export const health = async (id: number) => {
  const { data, error } = await Fetch(
    `/HealthAdvice/personalized?userId=${id}`,
    {
      method: "GET",
    }
  );
  return data;
};
