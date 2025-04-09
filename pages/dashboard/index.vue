<script setup lang="ts">
const status = ref("complete");
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { type Ref, ref } from "vue";
import { Progress } from "@/components/ui/progress";

const value = ref(today(getLocalTimeZone())) as Ref<DateValue>;
const progress = ref(13);
watchEffect((cleanupFn) => {
  const timer = setTimeout(() => (progress.value = 66), 500);
  cleanupFn(() => clearTimeout(timer));
});
</script>
<template>
  <main class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mx-4 text-center">
      <Card class="shadow-none border-0 bg-muted/50">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500">Weather</CardTitle>
          <CardDescription class="text-2xl font-bold mt-2 text-black">
            <Skeleton v-if="status === 'pending'" class="h-8" />
            <span v-else>{{ 0 }}°C</span>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="shadow-none border-0 bg-muted/50">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500">Workouts</CardTitle>
          <CardDescription class="text-2xl font-bold mt-2 text-black">
            <Skeleton v-if="status === 'pending'" class="h-8" />
            <span v-else>
              {{ "0" }}
            </span>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="shadow-none border-0 bg-muted/50">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500">Streak</CardTitle>
          <CardDescription class="text-2xl font-bold mt-2 text-black">
            <Skeleton v-if="status === 'pending'" class="h-8" />
            <span v-else>
              {{ "0" }}
            </span>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card class="shadow-none border-0 bg-muted/50">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500">Days Worked Out</CardTitle>
          <CardDescription class="text-2xl font-bold mt-2 text-black">
            <Skeleton v-if="status === 'pending'" class="h-8" />
            <span v-else>
              {{ "0" }}
            </span>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
    <div class="mx-4 grid auto-rows-min gap-4 md:grid-cols-3 text-center">
      <Card class="shadow-none border-0 bg-muted/50">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500">Days Worked Out</CardTitle>
          <CardDescription class="text-2xl font-bold mt-2 text-black">
            <Skeleton v-if="status === 'pending'" class="h-8" />
            <Calendar
              v-model="value"
              :weekday-format="'short'"
              class="rounded-md border"
            />
          </CardDescription>
        </CardHeader>
      </Card>
      <Card class="shadow-none border-0 bg-muted/50 col-span-2">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500 mb-4"
            >Weekly Summary</CardTitle
          >
          <div v-if="status !== 'pending'" class="space-y-6 text-black">
            <!-- First Row -->
            <div class="grid grid-cols-3 gap-4 text-center px-2">
              <div>
                <p class="text-sm text-gray-500">Workouts</p>
                <p class="text-xl font-bold">5</p>
                <p class="text-xs text-green-600">+2 from last week</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Calories Burned</p>
                <p class="text-xl font-bold">2,340</p>
                <p class="text-xs text-green-600">+180 kcal</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Steps</p>
                <p class="text-xl font-bold">14,800</p>
                <p class="text-xs text-green-600">+1,200 steps</p>
              </div>
            </div>

            <!-- Second Row -->
            <div class="grid grid-cols-3 gap-4 text-center mt-5 mb-4 px-2">
              <div>
                <p class="text-sm text-gray-500">Active Minutes</p>
                <p class="text-xl font-bold">190</p>
                <p class="text-xs text-gray-400">~27 min/day</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Avg. Workout Time</p>
                <p class="text-xl font-bold">38 min</p>
                <p class="text-xs text-gray-400">-2 min from last week</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Goal Completion</p>
                <p class="text-xl font-bold">83%</p>
                <p class="text-xs text-gray-400">5 of 6 days</p>
              </div>
            </div>

            <!-- Goal Progress -->
            <div class="px-2">
              <p class="text-sm text-gray-500 mb-1">Weekly Goal Progress</p>
              <Progress v-model="progress" />
            </div>
          </div>
          <Skeleton v-else class="h-48" />
        </CardHeader>
      </Card>
    </div>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="grid auto-rows-min gap-4 md:grid-cols-1">
        <Card class="h-[50vh] shadow-none border-0 bg-muted/50">
          <BarChart />
        </Card>
      </div>
      <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  </main>
</template>
