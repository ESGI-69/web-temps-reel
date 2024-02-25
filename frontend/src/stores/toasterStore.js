import { defineStore } from 'pinia';

export const useToasterStore = defineStore({
  id: 'toaster',
  state: () => ({
    toasts: [],
  }),
  actions: {
    addToast(message, type = 'default') {
      const id = Date.now();
      this.toasts.push({ id, message, type });

      setTimeout(() => {
        this.toasts = this.toasts.filter((toast) => toast.id !== id);
      }, 3000);
    },
  },
});
