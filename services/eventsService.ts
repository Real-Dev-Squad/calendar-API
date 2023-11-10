import { Calendar, Event } from '@prisma/client';
import { eventWithAttendees } from '../@types/apiReponse';
import prisma from '../prisma/prisma';

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
          // take: 1,
        },
      },
    });
    return event;
  } catch (err) {
    logger.error('Event: error while finding parent event', {
      err,
    });
    throw err;
  }
};

const findEventFromCalendar = async (
  calendarId: number,
  startTime: number,
  endTime: number
): Promise<eventWithAttendees[]> => {
  try {
    const whereCondition: {} = {
      calendarId,
      isDeleted: false,
      ...(startTime && { startTime: { gte: new Date(startTime) } }),
      ...(endTime && { endTime: { lte: new Date(endTime) } }),
    };

    // TODO: add pagination

    const event: eventWithAttendees[] = await prisma.event.findMany({
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
    logger.error('parentEvent: error while finding parent event', {
      err,
    });
    throw err;
  }
};

const findPublicEvent = async (
  startTime: number,
  endTime: number
): Promise<eventWithAttendees[]> => {
  try {
    const whereCondition: {} = {
      isDeleted: false,
      isPrivate: false,
      ...(startTime && { startTime: { gte: new Date(startTime) } }),
      ...(endTime && { endTime: { lte: new Date(endTime) } }),
    };

    // TODO: add pagination

    const event: eventWithAttendees[] = await prisma.event.findMany({
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
    logger.error('parentEvent: error while finding parent event', {
      err,
    });
    throw err;
  }
};

const findCalendarWithId = async (
  calendarId: number
): Promise<Calendar | null> => {
  const calendarData = await prisma.calendar.findUnique({
    where: { id: calendarId },
  });
  return calendarData;
};

const findEventWithId = async (eventId: number): Promise<Event | null> => {
  const eventResponse = await prisma.event.findUnique({
    where: { id: +eventId },
  });
  return eventResponse;
};

export {
  findEvent,
  findEventFromCalendar,
  findPublicEvent,
  findCalendarWithId,
  findEventWithId,
};
