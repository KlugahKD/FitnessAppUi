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
import { Dumbbell, CloudSunRain, Zap, CalendarDays } from "lucide-vue-next";

const router = useRouter();
const status = ref("pending");
const value = ref(today(getLocalTimeZone())) as Ref<DateValue>;
const UserData = ref();
const progress = ref(1);
const data = ref([]);

watchEffect((cleanupFn) => {
  const timer = setTimeout(() => progress.value, 500);
  cleanupFn(() => clearTimeout(timer));
});

onMounted(async () => {
  status.value = "pending";

  const interval = setInterval(async () => {
    const user = getData("user");

    if (!user || !user?.data?.userId) {
      clearInterval(interval);
      console.log("\u26a0\ufe0f No user found, redirecting to auth...");
      router.push("/auth");
      return;
    }

    clearInterval(interval);

    const userId = user.data.userId;
    const res = await dashboard(userId);

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
  <main class="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
    <!-- Overview Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
      <Card class="bg-muted/50 p-4 rounded-xl">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500">Weather</CardTitle>
          <CardDescription class="text-3xl font-bold text-black mt-2">
            <Skeleton v-if="status === 'pending'" class="h-8" />
            <span v-else>{{ UserData?.data?.temperature }}°C</span>
          </CardDescription>
          <CloudSunRain class="mx-auto mt-4" />
        </CardHeader>
      </Card>

      <Card class="bg-muted/50 p-4 rounded-xl">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500">Workouts</CardTitle>
          <CardDescription class="text-3xl font-bold text-black mt-2">
            <Skeleton v-if="status === 'pending'" class="h-8" />
            <span v-else>{{ UserData?.data?.totalWorkouts }}</span>
          </CardDescription>
          <Dumbbell class="mx-auto mt-4" />
        </CardHeader>
      </Card>

      <Card class="bg-muted/50 p-4 rounded-xl">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500">Streak</CardTitle>
          <CardDescription class="text-3xl font-bold text-black mt-2">
            <Skeleton v-if="status === 'pending'" class="h-8" />
            <span v-else>{{ UserData?.data?.streak }}</span>
          </CardDescription>
          <Zap class="mx-auto mt-4" />
        </CardHeader>
      </Card>

      <Card class="bg-muted/50 p-4 rounded-xl">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500">Days Worked Out</CardTitle>
          <CardDescription class="text-3xl font-bold text-black mt-2">
            <Skeleton v-if="status === 'pending'" class="h-8" />
            <span v-else>{{ UserData?.data?.daysWorkedOut }}</span>
          </CardDescription>
          <CalendarDays class="mx-auto mt-4" />
        </CardHeader>
      </Card>
    </div>

    <!-- Motivation + Weekly Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Motivation -->
      <div class="bg-muted/50 p-6 rounded-xl shadow-md w-full">
        <p class="text-sm text-gray-500 font-semibold mb-4">Motivation</p>
        <Skeleton v-if="status === 'pending'" class="h-48 w-full rounded-lg" />
        <template v-else>
          <div class="flex flex-col items-center sm:items-start gap-4 sm:gap-6 w-full flex-wrap">
            <div class="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-[4px] border-[#C6F600] shadow-lg animate-pulse-soft shrink-0">
              <img
                src="/avatars/motivational-coach.png"
                alt="Motivational Coach"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="speech-bubble text-sm md:text-base text-gray-800 font-medium italic leading-relaxed max-w-[300px]">
              <span class="typewriter block">
                {{
                  UserData?.data?.motivationalMessage ??
                  "The only bad workout is the one that didn't happen."
                }}
              </span>
            </div>
          </div>
        </template>
      </div>

      <!-- Weekly Summary -->
      <Card class="bg-muted/50 p-6 rounded-xl text-center">
        <CardHeader>
          <CardTitle class="text-sm text-gray-500 mb-4">Weekly Summary</CardTitle>
          <Skeleton v-if="status === 'pending'" class="h-48" />
          <template v-else>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-500">Workouts</p>
                <p class="text-xl font-bold">
                  {{ UserData?.data?.weeklyStats?.completedWorkouts }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Days Worked Out</p>
                <p class="text-xl font-bold">
                  {{ UserData?.data?.weeklyStats?.daysWorkedOut }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Weekly Workouts</p>
                <p class="text-xl font-bold">
                  {{ UserData?.data?.weeklyStats?.totalWorkoutsForTheWeek }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Active Minutes</p>
                <p class="text-xl font-bold">
                  {{ UserData?.data?.weeklyStats?.totalWorkoutTime }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Avg. Workout Time</p>
                <p class="text-xl font-bold">
                  {{ UserData?.data?.avgWorkoutTime }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Goal Completion</p>
                <p class="text-xl font-bold">
                  {{ Math.round(UserData?.data?.goalCompletionPercentage) }}%
                </p>
                </div>
            </div>
            <div class="mt-6 text-left">
              <p class="text-sm text-gray-500 mb-2">Weekly Goal Progress</p>
              <Progress v-model="progress" />
              <p class="text-xs text-gray-400 mt-2">
                {{ UserData?.data?.goalCompletionDetails }}
              </p>
            </div>
          </template>
        </CardHeader>
      </Card>
    </div>

    <!-- Chart -->
    <div class="grid grid-cols-1">
      <Card class="bg-muted/50 p-6 rounded-xl min-h-[300px] sm:min-h-[350px] md:min-h-[400px] w-full overflow-x-auto">
  <div class="min-w-[400px] sm:min-w-full">
    <Skeleton v-if="status === 'pending'" class="h-full" />
    <BarChart v-else :data="data" />
  </div>
</Card>
    </div>
  </main>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.95;
  }
}

.animate-pulse-soft {
  animation: pulse 3s ease-in-out infinite;
}

.speech-bubble {
  position: relative;
  background: #fff;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  word-wrap: break-word;
  word-break: break-word;
  max-width: 90%;
  width: fit-content;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-right: 10px solid #fff;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
}

.typewriter {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid rgba(0, 0, 0, 0.2);
  animation: typing 3s steps(30, end), blink 0.75s step-end infinite;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}
</style>
