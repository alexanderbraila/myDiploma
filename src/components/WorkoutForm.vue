<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 col-12">
        <h2 class="mb-4">Створіть своє тренування</h2>
        <form
          @submit.prevent="generateWorkout"
          class="needs-validation"
          novalidate
        >
          <div class="mb-3">
            <label for="level" class="form-label">Рівень:</label>
            <select id="level" v-model="level" class="form-select" required>
              <option value="beginner">Початківець</option>
              <option value="intermediate">Середній</option>
              <option value="advanced">Просунутий</option>
            </select>
            <div class="invalid-feedback">Будь ласка, виберіть рівень.</div>
          </div>
          <div class="mb-3">
            <label for="gender" class="form-label">Стать:</label>
            <select id="gender" v-model="gender" class="form-select" required>
              <option value="male">Чоловіча</option>
              <option value="female">Жіноча</option>
            </select>
            <div class="invalid-feedback">Будь ласка, виберіть стать.</div>
          </div>
          <div class="mb-3">
            <label for="goal" class="form-label">Мета:</label>
            <select id="goal" v-model="goal" class="form-select" required>
              <option value="muscle_gain">Набір маси</option>
              <option value="weight_loss">Схуднення</option>
              <option value="endurance">Витривалість</option>
            </select>
            <div class="invalid-feedback">Будь ласка, виберіть мету.</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Інвентар:</label>
            <div class="form-check">
              <input
                type="checkbox"
                v-model="equipment"
                value="bodyweight"
                class="form-check-input"
                id="bodyweight"
              />
              <label for="bodyweight" class="form-check-label"
                >Власна вага</label
              >
            </div>
            <div class="form-check">
              <input
                type="checkbox"
                v-model="equipment"
                value="dumbbells"
                class="form-check-input"
                id="dumbbells"
              />
              <label for="dumbbells" class="form-check-label">Гантелі</label>
            </div>
            <div class="form-check">
              <input
                type="checkbox"
                v-model="equipment"
                value="barbell"
                class="form-check-input"
                id="barbell"
              />
              <label for="barbell" class="form-check-label">Штанга</label>
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-primary btn-lg w-100"
            :disabled="isLoading"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>Згенерувати тренування</span>
          </button>
        </form>
      </div>
      <div class="col-md-6 col-12">
        <h3 class="mb-4">Мої тренування</h3>
        <div v-if="isLoading">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Завантаження...</span>
          </div>
        </div>
        <div v-if="savedWorkouts.length > 0">
          <div
            v-for="workout in savedWorkouts"
            :key="workout.id"
            class="card mb-3"
          >
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <button
                class="btn btn-link"
                type="button"
                @click="toggleWorkoutDetails(workout.id)"
              >
                {{ workout.showDetails ? "Приховати" : "Показати" }} тренування
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="deleteWorkout(workout.id)"
              >
                Видалити
              </button>
            </div>
            <div
              class="card-body"
              v-if="workout.showDetails"
              v-html="workout.workout_data"
            ></div>
          </div>
        </div>
        <div v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const apiKey = process.env.VUE_APP_API_KEY;
import axios from "axios";
import Groq from "groq-sdk";

export default {
  data() {
    return {
      level: "beginner",
      gender: "",
      goal: "",
      equipment: ["bodyweight"],
      workoutDescription: "",
      savedWorkouts: [],
      errorMessage: "",
      isLoading: false,
      showNewWorkout: false,
    };
  },
  created() {
    this.fetchProfile();
    this.fetchWorkouts();
  },
  methods: {
    async fetchProfile() {
      const token = localStorage.getItem("token");
      console.log("Fetching profile with token:", token);
      if (!token) {
        this.errorMessage = "Токен відсутній. Увійдіть у систему.";
        this.$router.push("/login");
        return;
      }
      try {
        const response = await axios.get(
          "https://93.170.78.64:5000/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { gender, goal } = response.data;
        this.gender = gender || this.gender;
        this.goal = goal || this.goal;
      } catch (error) {
        console.error(
          "Ошибка в fetchProfile:",
          error.response?.data || error.message
        );
        this.errorMessage =
          error.response?.data || "Помилка при отриманні даних профілю";
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.$router.push("/login");
        }
      }
    },
    async fetchWorkouts() {
      const token = localStorage.getItem("token");
      console.log("Fetching workouts with token:", token);
      if (!token) {
        this.errorMessage = "Токен відсутній. Увійдіть у систему.";
        this.$router.push("/login");
        return;
      }
      try {
        const response = await axios.get(
          "https://93.170.78.64:5000/api/workouts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.savedWorkouts = response.data.map((workout) => ({
          ...workout,
          showDetails: false,
        }));
        this.errorMessage = "";
      } catch (error) {
        console.error(
          "Ошибка в fetchWorkouts:",
          error.response?.data || error.message
        );
        this.errorMessage =
          error.response?.data || "Помилка при отриманні збережених тренувань";
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.$router.push("/login");
        }
      }
    },
    async generateWorkout() {
      this.isLoading = true;
      this.workoutDescription = "";
      this.showNewWorkout = false;

      const groq = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `Створи тренування для користувача з рівнем ${
                this.level
              }, статтю ${this.gender}, метою ${
                this.goal
              } та інвентарем ${this.equipment.join(
                ", "
              )}. Відформатуй відповідь у HTML з тегами для заголовків, списків і виділення тексту, щоб її можна було відобразити на веб-сторінці.`,
            },
          ],
          model: "llama-3.3-70b-versatile",
        });

        this.workoutDescription =
          completion.choices[0]?.message?.content ||
          "Не вдалося згенерувати тренування.";
        this.errorMessage = "";
        this.showNewWorkout = true;

        await axios.post(
          "https://93.170.78.64:5000/api/workouts",
          { workout_data: this.workoutDescription },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.fetchWorkouts();
      } catch (error) {
        console.error("Помилка при генерації тренування:", error);
        this.errorMessage = `Сталася помилка: ${error.message}. Будь ласка, перевірте консоль для додаткової інформації.`;
      } finally {
        this.isLoading = false;
      }
    },
    toggleWorkoutDetails(workoutId) {
      if (workoutId === "new") {
        this.showNewWorkout = !this.showNewWorkout;
      } else {
        const workout = this.savedWorkouts.find((w) => w.id === workoutId);
        if (workout) {
          workout.showDetails = !workout.showDetails;
        }
      }
    },
    async deleteWorkout(workoutId) {
      try {
        if (workoutId === "new") {
          this.workoutDescription = "";
          this.showNewWorkout = false;
        } else {
          await axios.delete(
            `https://93.170.78.64:5000/api/workouts/${workoutId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          this.savedWorkouts = this.savedWorkouts.filter(
            (workout) => workout.id !== workoutId
          );
        }
        this.errorMessage = "";
      } catch (error) {
        console.error("Помилка при видаленні тренування:", error);
        this.errorMessage = "Помилка при видаленні тренування";
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
  width: 100%;
  margin: auto;
  padding: 20px;
  background: var(--bg-color);
  border-radius: 15px;
  box-shadow: 0 4px 15px var(--shadow-color);
  animation: fadeIn 0.5s ease-out;
}

h2,
h3 {
  color: var(--text-color);
  font-weight: 700;
  animation: slideInLeft 0.5s ease-out;
}

.form-label {
  color: var(--text-color);
  font-weight: 600;
  transform: translateY(10px);
  animation: floatUp 0.5s ease-out forwards;
}

.form-select {
  background-color: var(--input-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.form-select:hover {
  transform: translateY(-2px);
}

.form-check {
  margin-bottom: 0.5rem;
  transition: transform 0.3s ease;
}

.form-check:hover {
  transform: translateX(5px);
}

.form-check-label {
  color: var(--text-color);
}

.btn-primary {
  background-color: var(--button-bg);
  border-color: var(--button-bg);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--button-hover);
  border-color: var(--button-hover);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 107, 139, 0.4);
}

.card {
  background: var(--card-bg);
  border: none;
  border-radius: 10px;
  margin-bottom: 15px;
  animation: fadeInUp 0.5s ease-out;
}

.card-header {
  background: var(--navbar-bg);
  color: white;
  transition: all 0.3s ease;
}

.card-body {
  color: var(--text-color);
  padding: 15px;
  border-radius: 0 0 10px 10px;
}

.card-body * {
  color: inherit;
}

.btn-link {
  color: white;
  transition: transform 0.3s ease;
}

.btn-link:hover {
  transform: translateX(5px);
}

.btn-danger {
  background-color: var(--error-color);
  border-color: var(--error-color);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  transform: scale(1.05);
}

.alert-danger {
  background-color: rgba(255, 133, 162, 0.2);
  color: var(--error-color);
  border-color: var(--error-color);
  border-radius: 8px;
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
