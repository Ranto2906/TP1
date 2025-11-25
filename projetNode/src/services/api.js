import axios from 'axios';

// En production (Docker), utilise le proxy Nginx
// En développement local, utilise le proxy Vite (défini dans vite.config.js)
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.status === 'success') {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.student));
      return response.data;
    }
    throw new Error(response.data.error?.message || 'Erreur de connexion');
  },

  loginAdmin: async (email, mot_de_passe) => {
    const response = await api.post('/auth/admin/login', { email, mot_de_passe });
    if (response.data.status === 'success') {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.student));
      localStorage.setItem('isAdmin', 'true');
      return response.data;
    }
    throw new Error(response.data.error?.message || 'Erreur de connexion');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    return localStorage.getItem('isAdmin') === 'true';
  }
};

// Services pour les vues de notes
export const notesService = {
  // Étudiant - Mes notes
  getMesNotes: async () => {
    const response = await api.get('/vue-notes/mes-notes');
    return response.data;
  },

  getMesNotesSemestre: async (idSemestre) => {
    const response = await api.get(`/vue-notes/mes-notes/semestre/${idSemestre}`);
    return response.data;
  },

  getMesNotesAnnee: async (annee) => {
    const response = await api.get(`/vue-notes/mes-notes/annee/${annee}`);
    return response.data;
  },

  getMesMoyennes: async () => {
    const response = await api.get('/vue-notes/mes-moyennes');
    return response.data;
  },

  getMaMoyenneSemestre: async (idSemestre) => {
    const response = await api.get(`/vue-notes/mes-moyennes/semestre/${idSemestre}`);
    return response.data;
  },

  // Admin - Toutes les notes
  getAllNotes: async () => {
    const response = await api.get('/vue-notes/admin/notes');
    return response.data;
  },

  getNotesEtudiant: async (idEtudiant) => {
    const response = await api.get(`/vue-notes/admin/notes/etudiant/${idEtudiant}`);
    return response.data;
  },

  getNotesSemestre: async (idSemestre) => {
    const response = await api.get(`/vue-notes/admin/notes/semestre/${idSemestre}`);
    return response.data;
  },

  getNotesAnnee: async (annee) => {
    const response = await api.get(`/vue-notes/admin/notes/annee/${annee}`);
    return response.data;
  },

  getAllMoyennes: async () => {
    const response = await api.get('/vue-notes/admin/moyennes');
    return response.data;
  },

  getMoyennesSemestre: async (idSemestre) => {
    const response = await api.get(`/vue-notes/admin/moyennes/semestre/${idSemestre}`);
    return response.data;
  },

  getMoyennesAnnee: async (annee) => {
    const response = await api.get(`/vue-notes/admin/moyennes/annee/${annee}`);
    return response.data;
  }
};

export default api;
