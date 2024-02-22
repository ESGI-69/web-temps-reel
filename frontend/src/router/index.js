import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RoomCreator from '../views/RoomCreator.vue';
import RoomView from '@/views/RoomView.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/room',
      name: 'room',
      component: RoomCreator,
    },
    {
      path: '/room/:id',
      name: 'roomid',
      component: RoomView,
    },

  ],
});

export default router;
