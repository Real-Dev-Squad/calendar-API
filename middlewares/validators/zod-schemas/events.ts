import { z } from "zod";

const RECURRING_FREQUENCY = [
  "YEARLY",
  "MONTHLY",
  "WEEKLY",
  "DAILY",
  "HOURLY",
] as const;

const postEventSchema = z.object({
  body: z
    .object({
      name: z.string().min(1),
      description: z.string().optional(),
      eventType: z.string(),
      location: z.string().optional(),
      startTime: z.string(),
      endTime: z.string(),
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
