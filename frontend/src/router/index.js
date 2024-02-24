import Cookies from 'js-cookie';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/room',
      name: 'room',
      component: () => import('@/views/RoomCreator.vue'),
    },
    {
      path: '/room/:id',
      name: 'roomid',
      component: () => import('@/views/RoomView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    //todo check if the user is admin
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/Admin/AdminView.vue'),
      meta: { requiresAdmin: true },
      children: [
        {
          path: 'quizzes',
          name: 'admin-quizzes',
          component: () => import('@/views/Admin/AdminQuizzesView.vue'),
        },
        {
          path: 'quizzes/:id',
          name: 'admin-quizz',
          component: () => import('@/views/Admin/AdminQuizzView.vue'),
        },
      ],
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const token = Cookies.get(import.meta.env.VITE_COOKIE_TOKEN_NAME);

  if (token) {
    if (to.name === 'login' || to.name === 'register') {
      next({ name: 'home' });
    } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if (!useAuthStore().isAdmin) {
        next({ name: 'home' });
        console.warn('You tried to access an admin route without being an admin, redirecting to home');
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    if (to.name === 'register' || to.name === 'login') {
      next();
    } else {
      next({ name: 'login' });
    }
  }
});

export default router;
