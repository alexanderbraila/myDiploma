<template>
  <div class="home">
    <!-- Первая секция с параллакс эффектом -->
    <section class="parallax">
      <div class="parallax__header">
        <div class="parallax__visuals">
          <div class="parallax__black-line-overflow"></div>
          <div data-parallax-layers class="parallax__layers">
            <img src="@/assets/images/fitplanner_bg.jpg" 
                 data-parallax-layer="1" 
                 alt="FitPlanner Background" 
                 class="parallax__layer-img">
            <img src="@/assets/images/fitplanner_bg.jpg" 
                 data-parallax-layer="2" 
                 alt="FitPlanner Background" 
                 class="parallax__layer-img">
            <div data-parallax-layer="3" class="parallax__layer-title">
              <h1 class="parallax__title">Хочеш на заняття?</h1>
              <p class="parallax__subtitle">Стань частиною нашого ком’юніті та досягай своїх цілей разом із нами!</p>
              <button @click="openModal" class="btn-custom">Записатися</button>
            </div>
          </div>
          <div class="parallax__fade"></div>
        </div>
      </div>
    </section>

    <!-- Вторая секция "Про нас" -->
    <section class="content-section about-us fluid">
      <div class="about-us-background"></div>
      <div class="about-us-image"></div>
      <h2 class="about-title"><span aria-hidden="true">Про </span>нас</h2>
      <div class="about-content">
        <p>Ми команда ентузіастів, які прагнуть зробити ваш шлях до здорового способу життя максимально зручним та ефективним. Наш планувальник тренувань допоможе вам створити персоналізовані програми, які відповідають вашим цілям і рівнем підготовки.</p>
      </div>
    </section>

    <!-- Третья секция "Переваги" -->
    <section class="content-section benefits fluid">
      <div class="benefits-wrapper">
        <h1 class="benefits-header">Наші переваги</h1>
        <div class="benefits-content">
          <h2 class="benefits-title">У нас</h2>
          <ul class="benefits-list" :style="{'--count': benefits.length}">
            <li v-for="(benefit, index) in benefits" 
                :key="index" 
                :style="{'--i': index}">
              {{ benefit.title }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Секция "Відгуки" -->
    <section class="content-section testimonials">
      <div class="section-content">
        <h2>Відгуки</h2>
        <div class="testimonials-carousel">
          <div class="carousel-wrapper" ref="carousel">
            <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
              <div class="testimonial-avatar"></div>
              <p>{{ testimonial.text }}</p>
              <span class="author">- {{ testimonial.author }}</span>
              <div class="rating">
                <span v-for="star in 5" :key="star" :class="{ 'filled': star <= testimonial.rating }">★</span>
              </div>
            </div>
          клуб
            </div>
          <button class="carousel-prev" @click="scrollCarousel(-1)">❮</button>
          <button class="carousel-next" @click="scrollCarousel(1)">❯</button>
        </div>
      </div>
    </section>

    <!-- Секция "Контакти" -->
    <section class="content-section contact">
      <div class="section-content">
        <h2>Контакти</h2>
        <div class="contact-card">
          <div class="contact-icon"></div>
          <p class="contact-title">Дипломна робота студента KI-21-2</p>
          <p class="contact-name">Браіла О.</p>
          <p class="contact-email">Пошта: <a href="mailto:brailaalex@icloud.com">brailaalex@icloud.com</a></p>
        </div>
      </div>
    </section>

    <!-- Футер -->
    <footer class="footer">
      <p>© 2025 FitPlanner. Розробка інтерактивного веб-сайту з інтеграцією штучного інтелекту та розгортанням на Raspberry Pi</p>
    </footer>

    <!-- Модальное окно -->
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
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'HomeView',
  data() {
    return {
      isModalOpen: false,
      bookingForm: {
        name: '',
        phone: '',
        email: '',
        date: '',
      },
      selectedBenefit: null,
      icons: [
        'icon-reorder',
        'icon-th-large',
        'icon-bar-chart',
        'icon-tasks',
        'icon-bell',
        'icon-archive',
        'icon-comment',
        'icon-sitemap'
      ],
      benefits: [
        { title: 'Персоналізовані тренування', description: 'Створюйте тренування під свої цілі та рівень.' },
        { title: 'Зручний інтерфейс', description: 'Просте та інтуїтивне використання.' },
        { title: 'Різні цілі', description: 'Підтримка схуднення, набору маси та витривалості.' },
        { title: 'Вибір інвентарю', description: 'Тренування з власною вагою, гантелями чи штангою.' },
        { title: 'Відстеження прогресу', description: 'Стежте за своїми досягненнями та покращуйте результати.' },
        { title: 'Поради від тренерів', description: 'Отримуйте рекомендації від професіоналів.' },
        { title: 'Гнучкий графік', description: 'Тренуйтеся у зручний для вас час.' },
        { title: 'Мотивація', description: 'Отримуйте нагадування та мотиваційні повідомлення.' },
      ],
      testimonials: [
        { text: 'За допомогою FitPlanner я досяг своїх цілей швидше, ніж очікував!', author: 'Іван І.', rating: 5 },
        { text: 'Чудовий сервіс для тих, хто хоче займатися вдома!', author: 'Марія К.', rating: 4 },
        { text: 'Простий і зручний додаток, рекомендую всім!', author: 'Олег П.', rating: 5 },
        { text: 'Тренування стали частиною мого життя завдяки FitPlanner!', author: 'Анна С.', rating: 4 },
        { text: 'Дуже зручно планувати заняття, все інтуїтивно зрозуміло.', author: 'Дмитро В.', rating: 5 },
        { text: 'Мотивуючі поради від тренерів — це те, що мені потрібно!', author: 'Юлія М.', rating: 4 },
        { text: 'FitPlanner допоміг мені схуднути без стресу.', author: 'Олена Т.', rating: 5 },
      ],
    };
  },
  computed: {
    currentTheme() {
      return this.$root.currentTheme || 'light';
    },
  },
  mounted() {
    // Parallax effect для первой секции
    document.querySelectorAll('[data-parallax-layers]').forEach((triggerElement) => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });
      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 }
      ];
      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    });

    // Эффект для третьей секции (Benefits)
    const benefitsItems = gsap.utils.toArray('.benefits-list li');
    gsap.set(benefitsItems, { opacity: 0.2 });

    benefitsItems.forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to(benefitsItems, { opacity: 0.2, duration: 0.3 });
          gsap.to(item, { opacity: 1, duration: 0.3 });
        },
        onLeave: () => {
          gsap.to(item, { opacity: 0.2, duration: 0.3 });
        },
        onEnterBack: () => {
          gsap.to(benefitsItems, { opacity: 0.2, duration: 0.3 });
          gsap.to(item, { opacity: 1, duration: 0.3 });
        },
        onLeaveBack: () => {
          gsap.to(item, { opacity: 0.2, duration: 0.3 });
        },
      });
    });
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
        await axios.post('http://93.170.78.64:5000/api/bookings', {
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
    selectBenefit(index) {
      this.selectedBenefit = index;
    },
    scrollCarousel(direction) {
      const carousel = this.$refs.carousel;
      const scrollAmount = carousel.offsetWidth * 0.8;
      carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    },
  },
};
</script>

<style scoped>
* {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.parallax {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.parallax__header {
  z-index: 2;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #1a1a1a;
}

.parallax__visuals {
  object-fit: cover;
  width: 100%;
  height: 120%;
  position: absolute;
  top: 0;
  left: 0;
}

.parallax__layers {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.parallax__layer-img {
  object-fit: cover;
  width: 100%;
  height: 117.5%;
  position: absolute;
  top: -17.5%;
  left: 0;
}

.parallax__layer-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

.parallax__title {
  font-size: 11vw;
  font-weight: 800;
  color: white;
  text-align: center;
  margin: 0 0 0.5rem 0;
  line-height: 1;
}

.parallax__subtitle {
  font-size: 1.2rem;
  color: white;
  text-align: center;
  max-width: 600px;
  margin: 0 0 2rem 0;
}

@media (max-width: 768px){
  .parallax__subtitle{
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
.parallax__fade {
  z-index: 30;
  width: 100%;
  height: 20%;
  position: absolute;
  bottom: 0;
  left: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.738) 19%, 
    rgba(0, 0, 0, 0.541) 34%, rgba(0, 0, 0, 0.382) 47%, rgba(0, 0, 0, 0.278) 56.5%, 
    rgba(0, 0, 0, 0.194) 65%, rgba(0, 0, 0, 0.126) 73%, rgba(0, 0, 0, 0.075) 80.2%, 
    rgba(0, 0, 0, 0.042) 86.1%, rgba(0, 0, 0, 0.021) 91%, rgba(0, 0, 0, 0.008) 95.2%, 
    rgba(0, 0, 0, 0.002) 98.2%, transparent 100%);
}

.parallax__black-line-overflow {
  z-index: 20;
  background-color: #000;
  width: 100%;
  height: 2px;
  position: absolute;
  bottom: -1px;
  left: 0;
}

.btn-custom {
  background-color: transparent;
  border: 2px solid #ff4d6d;
  border-radius: 25px;
  padding: 12px 40px;
  color: #ff4d6d;
  font-weight: 700;
  font-size: 1.3rem;
  transition: all 0.3s ease;
}

.btn-custom:hover {
  background-color: #ff4d6d;
  color: white;
}

.about-us {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 5rem;
  overflow: hidden;
}

.about-us-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0a1a2a;
  clip-path: polygon(0 0, 100% 0, 0 100%);
  z-index: 1;
}

.about-us-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/images/section2.jpg') no-repeat center/cover;
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
  z-index: 2;
}

.about-title {
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
  position: relative;
  z-index: 3;
}

.about-content {
  position: relative;
  z-index: 3;
}

@media (max-width: 768px) {
  .about-us{
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.about-content p {
  color: white;
  font-size: 1.2rem;
  max-width: 600px;
}

.benefits {
  min-height: 200vh;
  padding-left: 5rem;
  background: linear-gradient(45deg, #2a3b8f, #8b3a8f, #ff85a2);
}

.benefits-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.benefits-header {
  padding-top: 15px;
  font-size: 6rem;
  font-weight: 700;
  color: white;
  margin-bottom: 2rem;
}

.benefits-content {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.benefits-title {
  position: sticky;
  top: calc(50% - 0.5lh);
  font-weight: 600;
  color: white;
  margin: 3rem 0;
  font-size: 6rem;
  display: inline-block;
  height: fit-content;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 600;
  color: white;
  flex-grow: 1;
}

.benefits-list li {
  margin: 2rem 0;
  font-size: 6rem;
  --start: 0;
  --end: 360;
  --lightness: 75%;
  --base-chroma: 0.3;
  --step: calc((var(--end) - var(--start)) / (var(--count) - 1));
  color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * var(--i))));
}

@media (max-width: 768px) {
  .benefits {
    padding-left: 0.5rem; 
    min-height: auto; 
  }

  .benefits-header {
    font-size: 3rem;
    padding-left: 1rem;
  }

  .benefits-title {
    font-size: 2rem; 
    margin: 1.5rem 0;
    white-space: nowrap;
  }

  .benefits-list li {
    font-size: 2rem; 
    margin: 1rem 0;
    padding-left: 0.5rem;
  }
}

.testimonials {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2b2b2b;
}

.section-content {
  padding: 30px;
  width: 100%;
  color: #d3d3d3;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-content h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 700;
  color: #ffffff;
}

.testimonials-carousel {
  position: relative;
  width: 100%;
  max-width: 1000px;
  padding: 0 60px;
  overflow: hidden;
}

.carousel-wrapper {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 20px;
  padding: 20px 0;
  width: 100%;
  scrollbar-width: none;
}

.carousel-wrapper::-webkit-scrollbar {
  display: none;
}

.testimonial-card {
  flex: 0 0 300px;
  background: #3a3a3a;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  scroll-snap-align: center;
  transition: transform 0.3s ease;
  border: 1px solid #4a4a4a;
}

@media (max-width: 768px){
  .testimonial-card{
    flex: 0 0 250px;
  }
}

.testimonial-card:hover {
  transform: scale(1.05);
}

.testimonial-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #555555;
  margin: 0 auto 15px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.testimonial-avatar::before {
  content: '';
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #d3d3d3 10%, transparent 10%), 
              radial-gradient(circle at 50% 70%, #d3d3d3 20%, transparent 20%);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.testimonial-card p {
  color: #d3d3d3;
  font-size: 1.1rem;
  margin-bottom: 10px;
  text-align: center;
}

.testimonial-card .author {
  color: #00cc00;
  font-style: italic;
  font-size: 1rem;
  display: block;
  text-align: center;
}

.rating {
  margin-top: 10px;
  text-align: center;
}

.rating span {
  font-size: 1.2rem;
  color: #666666;
}

.rating .filled {
  color: #ffd700;
}

.carousel-prev,
.carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  color: #d3d3d3;
  cursor: pointer;
  transition: background 0.3s ease;
  z-index: 10;
}

.carousel-prev {
  left: 10px;
}

.carousel-next {
  right: 10px;
}

.carousel-prev:hover,
.carousel-next:hover {
  background: rgba(255, 255, 255, 0.2);
}

.contact {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1f1f1f;
}

.contact .section-content {
  padding: 30px;
  width: 100%;
  color: #d3d3d3;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contact .section-content h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 700;
  color: #ffffff;
}

.contact-card {
  background: #2a2a2a;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  text-align: center;
  max-width: 400px;
  width: 100%;
  border: 1px solid #3a3a3a;
  position: relative;
}

.contact-icon {
  width: 50px;
  height: 50px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23d3d3d3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>') no-repeat center;
  margin: 0 auto 20px;
}

.contact-title {
  color: #d3d3d3;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.contact-name {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.contact-email {
  color: #d3d3d3;
  font-size: 1.1rem;
}

.contact-email a {
  color: #00cc00;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-email a:hover {
  color: #00ff00;
}

.footer {
  background: v-bind('currentTheme === "light" ? "linear-gradient(90deg, #ff85a2, #5d8fc9, #4a5d8f)" : "linear-gradient(90deg, #8b3a5e, #3a5e8b)"');
  color: white;
  padding: 20px;
  width: 100%;
  text-align: center;
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
  color: #ffffff;
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
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border-color: #ffffff;
  color: #ffffff;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>