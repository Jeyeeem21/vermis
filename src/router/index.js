import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import Scheduling from '../views/Scheduling.vue';
import { auth } from '@/firebase';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // Protect this route
  },  {
    path: '/overview',
    name: 'overview',
    redirect: '/dashboard' // Redirect overview to dashboard
  },
  {
    path: '/scheduling',
    name: 'scheduling',
    component: Scheduling,
    meta: { requiresAuth: true } // Protect this route
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },  {
    path: '/logout',
    name: 'logout',
    beforeEnter: async (to, from, next) => {
      try {
        await auth.signOut();
        next('/');
      } catch (error) {
        console.error('Logout failed:', error);
        next('/');
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth) {
    // Wait for auth state to be restored
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
    
    const user = auth.currentUser;
    if (!user) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;