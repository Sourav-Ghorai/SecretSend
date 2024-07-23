import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "User name must contain atleast 2 character")
  .max(20, "User name must be with in 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const signUpSchema = z.object({
  userName: userNameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must contain at least 5 characters" }),
});
