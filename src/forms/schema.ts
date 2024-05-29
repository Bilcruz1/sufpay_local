
import { z } from "zod";




// login schematic
const emailSchema = z.string().email({ message: "Invalid email address" });

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
