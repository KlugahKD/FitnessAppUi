<script setup lang="ts">
import { useForm } from "vee-validate";
import { loginSchema } from "@/features/auth/schemas/auth";
import { login } from "@/features/auth/api/auth";
import type { LoginForm } from "@/features/auth/schemas/auth";
import { setData } from "nuxt-storage/local-storage";
import { toTypedSchema } from "@vee-validate/zod";
definePageMeta({
  layout: "custom",
});

const router = useRouter();

const form = useForm<LoginForm>({
  validationSchema: toTypedSchema(loginSchema),
});

const onSubmit = form.handleSubmit(async (values: LoginForm) => {
  const result = await login(values);
  setData("user", result, 60 * 60 * 24 * 7);
  router.push("/dashboard");
});
</script>
<template>
  <main class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col items-center justify-center">
      <div class="mx-auto grid w-[350px] gap-6">
        <form class="grid gap-4" @submit.prevent="onSubmit">
          <header class="mb-4">
            <h1 class="text-3xl font-bold">Log in</h1>
            <p class="mt-3 text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </header>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="johndoe@gmail.com"
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full">Login</Button>
        </form>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <NuxtLink to="/auth/sign-up" class="underline"> Sign up </NuxtLink>
        </div>
        <div class="text-center text-sm">
          <NuxtLink
            to="/auth/forgot"
            class="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="relative hidden bg-muted lg:block">
      <img
        src="/authbackground.jpg"
        alt="Image"
        class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </main>
</template>
