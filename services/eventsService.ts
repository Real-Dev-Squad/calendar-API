import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import prisma from "../prisma/prisma";

const DATE_ADD_MAPPING: any = {
  DAILY: addDays,
  WEEKLY: addWeeks,
  MONTHLY: addMonths,
  YEARLY: addYears,
};
Object.freeze(DATE_ADD_MAPPING);

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type
// const handelDailyEventsTimeUpdate = () => {};

const findEvent = async (eventId: number): Promise<any> => {
  try {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        isDeleted: false,
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
          take: 1,
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
    logger.error("Event: error while finding parent event", {
      err,
    });
    throw err;
  }
};

export { findEvent };
