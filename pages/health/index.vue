<template>
  <div class="bg-white min-h-screen">
    <div class="max-w-7xl mx-auto p-6 space-y-8">
      <!-- Hero Banner -->
      <div class="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-A3F300 rounded-2xl p-6 mb-6">
        <div class="flex items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Health & Wellness</h1>
            <p class="text-gray-600">Personalized advice for your fitness journey</p>
          </div>
          <div class="ml-auto">
            <div class="bg-black bg-opacity-5 p-2 rounded-full hidden md:block">
              <div class="w-10 h-10 bg-A3F300 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Health Advice Section -->
      <div>
        <h1 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-2">PERSONALIZED HEALTH ADVICE</span>
          <span class="bg-A3F300 h-1 flex-grow rounded-full ml-2"></span>
        </h1>
        
        <div v-if="status === 'complete'">
          <div 
            v-for="(item, index) in healthData" 
            :key="index"
            class="mb-8"
          >
            <div class="grid gap-6 md:grid-cols-3">
              <!-- Text Card -->
              <div class="md:col-span-2 bg-f6fef2 rounded-2xl shadow-sm overflow-hidden">
                <div class="p-6">
                  <h2 class="text-xl font-bold text-gray-800 mb-3">{{ item.title }}</h2>
                  <p class="text-gray-500 mb-6 line-clamp-3">{{ item.content }}</p>
                  <button 
                    @click="openArticle(item)" 
                    class="bg-A3F300 hover:bg-8dd800 text-gray-800 py-2 px-6 rounded-xl font-bold transition duration-200 inline-flex items-center"
                  >
                    <span>Read More</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Image Card -->
              <div class="bg-f6fef2 rounded-2xl shadow-sm overflow-hidden">
                <div class="aspect-square w-full h-full">
                  <img :src="'/' + item.img + '.jpg'" alt="Health tip" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="healthData.length === 0" class="text-center py-8">
            <div class="bg-f6fef2 rounded-2xl p-8 flex flex-col items-center shadow-sm">
              <p class="text-gray-500 text-lg font-medium">No personalized health advice available yet!</p>
            </div>
          </div>
        </div>
        
        <!-- Skeleton Loading State -->
        <div v-else>
          <div v-for="n in 2" :key="'health-skeleton-' + n" class="mb-8">
            <div class="grid gap-6 md:grid-cols-3">
              <!-- Text Skeleton -->
              <div class="md:col-span-2 bg-f6fef2 rounded-2xl shadow-sm overflow-hidden">
                <div class="p-6">
                  <div class="h-7 w-1/2 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                  <div class="h-4 w-3/4 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
                  <div class="h-4 w-2/3 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
                  <div class="h-4 w-1/2 bg-gray-200 rounded-full mb-6 animate-pulse"></div>
                  <div class="h-10 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
              
              <!-- Image Skeleton -->
              <div class="bg-f6fef2 rounded-2xl shadow-sm overflow-hidden">
                <div class="aspect-square w-full h-full">
                  <div class="w-full h-full bg-gray-200 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Articles Section -->
      <div>
        <h1 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-2">ARTICLES AND GUIDES</span>
          <span class="bg-A3F300 h-1 flex-grow rounded-full ml-2"></span>
        </h1>
        
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            v-if="status === 'complete'"
            v-for="(item, index) in articleData"
            :key="'article-' + index"
            class="bg-f6fef2 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full"
          >
            <div class="relative">
              <img
                :src="'/' + item.img + '.jpg'"
                :alt="item.title"
                class="w-full h-48 object-cover"
              />
              <div class="absolute top-3 right-3">
                <span class="bg-A3F300 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">
                  GUIDE
                </span>
              </div>
            </div>
            
            <div class="p-5 flex flex-col flex-grow">
              <h2 class="text-lg font-bold text-gray-800 mb-3">{{ item.title }}</h2>
              <p class="text-gray-500 text-sm mb-4 flex-grow">
                Expert advice to improve your daily wellness routine and boost your health naturally.
              </p>
              <a
                :href="item.articleUrl"
                target="_blank"
                class="text-sm font-medium text-gray-800 hover:text-A3F300 transition duration-200 flex items-center"
              >
                Read full article
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Article Skeleton -->
          <div
            v-else
            v-for="n in 3"
            :key="'article-skeleton-' + n"
            class="bg-f6fef2 rounded-2xl shadow-sm overflow-hidden flex flex-col"
          >
            <div class="relative">
              <div class="w-full h-48 bg-gray-200 animate-pulse"></div>
            </div>
            <div class="p-5">
              <div class="h-6 w-3/4 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
              <div class="h-4 w-full bg-gray-200 rounded-full mb-2 animate-pulse"></div>
              <div class="h-4 w-2/3 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
              <div class="h-4 w-1/3 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Health Tips Section -->
      <div class="bg-f6fef2 rounded-2xl shadow-sm p-6">
        <h1 class="text-xl font-bold text-gray-800 mb-4">TODAY'S QUICK TIPS</h1>
        
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </div>
              <h3 class="font-bold text-gray-800">Stay Hydrated</h3>
            </div>
            <p class="text-gray-500 text-sm">Drink at least 8 glasses of water daily to maintain optimal hydration levels.</p>
          </div>
          
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 class="font-bold text-gray-800">Eat More Greens</h3>
            </div>
            <p class="text-gray-500 text-sm">Include at least one serving of leafy greens with each meal for better nutrition.</p>
          </div>
          
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 class="font-bold text-gray-800">Quality Sleep</h3>
            </div>
            <p class="text-gray-500 text-sm">Aim for 7-8 hours of quality sleep each night to support recovery and overall health.</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Article Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800">{{ modalContent.title }}</h2>
            <button @click="showModal = false" class="text-gray-500 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mb-6">
            <img :src="'/' + modalContent.img + '.jpg'" alt="Article image" class="w-full h-64 object-cover rounded-xl">
          </div>
          
          <div class="prose max-w-none">
            <p class="text-gray-700 mb-4">{{ modalContent.content }}</p>
            <p class="text-gray-700 mb-4">
              Regular physical activity and proper nutrition are essential components of a healthy lifestyle. 
              The benefits of maintaining a balanced diet and exercise routine extend beyond physical 
              appearance and can significantly impact your overall well-being.
            </p>
            <p class="text-gray-700 mb-4">
              Studies have shown that incorporating whole foods, staying adequately hydrated, and engaging in 
              regular moderate exercise can reduce the risk of chronic diseases, improve mood, and increase energy levels.
            </p>
            <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">Key Takeaways</h3>
            <ul class="list-disc pl-5 mb-4 text-gray-700">
              <li>Maintain a balanced diet rich in whole foods</li>
              <li>Stay hydrated throughout the day</li>
              <li>Engage in at least 30 minutes of physical activity daily</li>
              <li>Prioritize sleep quality and stress management</li>
              <li>Consider consulting with healthcare professionals for personalized advice</li>
            </ul>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button 
              @click="showModal = false" 
              class="bg-A3F300 hover:bg-8dd800 text-gray-800 py-2 px-6 rounded-xl font-bold transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { health } from "~/features/health/api/health";
import { getData } from "nuxt-storage/local-storage";

const status = ref("pending");
const router = useRouter();
const healthData = ref([]);
const showModal = ref(false);
const modalContent = ref({
  title: "",
  content: "",
  img: ""
});

const articleData = ref([
  {
    title: "Better Sleep Habits",
    image: "/health3.jpg",
    articleUrl: "https://www.healthline.com/nutrition/17-tips-to-sleep-better",
  },
  {
    title: "Hydration Tips",
    image: "/health4.jpg",
    articleUrl:
      "https://www.medicalnewstoday.com/articles/why-is-water-important",
  },
  {
    title: "Whole Foods for Life",
    image: "/health5.jpg",
    articleUrl:
      "https://www.health.harvard.edu/blog/the-benefits-of-whole-foods-2020030918967",
  },
]);

onMounted(async () => {
  const interval = setInterval(async () => {
    const user = getData("user");

    if (!user || !user.data?.userId) {
      console.warn("User not found in localStorage");
      clearInterval(interval);
      status.value = "complete";
      return;
    }

    clearInterval(interval);

    try {
      const res = await health(user.data.userId);
      console.log("Health data fetched:", res.value?.data);
      healthData.value = res.value?.data || [];
    } catch (error) {
      console.error("Failed to fetch health data:", error);
      healthData.value = [];
    } finally {
      status.value = "complete";
    }
  }, 200);
});

function openArticle(item) {
  modalContent.value = {
    title: item.title,
    content: item.content,
    img: item.img
  };
  showModal.value = true;
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
.text-A3F300 {
  color: #A3F300;
}
.hover\:text-A3F300:hover {
  color: #A3F300;
}
</style>