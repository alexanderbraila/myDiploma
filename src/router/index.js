import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CreateWorkoutView from "@/views/CreateWorkoutView.vue";
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";
import MacroCalculatorView from "@/views/MacroCalculatorView.vue";
import ProfileView from "@/views/ProfileView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/create-workout",
    name: "create-workout",
    component: CreateWorkoutView,
    meta: { requiresAuth: true },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/macro-calculator",
    name: "macro-calculator",
    component: MacroCalculatorView,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: "/gym-finder",
    name: "GymFinder",
    component: () => import("../views/GymFinder.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  console.log("Перехід на:", to.path, "Аутентифікований:", isAuthenticated);

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log("Потрібна аутентифікація, перенаправлення на /login");
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    console.log("Вже аутентифікований, перенаправлення на /profile");
    next("/profile");
  } else {
    next();
  }
});

export default router;
