<template>
  <div id="app" :data-theme="currentTheme">
    <NavBar />
    <router-view :class="'router-view-' + $route.name" />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
  data() {
    return {
      currentTheme: localStorage.getItem("theme") || "light",
    };
  },
  watch: {
    currentTheme(newTheme) {
      localStorage.setItem("theme", newTheme);
    },
  },
};
</script>

<style>
html {
  overflow-y: scroll;
  scrollbar-width: thin;
}

body {
  padding-right: v-bind('scrollbarWidth + "px"');
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background: var(--bg-color);
}

#app {
  font-family: "Inter", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background: var(--bg-color);
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.router-view-create-workout,
.router-view-macro-calculator,
.router-view-profile,
.router-view-GymFinder {
  padding-top: 60px;
}

@media (max-width: 768px) {
  .router-view-create-workout,
  .router-view-macro-calculator,
  .router-view-profile,
  .router-view-GymFinder {
    padding-top: 50px;
  }
}

.router-view-create-workout,
.router-view-macro-calculator,
.router-view-profile,
.router-view-GymFinder {
  background: transparent;
}

:root {
  --bg-color: linear-gradient(135deg, #fce7ea, #e6f0fa);
  --text-color: #000000;
  --card-bg: rgba(255, 255, 255, 0.9);
  --button-bg: #ff85a2;
  --button-hover: #ff6b8b;
  --navbar-bg: linear-gradient(90deg, #ff85a2, #5d8fc9);
  --input-bg: rgba(255, 255, 255, 0.8);
  --border-color: #d4e4f7;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --error-color: #ff6b8b;
  --success-color: #5d8fc9;
}

[data-theme="dark"] {
  --bg-color: linear-gradient(135deg, #2a1c2b, #1c252b);
  --text-color: #ffffff;
  --card-bg: rgba(50, 50, 50, 0.9);
  --button-bg: #ff85a2;
  --button-hover: #ff6b8b;
  --navbar-bg: linear-gradient(90deg, #8b3a5e, #3a5e8b);
  --input-bg: rgba(70, 70, 70, 0.8);
  --border-color: #4a4a4a;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --error-color: #ff8c99;
  --success-color: #8cb3ff;
}
</style>
