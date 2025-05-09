<template>
  <div class="workout-form-view">
    <WorkoutForm />
  </div>
</template>

<script>
import WorkoutForm from "@/components/WorkoutForm.vue";

export default {
  name: "CreateWorkoutView",
  components: {
    WorkoutForm,
  },
};
</script>

<style scoped>
* {
  font-family: "Inter", sans-serif;
}

.workout-form-view {
  margin: 20px;
  background: var(--bg-color);
}
</style>
