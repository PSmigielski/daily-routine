<template>
  <div class="formContainer">
    <p class="formContainer__header">{{formData.label}}</p>
    <form method="post" class="form" @submit.prevent="handleSubmit">
      <InputComponent v-for="(data, index) in inputData" :key="index" :data="data" :value="formInputData[data.name]"  @inp="handleChange(data.name, $event)"/>
      <p class="error">{{errorMessage}}</p>
      <p class="notification">{{notification}}</p>
      <ButtonComponent v-for="(data, index) in buttonData" :key="index" :data="data"  />
    </form>
  </div>
</template>
<script>
import InputComponent from "@/components/InputComponent.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";

export default {
  name: 'FormWrapper',
  data() {
    return {
      formInputData: {},
      errorMessage: "",
      notification: "",
    };
  },
  components: { ButtonComponent, InputComponent },
  props: {
    inputData: {
      type: Array,
      required: true,
    },
    buttonData: {
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
    handleChange(name, e) {
      this.formInputData[name] = e.target.value;
    },
  },
};
</script>
