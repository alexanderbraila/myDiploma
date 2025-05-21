<template>
  <div class="register">
    <h2>Реєстрація</h2>
    <form @submit.prevent="register">
      <div>
        <label for="username">Ім’я користувача:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Зареєструватися</button>
    </form>
    <div
      v-if="message"
      :class="{ 'error-message': error, 'success-message': !error }"
    >
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      message: "",
      error: false,
    };
  },
  methods: {
    async register() {
      try {
        await axios.post("http://93.170.78.64:5000/api/register", {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        this.message =
          "Реєстрація пройшла успішно! Будь ласка, увійдіть у свій акаунт.";
        this.error = false;
        setTimeout(() => {
          this.$router.push("/login");
        }, 1500);
      } catch (error) {
        this.message = error.response?.data || "Сталася помилка при реєстрації";
        this.error = true;
      }
    },
  },
};
</script>

<style scoped>
* {
  font-family: "Inter", sans-serif;
}

.register {
  width: 400px;
  margin: auto;
  margin-top: 100px;
  padding: 20px;
  background: var(--bg-color);
  border-radius: 15px;
  box-shadow: 0 4px 15px var(--shadow-color);
  animation: fadeIn 0.5s ease-out;
}

h2 {
  color: var(--text-color);
  font-weight: 700;
  margin-bottom: 1.5rem;
  animation: slideInLeft 0.5s ease-out;
}

label {
  color: var(--text-color);
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
  transform: translateY(10px);
  animation: floatUp 0.5s ease-out forwards;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--input-bg);
  color: var(--text-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

input:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px var(--shadow-color);
}

input:focus {
  border-color: var(--button-bg);
  box-shadow: 0 0 8px rgba(255, 133, 162, 0.3);
  outline: none;
}

button {
  background-color: var(--button-bg);
  border-color: var(--button-bg);
  border-radius: 8px;
  padding: 10px 20px;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

button:hover {
  background-color: var(--button-hover);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 107, 139, 0.4);
}

.error-message {
  color: var(--error-color);
  margin-top: 1rem;
  animation: fadeInUp 0.5s ease-out;
}

.success-message {
  color: var(--success-color);
  margin-top: 1rem;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes floatUp {
  to {
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
