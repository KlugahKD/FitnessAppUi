<script setup lang="ts">
import { useForm } from "vee-validate";
import { loginSchema } from "@/features/auth/schemas/auth";
import { login } from "@/features/auth/api/auth";
import type { LoginForm } from "@/features/auth/schemas/auth";

definePageMeta({
  layout: "custom",
});
const router = useRouter();

// const { handleSubmit, errors, values } = useForm<LoginForm>({
//   validationSchema: loginSchema,
//   initialValues: {
//     email: "",
//     password: "",
//   },
// });

const form = ref({
  email: "",
  password: "",
});

const onSubmit = async (formData: any) => {
  formData = form.value;
  // const result = await login(formData);
  router.push("/dashboard");
};
</script>
<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Login</h1>
          <p class="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <form class="grid gap-4" @submit.prevent="onSubmit">
          <div>
            <Label for="email">Email</Label>
            <Input
              v-model="form.email"
              id="email"
              type="email"
              placeholder="m@example.com"
            />
          </div>

          <div>
            <Label for="password">Password</Label>
            <Input v-model="form.password" id="password" type="password" />
          </div>

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
