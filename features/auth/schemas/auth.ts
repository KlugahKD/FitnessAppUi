import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  FirstName: z.string().min(2, "First name must be at least 2 characters"),
  LastName: z.string().min(2, "Last name must be at least 2 characters"),
  DateOfBirth: z.date(),
  FitnessGoals: z.string(),
  HowOftenWorkout: z.string(),
  AvatarChoice: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignupForm = z.infer<typeof loginSchema>;
