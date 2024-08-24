
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
  password: z.string().min(7, "Password must be at least 8 characters long"),

  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z
    .string()
    .min(
      9,
      "Phone number must be at least 10 digits long"
    ),
    // .refine((val) => /^\+\d{1,3}\d{10}$/.test(val), {
    //   message:
    //     "Phone number must include country code and be at least 10 digits long after the country code",
    // }),
  email: z.string().email("Invalid email address"),
});

//change password schema
export const passwordChangeSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: z.string(),
});
