<script setup lang="ts">
import { cn } from "@/lib/utils";
import { defineEmits, defineProps } from "vue";

const props = defineProps<{
  class?: string;
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <textarea
    :class="
      cn(
        'max-h-12 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center h-16 resize-none',
        props.class
      )
    "
    autocomplete="off"
    name="message"
    :value="props.modelValue"
    @input="event => emit('update:modelValue', (event.target as HTMLTextAreaElement).value)"
  />
</template>
