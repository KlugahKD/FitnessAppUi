<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref } from 'vue';
import { Donut } from '@unovis/ts';
import { VisDonut, VisSingleContainer } from '@unovis/vue';
import { useMounted } from '@vueuse/core';
import type { Component } from 'vue';
import { ChartSingleTooltip, defaultColors } from '~/components/ui/chart';
import { cn } from '~/lib/utils';
import type { BaseChartProps } from '.';

const props = withDefaults(
  defineProps<
    Pick<
      BaseChartProps<T>,
      'data' | 'colors' | 'index' | 'margin' | 'showLegend' | 'showTooltip' | 'filterOpacity'
    > & {
      /**
       * Sets the name of the key containing the quantitative chart values.
       */
      category: KeyOfT;
      /**
       * Change the type of the chart
       * @default "donut"
       */
      type?: 'donut' | 'pie';
      /**
       * Function to sort the segment
       */
      sortFunction?: (a: any, b: any) => number | undefined;
      /**
       * Controls the formatting for the label.
       */
      valueFormatter?: (tick: number, i?: number, ticks?: number[]) => string;
      /**
       * Render custom tooltip component.
       */
      customTooltip?: Component;
    }
  >(),
  {
    margin: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    sortFunction: () => undefined,
    valueFormatter: (tick: number) => `${tick}`,
    type: 'donut',
    filterOpacity: 0.2,
    showTooltip: true,
    showLegend: true,
  },
);

type KeyOfT = Extract<keyof T, string>;
type Data = (typeof props.data)[number];

const category = computed(() => props.category as KeyOfT);
const index = computed(() => props.index as KeyOfT);

const isMounted = useMounted();
const activeSegmentKey = ref<string>();

// Ensure we have valid data before trying to compute derived values
const validData = computed(() =>
  Array.isArray(props.data)
    ? props.data.filter((d) => d && typeof d === 'object' && d[props.category] !== undefined)
    : [],
);

const colors = computed(() =>
  props.colors?.length ? props.colors : defaultColors(validData.value.length),
);

const legendItems = computed(() =>
  validData.value.map((item, i) => ({
    name: item[props.index] || 'Unknown',
    value: item[props.category] || 0,
    color: colors.value[i % colors.value.length], // Use modulo to prevent out-of-bounds access
    inactive: activeSegmentKey.value !== undefined && activeSegmentKey.value !== item[props.index],
  })),
);

const totalValue = computed(() =>
  validData.value.reduce((prev, curr) => {
    return prev + (Number(curr[props.category]) || 0);
  }, 0),
);

const chartHeight = computed(() => (props.showLegend ? 'h-full md:w-3/4' : 'h-full'));
</script>

<template>
  <div :class="cn('w-full h-full md:flex md:flex-row', $attrs.class ?? '')">
    <!-- Chart container -->
    <div :class="chartHeight">
      <VisSingleContainer class="w-full h-full" :margin="margin" :data="validData">
        <ChartSingleTooltip
          v-if="showTooltip"
          :selector="Donut.selectors.segment"
          :index="category"
          :items="legendItems"
          :value-formatter="valueFormatter"
          :custom-tooltip="customTooltip"
        />

        <VisDonut
          :value="(d: Data) => d[category]"
          :sort-function="sortFunction"
          :color="colors"
          :arc-width="type === 'donut' ? 20 : 0"
          :show-background="false"
          :central-label="type === 'donut' ? valueFormatter(totalValue) : ''"
          :events="{
            [Donut.selectors.segment]: {
              click: (d: Data, ev: PointerEvent, i: number, elements: HTMLElement[]) => {
                if (d?.data?.[index] === activeSegmentKey) {
                  activeSegmentKey = undefined;
                  elements.forEach((el) => (el.style.opacity = '1'));
                } else {
                  activeSegmentKey = d?.data?.[index];
                  elements.forEach((el) => (el.style.opacity = `${filterOpacity}`));
                  elements[i].style.opacity = '1';
                }
              },
            },
          }"
        />

        <slot />
      </VisSingleContainer>
    </div>

    <!-- Legend -->
    <div
      v-if="showLegend"
      class="flex flex-wrap md:flex-col items-start justify-start mt-4 md:mt-0 gap-4 h-auto md:h-full md:w-1/4 overflow-y-auto md:pl-2"
    >
      <div
        v-for="(item, i) in legendItems"
        :key="i"
        :class="
          cn(
            'flex items-center gap-2 px-2 cursor-pointer',
            activeSegmentKey && activeSegmentKey !== item.name ? 'opacity-50' : '',
          )
        "
        @click="activeSegmentKey = activeSegmentKey === item.name ? undefined : item.name"
      >
        <div class="w-3 h-3 rounded-sm" :style="{ backgroundColor: item.color }"></div>
        <span class="text-sm whitespace-nowrap text-xs uppercase"
          >{{ item.name }}: {{ valueFormatter(item.value) }}</span
        >
      </div>
    </div>
  </div>
</template>
