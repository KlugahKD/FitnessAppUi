<script setup lang="ts">
import type { FunctionalComponent } from "vue";
import { useNav } from "@/composables/useNav";
import { getData } from "nuxt-storage/local-storage";

interface SidebarProps {
  someProp?: string;
}
const props = defineProps<SidebarProps>();

const user = getData("user");
const data = {
  user: {
    name: user?.data?.firstName,
    email: user?.data?.email,
    avatar: (user?.data?.firstName?.[0] + user?.data?.lastName?.[0] || "").toUpperCase(),
  },
};

const { navMain, versions, icons } = useNav();
</script>

<template>
  <Sidebar class="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col">
    <!-- Logo or Brand -->
    <div class="flex items-center justify-center h-20 border-b border-gray-100">
      <span class="text-2xl font-extrabold text-black">Fit<span class="text-[#D1FA55]">Life</span></span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-6 px-4 space-y-3">
    <NuxtLink
  v-for="item in navMain"
  :key="item.title"
  :to="item.url"
  @click="handleNavClick"
  class="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
         text-gray-700 hover:bg-[#D1FA55]/10 hover:text-black group"
>
  <component
    :is="icons[item.icon as keyof typeof icons]"
    class="w-5 h-5 text-[#D1FA55] group-hover:scale-110 transition-transform"
  />
  <span>{{ item.title }}</span>
</NuxtLink>

    </nav>

    <!-- Footer with User -->
    <div class="px-4 py-6 border-t border-gray-100 bg-[#f9f9f9]">
      <NavUser :user="data.user" />
    </div>
  </Sidebar>
</template>

