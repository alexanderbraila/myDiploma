<template>
  <div class="router-view-create-workout">
    <WorkoutForm @workout-generated="displayWorkout" />
    <div v-if="workoutDescription" class="workout-description">
      <h3>Ваше тренування:</h3>
      <p>{{ workoutDescription }}</p>
    </div>
  </div>
</template>

<script>
import WorkoutForm from '@/components/WorkoutForm.vue';
import axios from 'axios';

export default {
  name: 'CreateWorkoutView',
  components: {
    WorkoutForm,
  },
  data() {
    return {
      workoutDescription: '',
    };
  },
  methods: {
    async displayWorkout(workoutData) {
      try {
        const apiKey = 'AIzaSyDjjE21tW-6VeRQeHH0yTsLi4s7xm9v2vo';
        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateMessage';

        const response = await axios.post(
          apiUrl,
          {
            contents: [
              {
                role: 'user',
                parts: {
                  text: `Створи тренування для користувача з рівнем ${workoutData.level}, статтю ${workoutData.gender}, метою ${workoutData.goal} та інвентарем ${workoutData.equipment.join(', ')}.`,
                },
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
          }
        );

        this.workoutDescription = response.data.candidates[0].content.parts[0].text;
      } catch (error) {
        console.error('Помилка при генерації тренування:', error);
        this.workoutDescription = 'Сталася помилка при генерації тренування. Будь ласка, спробуйте пізніше.';
      }
    },
  },
};
</script>

<style scoped>
* {
  font-family: 'Inter', sans-serif;
}

.router-view-create-workout {
  margin: 20px; 
  background: var(--bg-color);
}

.create-workout {
  margin: 0;
  padding: 20px;
  background: var(--bg-color);
  border-radius: 15px;
  box-shadow: 0 4px 15px var(--shadow-color);
  animation: fadeIn 0.5s ease-out;
  width: 100%;
}

.workout-description {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  animation: fadeInUp 0.5s ease-out;
}

h3 {
  color: var(--text-color);
  font-weight: 700;
  animation: slideInLeft 0.5s ease-out;
}

p {
  color: var(--text-color);
  animation: fadeInUp 0.5s ease-out 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>