import { ChildEvent, EventType } from "@prisma/client";
import { Request, Response } from "express";
import Boom from "@hapi/boom";
import prisma from "../prisma/prisma";
import {
  createManyChildEvent,
  findParentEvent,
} from "../services/eventsService";
import { formateParentEvent } from "../utils/formate-response";
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
    const eventTypeData: EventType = await prisma.eventType.findFirstOrThrow({
      where: {
        name: eventData.eventType,
      },
    });

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
        eventTypeId: eventTypeData.id,
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

    const event = formateParentEvent(parentEventResponse);

    logger.info("Event created");
    return res.status(200).send({ message: "Event created", data: event });
  } catch (err: any) {
    logger.error("Error while creating event", { err });
    return res.boom(Boom.badImplementation());
  }
};

/**
 * Route used to post event
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const getEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const { eventId } = req.params;

    const parentEventResponse: parentEventWithChildEventRecurringEventEventType =
      await findParentEvent(Number(eventId));

    if (!parentEventResponse) {
      return res.boom(Boom.notFound("Event not found"));
    }

    const event = formateParentEvent(parentEventResponse);
    return res.status(200).send({ data: event });
  } catch (err) {
    logger.error("Error while getting event", { err });
    return res.boom(Boom.badImplementation());
  }
};

export { postEvent, getEvents };
