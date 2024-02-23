import Cookies from 'js-cookie';
import { createRouter, createWebHistory } from 'vue-router';

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
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/Admin/AdminView.vue'),
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
        {
          path: 'questions',
          name: 'admin-questions',
          component: () => import('@/views/Admin/AdminQuestionsView.vue'),
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
