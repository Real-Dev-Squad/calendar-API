import { z } from "zod";

const patchUserSelfSchema = z.object({
  body: z
    .object({
      firstname: z.string().min(2).max(20),
      lastname: z.string().min(2).max(20),
      bio: z.string().min(2),
      username: z.string().min(2).max(20),
    })
    .partial()
    .strict(),
});

export { patchUserSelfSchema };
