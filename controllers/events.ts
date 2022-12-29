import { ChildEvent } from "@prisma/client";
import { Request, Response } from "express";
import Boom from "@hapi/boom";
import prisma from "../prisma/prisma";
import {
  createManyChildEvent,
  findChildEvent,
  findChildEventFromCalendar,
  findParentEvent,
} from "../services/eventsService";
import {
  formatChildEventForResponse,
  formatChildEventFromCalendarForResponse,
  formatParentEventForResponse,
} from "../utils/format-response";
import { parentEventWithChildEventRecurringEventEventType } from "../@types/services";

/**
 * Route used to post event
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const postEvent = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    const userId = req.userData.id;
    const eventData = req.body;
    const attendeesList = eventData.attendees ?? [];
    const recurringData = eventData.recurring;

    // Get event id from event name
    // const eventTypeData: EventType = await prisma.eventType.findFirstOrThrow({
    //   where: {
    //     name: eventData.eventType,
    //   },
    // });

    // Get attnedee ids from email
    const attendeeId = await prisma.users.findMany({
      where: {
        email: {
          in: attendeesList,
        },
      },
      select: {
        id: true,
      },
    });

    const allAttendeesData = attendeeId.map((id) => {
      return { attendeeId: id.id };
    });

    const childEvent: ChildEvent | any = {
      name: eventData.name,
      description: eventData.description,
      location: eventData.location,
      startTime: new Date(eventData.startTime),
      endTime: new Date(eventData.endTime),
      calendarId: eventData.calendarId,
      Attendees: {
        createMany: { data: allAttendeesData },
      },
    };
    // Prepare child recurring events
    let recurringChildEvent: ChildEvent[] = [childEvent];
    if (recurringData) {
      recurringChildEvent = await createManyChildEvent(
        recurringData,
        childEvent
      );
    }

    const parentEvent = await prisma.parentEvent.create({
      data: {
        name: eventData.name,
        description: eventData.description,
        ownerId: userId,
        eventTypeId: 1, // TODO: fix this to actual event type
        calendarId: eventData.calendarId,
        ChildEvent: {
          create: recurringChildEvent,
        },
        RecurringEvent: {
          create: recurringData,
        },
      },
    });

    const parentEventResponse: parentEventWithChildEventRecurringEventEventType =
      await findParentEvent(parentEvent.id);

    const event = formatParentEventForResponse(parentEventResponse);

    logger.info("Event created");
    return res.status(200).send({ message: "Event created", data: event });
  } catch (err: any) {
    logger.error("Error while creating event", { err });
    return res.boom(Boom.badImplementation());
  }
};

/**
 * Get event from eventId (child Events)
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const getEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const { eventId } = req.params;

    const childEventResponse: any = await findChildEvent(Number(eventId));

    if (!childEventResponse) {
      return res.boom(Boom.notFound("Event not found"));
    }
    const event = formatChildEventForResponse(childEventResponse);
    return res.status(200).send({ data: event });
  } catch (err) {
    logger.error("Error while getting event", { err });
    return res.boom(Boom.badImplementation());
  }
};

/**
 * Get event from calendarId with start and end time (child events)
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const getCalendarEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const { calendarId } = req.params;
    const { startTime, endTime } = req.query;

    const calenderChildEventResponse: any = await findChildEventFromCalendar(
      Number(calendarId),
      Number(startTime),
      Number(endTime)
    );

    if (!calenderChildEventResponse) {
      return res.boom(Boom.notFound("Event not found"));
    }

    const event = formatChildEventFromCalendarForResponse(
      calenderChildEventResponse
    );
    return res.status(200).send({ data: event });
  } catch (err) {
    logger.error("Error while getting event", { err });
    return res.boom(Boom.badImplementation());
  }
};
/**
 * Get event from calendarId with start and end time (child events)
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const deleteEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const { eventId } = req.params;

    // Check if event Exists
    const event = await prisma.childEvent.findUnique({
      where: {
        id: Number(eventId),
      },
    });
    if (!event) {
      return res.boom(Boom.notFound("Event not found"));
    }
    // Update ChildEvent isDeleted field
    // TODO: delete multiple events
    await prisma.childEvent.update({
      where: {
        id: Number(eventId),
      },
      data: {
        isDeleted: true,
      },
    });
    if (event)
      return res.status(200).send({ message: "Event deleted successfully" });
  } catch (err) {
    logger.error("Error while getting event", { err });
    return res.boom(Boom.badImplementation());
  }
};

export { postEvent, getEvents, getCalendarEvents, deleteEvents };
