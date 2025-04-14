export const dashboard = async (id: string) => {
  const { data, error } = await Fetch(`/Dashboard/overview?userId=${id}`, {
    method: "GET",
  });

  if (error.value) throw error.value;
  return data.value;
};
