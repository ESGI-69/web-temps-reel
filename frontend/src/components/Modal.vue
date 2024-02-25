<template>
  <div
    v-if="isOpen"
    class="modal"
  >
    <div class="modal-content">
      <button @click="closeModal">
        Close
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits([ 'update:isOpen' ]);

const closeModal = () => {
  emit('update:isOpen', false);
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  display: flex;
  justify-content: center;
  color: #000000;
}

.modal-content {
  margin-top: 6rem;
  background-color: white;
  width: 80%;
  height: fit-content;
  padding: 20px;
  border-radius: 10px;
  z-index: 2;
}
</style>
