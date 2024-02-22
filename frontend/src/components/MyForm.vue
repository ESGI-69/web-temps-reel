<template>
  <form @submit.prevent="onSubmit">
    <input v-model="value">

    <button
      type="submit"
      :disabled="isLoading"
    >
      Submit
    </button>
  </form>
</template>

<script>
export default {
  name: 'MyForm',
  emits: [ 'submit' ],

  data() {
    return {
      isLoading: false,
      value: '',
    };
  },

  methods: {
    onSubmit() {
      // console.log('form sent');
      this.isLoading = true;
      this.$emit('submit', this.value);
      this.isLoading = false;
    },
  },
};
</script>
