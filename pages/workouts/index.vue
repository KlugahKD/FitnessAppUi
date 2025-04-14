<template>
  <div class="p-4">
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <!-- Health Advice Section -->
      <div>
        <h1 class="text-xl text-gray-500 p-5">Start A Workout</h1>
        <div
          v-for="(item, index) in healthData"
          :key="index"
          class="grid auto-rows-min gap-4 md:grid-cols-3"
        >
          <!-- Text Card -->
          <Card
            class="shadow-none mb-4 border-0 rounded-xl bg-muted/50 col-span-2"
          >
            <CardHeader>
              <CardTitle class="px-3">{{ item.title }}</CardTitle>
              <CardDescription class="text-sm text-gray-500 px-3">
                {{ item.description }}
              </CardDescription>
              <Button class="mt-8 rounded-xl w-3xs">Start Workout</Button>
            </CardHeader>
          </Card>

          <!-- Image Card -->
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
      <div>
        <h1 class="text-xl text-gray-500 p-5">Past Workouts</h1>
        <div
          v-for="(item, index) in healthData"
          :key="index"
          class="flex flex-row gap-4"
        >
          <!-- Image Card -->
          <Card
            class="shadow-none size-24 border-0 rounded-xl mb-4 bg-muted/50 overflow-hidden p-0"
          >
            <img
              :src="item.image"
              alt="Fitness tip"
              class="w-full h-full object-cover rounded-xl"
            />
          </Card>
          <!-- Text Card -->
          <Card class="shadow-none w-full mb-4 border-0 rounded-xl bg-muted/50">
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
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const healthResponse = async () => {
  const { data, error } = await useFetch("health/personlised");
  if (error.value) {
    console.error("Error fetching health data:", error.value);
    return;
  }
  healthData.value = data.value;
};

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
