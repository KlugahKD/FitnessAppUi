<template>
  <div class="p-4">
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <!-- Health Advice Section -->
      <div>
        <h1 class="text-xl text-gray-500 p-5">Personalized Health Advice</h1>
        <div
          v-if="status === 'complete'"
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
                {{ item.content }}
              </CardDescription>
              <Button class="mt-8 rounded-xl w-3xs">read more</Button>
            </CardHeader>
          </Card>

          <!-- Image Card -->
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

        <!-- Skeleton Loading State -->
        <div
          v-else
          v-for="n in 2"
          :key="'health-skeleton-' + n"
          class="grid auto-rows-min gap-4 md:grid-cols-3"
        >
          <!-- Text Skeleton -->
          <Card
            class="shadow-none mb-4 border-0 rounded-xl bg-muted/50 col-span-2"
          >
            <CardHeader>
              <Skeleton class="h-6 w-1/3 mb-2" />
              <Skeleton class="h-4 w-3/4 mb-2" />
              <Skeleton class="h-4 w-1/2" />
              <Skeleton class="h-10 w-24 mt-6 rounded-xl" />
            </CardHeader>
          </Card>

          <!-- Image Skeleton -->
          <Card
            class="shadow-none border-0 rounded-xl mb-4 bg-muted/50 overflow-hidden p-0"
          >
            <Skeleton class="w-full h-full min-h-[150px] rounded-xl" />
          </Card>
        </div>
      </div>

      <!-- Articles Section -->
      <div>
        <h1 class="text-xl text-gray-500 p-5">Articles And Guides</h1>
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card
            v-if="status === 'complete'"
            v-for="(item, index) in articleData"
            :key="'article-' + index"
            class="shadow-none border-0 rounded-xl bg-muted/50 overflow-hidden flex flex-col p-0"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="w-full h-48 object-cover rounded-t-xl"
            />
            <div class="p-4">
              <h2 class="text-lg font-semibold mb-2">{{ item.title }}</h2>
              <a
                :href="item.articleUrl"
                target="_blank"
                class="text-sm text-blue-600 hover:underline"
              >
                Read full article →
              </a>
            </div>
          </Card>

          <!-- Article Skeleton -->
          <Card
            v-else
            v-for="n in 3"
            :key="'article-skeleton-' + n"
            class="shadow-none border-0 rounded-xl bg-muted/50 overflow-hidden flex flex-col p-0"
          >
            <Skeleton class="w-full h-48 rounded-t-xl" />
            <div class="p-4">
              <Skeleton class="h-6 w-2/3 mb-2" />
              <Skeleton class="h-4 w-1/2" />
            </div>
          </Card>
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
</script>
