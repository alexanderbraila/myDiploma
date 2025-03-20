<template>
  <div class="home">
    <header class="hero">
      <div class="banner">
        <h1>Хочеш на заняття?</h1>
        <button @click="openModal" class="btn btn-custom">Записатися</button>
      </div>
    </header>

    <section class="about-us section-animation">
      <div class="section-content">
        <h2>Про нас</h2>
        <div class="about-content" ref="aboutContent">
          <img src="@/assets/images/f1.jpg" alt="Фітнес команда" class="section-parallax-image" />
          <div class="about-text-overlay">
            <p>Ми команда ентузіастів, які прагнуть зробити ваш шлях до здорового способу життя максимально зручним та ефективним. Наш планувальник тренувань допоможе вам створити персоналізовані програми, які відповідають вашим цілям і рівнем підготовки.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="benefits section-animation">
      <div class="section-content">
        <h2>Переваги</h2>
        <div class="benefits-grid">
          <div class="benefit-card" v-for="(benefit, index) in benefits" :key="index" :style="{ backgroundColor: getBenefitColor(index) }">
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials section-animation">
      <div class="section-content">
        <h2>Відгуки</h2>
        <div class="testimonials-content">
          <img src="@/assets/images/f3.png" alt="Користувач" class="testimonial-image" />
          <div class="testimonial-text">
            <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
              <p>{{ testimonial.text }}</p>
              <span class="author">- {{ testimonial.author }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="contact section-animation">
      <div class="section-content">
        <h2>Контакти</h2>
        <div class="contact-card">
          <p>Якщо у вас є запитання чи пропозиції, зв’яжіться з нами:</p>
          <p>Email: support@fitplanner.com</p>
          <p>Телефон: +123 456 789</p>
        </div>
      </div>
    </section>

    <footer class="footer">
      <p>© 2023 FitPlanner. Усі права захищено.</p>
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
    this.addScrollAnimation();
    this.setupParallax();
  },
  data() {
    return {
      isModalOpen: false,
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
    addScrollAnimation() {
      const sections = document.querySelectorAll('.section-animation');
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, 
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 300); 
            observer.unobserve(entry.target); 
          }
        });
      }, observerOptions);

      sections.forEach(section => observer.observe(section));
    },
    getBenefitColor(index) {
      const colors = ['rgba(255, 133, 162, 0.2)', 'rgba(93, 143, 201, 0.2)', 'rgba(255, 215, 0, 0.2)', 'rgba(144, 238, 144, 0.2)'];
      return colors[index % colors.length];
    },
    setupParallax() {
      const aboutContent = this.$refs.aboutContent;
      if (!aboutContent) return;

      const parallaxImage = aboutContent.querySelector('.section-parallax-image');
      const contentHeight = aboutContent.offsetHeight;
      const imageHeight = parallaxImage.naturalHeight * (parallaxImage.width / parallaxImage.naturalWidth); 

      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const sectionTop = aboutContent.getBoundingClientRect().top + scrollTop;
        const windowHeight = window.innerHeight;
        const sectionBottom = sectionTop + contentHeight;

        
        if (scrollTop >= sectionTop - windowHeight && scrollTop < sectionBottom) {
          const progress = (scrollTop - (sectionTop - windowHeight)) / (contentHeight + windowHeight);
          const maxTranslate = imageHeight - (contentHeight * 0.3333); 
          const translateY = -progress * maxTranslate;

          
          const minTranslate = -(imageHeight - (contentHeight * 0.3333));
          parallaxImage.style.transform = `translateY(${Math.max(minTranslate, Math.min(0, translateY))}px)`;
        }
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll(); 
    },
  },
};
</script>

<style scoped>
* {
  font-family: 'Inter', sans-serif;
}

.home {
  padding: 20px;
  background: var(--bg-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hero {
  background: url('@/assets/images/f2.jpg') no-repeat center center;
  background-size: cover;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px var(--shadow-color);
  animation: fadeIn 0.5s ease-out;
}

.banner {
  background: v-bind('currentTheme === "light" ? "linear-gradient(90deg, #ff85a2, #5d8fc9)" : "linear-gradient(90deg, #8b3a5e, #3a5e8b)"'); 
  padding: 20px 40px;
  border-radius: 10px;
  text-align: center;
  color: white; 
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
  box-shadow: 0 4px 10px var(--shadow-color);
  color: #ff85a2;
}

.section-content {
  background: var(--card-bg);
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px var(--shadow-color);
  position: relative;
}

h2 {
  color: var(--text-color);
  font-weight: 700;
  margin-bottom: 1rem;
  animation: slideInLeft 0.5s ease-out;
}

p, li {
  color: var(--text-color);
  font-weight: 400;
}

.about-content {
  position: relative;
  height: 300px; 
  overflow: hidden; 
}

.section-parallax-image {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  filter: brightness(0.7); 
  border-radius: 15px 15px 0 0;
}

.about-text-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  padding: 30px;
  border-radius: 0; 
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.about-text-overlay p {
  color: white;
  font-weight: 400;
  text-align: center;
}

.benefits-grid, .testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.benefit-card {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px var(--shadow-color);
}

.benefit-card h3 {
  color: var(--text-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.testimonials-content, .contact-content {
  display: flex;
  gap: 20px;
  align-items: center;
}

.testimonial-image {
  max-width: 150px;
  opacity: 0.7; 
  border-radius: 10px;
  box-shadow: 0 4px 15px var(--shadow-color);
  transition: transform 0.3s ease;
}

.testimonial-image:hover {
  transform: scale(1.05);
}

.testimonial-text, .contact-text {
  flex-grow: 1;
}

.testimonial-card, .contact-card {
  background: var(--card-bg);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.testimonial-card:hover, .contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px var(--shadow-color);
}

.testimonial-card p, .contact-card p {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.testimonial-card .author {
  color: var(--success-color);
  font-style: italic;
}

.contact-card p:nth-child(2),
.contact-card p:nth-child(3) {
  margin-top: 0.5rem;
  font-weight: 500;
}

.footer {
  background: v-bind('currentTheme === "light" ? "linear-gradient(90deg, #ff85a2, #5d8fc9, #4a5d8f)" : "linear-gradient(90deg, #8b3a5e, #3a5e8b)"'); /* Градієнт, який змінюється залежно від теми */
  color: white;
  padding: 20px;
  width: 100%;
  position: fixed; 
  bottom: 0;
  left: 0;
  z-index: 1000; 
}

.footer:hover {
  transform: translateY(-5px);
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
  background: var(--card-bg);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px var(--shadow-color);
  width: 90%;
  max-width: 500px;
  animation: fadeIn 0.3s ease-out;
}

.modal-content h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text-color);
}

.btn-primary, .btn-secondary {
  margin-right: 10px;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--button-bg);
  border-color: var(--button-bg);
  color: white;
}

.btn-primary:hover {
  background: var(--button-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px var(--shadow-color);
}

.btn-secondary {
  background: var(--card-bg);
  border-color: var(--border-color);
  color: var(--text-color);
}

.btn-secondary:hover {
  background: var(--input-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px var(--shadow-color);
}

.section-animation {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.section-animation.visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>