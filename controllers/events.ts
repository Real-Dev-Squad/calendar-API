import { ChildEvent, EventType, ParentEvent } from "@prisma/client";
import { Request, Response } from "express";
import { RECURRING_FREQUENCY } from "../constants/recurringFrequency";
import prisma from "../prisma/prisma";

/**
 * Route used to get the health status of the server
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const postEvent = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | Express.BoomError<null>> => {
  try {
    const userId = req.userData.id;
    const eventData = req.body;

    // TODO: MOVE TO SERVICE
    const attendeesData = eventData.attendees;
    const recurringData = eventData.recurring;

    // Create parent event

    // GET EVENT ID
    const eventTypeData: EventType = await prisma.eventType.findFirstOrThrow({
      where: {
        name: eventData.eventType,
      },
    });

    // If null throw error

    const parentEvent: ParentEvent = await prisma.parentEvent.create({
      data: {
        name: eventData.name,
        description: eventData.description,
        ownerId: userId,
        eventTypeId: eventTypeData.id, /// /TODO: fix this using id
      },
    });

    console.log("parent done", parentEvent);

    // // Create child event

    const chileEvent: ChildEvent = await prisma.childEvent.create({
      data: {
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        startTime: new Date(), // GET daAT time fomr user
        endTime: new Date(), // GET DATE time from user
        parentEventID: parentEvent.id,
        eventTypeId: eventTypeData.id, // TODO: fix this using id
      },
    });

    console.log("chile done", chileEvent);

    console.log(chileEvent);

    // Create RECURRIGN EVENT DATA
    if (recurringData) {
      const recurringEvent = await prisma.recurringEvent.create({
        data: {
          eventId: parentEvent.id,
          recurringFrequency: recurringData.recurringFrequency,
          interval: recurringData.interval,
          count: recurringData.count,
          daysOfWeek: recurringData.daysOfWeek,
          weeksOfMonth: recurringData.weeksOfMonth,
          daysOfMonth: recurringData.daysOfMonth,
          monthsOfYear: recurringData.monthsOfYear,
        },
      });
      
      console.log(recurringEvent);


      // Create childEvents for recurring data

      const data = [];
      const timesToAdd =
        recurringData.count ??
        RECURRING_FREQUENCY[recurringData.recurringFrequency];
      for (let i = 0; i < timesToAdd; i++) {
        data.push({
          name: eventData.name,
          description: eventData.description,
          location: eventData.location,
          // TODO: fix start and end time for recurring events
          startTime: new Date(), // GET daAT time fomr user
          endTime: new Date(), // GET DATE time from user
          parentEventID: parentEvent.id,
          eventTypeId: eventTypeData.id, // TODO: fix this using id,
        });
      }
      console.log(data);

      // Add data to child event
      const manyEvents = await prisma.childEvent.createMany({
        data,
        skipDuplicates: true,
      });
      console.log("many", manyEvents, { manyEvents });
    }
    // CREAATE ATTNEDES DATA

    if (attendeesData.length) {
      const attendeeData = await prisma.users.findMany({
        where: {
          email: {
            in: [...attendeesData],
          },
        },
      });
      console.log(attendeeData);

      const data = attendeeData.map((attendee) => {
        return {
          attendeeId: attendee.id,
          eventId: parentEvent.id,
        };
      });

      console.log(data);

      await prisma.attendees.createMany({ data, skipDuplicates: true });
    }

    logger.info("Event created");
    return res.status(200).send({ message: "Event created" });
  } catch (err) {
    console.log(err);

    logger.error("Error while updating user", { err });
    return res.boom.badImplementation("An internal server error occurred");
  }
};

export { postEvent };
