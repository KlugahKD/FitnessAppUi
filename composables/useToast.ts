import { ref, onUnmounted } from 'vue';

// Create a global state for toasts that persists across component instances
const toasts = ref([]);
let toastIdCounter = 0;

export function useToast() {
  // Function to add a toast
  const toast = ({ title = '', description = '', type = 'default', duration = 5000 }) => {
    const id = `toast-${toastIdCounter++}`;
    
    // Add the toast to the array
    toasts.value.push({
      id,
      title,
      description,
      type,
      visible: true,
      progress: 100
    });

    // Set up a timer to remove the toast after the duration
    const timer = setTimeout(() => {
      dismissToast(id);
    }, duration);

    // Set up a timer to update the progress bar
    const interval = setInterval(() => {
      const toast = toasts.value.find(t => t.id === id);
      if (toast) {
        toast.progress = Math.max(0, toast.progress - (100 / (duration / 100)));
      }
    }, 100);

    // Clean up timers if the component is unmounted
    onUnmounted(() => {
      clearTimeout(timer);
      clearInterval(interval);
    });

    return id;
  };

  // Function to dismiss a toast by ID
  const dismissToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      // Fade out animation
      toasts.value[index].visible = false;
      
      // Remove from array after animation completes
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, 300);
    }
  };

  return {
    toast,
    dismissToast,
    toasts
  };
}