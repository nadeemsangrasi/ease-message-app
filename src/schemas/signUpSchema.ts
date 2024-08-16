import z from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must  not be contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters" }),
});
