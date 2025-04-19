<script setup>
import { ref, onMounted, computed } from "vue";
import { workout, step } from "~/features/workouts/api/workouts";
import { getData } from "nuxt-storage/local-storage";
import { useRoute } from "vue-router";

const status = ref("pending");
const workoutTimers = ref({});
const steps = ref([]);
const data = ref(null);
const route = useRoute();

onMounted(async () => {
  const user = getData("user");
  const id = route.params.id;

  console.log("User:", user);
  console.log("Route ID:", id);

  if (!id || !user?.data?.userId) {
    console.warn("Missing id or userId");
    return;
  }

  try {
    const res = await workout(user.data.userId, id);
    console.log("Workout response:", res);

    if (res?.value?.data) {
      data.value = res.value.data;

      steps.value = res.value.data.steps.map((step) => ({
        ...step,
        title: step.description,
        time: step.durationMinutes,
      }));

      for (const step of res.value.data.steps) {
        workoutTimers.value[step.id] = {
          countdown: step.durationMinutes * 60,
          totalTime: step.durationMinutes * 60,
          progress: step.isCompleted ? 100 : 0,
          isActive: false,
          isCompleted: step.isCompleted,
        };
      }

      status.value = "complete";
    } else {
      console.warn("Workout data is empty or invalid", res);
    }
  } catch (err) {
    console.error("Error fetching workout", err);
  }
});

const formatTime = (val) => {
  const min = String(Math.floor(val / 60)).padStart(2, "0");
  const sec = String(val % 60).padStart(2, "0");
  return `${min}:${sec}`;
};

const startWorkout = (id, durationMinutes) => {
  const isAnyStepActive = Object.values(workoutTimers.value).some(
    (step) => step.isActive
  );

  if (
    isAnyStepActive ||
    workoutTimers.value[id]?.isActive ||
    workoutTimers.value[id]?.isCompleted
  ) {
    return;
  }

  const totalTime = durationMinutes * 60;

  workoutTimers.value[id] = {
    countdown: totalTime,
    totalTime,
    progress: 0,
    isActive: true,
    isCompleted: false,
  };

  const timer = setInterval(async () => {
    const data = workoutTimers.value[id];
    if (!data) return;

    if (data.countdown > 0) {
      data.countdown -= 1;
      data.progress =
        ((data.totalTime - data.countdown) / data.totalTime) * 100;
    } else {
      clearInterval(timer);
      data.countdown = 0;
      data.progress = 100;
      data.isActive = false;
      data.isCompleted = true;
      await callDummyEndpoint(id);
    }
  }, 1000);
};

const isAnyStepActive = computed(() =>
  Object.values(workoutTimers.value).some((step) => step.isActive)
);

const callDummyEndpoint = async (id) => {
  const user = getData("user");
  await step(user.data.userId, id);
  console.log("Step completed and dummy API called for step", id);
};
</script>

<template>
  <div class="p-4">
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 class="text-xl text-gray-500 p-5">Start A Workout</h1>
        <div>
          <h2 class="text-lg text-gray-500 px-5">
            {{ data?.name }}
          </h2>
        </div>
        <div
          v-if="status === 'complete'"
          v-for="(item, index) in steps"
          :key="'step-' + item.id"
          class="space-y-10"
        >
          <div class="w-full my-10 mx-auto">
            <div class="flex flex-row justify-between items-center">
              <span class="my-6 text-sm text-gray-500"
                >{{ index + 1 }} of {{ steps.length }}</span
              >
              <span class="text-sm text-gray-500">
                {{ Math.round(workoutTimers[item.id]?.progress || 0) }}%
              </span>
            </div>
            <Progress :model-value="workoutTimers[item.id]?.progress || 0" />
          </div>

          <div class="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card class="shadow-none h-40 mb-4 border-0 rounded-xl col-span-2">
              <CardHeader class="p-0">
                <CardTitle>{{ item.title }}</CardTitle>
                <CardDescription class="text-sm text-gray-500">
                  {{ item.time }} minutes
                </CardDescription>

                <Button
                  class="mt-8 rounded-xl w-3xs"
                  @click="startWorkout(item.id, item.time)"
                  :disabled="
                    workoutTimers[item.id]?.isActive ||
                    (isAnyStepActive && !workoutTimers[item.id]?.isActive)
                  "
                >
                  {{
                    workoutTimers[item.id]?.isCompleted
                      ? "Completed Workout"
                      : workoutTimers[item.id]?.isActive
                      ? "In Progress..."
                      : "Start Workout"
                  }}
                </Button>
              </CardHeader>
            </Card>

            <Card
              class="shadow-none h-40 border-0 rounded-xl mb-4 bg-muted/50 flex items-center justify-center"
            >
              <div class="text-center w-full">
                <p class="text-4xl font-bold text-gray-700">
                  {{
                    workoutTimers[item.id]?.isCompleted
                      ? "✔️ Done"
                      : workoutTimers[item.id]?.countdown > 0
                      ? formatTime(workoutTimers[item.id]?.countdown)
                      : "00:00"
                  }}
                </p>
                <p class="text-sm text-gray-500 mt-2">Timer</p>
              </div>
            </Card>
          </div>
        </div>

        <!-- Skeletons -->
        <div v-else v-for="n in 3" :key="'skeleton-health-' + n">
          <div>
            <div class="flex flex-row justify-between items-center">
              <Skeleton class="h-8 w-16 mt-6 rounded-xl" />
              <Skeleton class="h-8 w-16 mt-6 rounded-xl" />
            </div>
            <Skeleton class="my-6 h-4 w-full" />
          </div>
          <div class="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card class="shadow-none mb-8 border-0 rounded-xl col-span-2">
              <CardHeader class="p-0">
                <Skeleton class="h-6 w-1/3 mb-2" />
                <Skeleton class="h-4 w-3/4 mb-2" />
                <Skeleton class="h-4 w-1/2" />
                <Skeleton class="h-10 w-32 mt-6 rounded-xl" />
              </CardHeader>
            </Card>
            <Card
              class="shadow-none border-0 rounded-xl mb-4 bg-muted/50 overflow-hidden p-0"
            >
              <Skeleton class="w-full h-full min-h-[100px] rounded-xl" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
