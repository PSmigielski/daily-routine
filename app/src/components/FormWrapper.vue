<template>
  <div class="formContainer">
    <p class="formContainer__header">{{formData.label}}</p>
    <form method="post" class="form" @submit.prevent="handleSubmit">
      <InputComponent v-for="(data, index) in inputData" :key="index" :data="data" :v-model="formInputData[data.name]" :value="formInputData[data.name]"/>
      <p class="error">{{errorMessage}}</p>
      <p class="notification">{{notification}}</p>
      <button type="submit" class="form__submit">{{formData.label}}</button>
    </form>
  </div>
</template>
<script>
import InputComponent from "@/components/InputComponent.vue";

export default {
  name: 'FormWrapper',
  data() {
    return {
      formInputData: {},
    };
  },
  components: { InputComponent },
  props: {
    inputData: {
      type: Array,
      required: true,
    },
    wrapperHeight: {
      type: String,
      required: true,
    },
    formHeight: {
      type: String,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleSubmit() {
      this.$emit('formSubmit', this.formInputData);
    },
  },
};
</script>
