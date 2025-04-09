export function Fetch<T>(path: string, options: any = {}) {
  const config = useRuntimeConfig();

  return useFetch<T>(`${config.public.apiBaseUrl}${path}`, {
    ...options,
  });
}
