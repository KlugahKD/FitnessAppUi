<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { workout, step } from "~/features/workouts/api/workouts";
import { getData } from "nuxt-storage/local-storage";
import { useRoute } from "vue-router";
import { useToast } from "~/composables/useToast";

const status = ref("loading");
const workoutTimers = ref({});
const steps = ref([]);
const route = useRoute();
const { toast } = useToast();
const activeStepId = ref(null);
const completedSteps = ref(0);
const totalSteps = ref(0);
const overallProgress = ref(0);

// Check if we can auto-continue to the next step
const autoContinue = ref(false);

onMounted(async () => {
  await fetchWorkoutData();
});

async function fetchWorkoutData() {
  const user = getData("user");
  const id = route.params.id;

  if (!id || !user?.data?.userId) {
    status.value = "error";
    toast({
      title: "Error",
      description: "Missing workout ID or user information",
      type: "error"
    });
    return;
  }

  try {
    status.value = "loading";
    const res = await workout(user.data.userId, id);
    
    if (res?.data?.value?.data) {
      workout.value = res.data.value.data;
      totalSteps.value = res.data.value.data.steps.length;
      
      // Transform steps data
      steps.value = res.data.value.data.steps.map((step) => ({
        ...step,
        title: step.description,
        time: step.durationMinutes,
      }));

      // Initialize timers and count completed steps
      let completed = 0;
      for (const step of res.data.value.data.steps) {
        if (step.isCompleted) completed++;
        
        workoutTimers.value[step.id] = {
          countdown: step.durationMinutes * 60,
          totalTime: step.durationMinutes * 60,
          progress: step.isCompleted ? 100 : 0,
          isActive: false,
          isCompleted: step.isCompleted,
          interval: null
        };
      }
      
      completedSteps.value = completed;
      updateOverallProgress();
      status.value = "ready";
    } else {
      status.value = "error";
      toast({
        title: "Failed to load workout",
        description: "Please try again later",
        type: "error"
      });
    }
  } catch (err) {
    status.value = "error";
    toast({
      title: "Error",
      description: "Could not load your workout",
      type: "error"
    });
  }
}

function updateOverallProgress() {
  overallProgress.value = Math.round((completedSteps.value / totalSteps.value) * 100);
}

const formatTime = (val) => {
  const min = String(Math.floor(val / 60)).padStart(2, "0");
  const sec = String(val % 60).padStart(2, "0");
  return `${min}:${sec}`;
};

const startWorkout = (id, durationMinutes) => {
  if (isAnyStepActive.value && !workoutTimers.value[id]?.isActive) {
    toast({
      title: "Workout in progress",
      description: "Please complete or pause the current exercise first",
      type: "warning"
    });
    return;
  }

  if (workoutTimers.value[id]?.isCompleted) {
    toast({
      title: "Already completed",
      description: "This exercise has already been completed",
      type: "info"
    });
    return;
  }

  if (workoutTimers.value[id]?.isActive) {
    // Pausing functionality
    pauseWorkout(id);
    return;
  }

  const totalTime = durationMinutes * 60;
  activeStepId.value = id;

  // Reset timer if it was previously started but not completed
  if (workoutTimers.value[id]?.progress > 0 && workoutTimers.value[id]?.progress < 100) {
    // Continue from where it left off
  } else {
    workoutTimers.value[id] = {
      countdown: totalTime,
      totalTime,
      progress: 0,
      isActive: true,
      isCompleted: false,
      interval: null
    };
  }

  workoutTimers.value[id].isActive = true;
  
  const interval = setInterval(async () => {
    const data = workoutTimers.value[id];
    if (!data) return;

    if (data.countdown > 0) {
      data.countdown -= 1;
      data.progress = ((data.totalTime - data.countdown) / data.totalTime) * 100;
    } else {
      clearInterval(interval);
      data.countdown = 0;
      data.progress = 100;
      data.isActive = false;
      data.isCompleted = true;
      completedSteps.value += 1;
      updateOverallProgress();
      
      try {
        await completeStep(id);
        toast({
          title: "Exercise completed!",
          description: "Great job! Keep going!",
          type: "success"
        });
        
        // Auto-continue to next step if enabled
        if (autoContinue.value) {
          const currentIndex = steps.value.findIndex(step => step.id === id);
          if (currentIndex < steps.value.length - 1) {
            const nextStep = steps.value[currentIndex + 1];
            setTimeout(() => startWorkout(nextStep.id, nextStep.time), 1000);
          }
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Could not mark exercise as completed",
          type: "error"
        });
      }
    }
  }, 1000);
  
  workoutTimers.value[id].interval = interval;
  
  toast({
    title: "Exercise started",
    description: "Timer has started!",
    type: "info"
  });
};

const pauseWorkout = (id) => {
  if (!workoutTimers.value[id]?.isActive) return;
  
  clearInterval(workoutTimers.value[id].interval);
  workoutTimers.value[id].isActive = false;
  workoutTimers.value[id].interval = null;
  activeStepId.value = null;
  
  toast({
    title: "Exercise paused",
    description: "Resume when you're ready",
    type: "info"
  });
};

const skipWorkout = async (id) => {
  if (workoutTimers.value[id]?.isActive) {
    pauseWorkout(id);
  }
  
  workoutTimers.value[id].progress = 100;
  workoutTimers.value[id].isCompleted = true;
  workoutTimers.value[id].countdown = 0;
  
  completedSteps.value += 1;
  updateOverallProgress();
  
  try {
    await completeStep(id);
    toast({
      title: "Exercise skipped",
      description: "Moving to the next exercise",
      type: "info"
    });
  } catch (err) {
    toast({
      title: "Error",
      description: "Could not skip exercise",
      type: "error"
    });
  }
};

const completeStep = async (id) => {
  const user = getData("user");
  return await step(user.data.userId, id);
};

const resetWorkout = () => {
  // Stop any active timers
  Object.entries(workoutTimers.value).forEach(([id, timer]) => {
    if (timer.interval) {
      clearInterval(timer.interval);
    }
  });
  
  // Reset all workout data
  fetchWorkoutData();
  
  toast({
    title: "Workout reset",
    description: "All progress has been reset",
    type: "info"
  });
};

const isAnyStepActive = computed(() =>
  Object.values(workoutTimers.value).some((step) => step.isActive)
);

const workoutCompleted = computed(() => 
  steps.value.length > 0 && steps.value.every(step => workoutTimers.value[step.id]?.isCompleted)
);

// Safely access timer data with defaults
const getTimerData = (id) => {
  return workoutTimers.value[id] || { 
    countdown: 0, 
    progress: 0, 
    isActive: false, 
    isCompleted: false 
  };
};

// Get appropriate button text based on timer state
const getButtonText = (id) => {
  const timer = workoutTimers.value[id];
  if (!timer) return "Start";
  if (timer.isCompleted) return "Completed";
  if (timer.isActive) return "Pause";
  if (timer.progress > 0) return "Resume";
  return "Start";
};

// Get appropriate button class based on timer state
const getButtonClass = (id) => {
  const timer = workoutTimers.value[id];
  if (!timer) return "bg-primary";
  if (timer.isCompleted) return "bg-[#A3F300]";
  if (timer.isActive) return "bg-amber-500";
  return "bg-primary";
};
</script>

<template>
  <div class="max-w-3xl mx-auto p-4">
    <!-- Header section -->
    <div class="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-slate-800">Workout Session</h1>
        <div class="flex gap-2">
          <Switch 
            v-model="autoContinue" 
            class="ml-2" 
            :disabled="status === 'loading'"
          >
          </Switch>
        </div>
      </div>

      <!-- Workout Info -->
      <div v-if="status === 'ready'" class="mb-4">
        <h2 class="text-xl font-semibold text-slate-700">
          {{ workout?.name }}
        </h2>
        <p class="text-slate-500">{{ workout?.description || 'Follow the workout plan below' }}</p>
        
        <!-- Overall Progress -->
        <div class="mt-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-slate-600">Overall Progress</span>
            <span class="text-sm font-medium text-slate-600">
              {{ completedSteps }} of {{ totalSteps }} exercises
            </span>
          </div>
          <div class="relative h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              class="absolute h-full bg-primary transition-all duration-300 ease-in-out" 
              :style="`width: ${overallProgress}%`"
            ></div>
          </div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-if="status === 'loading'">
        <Skeleton class="h-8 w-3/4 mb-4" />
        <Skeleton class="h-4 w-1/2 mb-6" />
        <div class="flex justify-between items-center mb-2">
          <Skeleton class="h-4 w-20" />
          <Skeleton class="h-4 w-20" />
        </div>
        <Skeleton class="h-2 w-full mb-6" />
      </div>
      
      <!-- Error state -->
      <div v-if="status === 'error'" class="p-4 bg-red-50 rounded-lg text-red-600">
        <p class="font-medium">Failed to load workout data</p>
        <p class="text-sm mt-1">Please check your connection and try again</p>
        <Button class="mt-4" @click="fetchWorkoutData">Retry</Button>
      </div>
    </div>

    <!-- Workout complete message -->
    <div 
      v-if="status === 'ready' && workoutCompleted" 
      class="bg-green-50 border border-green-100 p-6 rounded-2xl mb-6 text-center"
    >
      <div class="text-3xl mb-2">🎉</div>
      <h3 class="text-xl font-bold text-green-700 mb-2">Workout Complete!</h3>
      <p class="text-green-600 mb-4">Congratulations on finishing your workout session.</p>
    </div>

    <!-- Exercise cards -->
    <div v-if="status === 'ready' && !workoutCompleted" class="space-y-6">
      <div 
        v-for="(item, index) in steps" 
        :key="'step-' + item.id"
        class="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300"
        :class="{
          'border-2 border-primary': workoutTimers[item.id]?.isActive,
          'opacity-50': workoutTimers[item.id]?.isCompleted && !workoutTimers[item.id]?.isActive
        }"
      >
        <!-- Exercise header with progress bar -->
        <div class="px-6 pt-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-slate-500">Exercise {{ index + 1 }} of {{ steps.length }}</span>
            <span class="text-sm font-medium" :class="workoutTimers[item.id]?.isCompleted ? 'text-green-500' : 'text-slate-500'">
              {{ Math.round(getTimerData(item.id).progress) }}%
            </span>
          </div>
          <div class="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              class="absolute h-full transition-all duration-300 ease-in-out" 
              :class="workoutTimers[item.id]?.isCompleted ? 'bg-[#A3F300]' : 'bg-primary'"
              :style="`width: ${getTimerData(item.id).progress}%`"
            ></div>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-4 p-6">
          <!-- Exercise details -->
          <div class="md:col-span-2 flex flex-col">
            <h3 class="text-lg font-semibold text-slate-800">{{ item.title }}</h3>
            <p class="text-slate-500 mb-4">{{ item.time }} minutes</p>
            
            <div class="mt-auto flex flex-wrap gap-3">
              <Button 
                class="rounded-lg px-6 transition-all duration-300"
                :class="getButtonClass(item.id)"
                @click="startWorkout(item.id, item.time)"
                :disabled="
                  (isAnyStepActive && !workoutTimers[item.id]?.isActive) ||
                  workoutTimers[item.id]?.isCompleted
                "
              >
                {{ getButtonText(item.id) }}
              </Button>
              
              <Button 
                v-if="!workoutTimers[item.id]?.isCompleted"
                variant="outline" 
                class="rounded-lg"
                @click="skipWorkout(item.id)"
              >
                Skip
              </Button>
            </div>
          </div>

          <!-- Timer card -->
          <div 
            class="rounded-xl flex items-center justify-center p-4 transition-colors duration-300"
            :class="workoutTimers[item.id]?.isActive ? 'bg-primary/10' : 'bg-slate-50'"
          >
            <div class="text-center w-full">
              <p 
                class="text-4xl font-bold transition-all duration-300"
                :class="workoutTimers[item.id]?.isActive ? 'text-primary animate-pulse' : 'text-slate-700'"
              >
                <template v-if="workoutTimers[item.id]?.isCompleted">
                  <span class="text-green-500">✓</span>
                </template>
                <template v-else>
                  {{ formatTime(getTimerData(item.id).countdown) }}
                </template>
              </p>
              <p 
                class="text-sm mt-2"
                :class="workoutTimers[item.id]?.isActive ? 'text-primary' : 'text-slate-500'"
              >
                {{ workoutTimers[item.id]?.isCompleted ? 'Completed' : workoutTimers[item.id]?.isActive ? 'In Progress' : 'Timer' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton loader -->
    <div v-if="status === 'loading'" class="space-y-6">
      <div 
        v-for="n in 3" 
        :key="'skeleton-' + n" 
        class="bg-white rounded-2xl shadow-sm p-6"
      >
        <div class="flex justify-between items-center mb-2">
          <Skeleton class="h-4 w-24" />
          <Skeleton class="h-4 w-16" />
        </div>
        <Skeleton class="h-1.5 w-full mb-6" />
        
        <div class="grid md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <Skeleton class="h-6 w-3/4 mb-2" />
            <Skeleton class="h-4 w-1/2 mb-6" />
            <Skeleton class="h-10 w-28 rounded-lg" />
          </div>
          <div class="bg-slate-50 rounded-xl p-6 flex items-center justify-center">
            <div class="text-center w-full">
              <Skeleton class="h-10 w-20 mx-auto mb-2" />
              <Skeleton class="h-4 w-16 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>