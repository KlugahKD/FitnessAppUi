import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginForm = z.infer<typeof loginSchema>;

const stepOne = z.object({
  email: z.string().email("Invalid email"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(10, "Date must be in YYYY-MM-DD format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const stepTwo = z.object({
  fitnessGoals: z.union([
    z.literal("ImproveEndurance"),
    z.literal("LoseWeight"),
    z.literal("GainMuscle"),
    z.literal("IncreaseFlexibility"),
  ]),
  howOftenWorkOut: z.union([
    z.literal("1-2 times a week"),
    z.literal("3-4 times a week"),
    z.literal("5-6 times a week"),
    z.literal("Everyday"),
  ]),
});

const stepThree = z.object({
  avatarChoice: z.union([
    z.literal("Core"),
    z.literal("Pulse"),
    z.literal("Zenith"),
    z.literal("Titan"),
  ]),
});

export const signupSchema = stepOne.merge(stepTwo).merge(stepThree);
export const signupStep1 = stepOne;
export const signupStep2 = stepTwo;
export const signupStep3 = stepThree;

export type SignupForm = z.infer<typeof signupSchema>;
