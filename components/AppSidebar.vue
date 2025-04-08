<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";
import { Dumbbell } from "lucide-vue-next";
import { SquareActivity } from "lucide-vue-next";
interface SidebarProps {
  someProp?: string;
}

const props = defineProps<SidebarProps>();

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Overview",
      icon: "SquareActivity",
      url: "/dashboard",
    },
    {
      title: "Workouts",
      url: "/workouts",
    },
    {
      title: "Avatar",
      url: "/avatar",
    },
    {
      title: "Health Advice",
      icon: "SquareActivity",
      url: "/health",
    },
    {
      title: "Community",
      url: "#",
    },
  ],
};
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <VersionSwitcher
        :versions="data.versions"
        :default-version="data.versions[0]"
      />
      <SearchForm />
    </SidebarHeader>
    <SidebarContent class="gap-0">
      <Collapsible
        v-for="item in data.navMain"
        :key="item.title"
        :title="item.title"
        default-open
        class="group/collapsible"
      >
        <SidebarGroup>
          <SidebarGroupLabel
            as-child
            class="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <NuxtLink :to="item.url">
              <CollapsibleTrigger>
                <component :is="Dumbbell || item.icon" class="size-6 mx-2" />
                <p>{{ item.title }}</p>
              </CollapsibleTrigger>
            </NuxtLink>
          </SidebarGroupLabel>
        </SidebarGroup>
      </Collapsible>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
