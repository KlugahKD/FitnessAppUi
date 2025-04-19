export const workouts = async (id: number) => {
  const { data, error } = await Fetch(`/Workout/exercises/today?userId=${id}`, {
    method: "GET",
  });
  return data;
};

export const pastworkouts = async (id: number) => {
  const { data, error } = await Fetch(
    `/Workout/exercises/summary?userId=${id}`,
    {
      method: "GET",
    }
  );
  return data;
};

export const workout = async (id: number, exerciseId: number) => {
  const res = await Fetch(
    `/Workout/exercises/steps?exerciseId=${exerciseId}&userId=${id}`,
    {
      method: "GET",
    }
  );
  return res;
};

export const step = async (id: number, stepId: number) => {
  const { data, error } = await Fetch(
    `/Workout/steps/${stepId}/complete?userId=${id}`,
    {
      method: "PUT",
    }
  );
  return data;
};
