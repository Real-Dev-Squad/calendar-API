import {
  ChildEvent,
  EventType,
  ParentEvent,
  RecurringEvent,
} from "@prisma/client";
import { Request, Response } from "express";
import Boom from "@hapi/boom";
import { RECURRING_FREQUENCY } from "../constants/recurringFrequency";
import prisma from "../prisma/prisma";
import {
  createParentEvent,
  createChildEvent,
  createRecurringEvent,
  createManyChildEvent,
  createAttendeesForEvent,
} from "../services/eventsService";

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
    const attendeesData = eventData.attendees;
    const recurringData = eventData.recurring;

    // GET EVENT ID
    const eventTypeData: EventType = await prisma.eventType.findFirstOrThrow({
      where: {
        name: eventData.eventType,
      },
    });

    const parentEventData: ParentEvent | any = {
      name: eventData.name,
      description: eventData.description,
      ownerId: userId,
      eventTypeId: eventTypeData.id,
    };

    const parentEvent: ParentEvent = await createParentEvent(parentEventData);

    const childEventData: ChildEvent | any = {
      name: eventData.name,
      description: eventData.description,
      location: eventData.location,
      startTime: new Date(eventData.startTime),
      endTime: new Date(eventData.endTime),
      parentEventID: parentEvent.id,
      eventTypeId: eventTypeData.id,
    };

    const childEvent = await createChildEvent(childEventData);

    // Create RECURRIGN EVENT DATA
    if (recurringData) {
      const recurringEventData: RecurringEvent | any = {
        eventId: parentEvent.id,
        recurringFrequency: recurringData.recurringFrequency,
        interval: recurringData.interval,
        count: recurringData.count,
        daysOfWeek: recurringData.daysOfWeek,
        weeksOfMonth: recurringData.weeksOfMonth,
        daysOfMonth: recurringData.daysOfMonth,
        monthsOfYear: recurringData.monthsOfYear,
      };

      await createRecurringEvent(recurringEventData);

      const recurringEventFrequency =
        recurringData.count ??
        RECURRING_FREQUENCY[recurringData.recurringFrequency];

      await createManyChildEvent(recurringEventFrequency, childEvent);
    }

    if (attendeesData?.length) {
      await createAttendeesForEvent(childEvent.id, attendeesData);
    }

    // TODO: change response accroding to doc
    const event = await prisma.childEvent.findUnique({
      where: {
        id: childEvent.id,
      },
      include: {
        Attendees: {
          select: {
            attendee: {
              select: {
                email: true,
              },
            },
          },
        },
        parentEvent: {
          select: {
            RecurringEvent: true,
          },
        },
      },
    });

    logger.info("Event created");
    return res.status(200).send({ message: "Event created", data: event });
  } catch (err: any) {
    logger.error("Error while creating event", { err });
    return res.boom(Boom.badImplementation());
  }
};

export { postEvent };
