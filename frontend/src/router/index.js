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
  ],
});

router.beforeEach((to, _from, next) => {
  if (to.name !== 'login' && !Cookies.get(import.meta.env.VITE_COOKIE_TOKEN_NAME)) {
    next({ name: 'login' });
  } else if (to.name === 'login' && Cookies.get(import.meta.env.VITE_COOKIE_TOKEN_NAME)) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
