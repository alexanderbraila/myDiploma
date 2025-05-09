<template>
  <div class="container mt-5">
    <h2 class="mb-4">Особистий кабінет</h2>
    <form @submit.prevent="updateProfile">
      <div class="mb-3">
        <label for="username" class="form-label">Ім’я користувача:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="form-control"
          required
          disabled
        />
      </div>
      <div class="mb-3">
        <label for="age" class="form-label">Вік:</label>
        <input
          type="number"
          id="age"
          v-model="age"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="height" class="form-label">Зріст (см):</label>
        <input
          type="number"
          id="height"
          v-model="height"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="weight" class="form-label">Вага (кг):</label>
        <input
          type="number"
          id="weight"
          v-model="weight"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="gender" class="form-label">Стать:</label>
        <select id="gender" v-model="gender" class="form-select" required>
          <option value="male">Чоловіча</option>
          <option value="female">Жіноча</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="goal" class="form-label">Мета:</label>
        <select id="goal" v-model="goal" class="form-select" required>
          <option value="maintain">Підтримка форми</option>
          <option value="gain">Набір маси</option>
          <option value="lose">Схуднення</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="activity_level" class="form-label"
          >Рівень активності:</label
        >
        <select
          id="activity_level"
          v-model="activity_level"
          class="form-select"
          required
        >
          <option value="sedentary">Мізерна активність (основний обмін)</option>
          <option value="lightly_active">Мінімальна активність</option>
          <option value="moderately_active">3 рази на тиждень</option>
          <option value="very_active">5 разів на тиждень</option>
          <option value="extra_active">Щодня</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Зберегти зміни</button>
    </form>
    <div
      v-if="message"
      :class="{ 'alert alert-danger': error, 'alert alert-success': !error }"
      role="alert"
    >
      {{ message }}
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
      height: null,
      weight: null,
      gender: "",
      goal: "",
      activity_level: "",
      age: null,
      message: "",
      error: false,
    };
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.message = "Токен відсутній. Увійдіть у систему.";
        this.error = true;
        this.$router.push("/login");
        return;
      }
      console.log("Sending token:", token);
      try {
        const response = await axios.get(
          "http://93.170.78.64:5000/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const {
          username,
          email,
          height,
          weight,
          gender,
          goal,
          activity_level,
          age,
        } = response.data;
        this.username = username;
        this.email = email;
        this.height = height;
        this.weight = weight;
        this.gender = gender;
        this.goal = goal;
        this.activity_level = activity_level;
        this.age = age;
      } catch (error) {
        console.error(
          "Ошибка в fetchProfile:",
          error.response?.data || error.message
        );
        this.message =
          error.response?.data || "Помилка при отриманні даних профілю";
        this.error = true;
        if (error.response?.status === 401) {
          this.$router.push("/login");
        }
      }
    },
    async updateProfile() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.message = "Токен відсутній. Увійдіть у систему.";
        this.error = true;
        this.$router.push("/login");
        return;
      }
      try {
        const response = await axios.put(
          "http://93.170.78.64:5000/api/profile",
          {
            username: this.username,
            email: this.email,
            height: this.height,
            weight: this.weight,
            gender: this.gender,
            goal: this.goal,
            activity_level: this.activity_level,
            age: this.age,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.message = response.data || "Профіль успішно оновлено";
        this.error = false;
      } catch (error) {
        console.error(
          "Ошибка в updateProfile:",
          error.response?.data || error.message
        );
        this.message = error.response?.data || "Помилка при оновленні профілю";
        this.error = true;
        if (error.response?.status === 401) {
          this.$router.push("/login");
        }
      }
    },
  },
};
</script>

<style scoped>
* {
  font-family: "Inter", sans-serif;
}

.container {
  max-width: 800px;
  margin: 20px;
  padding: 20px;
  padding-top: 80px;
  background: var(--bg-color);
  border-radius: 15px;
  box-shadow: 0 4px 15px var(--shadow-color);
  animation: fadeIn 0.5s ease-out;
}

@media (max-width: 768px) {
  .container {
    padding-top: 70px;
  }
}

h2 {
  color: var(--text-color);
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  animation: slideInLeft 0.5s ease-out;
}

@media (max-width: 768px) {
  h2 {
    font-size: 1.5rem;
  }
}

.form-control#email {
  color: #000000 !important;
}

.form-control#email:disabled {
  background-color: var(--input-bg);
  opacity: 1;
}

.form-label {
  color: var(--text-color);
  font-weight: 600;
  transform: translateY(10px);
  animation: floatUp 0.5s ease-out forwards;
}

.form-control,
.form-select {
  background-color: var(--input-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.form-control:hover,
.form-select:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px var(--shadow-color);
}

.form-control:focus,
.form-select:focus {
  border-color: var(--button-bg);
  box-shadow: 0 0 8px rgba(255, 133, 162, 0.3);
}

.btn-primary {
  background-color: var(--button-bg);
  border-color: var(--button-bg);
  border-radius: 8px;
  padding: 10px 20px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--button-hover);
  border-color: var(--button-hover);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 107, 139, 0.4);
}

.alert-danger {
  background-color: rgba(255, 133, 162, 0.2);
  color: var(--error-color);
  border-color: var(--error-color);
  border-radius: 8px;
  animation: fadeInUp 0.5s ease-out;
}

.alert-success {
  background-color: rgba(93, 143, 201, 0.2);
  color: var(--success-color);
  border-color: var(--success-color);
  border-radius: 8px;
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
