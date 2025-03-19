<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 col-12">
        <h2 class="mb-4">Калькулятор БЖВ</h2>
        <form @submit.prevent="calculateMacros" class="needs-validation" novalidate>
          <div class="mb-3">
            <label for="gender" class="form-label">Стать:</label>
            <select id="gender" v-model="gender" class="form-select" required>
              <option value="male">Чоловіча</option>
              <option value="female">Жіноча</option>
            </select>
            <div class="invalid-feedback">Будь ласка, виберіть стать.</div>
          </div>
          <div class="mb-3">
            <label for="activityLevel" class="form-label">Рівень фізичної підготовки:</label>
            <select id="activityLevel" v-model="activityLevel" class="form-select" required>
              <option value="sedentary">Мізерна активність (основний обмін)</option>
              <option value="lightly_active">Мінімальна активність</option>
              <option value="moderately_active">3 рази на тиждень</option>
              <option value="very_active">5 разів на тиждень</option>
              <option value="extra_active">Щодня</option>
            </select>
            <div class="invalid-feedback">Будь ласка, виберіть рівень активності.</div>
          </div>
          <div class="mb-3">
            <label for="age" class="form-label">Вік:</label>
            <input type="number" id="age" v-model="age" class="form-control" required />
            <div class="invalid-feedback">Будь ласка, вкажіть вік.</div>
          </div>
          <div class="mb-3">
            <label for="weight" class="form-label">Вага (кг):</label>
            <input type="number" id="weight" v-model="weight" class="form-control" required />
            <div class="invalid-feedback">Будь ласка, вкажіть вагу.</div>
          </div>
          <div class="mb-3">
            <label for="height" class="form-label">Зріст (см):</label>
            <input type="number" id="height" v-model="height" class="form-control" required />
            <div class="invalid-feedback">Будь ласка, вкажіть зріст.</div>
          </div>
          <div class="mb-3">
            <label for="goal" class="form-label">Мета:</label>
            <select id="goal" v-model="goal" class="form-select" required>
              <option value="maintain">Підтримка форми</option>
              <option value="gain">Набір маси</option>
              <option value="lose">Схуднення</option>
            </select>
            <div class="invalid-feedback">Будь ласка, виберіть мету.</div>
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span v-else>Розрахувати БЖВ</span>
          </button>
        </form>
      </div>
      <div class="col-md-6 col-12">
        <h3 class="mb-4">Мої розрахунки БЖВ</h3>
        <div v-if="isLoading">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Завантаження...</span>
          </div>
        </div>
        <div v-if="showNewMacro">
          <div class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
              <button class="btn btn-link" type="button" @click="toggleMacroDetails('new')">
                {{ showNewMacro ? 'Приховати' : 'Показати' }} новий розрахунок
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteMacro('new')">Видалити</button>
            </div>
            <div class="card-body" v-if="showNewMacro" v-html="macroDescription"></div>
          </div>
        </div>
        <div v-if="savedMacros.length > 0">
          <div v-for="macro in savedMacros" :key="macro.id" class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
              <button class="btn btn-link" type="button" @click="toggleMacroDetails(macro.id)">
                {{ macro.showDetails ? 'Приховати' : 'Показати' }} розрахунок
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteMacro(macro.id)">Видалити</button>
            </div>
            <div class="card-body" v-if="macro.showDetails" v-html="macro.macro_data"></div>
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
import axios from 'axios';
import Groq from 'groq-sdk';

export default {
  data() {
    return {
      gender: '',
      activityLevel: '',
      age: null,
      weight: null,
      height: null,
      goal: '',
      macroDescription: '',
      savedMacros: [],
      errorMessage: '',
      isLoading: false,
      showNewMacro: false,
    };
  },
  created() {
    this.fetchProfile();
    this.fetchMacros();
  },
  methods: {
    async fetchProfile() {
  const token = localStorage.getItem('token');
  console.log('Fetching profile with token:', token); 
  if (!token) {
    this.errorMessage = 'Токен відсутній. Увійдіть у систему.';
    this.$router.push('/login');
    return;
  }
  try {
    const response = await axios.get('http://localhost:5000/profile', {
      headers: { Authorization: `Bearer ${token}` }, 
    });
    const { gender, activity_level, age, weight, height, goal } = response.data; 
    this.gender = gender || this.gender;
    this.activityLevel = activity_level || this.activityLevel;
    this.age = age || this.age;
    this.weight = weight || this.weight;
    this.height = height || this.height;
    this.goal = goal || this.goal;
  } catch (error) {
    console.error('Ошибка в fetchProfile:', error.response?.data || error.message);
    this.errorMessage = error.response?.data || 'Помилка при отриманні даних профілю';
    if (error.response?.status === 401 || error.response?.status === 403) {
      this.$router.push('/login');
    }
  }
},
    async fetchMacros() {
  const token = localStorage.getItem('token');
  console.log('Fetching macros with token:', token); 
  if (!token) {
    this.errorMessage = 'Токен відсутній. Увійдіть у систему.';
    this.$router.push('/login');
    return;
  }
  try {
    const response = await axios.get('http://localhost:5000/macros', {
      headers: { Authorization: `Bearer ${token}` }, 
    });
    this.savedMacros = response.data.map(macro => ({
      ...macro,
      showDetails: false,
    }));
    this.errorMessage = ''; 
  } catch (error) {
    console.error('Ошибка в fetchMacros:', error.response?.data || error.message);
    this.errorMessage = error.response?.data || 'Помилка при отриманні збережених розрахунків БЖВ';
    if (error.response?.status === 401 || error.response?.status === 403) {
      this.$router.push('/login'); 
    }
  }
},
    async calculateMacros() {
      this.isLoading = true;
      this.macroDescription = '';
      this.showNewMacro = false;

      const groq = new Groq({
        apiKey: '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',
        dangerouslyAllowBrowser: true,
      });

      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: `Розрахуй БЖВ для користувача зі статтю ${this.gender}, рівнем активності ${this.activityLevel}, віком ${this.age}, вагою ${this.weight} кг, зростом ${this.height} см і метою ${this.goal}. Відформатуй відповідь у HTML з тегами для заголовків, списків і виділення тексту, щоб її можна було відобразити на веб-сторінці.`,
            },
          ],
          model: 'llama-3.3-70b-versatile',
        });

        this.macroDescription = completion.choices[0]?.message?.content || 'Не вдалося розрахувати БЖВ.';
        this.errorMessage = '';
        this.showNewMacro = true;

        await axios.post(
  'http://localhost:5000/macros',
  { macro_data: this.macroDescription },
  { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } } 
);

        this.fetchMacros();
      } catch (error) {
        console.error('Помилка при розрахунку БЖВ:', error);
        this.errorMessage = `Сталася помилка: ${error.message}. Будь ласка, перевірте консоль для додаткової інформації.`;
      } finally {
        this.isLoading = false;
      }
    },
    toggleMacroDetails(macroId) {
      if (macroId === 'new') {
        this.showNewMacro = !this.showNewMacro;
      } else {
        const macro = this.savedMacros.find(m => m.id === macroId);
        if (macro) {
          macro.showDetails = !macro.showDetails;
        }
      }
    },
    async deleteMacro(macroId) {
  try {
    if (macroId === 'new') {
      this.macroDescription = '';
      this.showNewMacro = false;
    } else {
      await axios.delete(`http://localhost:5000/macros/${macroId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      this.savedMacros = this.savedMacros.filter(macro => macro.id !== macroId);
    }
    this.errorMessage = ''; 
  } catch (error) {
    console.error('Помилка при видаленні розрахунку БЖВ:', error);
    this.errorMessage = 'Помилка при видаленні розрахунку БЖВ';
  }
},
  },
};
</script>

<style scoped>
* {
  font-family: 'Inter', sans-serif;
}

.container {
  width: 100%;
  margin: 0;
  padding: 20px;
  background: var(--bg-color);
  border-radius: 15px;
  box-shadow: 0 4px 15px var(--shadow-color);
  animation: fadeIn 0.5s ease-out;
}

h2, h3 {
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

.form-control, .form-select {
  background-color: var(--input-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.form-control:hover, .form-select:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px var(--shadow-color);
}

.form-control:focus, .form-select:focus {
  border-color: var(--button-bg);
  box-shadow: 0 0 8px rgba(255, 133, 162, 0.3);
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
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes floatUp {
  to { transform: translateY(0); }
}

@keyframes fadeInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>