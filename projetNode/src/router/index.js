import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '@/services/api';

// Import des views
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import ListeSemestres from '@/views/ListeSemestres.vue';
import ListeEtudiants from '@/views/ListeEtudiants.vue';
import FicheEtudiant from '@/views/FicheEtudiant.vue';
import ReleveNotes from '@/views/ReleveNotes.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/semestres',
    name: 'ListeSemestres',
    component: ListeSemestres,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/semestres/:idSemestre/etudiants',
    name: 'ListeEtudiants',
    component: ListeEtudiants,
    props: true,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/etudiants/:idEtudiant',
    name: 'FicheEtudiant',
    component: FicheEtudiant,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/etudiants/:idEtudiant/releve/:niveau',
    name: 'ReleveNotes',
    component: ReleveNotes,
    props: true,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/');
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/');
  } else {
    next();
  }
});

export default router;
