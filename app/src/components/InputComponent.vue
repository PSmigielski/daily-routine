<template>
  <input
    :type="data.type"
    :name="data.name"
    :value="value"
    :placeholder="data.placeholder"
    :required="data.required ? true : false"
    @input="handleChange"
  />
</template>
<script>
export default {
  name: 'InputComponent',
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    },
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleChange(e) {
      console.log('asdasd');
      this.$emit('input', e.target.value);
    },
  },
};
</script>
