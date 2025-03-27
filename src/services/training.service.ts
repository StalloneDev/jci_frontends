import api from './api';
import { Training } from '@/types';

interface GetTrainingsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  commissionId?: string;
}

export const trainingService = {
  getAll: async (params: GetTrainingsParams = {}) => {
    const response = await api.get('/trainings', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/trainings/${id}`);
    return response.data;
  },

  create: async (data: Partial<Training>) => {
    const response = await api.post('/trainings', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Training>) => {
    const response = await api.put(`/trainings/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/trainings/${id}`);
  },

  registerParticipant: async (trainingId: string, memberId: string) => {
    const response = await api.post(`/trainings/${trainingId}/participants/${memberId}`);
    return response.data;
  },

  unregisterParticipant: async (trainingId: string, memberId: string) => {
    await api.delete(`/trainings/${trainingId}/participants/${memberId}`);
  },

  getParticipants: async (id: string) => {
    const response = await api.get(`/trainings/${id}/participants`);
    return response.data;
  },

  updateMaterials: async (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('materials', file);
    });
    const response = await api.put(`/trainings/${id}/materials`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
