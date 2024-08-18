import * as z from "zod";

export const sandMessageSchema = z.object({
  content: z
    .string()
    .min(2, "message should be at least 2 characters or long")
    .max(250, "message should not be greater then 250"),
});
