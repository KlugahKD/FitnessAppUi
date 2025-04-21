// plugins/toast.js

export default defineNuxtPlugin((nuxtApp) => {
    // Import the Toast component
    import('~/components/Toast.vue').then((module) => {
      const ToastComponent = module.default;
      
      // Create a div for mounting the Toast component
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
      
      // Create and mount the Toast component
      const { createApp } = require('vue');
      const app = createApp(ToastComponent);
      app.mount('#toast-container');
    });
  });