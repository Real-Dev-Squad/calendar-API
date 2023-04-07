import { z } from 'zod';
import { EventAcknowledgements } from '@prisma/client';

const EVENT_TYPE = ['event'] as const;

const postEventSchema = z.object({
  body: z
    .object({
      name: z.string().min(1),
      description: z.string().optional(),
      eventType: z.enum(EVENT_TYPE),
      location: z.string().optional(),
      startTime: z.number(),
      endTime: z.number(),
      calendarId: z.number(),
      attendees: z.array(z.string()).optional(),
      // TODO: Recuring event to be added
    })
    .strict(),
});

const getEventSchema = z.object({
  params: z.object({
    eventId: z.preprocess((a) => Number(a), z.number().positive()),
  }),
});

const UPDATED_ACKNOWLEDGEMENT_TYPES = [
  EventAcknowledgements.ACCEPTED,
  EventAcknowledgements.DECLINED,
  EventAcknowledgements.TENTATIVE,
] as const;

const getAcknowledgementSchema = z.object({
  params: z.object({
    eventId: z.preprocess((a) => Number(a), z.number().positive()),
    attendeeId: z.preprocess((a) => Number(a), z.number().positive()),
  }),
  body: z.object({
    status: z.enum(UPDATED_ACKNOWLEDGEMENT_TYPES),
  }),
});

const getCalenderEventSchema = z.object({
  params: z.object({
    calendarId: z.preprocess((a) => Number(a), z.number().positive()),
  }),
  query: z.object({
    startTime: z.preprocess((a) => Number(a), z.number().positive()).optional(),
    endTime: z.preprocess((a) => Number(a), z.number().positive()).optional(),
  }),
});

export {
  postEventSchema,
  getEventSchema,
  getCalenderEventSchema,
  getAcknowledgementSchema,
};
