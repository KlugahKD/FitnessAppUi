<script setup lang="ts">
definePageMeta({
  layout: "custom",
});
import { toTypedSchema } from "@vee-validate/zod";
import { Check, Circle, Dot } from "lucide-vue-next";
import { h, ref } from "vue";
import * as z from "zod";

const router = useRouter();
const formSchema = [
  z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.string().min(2).max(50),
  }),
  z
    .object({
      password: z.string().min(2).max(50),
      confirmPassword: z.string(),
    })
    .refine(
      (values) => {
        return values.password === values.confirmPassword;
      },
      {
        message: "Passwords must match!",
        path: ["confirmPassword"],
      }
    ),
  z.object({
    goal: z.union([
      z.literal("Strength"),
      z.literal("Endurance"),
      z.literal("Weight Loss"),
      z.literal("Muscle Gain"),
      z.literal("Cardio"),
    ]),
  }),
];

const stepIndex = ref(1);
const steps = [
  {
    step: 1,
    title: "Your details",
    description: "Provide your name and email",
  },
  {
    step: 2,
    title: "Your Goals",
    description: "Choose a goal",
  },
  {
    step: 3,
    title: "Your Favorite Avatar",
    description: "Choose an avatar",
  },
];

function onSubmit(values: any) {
  //   toast({
  //     title: "You submitted the following values:",
  //     description: h(
  //       "pre",
  //       { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
  //       h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
  //     ),
  //   });
  console.log(values);
  router.push("/dashboard");
  // router.push("/auth/sign-in");
}
</script>

<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div
      class="w-[400px] mx-auto my-auto flex items-center justify-center py-12 grid gap-6"
    >
      <div class="grid gap-2 text-center">
        <h1 class="text-3xl font-bold">Sign Up</h1>
        <p class="text-balance text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      <Form
        v-slot="{ meta, values, validate }"
        as=""
        keep-values
        :validation-schema="toTypedSchema(formSchema[stepIndex - 1])"
      >
        <div class="grid items-center w-full gap-4">
          <Stepper
            v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
            v-model="stepIndex"
            class="block w-full"
          >
            <form
              @submit="
                (e) => {
                  e.preventDefault();
                  validate();

                  if (stepIndex === steps.length && meta.valid) {
                    onSubmit(values);
                  }
                }
              "
            >
              <div class="flex w-full flex-start gap-2">
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
                    <StepperDescription
                      :class="[state === 'active' && 'text-primary']"
                      class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
                    >
                      {{ step.description }}
                    </StepperDescription>
                  </div>
                </StepperItem>
              </div>

              <div class="flex flex-col gap-4 mt-4">
                <template v-if="stepIndex === 1">
                  <FormField v-slot="{ componentField }" name="fullName">
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input type="text" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="email">
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email " v-bind="componentField" />
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
                          v-bind="componentField"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </template>

                <template v-if="stepIndex === 2">
                  <FormField v-slot="{ componentField }" name="password">
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="confirmPassword">
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </template>

                <template v-if="stepIndex === 3">
                  <FormField v-slot="{ componentField }" name="goal">
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
                </template>
                <template v-if="stepIndex === 4">
                  <FormField v-slot="{ componentField }" name="goal">
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
            </form>
          </Stepper>
        </div>
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
