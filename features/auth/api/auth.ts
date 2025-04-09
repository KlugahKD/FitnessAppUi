import type { LoginForm } from "@/features/auth/schemas/auth";
import type { SignupForm } from "@/features/auth/schemas/auth";

export const login = async (payload: LoginForm) => {
  const config = useRuntimeConfig();

  const { data, error } = await Fetch("/Auth/login", {
    method: "POST",
    body: payload,
  });

  if (error.value) throw error.value;
  return data.value;
};
export const signup = async (payload: SignupForm) => {
  const { data, error } = await Fetch("/Auth/register", {
    method: "POST",
    body: payload,
  });

  if (error.value) throw error.value;
  return data.value;
};
