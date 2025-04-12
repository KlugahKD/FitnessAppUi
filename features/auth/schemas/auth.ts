import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginForm = z.infer<typeof loginSchema>;

const stepOne = z.object({
  email: z.string().email("Invalid email"),
  FirstName: z.string().min(2, "First name must be at least 2 characters"),
  LastName: z.string().min(2, "Last name must be at least 2 characters"),
  dob: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "Date must be in DD/MM/YYYY format",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const stepTwo = z.object({
  FitnessGoals: z.union([
    z.literal("Strength"),
    z.literal("Endurance"),
    z.literal("Weight Loss"),
    z.literal("Muscle Gain"),
    z.literal("Cardio"),
  ]),
  HowOftenWorkout: z.union([
    z.literal("1-2 times a week"),
    z.literal("3-4 times a week"),
    z.literal("5-6 times a week"),
    z.literal("Every day"),
  ]),
});

const stepThree = z.object({
  AvatarChoice: z.union([
    z.literal("Avatar 1"),
    z.literal("Avatar 2"),
    z.literal("Avatar 3"),
    z.literal("Avatar 4"),
  ]),
});

export const signupSchema = stepOne.merge(stepTwo).merge(stepThree);
export const signupStep1 = stepOne;
export const signupStep2 = stepTwo;
export const signupStep3 = stepThree;

export type SignupForm = z.infer<typeof signupSchema>;
