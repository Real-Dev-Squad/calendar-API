import { z } from "zod";

const patchUserSelfSchema = z.object({
  body: z
    .object({
      firstname: z.string().min(2).max(20).optional(),
      lastname: z.string().min(2).max(20).optional(),
      bio: z.string().min(2).optional(),
      username: z.string().min(2).max(20).optional(),
      timezone: z.string().optional(),
      onboarding: z
        .object({
          isOnboarded: z.boolean(),
        })
        .strict()
        .optional(),
    })
    .strict(),
});

const usernameParamSchema = z.object({
  params: z
    .object({
      username: z.string().min(2).max(20),
    })
    .strict(),
});

export { patchUserSelfSchema, usernameParamSchema };
