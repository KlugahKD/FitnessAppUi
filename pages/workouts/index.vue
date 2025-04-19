<template>
  <div class="p-4">
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <!-- Health Advice Section -->
      <div>
        <h1 class="text-xl text-gray-500 p-5">Start A Workout</h1>
        <div v-if="status === 'complete'">
          <div
            v-if="currentWorkoutsData.length === 0"
            class="text-center py-10 text-gray-400 text-lg"
          >
            <Card
              class="flex align-center justify-center h-50 shadow-none mb-4 border-0 rounded-xl bg-muted/50 text-gray-500"
              >No workouts for today!</Card
            >
          </div>
          <div
            v-else
            v-for="(item, index) in currentWorkoutsData"
            :key="'health-' + index"
            class="grid auto-rows-min gap-4 md:grid-cols-3"
          >
            <Card
              class="shadow-none mb-4 border-0 rounded-xl bg-muted/50 col-span-2"
            >
              <CardHeader>
                <CardTitle class="px-3">{{ item.name }}</CardTitle>
                <CardDescription class="text-sm text-gray-500 px-3">
                  {{ item.description }}
                </CardDescription>
                <Button
                  @click="onSubmit(item.id)"
                  class="mt-8 rounded-xl w-3xs"
                >
                  {{
                    item.isCompleted
                      ? "Completed Workout"
                      : item.isStarted
                      ? "In Progress..."
                      : "Start Workout"
                  }}
                </Button>
              </CardHeader>
            </Card>

            <Card
              class="shadow-none border-0 rounded-xl mb-4 bg-muted/50 overflow-hidden p-0"
            >
              <img
                :src="'/' + item.img + '.jpg'"
                alt="Fitness tip"
                class="w-full h-full object-cover rounded-xl"
              />
            </Card>
          </div>
        </div>

        <div
          v-else
          class="grid auto-rows-min gap-4 md:grid-cols-3"
          v-for="n in 2"
          :key="'skeleton-health-' + n"
        >
          <Card
            class="shadow-none mb-4 border-0 rounded-xl bg-muted/50 col-span-2"
          >
            <CardHeader>
              <Skeleton class="h-6 w-1/3 mb-2" />
              <Skeleton class="h-4 w-3/4 mb-2" />
              <Skeleton class="h-4 w-1/2" />
              <Skeleton class="h-10 w-32 mt-6 rounded-xl" />
            </CardHeader>
          </Card>

          <Card
            class="shadow-none border-0 rounded-xl mb-4 bg-muted/50 overflow-hidden p-0"
          >
            <Skeleton class="w-full h-full min-h-[150px] rounded-xl" />
          </Card>
        </div>
      </div>

      <div>
        <h1 class="text-xl text-gray-500 p-5">Past Workouts</h1>

        <div v-if="status === 'complete'">
          <div
            v-if="pastWorkoutsData.length === 0"
            class="text-center py-10 text-gray-400 text-lg"
          >
            <Card
              class="flex align-center justify-center h-50 shadow-none mb-4 border-0 rounded-xl bg-muted/50 text-gray-500"
              >No workout history!</Card
            >
          </div>
          <div
            v-for="(item, index) in pastWorkoutsData"
            :key="'past-' + index"
            class="flex flex-row gap-4"
          >
            <Card
              class="shadow-none size-24 border-0 rounded-xl mb-4 bg-muted/50 overflow-hidden p-0"
            >
              <img
                :src="'/' + item.img + '.jpg'"
                alt="Fitness tip"
                class="w-full h-full object-cover rounded-xl"
              />
            </Card>

            <Card
              class="shadow-none w-full mb-4 border-0 rounded-xl bg-muted/50"
            >
              <CardHeader>
                <div class="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle class="px-3">{{ item.name }}</CardTitle>
                    <CardDescription class="text-sm text-gray-500 px-3">
                      {{ item.description }}
                    </CardDescription>
                  </div>
                  <Badge
                    class="rounded-xl w-fit text-white"
                    :class="item.isCompleted ? 'bg-green-100' : 'bg-red-400'"
                  >
                    {{ item.isCompleted ? "completed" : "missed" }}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div
          v-else
          v-for="n in 2"
          :key="'skeleton-past-' + n"
          class="flex flex-row gap-4"
        >
          <Card
            class="shadow-none size-24 border-0 rounded-xl mb-4 bg-muted/50 overflow-hidden p-0"
          >
            <Skeleton class="w-full h-full rounded-xl" />
          </Card>

          <Card class="shadow-none w-full mb-4 border-0 rounded-xl bg-muted/50">
            <CardHeader>
              <div class="flex flex-row justify-between items-center">
                <div class="w-full">
                  <Skeleton class="h-6 w-1/2 mb-2" />
                  <Skeleton class="h-4 w-3/4" />
                </div>
                <Skeleton class="h-6 w-20 rounded-xl" />
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { workouts, pastworkouts } from "~/features/workouts/api/workouts";
import { getData } from "nuxt-storage/local-storage";

const status = ref("pending");
const router = useRouter();
const currentWorkoutsData = ref([
  // {
  //   title: "Yoga for Beginners",
  //   description: "Aim at sleeping 7-8 hours a day to improve your health.",
  //   image: "/health2.jpg",
  // },
  // {
  //   title: "Full Body Workout",
  //   description: "workout for 30 minutes a day to stay fit.",
  //   image: "/health3.jpg",
  // },
]);
const pastWorkoutsData = ref([
  // {
  //   title: "Yoga for Beginners",
  //   description: "Aim at sleeping 7-8 hours a day to improve your health.",
  //   image: "/health2.jpg",
  // },
  // {
  //   title: "Full Body Workout",
  //   description: "workout for 30 minutes a day to stay fit.",
  //   image: "/health3.jpg",
  // },
]);

onMounted(async () => {
  const interval = setInterval(async () => {
    // status.value = "pending";
    const user = getData("user");
    clearInterval(interval);
    console.log("user", user.data.userId);
    const currentWorkouts = await workouts(user.data.userId);
    const pastWorkouts = await pastworkouts(user.data.userId);
    console.log("res", currentWorkouts.value);
    console.log("res2", pastWorkouts.value);
    currentWorkoutsData.value = currentWorkouts.value.data;
    pastWorkoutsData.value = pastWorkouts.value.data.pastWorkouts;
    if (currentWorkouts !== null && pastWorkouts !== null) {
      status.value = "complete";
    }
  }, 200);
});

function onSubmit(id) {
  router.push(`/workouts/${id}`);
}
</script>
