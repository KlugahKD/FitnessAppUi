<script setup lang="ts">
import { Dumbbell } from "lucide-vue-next";
import { ref } from "vue";

const props = defineProps<{
  versions: string[];
  defaultVersion: string;
}>();

const selectedVersion = ref(props.defaultVersion);
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div
          class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
        >
          <Dumbbell class="size-4" />
        </div>
        <div class="flex flex-col gap-0.5 leading-none">
          <span class="font-medium">FITNESSAPP</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
