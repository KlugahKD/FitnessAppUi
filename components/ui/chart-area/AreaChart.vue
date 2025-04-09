<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref } from "vue";
import { Area, Axis, CurveType, Line } from "@unovis/ts";
import { VisArea, VisAxis, VisLine, VisXYContainer } from "@unovis/vue";
import { useMounted } from "@vueuse/core";
import { useId } from "radix-vue";
import type { Component } from "vue";
import type { BulletLegendItemInterface } from "@unovis/ts";
import {
  ChartCrosshair,
  ChartLegend,
  defaultColors,
} from "~/components/ui/chart";
import { cn } from "~/lib/utils";
import type { BaseChartProps } from ".";

const props = withDefaults(
  defineProps<
    BaseChartProps<T> & {
      /**
       * Render custom tooltip component.
       */
      customTooltip?: Component;
      /**
       * Type of curve
       */
      curveType?: CurveType;
      /**
       * Controls the visibility of gradient.
       * @default true
       */
      showGradiant?: boolean;
    }
  >(),
  {
    curveType: CurveType.MonotoneX,
    filterOpacity: 0.2,
    margin: () => ({ top: 20, bottom: 20, left: 40, right: 20 }), // Increased margins for better visibility
    showXAxis: true,
    showYAxis: true,
    showTooltip: true,
    showLegend: true,
    showGridLine: true,
    showGradiant: true,
  }
);

const emits = defineEmits<{
  legendItemClick: [d: BulletLegendItemInterface, i: number];
}>();

type KeyOfT = Extract<keyof T, string>;
type Data = (typeof props.data)[number];

const chartRef = useId();

const index = computed(() => props.index as KeyOfT);
const defaultGreenColors = computed(() => [
  "#000", // Primary green
  "#3eb370", // Secondary green
  "#66c2a5", // Light green
  "#1a7431", // Dark green
  "#8dd3c7", // Mint green
]);

const colors = computed(() =>
  props.colors?.length
    ? props.colors
    : defaultGreenColors.value.slice(0, props.categories.length)
);

const legendItems = ref<BulletLegendItemInterface[]>(
  props.categories.map((category, i) => ({
    name: category,
    color: colors.value[i],
    inactive: false,
  }))
);

const isMounted = useMounted();

function handleLegendItemClick(d: BulletLegendItemInterface, i: number) {
  emits("legendItemClick", d, i);
}
</script>

<template>
  <div :class="cn('w-full h-full flex flex-col', $attrs.class ?? '')">
    <ChartLegend
      v-if="showLegend"
      v-model:items="legendItems"
      class="mb-2"
      @legend-item-click="handleLegendItemClick"
    />

    <div class="flex-grow w-full">
      <VisXYContainer class="w-full h-full" :margin="margin" :data="data">
        <svg width="0" height="0">
          <defs>
            <linearGradient
              v-for="(color, i) in colors"
              :id="`${chartRef}-color-${i}`"
              :key="i"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <template v-if="showGradiant">
                <stop offset="5%" :stop-color="color" stop-opacity="0.5" />
                <!-- Increased opacity -->
                <stop offset="95%" :stop-color="color" stop-opacity="0.05" />
                <!-- Subtle base -->
              </template>
              <template v-else>
                <stop offset="0%" :stop-color="color" />
              </template>
            </linearGradient>
          </defs>
        </svg>

        <ChartCrosshair
          v-if="showTooltip"
          :colors="colors"
          :items="legendItems"
          :index="index"
          :custom-tooltip="customTooltip"
        />

        <template v-for="(category, i) in categories" :key="category">
          <VisArea
            :x="(d: Data, i: number) => i"
            :y="(d: Data) => d[category]"
            color="auto"
            :curve-type="curveType"
            :attributes="{
              [Area.selectors.area]: {
                fill: `url(#${chartRef}-color-${i})`,
              },
            }"
            :opacity="
              legendItems.find((item) => item.name === category)?.inactive
                ? filterOpacity
                : 1
            "
          />
        </template>

        <template v-for="(category, i) in categories" :key="category">
          <VisLine
            :x="(d: Data, i: number) => i"
            :y="(d: Data) => d[category]"
            :color="colors[i]"
            :stroke-width="2"
            :curve-type="curveType"
            :attributes="{
              [Line.selectors.line]: {
                opacity: legendItems.find((item) => item.name === category)
                  ?.inactive
                  ? filterOpacity
                  : 1,
              },
            }"
          />
        </template>

        <VisAxis
          v-if="showXAxis"
          type="x"
          :tick-format="xFormatter ?? ((v: number) => data[v]?.[index])"
          :grid-line="false"
          :tick-line="false"
          tick-text-color="hsl(var(--vis-text-color))"
        />
        <VisAxis
          v-if="showYAxis"
          type="y"
          :tick-line="false"
          :tick-format="yFormatter"
          :domain-line="false"
          :grid-line="showGridLine"
          :attributes="{
            [Axis.selectors.grid]: {
              class: 'text-muted',
            },
          }"
          tick-text-color="hsl(var(--vis-text-color))"
        />

        <slot />
      </VisXYContainer>
    </div>
  </div>
</template>

<style scoped>
:deep(.vis-area) {
  transition: opacity 0.3s ease;
}

:deep(.vis-line) {
  transition: opacity 0.3s ease;
}
</style>
