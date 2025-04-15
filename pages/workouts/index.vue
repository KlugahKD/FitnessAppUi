<template>
  <div class="p-4">
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <!-- Health Advice Section -->
      <div>
        <h1 class="text-xl text-gray-500 p-5">Start A Workout</h1>
        <div v-if="status === 'complete'">
          <div
            v-for="(item, index) in healthData"
            :key="'health-' + index"
            class="grid auto-rows-min gap-4 md:grid-cols-3"
          >
            <Card
              class="shadow-none mb-4 border-0 rounded-xl bg-muted/50 col-span-2"
            >
              <CardHeader>
                <CardTitle class="px-3">{{ item.title }}</CardTitle>
                <CardDescription class="text-sm text-gray-500 px-3">
                  {{ item.description }}
                </CardDescription>
                <Button @click="onSubmit(item.id)" class="mt-8 rounded-xl w-3xs"
                  >Start Workout</Button
                >
              </CardHeader>
            </Card>

            <Card
              class="shadow-none border-0 rounded-xl mb-4 bg-muted/50 overflow-hidden p-0"
            >
              <img
                :src="item.image"
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
            v-for="(item, index) in healthData"
            :key="'past-' + index"
            class="flex flex-row gap-4"
          >
            <Card
              class="shadow-none size-24 border-0 rounded-xl mb-4 bg-muted/50 overflow-hidden p-0"
            >
              <img
                :src="item.image"
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
                    <CardTitle class="px-3">{{ item.title }}</CardTitle>
                    <CardDescription class="text-sm text-gray-500 px-3">
                      {{ item.description }}
                    </CardDescription>
                  </div>
                  <Badge class="rounded-xl w-fit">completed</Badge>
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
import { workouts } from "~/features/workouts/api/workouts";
import { getData } from "nuxt-storage/local-storage";

const status = ref("pending");
const router = useRouter();

onMounted(async () => {
  const interval = setInterval(async () => {
    status.value = "pending";
    const user = getData("user");
    clearInterval(interval);
    console.log("user", user.data.userId);
    const res = await workouts(user.data.userId);
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
    description: "Aim at sleeping 7-8 hours a day to improve your health.",
    image: "/health2.jpg",
  },
  {
    title: "Full Body Workout",
    description: "workout for 30 minutes a day to stay fit.",
    image: "/health3.jpg",
  },
]);
</script>
