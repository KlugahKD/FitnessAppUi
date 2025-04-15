<script setup lang="ts">
import type { FunctionalComponent } from "vue";
import { useNav } from "@/composables/useNav";
import { getData } from "nuxt-storage/local-storage";
interface SidebarProps {
  someProp?: string;
}

const user = getData("user");
const props = defineProps<SidebarProps>();
const data = {
  user: {
    name: user?.data?.firstName,
    email: user?.data?.email,
    avatar: user?.data?.firstName[0] + user?.data?.lastName[0],
  },
};

const { navMain, versions, icons } = useNav();
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <VersionSwitcher :versions="versions" :default-version="versions[0]" />
      <SearchForm />
    </SidebarHeader>

    <SidebarContent class="gap-0">
      <Collapsible
        v-for="item in navMain"
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
              <CollapsibleTrigger class="flex items-center gap-2 px-2 py-1">
                <component
                  v-if="item.icon && icons[item.icon as keyof typeof icons]"
                  :is="icons[item.icon as keyof typeof icons] as FunctionalComponent"
                  class="size-5"
                />
                <span>{{ item.title }}</span>
              </CollapsibleTrigger>
            </NuxtLink>
          </SidebarGroupLabel>
        </SidebarGroup>
      </Collapsible>
    </SidebarContent>

    <SidebarRail />
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>
