import { ParentEvent, Users } from "@prisma/client";
import { Request, Response } from "express";
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
    const { id: userId }: Users = req.userData;
    const eventData = req.body;
    // TODO: MOVE TO SERVICE
    // const attendeesData = eventData.attendees;
    const recurringData = eventData.recurring;

    // Create parent event

    const parentEvent: ParentEvent = await prisma.parentEvent.create({
      data: {
        name: eventData.name,
        description: eventData.description,
        ownerId: userId,
        EventType: eventData.eventType,
        eventTypeId: 1, //GET FROM EVENT ID
      },
    });

    // Create child event

    const chileEvent = prisma.childEvent.create({
      data: {
        name: eventData.name,
        description: eventData.description,
        usersId: userData?.id,
        location: eventData.location,
        EventType: eventData.eventType,
        parentEventID: parentEvent.id,
      },
    });

    console.log(event);
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
    }
    // CREAATE ATTNEDES DATA

    await prisma.attendees.createMany({ data: [], skipDuplicates: true });

    logger.info("User data updated");
    return res.status(200).send({ message: "User data updated" });
  } catch (err) {
    console.log(err);

    logger.error("Error while updating user", { err });
    return res.boom.badImplementation("An internal server error occurred");
  }
};

export { postEvent };
