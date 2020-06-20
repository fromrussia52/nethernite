<template>
  <TestCmp />
</template>

<script>
// @ is an alias to /src
import TestCmp from "@/components/TestCmp/test.component.vue";

export default {
  name: "Home",
  components: {
    TestCmp
  }
};
</script>
