import { Event } from '@prisma/client';
import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import prisma from '../prisma/prisma';
import {
  findEvent,
  findEventFromCalendar,
  findPublicEvent,
} from '../services/eventsService';

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
      eventTypeId: 1,
      isPrivate: eventData.isPrivate,
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
 * Route used to patch event
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const patchEvent = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    const { eventId } = req.params;
    const userId = req.userData.id;
    const eventData = req.body;
    const start = eventData.startTime
      ? new Date(eventData.startTime)
      : undefined;
    const end = eventData.endTime ? new Date(eventData.endTime) : undefined;

    const eventObject: Event | any = {
      name: eventData.name,
      description: eventData.description,
      location: eventData.location,
      startTime: start,
      endTime: end,
      ownerId: userId,
      calendarId: eventData.calendarId,
      isPrivate: eventData.isPrivate,
      // @prakash :: Event Type: Event. Id: 1
      eventTypeId: 1,
      // TODO: Need to fix updating attendees list
      // Attendees: {
      //   createMany: { data: allAttendeesData },
      // },
    };
    // Prepare child recurring events

    const event = await prisma.event.update({
      where: {
        id: Number(eventId),
      },
      data: eventObject,
    });
    logger.info('Event updated');

    const respEvent: Event = await findEvent(event.id);

    return res.status(200).send({ message: 'Event updated', data: respEvent });
  } catch (err: any) {
    logger.error('Error while updating event', { err });
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
const getCalendarEvents = async (req: Request, res: Response): Promise<any> => {
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

/**
 * Get public event start and end time (child events)
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const getPublicEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const { startTime, endTime } = req.query;

    const eventResponse: any = await findPublicEvent(
      Number(startTime),
      Number(endTime)
    );

    if (!eventResponse) {
      return res.boom(Boom.notFound('Events not found'));
    }
    return res.status(200).send({ data: eventResponse });
  } catch (err) {
    logger.error('Error while getting event', { err });
    return res.boom(Boom.badImplementation());
  }
};

export { postEvent, patchEvent, getEvents, getCalendarEvents, getPublicEvents };
