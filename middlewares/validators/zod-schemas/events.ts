import { z } from "zod";

const EVENT_TYPE = ["event"] as const;

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

export { postEventSchema };
