<template>
  <div>
    <!-- Десктопный навбар -->
    <nav class="navbar desktop-navbar">
      <div class="navbar-container">
        <!-- Блок логотипу -->
        <div class="navbar-logo">
          <span class="navbar-brand">Fit Planner</span>
        </div>
        <!-- Блок меню -->
        <div class="navbar-menu" :class="{ active: isMenuOpen }">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Головна</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/create-workout" class="nav-link"
                >Створити тренування</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/gym-finder" class="nav-link"
                >Найближчий зал</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/macro-calculator" class="nav-link"
                >Калькулятор БЖВ</router-link
              >
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link to="/profile" class="nav-link"
                >Особистий кабінет</router-link
              >
            </li>
          </ul>
        </div>
        <!-- Блок дій -->
        <div class="navbar-actions">
          <button
            @click="toggleTheme"
            class="btn btn-theme"
            :class="{ 'dark-theme': currentTheme === 'dark' }"
          >
            <span class="theme-icon moon"></span>
          </button>
          <div v-if="!isAuthenticated" class="auth-buttons">
            <router-link to="/register" class="btn btn-outline"
              >Реєстрація</router-link
            >
            <router-link to="/login" class="btn btn-primary">Вхід</router-link>
          </div>
          <div v-else class="user-info">
            <span class="username">Вітаємо, {{ username }}</span>
            <button @click="logout" class="btn btn-outline">Вийти</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Мобільний навбар -->
    <nav class="navbar mobile-navbar">
      <div class="mobile-navbar-container">
        <button
          class="navbar-brand"
          @click="toggleMenu"
          aria-label="Toggle navigation"
        >
          Fit Planner
        </button>
      </div>
      <div
        class="mobile-menu"
        :class="{ active: isMenuOpen }"
        @click="handleOutsideClick"
      >
        <ul class="mobile-nav">
          <li class="nav-item">
            <router-link to="/" class="nav-link" @click="toggleMenu"
              >Головна</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              to="/create-workout"
              class="nav-link"
              @click="toggleMenu"
              >Створити тренування</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/gym-finder" class="nav-link" @click="toggleMenu"
              >Найближчий зал</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              to="/macro-calculator"
              class="nav-link"
              @click="toggleMenu"
              >Калькулятор БЖВ</router-link
            >
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <router-link to="/profile" class="nav-link" @click="toggleMenu"
              >Особистий кабінет</router-link
            >
          </li>
        </ul>
        <div class="mobile-actions">
          <button
            @click="toggleTheme"
            class="btn btn-theme"
            :class="{ 'dark-theme': currentTheme === 'dark' }"
          >
            <span class="theme-icon moon"></span>
          </button>
          <div v-if="!isAuthenticated" class="auth-buttons">
            <router-link
              to="/register"
              class="btn btn-outline"
              @click="toggleMenu"
              >Реєстрація</router-link
            >
            <router-link to="/login" class="btn btn-primary" @click="toggleMenu"
              >Вхід</router-link
            >
          </div>
          <div v-else class="user-info">
            <span class="username">Вітаємо, {{ username }}</span>
            <button @click="logout" class="btn btn-outline">Вийти</button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      isMenuOpen: false,
      scrollbarWidth: 0,
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem("token");
    },
    username() {
      return localStorage.getItem("username") || "Гість";
    },
    currentTheme() {
      return this.$root.currentTheme || "light";
    },
  },
  mounted() {
    this.scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${this.scrollbarWidth}px`;
    this.$nextTick(() => {
      this.$el.querySelector(".desktop-navbar").classList.add("visible");
    });
  },
  methods: {
    logout() {
      console.log("Вихід з акаунта...");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      this.$router.push("/login");
      console.log("Перенаправлення на /login виконано, перезавантаження...");
      window.location.reload();
    },
    toggleTheme() {
      this.$root.currentTheme =
        this.currentTheme === "light" ? "dark" : "light";
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    handleOutsideClick(event) {
      if (
        !event.target.closest(".mobile-nav, .mobile-actions, .navbar-brand")
      ) {
        this.isMenuOpen = false;
      }
    },
  },
};
</script>

<style scoped>
* {
  font-family: "Inter", sans-serif;
}

.desktop-navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
  z-index: 1000;
  background: var(--navbar-bg);
  opacity: 0;
  transform: translate(-50%, -100px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 10px var(--shadow-color);
}

.desktop-navbar.visible {
  opacity: 1;
  transform: translate(-50%, 0);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.navbar-logo,
.navbar-menu,
.navbar-actions {
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 10px var(--shadow-color);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--button-bg);
  letter-spacing: 2px;
  background: var(--navbar-bg);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 4px var(--shadow-color);
  padding: 0;
  line-height: 1;
  user-select: none;
  margin: 0;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.navbar-menu {
  gap: 0.5rem;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  list-style: none;
  gap: 1rem;
}

.nav-item {
  display: inline-flex;
  position: relative;
}

.nav-link {
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  position: relative;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--button-bg);
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--button-bg),
    transparent
  );
  transition: width 0.4s ease, left 0.4s ease;
}

.nav-link:hover::after {
  width: 100%;
  left: 0;
}

.router-link-active {
  color: var(--text-color) !important;
}

.router-link-active::after {
  width: 70%;
  left: 15%;
  background: var(--button-bg);
}

.navbar-actions {
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  color: var(--text-color);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color);
  box-shadow: 0 0 5px var(--shadow-color);
}

.btn-outline:hover {
  background: var(--button-hover);
  border-color: var(--button-bg);
  color: var(--text-color);
  box-shadow: 0 0 10px var(--shadow-color);
}

.btn-primary {
  background: var(--button-bg);
  color: var(--text-color);
}

.btn-primary:hover {
  background: var(--button-hover);
  color: var(--text-color);
}

.btn-theme {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
  flex-shrink: 0;
}

.btn-theme:hover {
  background: var(--button-bg);
  border-color: var(--button-bg);
  transform: scale(1.1);
}

.theme-icon.moon {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--text-color);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: inset -10px 0 0 var(--shadow-color);
  transition: transform 0.6s ease-in-out, box-shadow 0.6s ease-in-out;
}

.btn-theme.dark-theme .theme-icon.moon {
  transform: translate(-50%, -50%) rotate(360deg);
  box-shadow: inset 10px 0 0 var(--shadow-color);
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  color: var(--text-color);
}

.mobile-navbar {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: var(--navbar-bg);
  height: 57px;
  box-shadow: 0 4px 10px var(--shadow-color);
}

.mobile-navbar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.mobile-navbar .navbar-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--button-bg);
  letter-spacing: 2px;
  background: var(--navbar-bg);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 2px 4px var(--shadow-color);
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 25px;
  animation: pulse 2s infinite ease-in-out;
  transition: transform 0.3s ease, border-radius 0.3s ease, background 0.3s ease;
  line-height: 1;
  user-select: none;
  cursor: pointer;
  background: none;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--shadow-color);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 10px 5px var(--shadow-color);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--shadow-color);
  }
}

.mobile-menu.active .navbar-brand {
  transform: translateX(-4rem);
  border-radius: 15px;
  background: var(--card-bg);
}

.mobile-menu {
  position: fixed;
  top: 57px;
  left: 0;
  width: 100%;
  display: flex;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  padding: 1rem;
  max-height: calc(100dvh - 60px);
  overflow-y: auto;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  border-radius: 2rem;
}

.mobile-menu.active {
  display: flex;
  transform: scaleY(1);
  opacity: 1;
  border-radius: 2rem;
}

.mobile-nav {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.mobile-menu.active .mobile-nav {
  opacity: 1;
  transform: translateY(0);
}

.mobile-nav .nav-item {
  margin: 0.5rem 0;
}

.mobile-nav .nav-link {
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
  text-decoration: none;
  padding: 0.5rem 1rem;
  display: block;
  transition: color 0.3s ease;
}

.mobile-nav .nav-link:hover {
  color: var(--button-bg);
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0 0 0 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
}

.mobile-menu.active .mobile-actions {
  opacity: 1;
  transform: translateY(0);
}

.content-with-navbar {
  padding-top: 57px;
}

@media (max-width: 768px) {
  .desktop-navbar {
    display: none;
  }
  .mobile-navbar {
    display: block;
  }

  .auth-buttons {
    flex-direction: column;
  }
}

@media (min-width: 769px) {
  .mobile-navbar {
    display: none;
  }
  .desktop-navbar {
    display: block;
  }
}
</style>
