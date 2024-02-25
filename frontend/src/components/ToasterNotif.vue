<template>
  <div class="toaster">
    <TransitionGroup
      name="toast"
      tag="div"
    >
      <div
        v-for="toast in toasterStore.toasts"
        :key="toast.id"
        :class="['toast', toast.type]"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToasterStore } from '@/stores/toasterStore.js';

const toasterStore = useToasterStore();
</script>

  <style scoped>
  .toaster {
    position: fixed;
    top: 0;
    right: 0;
    padding: 10px;
    z-index: 1000;
  }

  .toast {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
  }

  .toast.warning {
    background-color: #ffc107;
  }

  .toast-enter-active, .toast-leave-active {
  transition: all 0.5s;
}

.toast-enter-from, .toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-enter-to, .toast-leave-from {
  transform: translateX(0);
  opacity: 1;
}
  </style>
