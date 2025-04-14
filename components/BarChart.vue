<script setup lang="ts">
import { AreaChart } from "@/components/ui/chart-area";
import { CurveType } from "@unovis/ts";

const props = defineProps({
  data: {
    type: Array as () => Record<string, any>[],
    required: true,
    default: () => [
      { name: "Sunday", total: Math.floor(Math.random() * 2000) + 1000 },
      { name: "Monday", total: Math.floor(Math.random() * 2000) + 1000 },
      { name: "Tuesday", total: Math.floor(Math.random() * 2000) + 1000 },
      { name: "Wednesday", total: Math.floor(Math.random() * 2000) + 1000 },
      { name: "Thursday", total: Math.floor(Math.random() * 2000) + 1000 },
      { name: "Friday", total: Math.floor(Math.random() * 2000) + 1000 },
      { name: "Saturday", total: Math.floor(Math.random() * 2000) + 1000 },
    ],
  },
});

// const data = [
//   { name: "Sunday", total: Math.floor(Math.random() * 2000) + 1000 },
//   { name: "Monday", total: Math.floor(Math.random() * 2000) + 1000 },
//   { name: "Tuesday", total: Math.floor(Math.random() * 2000) + 1000 },
//   { name: "Wednesday", total: Math.floor(Math.random() * 2000) + 1000 },
//   { name: "Thursday", total: Math.floor(Math.random() * 2000) + 1000 },
//   { name: "Friday", total: Math.floor(Math.random() * 2000) + 1000 },
//   { name: "Saturday", total: Math.floor(Math.random() * 2000) + 1000 },
// ];
</script>

<template>
  <AreaChart
    index="name"
    :data="props.data"
    :categories="['total']"
    :show-grid-line="false"
    :show-legend="false"
    :show-x-axis="false"
    :show-y-axis="false"
    :curve-type="CurveType.Linear"
  />
</template>
