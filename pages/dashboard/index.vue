<script setup lang="ts">
import { ref, watchEffect, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { dashboard } from "@/features/dashboard/api/dashboard";
import { getData } from "nuxt-storage/local-storage";
import { Progress } from "@/components/ui/progress";

const router = useRouter();
const status = ref("pending");
const value = ref(today(getLocalTimeZone())) as Ref<DateValue>;
const UserData = ref();
const progress = ref(1);
const data = ref([]);

watchEffect((cleanupFn) => {
  const timer = setTimeout(() => (progress.value = 20), 500);
  cleanupFn(() => clearTimeout(timer));
});

onMounted(async () => {
  status.value = "pending";

  const interval = setInterval(async () => {
    const user = getData("user");

    if (!user || !user?.data?.userId) {
      clearInterval(interval);
      console.log("⚠️ No user found, redirecting to auth...");
      router.push("/auth"); // adjust this path if your auth route is different
      return;
    }

    clearInterval(interval);

    const userId = user.data.userId;
    console.log("✅ userId", userId);

    const res = await dashboard(userId);
    console.log("✅ dashboard response", res);

    if (res !== null) {
      status.value = "complete";
    }
    UserData.value = res;
    progress.value = UserData.value?.data?.goalCompletionPercentage ?? 1;
    data.value = UserData.value?.data?.graphData?.y ?? [];
  }, 200);
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
            <span v-else>{{ UserData?.data?.temperature }}°C</span>
          </CardDescription>
        </CardHeader>
      </Card>
      <Card class="shadow-none border-0 bg-muted/50">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500">Workouts</CardTitle>
          <CardDescription class="text-2xl font-bold mt-2 text-black">
            <Skeleton v-if="status === 'pending'" class="h-8" />
            <span v-else>
              {{ UserData?.data?.totalWorkouts }}
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
              {{ UserData?.data?.streak }}
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
              {{ UserData?.data?.daysWorkedOut }}
            </span>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
    <div class="mx-4 grid auto-rows-min gap-4 md:grid-cols-3 text-center">
      <Card class="shadow-none border-0 bg-muted/50">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500">Motivation</CardTitle>
          <CardDescription
            class="flex flex-col text-2xl mt-4 font-bold text-black"
          >
            <Skeleton v-if="status === 'pending'" class="h-48" />
            <div v-else>
              <Avatar class="">
                <AvatarImage
                  src="https://github.com/unovue.png"
                  alt="@unovue"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span class="text-sm text-gray-500">
                {{
                  UserData?.data?.motivationalMessage ||
                  "The only bad workout is the one that didn't happen."
                }}
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col mt-4 items-center justify-center">
        </CardContent>
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
                <p class="text-xl font-bold">
                  {{ UserData?.data?.weeklyStats?.completedWorkouts }}
                </p>
                <p class="text-xs text-green-600"></p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Days Worked Out</p>
                <p class="text-xl font-bold">
                  {{ UserData?.data?.weeklyStats?.daysWorkedOut }}
                </p>
                <p class="text-xs text-green-600"></p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Weekly Work Outs</p>
                <p class="text-xl font-bold">
                  {{ UserData?.data?.weeklyStats?.totalWorkoutsForTheWeek }}
                </p>
                <p class="text-xs text-green-600"></p>
              </div>
            </div>

            <!-- Second Row -->
            <div class="grid grid-cols-3 gap-4 text-center mt-5 mb-4 px-2">
              <div>
                <p class="text-sm text-gray-500">Active Minutes</p>
                <p class="text-xl font-bold">
                  {{ UserData?.data?.weeklyStats?.totalWorkoutTime }}
                </p>
                <p class="text-xs text-gray-400"></p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Avg. Workout Time</p>
                <p class="text-xl font-bold">
                  {{ UserData?.data?.avgWorkoutTime }}
                </p>
                <p class="text-xs text-gray-400"></p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Goal Completion</p>
                <p class="text-xl font-bold">
                  {{ UserData?.data?.goalCompletionPercentage }}%
                </p>
                <p class="text-xs text-gray-400"></p>
              </div>
            </div>

            <!-- Goal Progress -->
            <div class="px-2">
              <p class="text-sm text-gray-500 mb-4 mt-8">
                Weekly Goal Progress
              </p>
              <Progress v-model="progress" />
              <p class="text-sm text-gray-400 mt-4">
                {{ UserData?.data?.goalCompletionDetails }}
              </p>
            </div>
          </div>
          <Skeleton v-else class="h-48" />
        </CardHeader>
      </Card>
    </div>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="grid auto-rows-min gap-4 md:grid-cols-1">
        <Card class="h-[50vh] shadow-none border-0 bg-muted/50">
          <BarChart :data="data" />
        </Card>
      </div>
      <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  </main>
</template>
