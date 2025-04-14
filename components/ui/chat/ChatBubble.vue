<script setup lang="ts">
import { computed, defineProps } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  variant?: "received" | "sent";
  layout?: "default" | "ai";
  class?: string;
}>();

const classes = computed(() => {
  const base = "flex gap-2 max-w-[60%] items-end relative group";
  const variant =
    props.variant === "sent" ? "self-end flex-row-reverse" : "self-start";
  const layout = props.layout === "ai" ? "max-w-full w-full items-center" : "";
  return cn(base, variant, layout, props.class);
});
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
