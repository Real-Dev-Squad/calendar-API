import {
  ChildEvent,
  ParentEvent,
  Prisma,
  RecurringEvent,
} from "@prisma/client";
import prisma from "../prisma/prisma";

const createParentEvent = async ({
  name,
  description,
  ownerId,
  eventTypeId,
}: ParentEvent): Promise<ParentEvent> => {
  try {
    const parentEvent: ParentEvent = await prisma.parentEvent.create({
      data: {
        name,
        description,
        ownerId,
        eventTypeId,
      },
    });
    return parentEvent;
  } catch (err) {
    logger.error("parentEvent: error while creating parent event", {
      err,
    });
    throw err;
  }
};

const createChildEvent = async ({
  name,
  description,
  location,
  startTime,
  endTime,
  parentEventID,
  eventTypeId,
}: ChildEvent): Promise<ChildEvent> => {
  try {
    const chileEvent: ChildEvent = await prisma.childEvent.create({
      data: {
        name,
        description,
        location,
        startTime,
        endTime,
        parentEventID,
        eventTypeId,
      },
    });
    return chileEvent;
  } catch (err) {
    logger.error("childEvent: error while creating child event", {
      err,
    });
    throw err;
  }
};

const createManyChildEvent = async (
  frequency: number,
  childEvent: ChildEvent
): Promise<Prisma.BatchPayload> => {
  try {
    const data = [];
    for (let i = 0; i < frequency; i++) {
      const { id: _, ...childEventData } = childEvent;
      data.push(childEventData);
    }
    const chileEvents = await prisma.childEvent.createMany({
      data,
      skipDuplicates: true,
    });
    return chileEvents;
  } catch (err) {
    logger.error("childEvent: error while creating many child event", {
      err,
    });
    throw err;
  }
};

const createRecurringEvent = async ({
  eventId,
  recurringFrequency,
  interval,
  count,
  daysOfWeek,
  weeksOfMonth,
  daysOfMonth,
  monthsOfYear,
}: RecurringEvent): Promise<RecurringEvent> => {
  try {
    const recurringEvent = await prisma.recurringEvent.create({
      data: {
        eventId,
        recurringFrequency,
        interval,
        count,
        daysOfWeek,
        weeksOfMonth,
        daysOfMonth,
        monthsOfYear,
      },
    });
    return recurringEvent;
  } catch (err) {
    logger.error("recurringEvent: error while creating recurring event", {
      err,
    });
    throw err;
  }
};

const createAttendeesForEvent = async (
  eventId: number,
  attendeesData: string[]
): Promise<Prisma.BatchPayload> => {
  try {
    const allAttendeesData = await prisma.users.findMany({
      where: {
        email: {
          in: [...attendeesData],
        },
      },
    });

    const data = allAttendeesData.map((attendee) => {
      return {
        attendeeId: attendee.id,
        eventId,
      };
    });

    const manyAttnedees = await prisma.attendees.createMany({
      data,
      skipDuplicates: true,
    });

    return manyAttnedees;
  } catch (err) {
    logger.error("attnedees: error while creating attendees for event", {
      err,
    });
    throw err;
  }
};

export {
  createAttendeesForEvent,
  createChildEvent,
  createManyChildEvent,
  createParentEvent,
  createRecurringEvent,
};
