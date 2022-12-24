import { z } from "zod";

const RECURRING_FREQUENCY = [
  "YEARLY",
  "MONTHLY",
  "WEEKLY",
  "DAILY",
  "HOURLY",
] as const;

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
      recurring: z
        .object({
          recurringFrequency: z.enum(RECURRING_FREQUENCY),
          interval: z.number(),
          count: z.number().optional(),
          daysOfWeek: z.string().optional(),
          weeksOfMonth: z.string().optional(),
          daysOfMonth: z.string().optional(),
          monthsOfYear: z.string().optional(),
        })
        .optional(),
    })
    .strict(),
});

export { postEventSchema };
