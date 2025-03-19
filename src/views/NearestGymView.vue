<template>
  <div class="nearest-gym">
    <h1>Найближчий зал</h1>
    <p>Функціонал у розробці...</p>
  </div>
</template>

<script>
export default {
  name: 'NearestGymView',
};
</script>

<style scoped>
* {
  font-family: 'Inter', sans-serif;
}

.nearest-gym {
  margin: 20px;
  padding: 20px;
  background: var(--bg-color);
  border-radius: 15px;
  box-shadow: 0 4px 15px var(--shadow-color);
  animation: fadeIn 0.5s ease-out;
}

h1 {
  color: var(--text-color);
  font-weight: 700;
  animation: slideInLeft 0.5s ease-out;
}

p {
  color: var(--text-color);
  font-weight: 400;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>