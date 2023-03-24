<template>
  <button :type="data.type" :style="data.style">
    {{data.label}}
  </button>
</template>

<script>
export default {
  name: "ButtonComponent",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>

</style>
