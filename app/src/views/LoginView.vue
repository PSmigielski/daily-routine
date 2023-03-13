<template>
  <FormWrapper
    :inputData="[
          {
            type: 'text',
            placeholder: 'Email',
            name: 'login',
            required: true,
          },
          {
            type: 'password',
            placeholder: 'Hasło',
            name: 'password',
            required: true,
          },
        ]"
    :formData="{
          messages: 'Log in',
          label: 'Zaloguj się',
        }"
    :wrapperHeight="'60%'"
    :formHeight="'46%'"
    @form-submit="handleSubmit"
  />
</template>

<script>
// @ is an alias to /src
import FormWrapper from '@/components/FormWrapper.vue';

export default {
  name: 'LoginView',
  components: { FormWrapper },
  data() {
    return {
      login: '',
      password: '',
    };
  },
  methods: {
    handleSubmit(e) {
      console.log(e);
    },
  },
};
</script>
<style lang="scss">
  @import '@/assets/index.scss';

</style>
