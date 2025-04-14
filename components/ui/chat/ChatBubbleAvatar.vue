<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { defineProps } from "vue";

const props = defineProps<{
  src?: string;
  fallback?: string;
  class?: string;
}>();
</script>

<template>
  <Avatar :class="props.class">
    <AvatarImage :src="props.src || ''" alt="Avatar" />
    <AvatarFallback>{{ props.fallback }}</AvatarFallback>
  </Avatar>
</template>
