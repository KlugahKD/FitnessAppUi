export const workouts = async (id: number) => {
  const { data, error } = Fetch(`/Workout/exercises/${id}`, { method: "GET" });
};

export const workout = async (id: number, exerciseId: number) => {
  const { data, error } = Fetch(`Workout/exercises/${exerciseId}/${id}`, {
    method: "GET",
  });
};
