<template>
  <div class="bg-white min-h-screen">
    <div class="max-w-7xl mx-auto p-6 space-y-8">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-400 rounded-2xl p-6 mb-6">
        <div class="flex items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">FitLife</h1>
            <p class="text-gray-600">Push your limits, achieve your goals</p>
          </div>
          <div class="ml-auto">
            <div class="bg-black bg-opacity-5 p-2 rounded-full">
              <div class="w-10 h-10 bg-A3F300 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Start A Workout -->
      <div>
        <h1 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-2">TODAY'S WORKOUTS</span>
          <span class="bg-A3F300 h-1 flex-grow rounded-full ml-2"></span>
        </h1>
        
        <div v-if="status === 'complete'">
          <div v-if="currentWorkoutsData.length === 0" class="text-center py-8">
            <div class="bg-f6fef2 rounded-2xl p-8 flex flex-col items-center shadow-sm">
              <p class="text-gray-500 text-lg font-medium">No workouts scheduled for today!</p>
            </div>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(item, index) in currentWorkoutsData"
              :key="'health-' + index"
              class="bg-f6fef2 rounded-2xl overflow-hidden shadow-sm"
            >
              <div class="aspect-video w-full relative">
                <img :src="'/' + item.img + '.jpg'" alt="Workout image" class="w-full h-full object-cover" />
                <div class="absolute bottom-4 left-4">
                  <span 
                    class="text-white px-4 py-1 rounded-full text-xs font-bold"
                    :class="item.isStarted ? 'bg-yellow-500' : item.isCompleted ? 'bg-A3F300' : 'bg-A3F300'"
                  >
                    {{ item.isCompleted ? "COMPLETED" : item.isStarted ? "IN PROGRESS" : "READY" }}
                  </span>
                </div>
              </div>
              
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2">{{ item.name }}</h3>
                <p class="text-gray-500 mb-6">{{ item.description }}</p>
                <button 
                  @click="onSubmit(item.id)" 
                  class="w-full bg-A3F300 hover:bg-8dd800 text-gray-800 py-3 px-6 rounded-xl font-bold transition duration-200"
                >
                  {{ item.isCompleted ? "VIEW COMPLETED" : item.isStarted ? "CONTINUE WORKOUT" : "START WORKOUT" }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="n in 2" :key="'skeleton-health-' + n" class="bg-f6fef2 rounded-2xl overflow-hidden shadow-sm">
            <div class="aspect-video w-full">
              <div class="w-full h-full bg-gray-200 animate-pulse"></div>
            </div>
            <div class="p-6">
              <div class="h-6 w-1/2 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
              <div class="h-4 w-3/4 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
              <div class="h-4 w-1/2 bg-gray-200 rounded-full mb-6 animate-pulse"></div>
              <div class="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Past Workouts -->

      <h1 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-2">WORKOUT HISTORY</span>
          <span class="bg-A3F300 h-1 flex-grow rounded-full ml-2"></span>
        </h1>

      <div
  v-for="(item, index) in pastWorkoutsData"
  :key="'past-' + index"
  class="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition"
>
  <div class="flex items-center gap-4">
    <img :src="'/' + item.img + '.jpg'" class="w-16 h-16 rounded-lg object-cover" />
    <div>
      <h4 class="font-bold text-gray-800">{{ item.name }}</h4>
      <p class="text-gray-500 text-sm">{{ item.description }}</p>
    </div>
  </div>
  <span 
    class="mt-3 sm:mt-0 px-3 py-1 rounded-full text-xs font-semibold"
    :class="item.isCompleted ? 'bg-green-500 text-white' : 'bg-red-100 text-red-600'"
  >
    {{ item.isCompleted ? "COMPLETED" : "MISSED" }}
  </span>
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
const currentWorkoutsData = ref([]);
const pastWorkoutsData = ref([]);

onMounted(async () => {
  const interval = setInterval(async () => {
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

<style>
/* Custom color classes for the theme */
.bg-A3F300 {
  background-color: #A3F300;
}
.bg-8dd800 {
  background-color: #8dd800;
}
.bg-f6fef2 {
  background-color: #f6fef2;
}
.border-A3F300 {
  border-color: #A3F300;
}
</style>