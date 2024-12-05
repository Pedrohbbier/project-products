import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import AccountSettings from '../views/AccountSettings.vue';

const isAuthenticated = () => !!localStorage.getItem('token');

const routes = [
  {
    path: '/',
    name: 'DashboardPage',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
  },
  {
    path: '/account', name: 'AccountSettings', component: AccountSettings,
  }
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login');
  } else if (to.name === 'LoginPage' && isAuthenticated()) {
    next('/'); 
  } else {
    next();
  }
});

export default router;
