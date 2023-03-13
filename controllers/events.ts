import { Event, EventType } from "@prisma/client";
import { Request, Response } from "express";
import Boom from "@hapi/boom";
import prisma from "../prisma/prisma";
import { findEvent } from "../services/eventsService";

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

    const respEvent: Event = await findEvent(event.id);
    logger.info("Event created");

    return res.status(200).send({ message: "Event created", data: respEvent });
  } catch (err: any) {
    logger.error("Error while creating event", { err });
    return res.boom(Boom.badImplementation());
  }
};

export { postEvent };
