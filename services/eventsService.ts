import prisma from "../prisma/prisma";

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
