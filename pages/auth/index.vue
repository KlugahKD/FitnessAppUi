<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { loginSchema } from "@/features/auth/schemas/auth";
import { login } from "@/features/auth/api/auth";
import type { LoginForm } from "@/features/auth/schemas/auth";
import nuxtStorage from "nuxt-storage";
import { toTypedSchema } from "@vee-validate/zod";

definePageMeta({
  layout: "custom",
});

const router = useRouter();
const loading = ref(false);

const form = useForm<LoginForm>({
  validationSchema: toTypedSchema(loginSchema),
});

const onSubmit = form.handleSubmit(async (values: LoginForm) => {
  try {
    loading.value = true;
    const result = await login(values);
    nuxtStorage.localStorage.setData("user", result, 60 * 60 * 24 * 7);
    router.push("/dashboard");
  } catch (error) {
    console.error("Login failed", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main
    class="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white text-black"
  >
    <!-- Left Section (Form) -->
    <div class="flex items-center justify-center p-6 sm:p-12 bg-white">
      <div
        class="w-full max-w-md shadow-xl rounded-2xl p-8 space-y-8 border border-black/10"
      >
        <header class="text-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-black">
            Welcome Back
          </h1>
          <p class="mt-2 text-sm text-gray-600">Log in to your account</p>
        </header>

        <form class="space-y-5" @submit.prevent="onSubmit">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel class="text-black">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="johndoe@gmail.com"
                  v-bind="componentField"
                  class="bg-white border border-black/20 text-black placeholder-gray-400 focus:ring-2 focus:ring-[#C6F600]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel class="text-black">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  v-bind="componentField"
                  class="bg-white border border-black/20 text-black placeholder-gray-400 focus:ring-2 focus:ring-[#C6F600]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#C6F600] hover:bg-lime-400 text-black font-semibold rounded-lg py-2 transition-all flex items-center justify-center"
          >
            <span v-if="!loading">Log in</span>
            <span v-else>
              <svg
                class="animate-spin h-5 w-5 mr-2 text-black inline-block"
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
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Logging in...
            </span>
          </Button>
        </form>

        <div class="text-center text-sm text-gray-700">
          <p>
            Don't have an account?
            <NuxtLink
              to="/auth/sign-up"
              class="text-[#C6F600] underline hover:text-lime-500"
            >
              Sign up
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Right Section (Image + Overlay) -->
    <div class="relative hidden lg:flex items-center justify-center bg-black">
      <img
        src="/authbackground.jpg"
        alt="Login background"
        class="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div class="absolute inset-0 bg-black/70"></div>
      <div class="relative z-10 text-center px-6 text-white">
        <h2 class="text-3xl lg:text-5xl font-bold">Stay Fit. Stay Strong.</h2>
        <p class="mt-4 text-lg max-w-md mx-auto text-[#C6F600]">
          Your journey to a healthier life starts here.
        </p>
      </div>
    </div>
  </main>
</template>
