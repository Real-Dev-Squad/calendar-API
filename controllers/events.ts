import { z } from 'zod';
import { Event, EventType } from '@prisma/client';
import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import prisma from '../prisma/prisma';
import { findEvent, findEventFromCalendar } from '../services/eventsService';
import { getAcknowledgementSchema } from '../middlewares/validators/zod-schemas/events';

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

    // Get event id from event name
    const eventTypeData: EventType = await prisma.eventType.findFirstOrThrow({
      where: {
        name: eventData.eventType,
      },
    });

    // Get attendee ids from email
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

    const eventObject: Event | any = {
      name: eventData.name,
      description: eventData.description,
      location: eventData.location,
      startTime: new Date(eventData.startTime),
      endTime: new Date(eventData.endTime),
      ownerId: userId,
      calendarId: eventData.calendarId,
      eventTypeId: eventTypeData.id,
      Attendees: {
        createMany: { data: allAttendeesData },
      },
    };
    // Prepare child recurring events

    const event = await prisma.event.create({
      data: eventObject,
    });
    logger.info('Event created');

    const respEvent: Event = await findEvent(event.id);

    return res.status(200).send({ message: 'Event created', data: respEvent });
  } catch (err: any) {
    logger.error('Error while creating event', { err });
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

    const respEvent: Event = await findEvent(Number(eventId));

    if (!respEvent) {
      return res.boom(Boom.notFound('Event not found'));
    }
    return res.status(200).send({ data: respEvent });
  } catch (err) {
    logger.error('Error while getting event', { err });
    return res.boom(Boom.badImplementation());
  }
};

/**
 * Get event from calendarId with start and end time (child events)
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const getCalendarEvents = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { calendarId } = req.params;
    const { startTime, endTime } = req.query;

    const eventResponse: any = await findEventFromCalendar(
      Number(calendarId),
      Number(startTime),
      Number(endTime)
    );

    if (!eventResponse) {
      return res.boom(Boom.notFound('Event not found'));
    }
    return res.status(200).send({ data: eventResponse });
  } catch (err) {
    logger.error('Error while getting event', { err });
    return res.boom(Boom.badImplementation());
  }
};

type TAcknowledgementStatusReq = z.infer<typeof getAcknowledgementSchema>;

const getAcknowledgementStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { eventId, attendeeId } = req.params;
  const { status } = req.body as TAcknowledgementStatusReq['body'];

  const attendeeData = await prisma.attendees.findFirst({
    where: {
      eventId: Number(eventId),
      attendeeId: Number(attendeeId),
    },
  });

  if (attendeeData === null) {
    return res.boom(Boom.badRequest('Attendee not found'));
  }

  const updatedData = await prisma.attendees.update({
    where: {
      id: attendeeData.id,
    },
    data: {
      acknowledgement: status,
    },
  });

  if (updatedData.acknowledgement === status) {
    return res.json({ message: 'Acknowledgement status updated' });
  } else {
    return res.boom(Boom.internal('Something went wrong'));
  }
};

export { postEvent, getEvents, getCalendarEvents, getAcknowledgementStatus };
