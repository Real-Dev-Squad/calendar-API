import { RECURRING_FREQUENCY } from "../constants/recurringFrequency";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import prisma from "../prisma/prisma";

const DATE_ADD_MAPPING: any = {
  DAILY: addDays,
  WEEKLY: addWeeks,
  MONTHLY: addMonths,
  YEARLY: addYears,
};
Object.freeze(DATE_ADD_MAPPING);

/*
  Created chileEvents by updating the start and end time for cbild events when created
  TODO: handel other cases when weeksOfMonth present and other details present
*/
const createManyChildEvent = async (
  recurringData: any,
  childEvent: any
): Promise<any[]> => {
  try {
    const recurringFrequency: string = recurringData?.recurringFrequency;
    const totalNoOfChildEvents =
      recurringData?.count ?? RECURRING_FREQUENCY[`${recurringFrequency}`] ?? 1;
    const data = [];
    const startTime = childEvent.startTime;
    const endTime = childEvent.endTime;
    const addDateFunction = DATE_ADD_MAPPING[`${recurringFrequency}`];
    let numberToAddToDate = 1;
    for (let i = 0; i < totalNoOfChildEvents; i++) {
      data.push({
        ...childEvent,
        startTime: addDateFunction(startTime, numberToAddToDate),
        endTime: addDateFunction(endTime, numberToAddToDate),
      });
      numberToAddToDate += 1;
    }
    return data;
  } catch (err) {
    logger.error("childEvent: error while creating many child event", {
      err,
    });
    throw err;
  }
};

const findChildEvent = async (childEventId: number): Promise<any> => {
  try {
    const event = await prisma.childEvent.findFirst({
      where: {
        id: childEventId,
        isDeleted: false,
      },
      include: {
        ParentEvent: {
          select: {
            RecurringEvent: true,
          },
        },
        Attendees: {
          select: {
            attendee: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
    return event;
  } catch (err) {
    logger.error("childEvent: error while finding child event", {
      err,
    });
    throw err;
  }
};

const findParentEvent = async (parentEventId: number): Promise<any> => {
  try {
    const event = await prisma.parentEvent.findFirst({
      where: {
        id: parentEventId,
        isDeleted: false,
      },
      include: {
        ChildEvent: {
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
          },
          take: 1,
        },
        RecurringEvent: {
          select: {
            recurringFrequency: true,
            interval: true,
            count: true,
            daysOfWeek: true,
            weeksOfMonth: true,
            daysOfMonth: true,
            monthsOfYear: true,
          },
        },
        EventType: {
          select: {
            name: true,
          },
        },
      },
    });
    return event;
  } catch (err) {
    logger.error("parentEvent: error while finding parent event", {
      err,
    });
    throw err;
  }
};

const findChildEventFromCalendar = async (
  calendarId: number,
  startTime: number,
  endTime: number
): Promise<any> => {
  try {
    const whereCondition: {} = {
      calendarId,
      isDeleted: false,
      ...(startTime && { startTime: { gte: new Date(startTime) } }),
      ...(endTime && { endTime: { lte: new Date(endTime) } }),
    };

    // TODO: add pagination

    const event = await prisma.childEvent.findMany({
      where: whereCondition,
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
      },
    });

    return event;
  } catch (err) {
    logger.error("parentEvent: error while finding parent event", {
      err,
    });
    throw err;
  }
};

export {
  createManyChildEvent,
  findParentEvent,
  findChildEvent,
  findChildEventFromCalendar,
};
