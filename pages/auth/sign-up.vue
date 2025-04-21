<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signup } from "@/features/auth/api/auth";
import nuxtStorage from "nuxt-storage";
import { toast } from "vue-sonner";
import {
  signupStep1,
  signupStep2,
  signupStep3,
  signupSchema,
} from "@/features/auth/schemas/auth";
import type { SignupForm } from "@/features/auth/schemas/auth";
import { Check } from "lucide-vue-next";

const router = useRouter();
const stepIndex = ref(1);
const stepSchemas = [signupStep1, signupStep2, signupStep3];
const loadingMessages = [
  "Creating your workout plan...",
  "Creating your exercises...",
  "Creating your personalised avatar...",
  "Creating your personalised health tips...",
];
const isLoading = ref(false);
const loadingText = ref("");
const currentDoneText = ref("");
const showDoneText = ref(false);

const formValues = ref<SignupForm>({
  avatarChoice: "",
  fitnessGoals: "",
  howOftenWorkOut: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  dateOfBirth: "",
});

const form = useForm<SignupForm>({
  validationSchema: toTypedSchema(signupSchema),
  initialValues: formValues.value,
});

const updateField = (field: keyof SignupForm, value: string) => {
  form.setFieldValue(field, value);
  formValues.value[field] = value;
};

const steps = [
  { step: 1, title: "Your Details" },
  { step: 2, title: "Your Goals" },
  { step: 3, title: "Your Avatar" },
];

const animateLoading = async () => {
  isLoading.value = true;
  for (let i = 0; i < loadingMessages.length; i++) {
    loadingText.value = loadingMessages[i];
    showDoneText.value = false;
    await new Promise((resolve) => setTimeout(resolve, 5000));
    currentDoneText.value =
      "✓ " +
      loadingMessages[i].replace("Creating", "").replace("...", "").trim() +
      " done";
    showDoneText.value = true;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  isLoading.value = false;
  router.push("/auth");
};

const onSubmit = async () => {
  try {
    const values = formValues.value;
    const result = await signup(values);
    if (result?.isSuccessful) {
      nuxtStorage.localStorage.setData("user", result.data);
      await animateLoading();
      toast.success("Account created successfully");
    } else {
      toast.error(result?.message || "Something went wrong. Please try again.");
    }
  } catch (error) {
    toast.error("Server error. Please check your connection and try again.");
  }
};

const isStepComplete = (step: number) => step < stepIndex.value;

definePageMeta({
  layout: "custom",
});
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-2 bg-white text-black">
    <!-- Loading Screen -->
    <transition name="fade">
      <div
        v-if="isLoading"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white space-y-4"
      >
        <div
          class="w-12 h-12 border-4 border-[#C6F600] border-t-transparent rounded-full animate-spin"
        ></div>
        <div class="text-center">
          <p class="text-lg font-medium text-gray-700">{{ loadingText }}</p>
          <p v-if="showDoneText" class="text-green-600 font-semibold mt-2">
            {{ currentDoneText }}
          </p>
        </div>
      </div>
    </transition>

    <!-- Left Side Form -->
    <div class="flex items-center justify-center px-6 py-12">
      <div
        class="w-full max-w-xl space-y-8 rounded-xl border border-black/10 bg-white p-6 shadow-xl sm:p-8"
      >
        <div class="text-center">
          <h1 class="text-4xl font-extrabold">Create Account</h1>
          <p class="mt-2 text-sm text-gray-600">
            Start your fitness journey today
          </p>
        </div>

        <Form
          v-slot="{ meta, handleSubmit }"
          :validation-schema="toTypedSchema(stepSchemas[stepIndex - 1])"
        >
          <form @submit.prevent="handleSubmit(onSubmit)" class="space-y-6">
            <!-- Step Indicator -->
            <div class="flex justify-center gap-4">
              <template v-for="step in steps" :key="step.step">
                <div class="flex flex-col items-center">
                  <div
                    :class="[
                      'w-10 h-10 flex items-center justify-center rounded-full font-semibold',
                      step.step === stepIndex
                        ? 'bg-[#C6F600] text-black'
                        : isStepComplete(step.step)
                        ? 'bg-[#C6F600] text-black'
                        : 'bg-gray-200 text-gray-500',
                    ]"
                  >
                    <Check v-if="isStepComplete(step.step)" class="w-5 h-5" />
                    <span v-else>{{ step.step }}</span>
                  </div>
                  <span class="mt-1 text-xs">{{ step.title }}</span>
                </div>
              </template>
            </div>

            <!-- Step 1 -->
            <div v-if="stepIndex === 1" class="space-y-4">
              <FormField v-slot="{ componentField }" name="firstName">
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jane"
                      v-bind="componentField"
                      v-model="formValues.firstName"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      v-bind="componentField"
                      v-model="formValues.lastName"
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
                      placeholder="janedoe@example.com"
                      v-bind="componentField"
                      v-model="formValues.email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="dateOfBirth">
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="YYYY/DD/MM"
                      v-bind="componentField"
                      v-model="formValues.dateOfBirth"
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
                      placeholder="••••••••"
                      v-bind="componentField"
                      v-model="formValues.password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- Step 2 -->
            <div v-if="stepIndex === 2" class="space-y-4">
              <FormField v-slot="{ componentField }" name="fitnessGoals">
                <FormItem>
                  <FormLabel>Fitness Goal</FormLabel>
                  <Select
                    v-bind="componentField"
                    v-model="formValues.fitnessGoals"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ImproveEndurance"
                          >Improve Endurance</SelectItem
                        >
                        <SelectItem value="LoseWeight">Lose Weight</SelectItem>
                        <SelectItem value="GainMuscle">Gain Muscle</SelectItem>
                        <SelectItem value="IncreaseFlexibility"
                          >Increase Flexibility</SelectItem
                        >
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="howOftenWorkOut">
                <FormItem>
                  <FormLabel>Workout Frequency</FormLabel>
                  <Select
                    v-bind="componentField"
                    v-model="formValues.howOftenWorkOut"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Times per week" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1-2 times a week"
                          >1-2 times</SelectItem
                        >
                        <SelectItem value="3-4 times a week"
                          >3-4 times</SelectItem
                        >
                        <SelectItem value="5-6 times a week"
                          >5-6 times</SelectItem
                        >
                        <SelectItem value="Everyday">Everyday</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- Step 3 -->
            <div v-if="stepIndex === 3" class="space-y-4">
              <FormField v-slot="{ componentField }" name="avatarChoice">
                <FormItem>
                  <FormLabel>Choose an Avatar</FormLabel>
                  <div class="grid grid-cols-2 gap-4">
                    <label
                      v-for="avatar in ['Core', 'Pulse', 'Zenith', 'Titan']"
                      :key="avatar"
                      @click="formValues.avatarChoice = avatar"
                      :class="[
                        'flex flex-col items-center cursor-pointer border rounded-lg p-4 hover:shadow-md',
                        formValues.avatarChoice === avatar
                          ? 'border-[#C6F600] ring-2 ring-[#C6F600]'
                          : 'border-gray-300',
                      ]"
                    >
                      <img
                        :src="`/avatars/${avatar.toLowerCase()}.png`"
                        :alt="avatar"
                        class="w-16 h-16 mb-2 object-contain"
                      />
                      <input
                        type="radio"
                        :value="avatar"
                        v-bind="componentField"
                        class="hidden"
                      />
                      <span class="text-sm font-medium">{{ avatar }}</span>
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- Navigation -->
            <div class="flex justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                @click="stepIndex === 1 ? router.back() : stepIndex--"
              >
                {{ stepIndex === 1 ? "Cancel" : "Back" }}
              </Button>
              <Button
                v-if="stepIndex < 3"
                type="button"
                class="bg-[#C6F600] text-black hover:bg-lime-400"
                size="sm"
                @click="meta.valid && stepIndex++"
              >
                Next
              </Button>
              <Button
                v-else
                type="submit"
                size="sm"
                :disabled="isLoading"
                class="bg-black text-white hover:bg-gray-900 flex items-center justify-center gap-2"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>{{ isLoading ? "Creating Account..." : "Submit" }}</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>

    <!-- Right Side Background -->
    <div class="relative hidden lg:block">
      <img
        src="/authbackground.jpg"
        alt="Fitness"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 bg-black/60 flex items-center justify-center text-center text-white px-6"
      >
        <div>
          <h2 class="text-3xl lg:text-5xl font-bold">
            Train Smart. Live Better.
          </h2>
          <p class="mt-4 text-[#C6F600] text-base max-w-md mx-auto">
            Build a personalized fitness path with our avatars and expert
            guidance.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
