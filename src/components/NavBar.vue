<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Блок логотипу -->
      <div class="navbar-logo">
        <img src="@/assets/images/FitPlanner.png" alt="FitPlanner" class="navbar-brand" />
      </div>
      <!-- Блок меню -->
      <div class="navbar-menu" :class="{ active: isMenuOpen }">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Головна</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/create-workout" class="nav-link">Створити тренування</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/gym-finder" class="nav-link">Найближчий зал</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/macro-calculator" class="nav-link">Калькулятор БЖВ</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <router-link to="/profile" class="nav-link">Особистий кабінет</router-link>
          </li>
        </ul>
      </div>
      <!-- Блок дій -->
      <div class="navbar-actions">
        <button @click="toggleTheme" class="btn btn-theme" :class="{ 'dark-theme': currentTheme === 'dark' }">
          <span class="theme-icon moon"></span>
        </button>
        <div v-if="!isAuthenticated" class="auth-buttons">
          <router-link to="/register" class="btn btn-outline">Реєстрація</router-link>
          <router-link to="/login" class="btn btn-primary">Вхід</router-link>
        </div>
        <div v-else class="user-info">
          <span class="username">Вітаємо, {{ username }}</span>
          <button @click="logout" class="btn btn-outline">Вийти</button>
        </div>
      </div>
      <!-- Кнопка для мобільного меню -->
      <button class="navbar-toggler" @click="toggleMenu" aria-label="Toggle navigation">
        <span class="toggler-icon"></span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      isMenuOpen: false,
      scrollbarWidth: 0,
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    },
    username() {
      return localStorage.getItem('username') || 'Гість';
    },
    currentTheme() {
      return this.$root.currentTheme || 'light';
    },
  },
  mounted() {
    this.scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${this.scrollbarWidth}px`;
    this.$nextTick(() => {
      this.$el.classList.add('visible');
    });
  },
  methods: {
    logout() {
      console.log('Вихід з акаунта...');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      this.$router.push('/login');
      console.log('Перенаправлення на /login виконано, перезавантаження...');
      window.location.reload();
    },
    toggleTheme() {
      this.$root.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
* {
  font-family: 'Inter', sans-serif;
}

.navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content; /* Адаптивна ширина */
  z-index: 1000;
  transition: all 0.6s ease-out;
  background: transparent;
  opacity: 0;
  transform: translate(-50%, -100px);
}

.navbar.visible {
  opacity: 1;
  transform: translate(-50%, 0);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem; /* Відступ між трьома блоками */
}

/* Блок логотипу */
.navbar-logo {
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.navbar-brand {
  height: 40px;
  width: 150px;
  padding: 0.5rem 0;
  border-radius: 25px;
  object-fit: contain;
}

/* Блок меню */
.navbar-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  flex-wrap: nowrap;
  transition: all 0.5s ease;
}

.navbar-nav {
  display: flex !important;
  flex-direction: row !important;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem;
  flex-wrap: nowrap;
}

.nav-item {
  display: inline-flex;
  position: relative;
}

.nav-link {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  position: relative;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: #ff85a2;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff85a2, transparent);
  transition: width 0.4s ease, left 0.4s ease;
}

.nav-link:hover::after {
  width: 100%;
  left: 0;
}

.router-link-active {
  color: #ffffff !important;
}

.router-link-active::after {
  width: 70%;
  left: 15%;
  background: #ff85a2;
}

/* Блок дій */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  flex-wrap: nowrap;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.btn-outline {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
}

.btn-outline:hover {
  background: rgba(255, 133, 162, 0.1);
  border-color: #ff85a2;
  color: #ffffff;
  box-shadow: 0 0 10px rgba(255, 133, 162, 0.5);
}

.btn-primary {
  background: #ff85a2;
  color: #ffffff;
}

.btn-primary:hover {
  background: #ff6b8b;
  color: #ffffff;
}

.btn-theme {
  background: transparent;
  border: 1px solid #ffffff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-theme:hover {
  background: #ff85a2;
  border-color: #ff85a2;
  transform: scale(1.1);
}

.btn-theme:active .theme-icon.moon {
  transform: translate(-50%, -50%) rotate(180deg);
}

.btn-theme.dark-theme::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: #ff85a2;
  transition: width 0.3s ease;
}

.btn-theme.dark-theme:hover::after {
  width: 70%;
}

.btn-theme span {
  display: none;
}

.theme-icon.moon {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: inset -10px 0 0 #000000;
  transition: transform 0.6s ease-in-out, box-shadow 0.6s ease-in-out;
}

.btn-theme.dark-theme .theme-icon.moon {
  transform: translate(-50%, -50%) rotate(360deg);
  box-shadow: inset 10px 0 0 #000000;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: nowrap;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: nowrap;
}

.username {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
}

.navbar-toggler {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.toggler-icon {
  display: block;
  width: 25px;
  height: 3px;
  background: #ffffff;
  position: relative;
}

.toggler-icon::before,
.toggler-icon::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 3px;
  background: #ffffff;
  transition: all 0.3s ease;
}

.toggler-icon::before {
  top: -8px;
}

.toggler-icon::after {
  bottom: -8px;
}

/* Мобільна версія */
@media (max-width: 768px) {
  .navbar {
    left: 0;
    transform: none;
    margin: 0;
    width: 100%;
    padding: 0 0.5rem;
  }

  .navbar-container {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    gap: 0;
  }

  .navbar-logo {
    border-radius: 50px;
    padding: 0.5rem;
  }

  .navbar-menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(10px);
    padding: 1rem;
    border-radius: 0 0 20px 20px;
    transform: scaleY(0);
    transform-origin: top;
    opacity: 0;
  }

  .navbar-menu.active {
    display: flex;
    transform: scaleY(1);
    opacity: 1;
    transition: transform 0.5s ease, opacity 0.3s ease;
  }

  .navbar-nav {
    flex-direction: column !important;
    gap: 1rem;
    width: 100%;
  }

  .nav-item {
    display: block;
  }

  .navbar-actions {
    border-radius: 50px;
    padding: 0.5rem;
    flex-direction: row;
    gap: 1rem;
  }

  .auth-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .user-info {
    flex-direction: column;
    gap: 1rem;
  }

  .navbar-toggler {
    display: block;
  }

  .navbar-toggler.active .toggler-icon {
    background: transparent;
  }

  .navbar-toggler.active .toggler-icon::before {
    transform: rotate(45deg);
    top: 0;
  }

  .navbar-toggler.active .toggler-icon::after {
    transform: rotate(-45deg);
    bottom: 0;
  }
}
</style>