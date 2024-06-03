
import { z } from "zod";




// login schematic
export const emailSchema = z.string().email({ message: "Invalid email address" });

const phoneSchema = z
  .string()
  .regex(
    /^(\+?\d{1,4}?[\s-.\(\)]?)?\(?\d{3}\)?[\s-.\(\)]?\d{3}[\s-.\(\)]?\d{4}$/,
    { message: "Invalid phone number" }
  );

const passwordSchema = z
  .string()
  .min(8, { message: "Password cannot be empty" });

const credentialsSchema = z.union([emailSchema, phoneSchema]);

export const formDataSchema = z.object({
  credentials: credentialsSchema,
  password: passwordSchema,
});

export const signupFormDataSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name must be at least 3 characters long and is required"),
  lastName: z
    .string()
    .min(3, "Last name must be at least 3 characters long and is required"),
  countryCode: z.enum(["+1", "+91", "+44"]),
  phoneNumber: z.string().nonempty("Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});