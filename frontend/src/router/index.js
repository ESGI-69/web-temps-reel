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

  ],
});

export default router;
