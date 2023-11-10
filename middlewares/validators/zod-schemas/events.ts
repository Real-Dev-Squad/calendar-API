import { z } from 'zod';

const EVENT_TYPE = ['event'] as const;

const postEventSchema = z.object({
  body: z
    .object({
      name: z.string().min(1),
      description: z.string().optional(),
      eventType: z.enum(EVENT_TYPE).optional(),
      location: z.string().optional(),
      startTime: z.number(),
      endTime: z.number(),
      calendarId: z.number(),
      attendees: z.array(z.string()).optional(),
      isPrivate: z.boolean(),
      // TODO: Recuring event to be added
    })
    .strict(),
});

const patchEventSchema = z.object({
  params: z.object({
    eventId: z.preprocess((a) => Number(a), z.number().positive()),
  }),
  body: z
    .object({
      name: z.string().optional(),
      description: z.string().optional(),
      eventType: z.enum(EVENT_TYPE).optional(),
      location: z.string().optional(),
      startTime: z.number().optional(),
      endTime: z.number().optional(),
      calendarId: z.number().optional(),
      attendees: z.array(z.string()).optional(),
      isPrivate: z.boolean(),
      // TODO: Recuring event to be added
    })
    .strict(),
});

const getEventSchema = z.object({
  params: z.object({
    eventId: z.preprocess((a) => Number(a), z.number().positive()),
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

const getPublicEventSchema = z.object({
  query: z.object({
    startTime: z.preprocess((a) => Number(a), z.number().positive()).optional(),
    endTime: z.preprocess((a) => Number(a), z.number().positive()).optional(),
  }),
});

export {
  postEventSchema,
  patchEventSchema,
  getEventSchema,
  getCalenderEventSchema,
  getPublicEventSchema,
};
