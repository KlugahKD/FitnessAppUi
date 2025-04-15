<template>
  <div class="p-4">
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <!-- Health Advice Section -->
      <div>
        <h1 class="text-xl text-gray-500 p-5">Start A Workout</h1>
        <div
          v-if="status === 'complete'"
          v-for="(item, index) in healthData"
          :key="'health-' + index"
          class="space-y-10"
        >
          <div class="w-full my-10 mx-auto">
            <div class="flex flex-row justify-between items-center">
              <span class="my-6 text-sm text-gray-500"
                >{{ index + 1 }} of {{ healthData.length }}</span
              >
              <span class="text-sm text-gray-500">{{ 30 }}%</span>
            </div>
            <Progress />
          </div>
          <div class="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card class="shadow-none h-40 mb-4 border-0 rounded-xl col-span-2">
              <CardHeader class="p-0">
                <CardTitle class="">{{ item.title }}</CardTitle>
                <CardDescription class="text-sm text-gray-500">
                  {{ item.level }} * {{ item.time }}
                </CardDescription>
                <Button @click="onSubmit(item.id)" class="mt-8 rounded-xl w-3xs"
                  >Start Workout</Button
                >
              </CardHeader>
            </Card>

            <Card
              class="shadow-none h-40 border-0 rounded-xl mb-4 bg-muted/50 overflow-hidden p-0"
            >
              <img
                :src="item.image"
                alt="Fitness tip"
                class="w-full h-full object-cover rounded-xl"
              />
            </Card>
          </div>
        </div>

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

<script setup>
import { ref } from "vue";
import { workout } from "~/features/workouts/api/workouts";
import { getData } from "nuxt-storage/local-storage";

const status = ref("pending");
const router = useRouter();

onMounted(async () => {
  const interval = setInterval(async () => {
    status.value = "pending";
    const user = getData("user");
    clearInterval(interval);
    console.log("user", user.data.userId);
    const res = await workout(user.data.userId, router.params.id);
    if (res !== null) {
      status.value = "complete";
    }
  }, 200);
});

function onSubmit(id) {
  router.push(`/workouts/${id}`);
}

const healthData = ref([
  {
    title: "Yoga for Beginners",
    level: "amateur",
    time: "30 minutes",
    image: "/health2.jpg",
  },
  {
    title: "Full Body Workout",
    level: "beginner",
    time: "10 minutes",
    image: "/health3.jpg",
  },
  {
    title: "Full Body Workout",
    level: "amateur",
    time: "30 minutes",
    image: "/health3.jpg",
  },
]);
</script>
