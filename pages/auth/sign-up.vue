<script setup lang="ts">
definePageMeta({
  layout: "custom",
});
import { toTypedSchema } from "@vee-validate/zod";
import { h, ref } from "vue";
import * as z from "zod";
import { signup } from "@/features/auth/api/auth";
import { useForm } from "vee-validate";
import {
  signupStep1,
  signupStep2,
  signupStep3,
  signupSchema, // still needed for final submission
} from "@/features/auth/schemas/auth";
import type { SignupForm } from "@/features/auth/schemas/auth";
import { Check, Circle, Dot } from "lucide-vue-next";
const router = useRouter();
import { toast } from "vue-sonner";

const form = useForm<SignupForm>({
  validationSchema: toTypedSchema(signupSchema),
});

const stepSchemas = [signupStep1, signupStep2, signupStep3];

const stepIndex = ref(1);
const steps = [
  {
    step: 1,
    title: "Your details",
  },
  {
    step: 2,
    title: "Your Goals",
  },
  {
    step: 3,
    title: "Your Avatar",
  },
];

const onSubmit = async (values: any) => {
  console.log("submitted", values);
  const result = await signup(values);
};
</script>

<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div
      class="w-full mx-auto my-auto flex items-center justify-center py-12 grid gap-6"
    >
      <div class="grid gap-2 text-center">
        <h1 class="text-3xl font-bold">Sign Up</h1>
        <p class="text-balance text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>

      <Form
        v-slot="{ meta, values }"
        as="form"
        keep-values
        :validation-schema="toTypedSchema(stepSchemas[stepIndex - 1])"
      >
        <form
          @submit="
            (e) => {
              e.preventDefault();
              onSubmit(values);
            }
          "
        >
          <div class="grid items-center w-full gap-4">
            <Stepper
              v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
              v-model="stepIndex"
              class="block w-full"
            >
              <div class="flex flex-start gap-2">
                <StepperItem
                  v-for="step in steps"
                  :key="step.step"
                  v-slot="{ state }"
                  class="relative flex w-full flex-col items-center justify-center"
                  :step="step.step"
                >
                  <StepperSeparator
                    v-if="step.step !== steps[steps.length - 1].step"
                    class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
                  />

                  <StepperTrigger as-child>
                    <Button
                      :variant="
                        state === 'completed' || state === 'active'
                          ? 'default'
                          : 'outline'
                      "
                      size="icon"
                      class="z-10 rounded-full shrink-0"
                      :class="[
                        state === 'active' &&
                          'ring-2 ring-ring ring-offset-2 ring-offset-background',
                      ]"
                      :disabled="state !== 'completed' && !meta.valid"
                    >
                      <Check v-if="state === 'completed'" class="size-5" />
                      <Circle v-if="state === 'active'" />
                      <Dot v-if="state === 'inactive'" />
                    </Button>
                  </StepperTrigger>

                  <div class="mt-5 flex flex-col items-center text-center">
                    <StepperTitle
                      :class="[state === 'active' && 'text-primary']"
                      class="text-sm font-semibold transition lg:text-base"
                    >
                      {{ step.title }}
                    </StepperTitle>
                    <!-- <StepperDescription
                      :class="[state === 'active' && 'text-primary']"
                      class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
                    >
                      {{ step.description }}
                    </StepperDescription> -->
                  </div>
                </StepperItem>
              </div>

              <div class="w-full flex flex-col gap-4 mt-4">
                <template v-if="stepIndex === 1">
                  <FormField v-slot="{ componentField }" name="FirstName">
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Jane"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="LastName">
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Doe"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="email">
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="janedoe@gmail.com"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="dob">
                    <FormItem>
                      <FormLabel>Date Of Birth</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="DD/MM/YYYY"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="password">
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="password"
                          v-bind="componentField"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </template>

                <template v-if="stepIndex === 2">
                  <FormField v-slot="{ componentField }" name="FitnessGoals">
                    <FormItem>
                      <FormLabel>Goal</FormLabel>

                      <Select v-bind="componentField">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a target goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Strength"> Strength </SelectItem>
                            <SelectItem value="Endurance">
                              Endurance
                            </SelectItem>
                            <SelectItem value="Weight Loss">
                              Weight Loss
                            </SelectItem>
                            <SelectItem value="Muscle Gain">
                              Muscle Gain
                            </SelectItem>
                            <SelectItem value="Cardio"> Cardio </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="HowOftenWorkout">
                    <FormItem>
                      <FormLabel>How Often Do You Workout</FormLabel>

                      <Select v-bind="componentField">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="how many times a week" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="1-2 times a week">
                              1-2 times a week
                            </SelectItem>
                            <SelectItem value="3-4 times a week">
                              3-4 times a week
                            </SelectItem>
                            <SelectItem value="5-6 times a week">
                              5-6 times a week
                            </SelectItem>
                            <SelectItem value="Every day">
                              Every day
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </template>

                <template v-if="stepIndex === 3">
                  <FormField v-slot="{ componentField }" name="AvatarChoice">
                    <FormItem>
                      <FormLabel>Avatar Choice</FormLabel>

                      <Select v-bind="componentField">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="choose an avatar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Avatar 1"> Avatar 1 </SelectItem>
                            <SelectItem value="Avatar 2"> Avatar 2 </SelectItem>
                            <SelectItem value="Avatar 3"> Avatar 3 </SelectItem>
                            <SelectItem value="Avatar 4"> Avatar 4 </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </template>
              </div>

              <div class="flex items-center justify-between mt-4">
                <Button
                  v-if="stepIndex !== 1"
                  :disabled="isPrevDisabled"
                  variant="outline"
                  size="sm"
                  @click="prevStep()"
                >
                  Back
                </Button>
                <Button
                  v-else
                  variant="outline"
                  size="sm"
                  @click="$router.back()"
                >
                  Cancel
                </Button>
                <div class="flex items-center gap-3">
                  <Button
                    v-if="stepIndex !== 3"
                    :type="meta.valid ? 'button' : 'submit'"
                    :disabled="isNextDisabled"
                    size="sm"
                    @click="meta.valid && nextStep()"
                  >
                    Next
                  </Button>
                  <Button v-if="stepIndex === 3" size="sm" type="submit">
                    Submit
                  </Button>
                </div>
              </div>
            </Stepper>
          </div>
        </form>
      </Form>
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        src="/authbackground.jpg"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>
