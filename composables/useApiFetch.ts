export function Fetch<T>(path: string, options: any = {}) {
  const config = useRuntimeConfig();
  const key = `fetch-${path}`; // or use hash(path + options) for uniqueness

  return useAsyncData<T>(key, () =>
    $fetch<T>(`${config.public.apiBaseUrl}${path}`, {
      ...options,
    })
  );
}
