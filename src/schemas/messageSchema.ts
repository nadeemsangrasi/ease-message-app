import z from "zod";
export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content length must be at least 10 characters" })
    .max(300, {
      message: "Content length must not be more then 300 characters",
    }),
});
