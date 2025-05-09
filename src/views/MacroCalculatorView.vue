<template>
  <div class="macro-calculator-view">
    <MacroCalculator />
  </div>
</template>

<script>
import MacroCalculator from "@/components/MacroCalculator.vue";

export default {
  name: "MacroCalculatorView",
  components: {
    MacroCalculator,
  },
};
</script>

<style scoped>
* {
  font-family: "Inter", sans-serif;
}

.macro-calculator-view {
  margin: 20px;
  background: var(--bg-color);
}
</style>
