<script setup lang="ts">
import { computed, defineProps } from "vue";
import { cn } from "@/lib/utils";
import MessageLoading from "./MessageLoading.vue";

const props = defineProps<{
  variant?: "received" | "sent";
  layout?: "default" | "ai";
  isLoading?: boolean;
  class?: string;
}>();

const classes = computed(() => {
  let base = "p-4";
  const variant =
    props.variant === "sent"
      ? "bg-primary text-primary-foreground rounded-l-lg rounded-tr-lg"
      : "bg-secondary text-secondary-foreground rounded-r-lg rounded-tl-lg";
  const layout =
    props.layout === "ai" ? "border-t w-full rounded-none bg-transparent" : "";
  return cn(base, variant, layout, props.class);
});
</script>

<template>
  <div :class="[classes, 'break-words max-w-full whitespace-pre-wrap']">
    <template v-if="props.isLoading">
      <div class="flex items-center space-x-2">
        <MessageLoading />
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>
