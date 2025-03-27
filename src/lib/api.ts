import axios from 'axios';

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
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
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      if (error.response.status === 401) {
        // Token expiré ou invalide
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      return Promise.reject({ message: 'Erreur de connexion au serveur' });
    } else {
      // Erreur lors de la configuration de la requête
      return Promise.reject({ message: 'Erreur lors de la requête' });
    }
  }
);

// Endpoints d'authentification
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: any) => api.post('/auth/register', userData),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),
};

// Endpoints des membres
export const membersApi = {
  getAll: () => api.get('/members'),
  getById: (id: number) => api.get(`/members/${id}`),
  create: (data: any) => api.post('/members', data),
  update: (id: number, data: any) => api.put(`/members/${id}`, data),
  delete: (id: number) => api.delete(`/members/${id}`),
};

// Endpoints des commissions
export const commissionsApi = {
  getAll: () => api.get('/commissions'),
  getById: (id: number) => api.get(`/commissions/${id}`),
  create: (data: any) => api.post('/commissions', data),
  update: (id: number, data: any) => api.put(`/commissions/${id}`, data),
  delete: (id: number) => api.delete(`/commissions/${id}`),
  addMember: (id: number, memberId: number, role: string) =>
    api.post(`/commissions/${id}/members`, { memberId, role }),
  removeMember: (id: number, memberId: number) =>
    api.delete(`/commissions/${id}/members/${memberId}`),
};

// Endpoints des réunions
export const meetingsApi = {
  getAll: () => api.get('/meetings'),
  getById: (id: number) => api.get(`/meetings/${id}`),
  create: (data: any) => api.post('/meetings', data),
  update: (id: number, data: any) => api.put(`/meetings/${id}`, data),
  delete: (id: number) => api.delete(`/meetings/${id}`),
  addAttendee: (id: number, memberId: number) =>
    api.post(`/meetings/${id}/attendees`, { memberId }),
  removeAttendee: (id: number, memberId: number) =>
    api.delete(`/meetings/${id}/attendees/${memberId}`),
};

// Endpoints des formations
export const trainingsApi = {
  getAll: () => api.get('/trainings'),
  getById: (id: number) => api.get(`/trainings/${id}`),
  create: (data: any) => api.post('/trainings', data),
  update: (id: number, data: any) => api.put(`/trainings/${id}`, data),
  delete: (id: number) => api.delete(`/trainings/${id}`),
  addParticipant: (id: number, memberId: number) =>
    api.post(`/trainings/${id}/participants`, { memberId }),
  removeParticipant: (id: number, memberId: number) =>
    api.delete(`/trainings/${id}/participants/${memberId}`),
};

// Endpoints des rapports
export const reportsApi = {
  getAll: () => api.get('/reports'),
  getById: (id: number) => api.get(`/reports/${id}`),
  create: (data: any) => api.post('/reports', data),
  update: (id: number, data: any) => api.put(`/reports/${id}`, data),
  delete: (id: number) => api.delete(`/reports/${id}`),
};

// Endpoints du profil utilisateur
export const profileApi = {
  get: () => api.get('/profile'),
  update: (data: any) => api.put('/profile', data),
  updatePassword: (currentPassword: string, newPassword: string) =>
    api.put('/profile/password', { currentPassword, newPassword }),
  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.put('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export { api };
