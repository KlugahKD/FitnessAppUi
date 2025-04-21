<!-- components/Toast.vue -->

<script setup>
import { useToast } from '~/composables/useToast';
import { onMounted, ref } from 'vue';

const { toasts, dismissToast } = useToast();

// Define type-based classes for styling
const getTypeClasses = (type) => {
  switch (type) {
    case 'success':
      return {
        container: 'bg-green-50 border-green-200',
        title: 'text-green-800',
        description: 'text-green-600',
        progress: 'bg-green-500'
      };
    case 'error':
      return {
        container: 'bg-red-50 border-red-200',
        title: 'text-red-800',
        description: 'text-red-600',
        progress: 'bg-red-500'
      };
    case 'warning':
      return {
        container: 'bg-amber-50 border-amber-200',
        title: 'text-amber-800',
        description: 'text-amber-600',
        progress: 'bg-amber-500'
      };
    case 'info':
      return {
        container: 'bg-blue-50 border-blue-200',
        title: 'text-blue-800',
        description: 'text-blue-600',
        progress: 'bg-blue-500'
      };
    default:
      return {
        container: 'bg-slate-50 border-slate-200',
        title: 'text-slate-800',
        description: 'text-slate-600',
        progress: 'bg-slate-500'
      };
  }
};
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 w-full max-w-sm">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="w-full rounded-lg shadow-md border p-4 flex flex-col transition-all duration-300 transform"
        :class="[
          getTypeClasses(toast.type).container,
          toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        ]"
      >
        <div class="flex justify-between items-start">
          <div>
            <h4 v-if="toast.title" :class="getTypeClasses(toast.type).title" class="font-medium">
              {{ toast.title }}
            </h4>
            <p v-if="toast.description" :class="getTypeClasses(toast.type).description" class="text-sm mt-1">
              {{ toast.description }}
            </p>
          </div>
          <button 
            @click="dismissToast(toast.id)" 
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <!-- Progress bar -->
        <div class="h-1 mt-3 bg-slate-100 rounded overflow-hidden">
          <div 
            :class="getTypeClasses(toast.type).progress" 
            class="h-full transition-all duration-100 ease-linear"
            :style="{ width: `${toast.progress}%` }"
          ></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}


.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>