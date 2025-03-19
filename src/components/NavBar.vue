<template>
  <nav class="navbar">
    <div class="navbar-container">
      <a class="navbar-brand" href="#">FitPlanner</a>
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
      </div>
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
  width: 100%;
  max-width: 1300px; 
  z-index: 1000;
  transition: all 0.3s ease;
  background: transparent;
}

.navbar-container {
  max-width: 1300px; 
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 50px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
}

[data-theme="dark"] .navbar-container {
  background: rgba(20, 20, 20, 0.8);
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
}

.btn-theme:hover {
  background: #ff85a2;
  border-color: #ff85a2;
}


.btn-theme.dark-theme::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #ff85a2;
  transition: all 0.3s ease;
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
  position: relative;
  box-shadow: inset -10px 0 0 #000000;
}


.btn-theme .theme-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}


.navbar-brand {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.5rem;
  text-decoration: none;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  transition: all 0.3s ease;
  margin-right: 0;
}


.navbar-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: 0;
}


.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}


.navbar-nav {
  display: flex !important;
  flex-direction: row !important;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem;
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
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #ff85a2;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #ff85a2;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.router-link-active {
  color: #ffffff !important;
}

.router-link-active::after {
  width: 100% !important;
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
}

.btn-outline {
  background: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
}

.btn-outline:hover {
  background: #ff85a2;
  border-color: #ff85a2;
  color: #ffffff;
}

.btn-primary {
  background: #ff85a2;
  color: #ffffff;
}

.btn-primary:hover {
  background: #ff6b8b;
  color: #ffffff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
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

@media (max-width: 768px) {
  .navbar-container {
    padding: 0.5rem 1rem;
  }

  .navbar-menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    padding: 1rem;
    border-radius: 0 0 20px 20px;
  }

  .navbar-menu.active {
    display: flex;
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
    flex-direction: column;
    width: 100%;
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