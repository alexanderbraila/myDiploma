<template>
  <div class="home">
    <section class="content-section" ref="banner">
      <div class="banner">
        <h1>Хочеш на заняття?</h1>
        <button @click="openModal" class="btn btn-custom">Записатися</button>
      </div>
    </section>

    <section class="content-section about-us" ref="about-us">
      <div class="section-content">
        <h2>Про нас</h2>
        <div class="about-content">
          <div class="about-text-overlay">
            <p>Ми команда ентузіастів, які прагнуть зробити ваш шлях до здорового способу життя максимально зручним та ефективним. Наш планувальник тренувань допоможе вам створити персоналізовані програми, які відповідають вашим цілям і рівнем підготовки.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="content-section benefits" ref="benefits">
      <div class="section-content">
        <h2>Переваги</h2>
        <div class="benefits-grid-wrapper">
          <div class="benefits-grid">
            <div class="benefit-card" v-for="(benefit, index) in benefits" :key="index" :style="{ backgroundColor: getBenefitColor(index) }">
              <h3>{{ benefit.title }}</h3>
              <p>{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content-section testimonials" ref="testimonials">
      <div class="section-content">
        <h2>Відгуки</h2>
        <div class="testimonials-content">
          <div class="testimonial-text">
            <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
              <p>{{ testimonial.text }}</p>
              <span class="author">- {{ testimonial.author }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content-section contact" ref="contact">
      <div class="section-content">
        <h2>Контакти</h2>
        <div class="contact-card">
          <p>Дипломна робота студента KI-21-2</p>
          <p>Браіла О.</p>
          <p>Пошта: brailaalex@icloud.com</p>
        </div>
      </div>
    </section>

    <footer class="footer">
      <p>© 2025 FitPlanner. Розробка інтерактивного веб-сайту з інтеграцією штучного інтелекту та розгортанням на Raspberry Pi</p>
    </footer>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>Запис на заняття</h3>
        <form @submit.prevent="submitBooking">
          <div class="form-group">
            <label for="name">Ім’я:</label>
            <input type="text" id="name" v-model="bookingForm.name" required />
          </div>
          <div class="form-group">
            <label for="phone">Телефон:</label>
            <input type="tel" id="phone" v-model="bookingForm.phone" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="bookingForm.email" required />
          </div>
          <div class="form-group">
            <label for="date">Бажана дата та час:</label>
            <input type="datetime-local" id="date" v-model="bookingForm.date" required />
          </div>
          <button type="submit" class="btn btn-primary">Відправити</button>
          <button type="button" @click="closeModal" class="btn btn-secondary">Закрити</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeView',
  mounted() {
    this.setupScroll();
  },
  data() {
    return {
      isModalOpen: false,
      currentSection: 0,
      touchStartY: null,
      bookingForm: {
        name: '',
        phone: '',
        email: '',
        date: '',
      },
      benefits: [
        { title: 'Персоналізовані тренування', description: 'Створюйте тренування під свої цілі та рівень.' },
        { title: 'Зручний інтерфейс', description: 'Просте та інтуїтивне використання.' },
        { title: 'Різні цілі', description: 'Підтримка схуднення, набору маси та витривалості.' },
        { title: 'Вибір інвентарю', description: 'Тренування з власною вагою, гантелями чи штангою.' },
      ],
      testimonials: [
        { text: 'За допомогою FitPlanner я досяг своїх цілей швидше, ніж очікував!', author: 'Іван І.' },
        { text: 'Чудовий сервіс для тих, хто хоче займатися вдома!', author: 'Марія К.' },
      ],
    };
  },
  computed: {
    currentTheme() {
      return this.$root.currentTheme || 'light';
    },
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.bookingForm = { name: '', phone: '', email: '', date: '' };
    },
    async submitBooking() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$root.$emit('showToast', { message: 'Будь ласка, увійдіть в систему для запису.', type: 'error' });
          this.$router.push('/login');
          return;
        }
        console.log('Sending request with token:', token);
        await axios.post('/api/bookings', {
          name: this.bookingForm.name,
          phone: this.bookingForm.phone,
          email: this.bookingForm.email,
          date: this.bookingForm.date,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.$root.$emit('showToast', { message: 'Запис успішно відправлено!', type: 'success' });
        this.closeModal();
      } catch (error) {
        console.error('Помилка при відправці запису:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 403) {
          this.$root.$emit('showToast', { message: 'Сесія закінчилася. Увійдіть знову.', type: 'error' });
          localStorage.removeItem('token');
          this.$router.push('/login');
        } else {
          this.$root.$emit('showToast', { message: 'Сталася помилка при відправці запису.', type: 'error' });
        }
      }
    },
    setupScroll() {
      const sectionHeight = window.innerHeight;
      const totalSections = 5;

      window.addEventListener('wheel', (event) => {
        event.preventDefault();
        const delta = event.deltaY > 0 ? 1 : -1;
        this.currentSection = Math.max(0, Math.min(totalSections - 1, this.currentSection + delta));
        window.scrollTo({
          top: this.currentSection * sectionHeight,
          behavior: 'smooth',
        });
        console.log(`Current section (wheel): ${this.currentSection}`);
      }, { passive: false });

      window.addEventListener('touchstart', (event) => {
        this.touchStartY = event.touches[0].clientY;
      }, { passive: true });

      window.addEventListener('touchmove', (event) => {
        if (this.touchStartY === null) return;
        const touchY = event.touches[0].clientY;
        const deltaY = this.touchStartY - touchY;
        if (Math.abs(deltaY) > 50) {
          const direction = deltaY > 0 ? 1 : -1;
          this.currentSection = Math.max(0, Math.min(totalSections - 1, this.currentSection + direction));
          window.scrollTo({
            top: this.currentSection * sectionHeight,
            behavior: 'smooth',
          });
          console.log(`Current section (touch): ${this.currentSection}`);
          this.touchStartY = null;
        }
      }, { passive: false });

      window.addEventListener('touchend', () => {
        this.touchStartY = null;
      }, { passive: true });
    },
    getBenefitColor(index) {
      const colors = [
        'rgba(255, 133, 162, 0.5)',
        'rgba(93, 143, 201, 0.5)',
        'rgba(255, 215, 0, 0.5)',
        'rgba(144, 238, 144, 0.5)',
      ];
      return colors[index % colors.length];
    },
  },
};
</script>

<style scoped>
* {
  font-family: 'Inter', sans-serif;
}

.home {
  padding: 0;
  height: 500vh;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

.content-section {
  height: 100vh;
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.5s ease-out;
}

/* Пастельные цвета для каждого блока */
.content-section:nth-child(1) {
  top: 0;
  background-color: #f8e1e9; /* Светлый розовый */
}

.content-section:nth-child(2) {
  top: 100vh;
  background-color: #e9d8f4; /* Лавандовый */
}

.content-section:nth-child(3) {
  top: 200vh;
  background-color: #d9c2e9; /* Пастельный фиолетовый */
}

.content-section:nth-child(4) {
  top: 300vh;
  background-color: #f4c7d9; /* Розово-персиковый */
}

.content-section:nth-child(5) {
  top: 400vh;
  background-color: #e6d1f2; /* Лёгкий сиреневый */
}

.section-content {
  background: rgba(0, 0, 0, 0.8);
  padding: 30px;
  border-radius: 15px;
  margin: 0 auto;
  max-width: 1200px;
  width: 90%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  color: #ffffff;
  overflow: hidden;
}

.banner {
  background: v-bind('currentTheme === "light" ? "linear-gradient(90deg, #ff85a2, #5d8fc9)" : "linear-gradient(90deg, #8b3a5e, #3a5e8b)"');
  padding: 20px 40px;
  border-radius: 10px;
  text-align: center;
  color: white;
  max-width: 600px;
  width: 90%;
}

.banner h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: white;
}

.btn-custom {
  background-color: white;
  border-color: white;
  border-radius: 8px;
  padding: 12px 24px;
  color: #ff85a2;
  font-weight: 600;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.btn-custom:hover {
  background-color: #e6e6e6;
  border-color: #e6e6e6;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  color: #ff85a2;
}

h2 {
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 1rem;
}

p, li {
  color: #ffffff;
  font-weight: 400;
}

.about-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-text-overlay {
  padding: 30px;
  text-align: center;
  max-width: 600px;
}

.benefits-grid-wrapper {
  width: 100%;
  overflow: hidden;
}

.benefits-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  margin-top: 20px;
  width: max-content;
  animation: scrollBenefits 15s linear infinite;
}

@keyframes scrollBenefits {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.benefit-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  min-width: 250px;
  flex-shrink: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.benefit-card h3 {
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.testimonials-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.testimonial-text {
  flex-grow: 1;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.testimonial-card p {
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.testimonial-card .author {
  color: #00cc00;
  font-style: italic;
}

.contact-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

.contact-card p {
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.contact-card p:nth-child(2),
.contact-card p:nth-child(3) {
  margin-top: 0.5rem;
  font-weight: 500;
}

.footer {
  background: v-bind('currentTheme === "light" ? "linear-gradient(90deg, #ff85a2, #5d8fc9, #4a5d8f)" : "linear-gradient(90deg, #8b3a5e, #3a5e8b)"');
  color: white;
  padding: 20px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-content {
  background: rgba(0, 0, 0, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  animation: popIn 0.4s ease-out;
  color: #ffffff;
}

@keyframes popIn {
  0% { transform: scale(0.7); opacity: 0; }
  70% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
}

.modal-content h3 {
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ffffff;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.btn-primary,
.btn-secondary {
  margin-right: 10px;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #ff85a2;
  border-color: #ff85a2;
  color: white;
}

.btn-primary:hover {
  background: #e67592;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border-color: #ffffff;
  color: #ffffff;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>