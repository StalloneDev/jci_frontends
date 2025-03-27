import api from './api';
import { Commission } from '@/types';

interface GetCommissionsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
}

export const commissionService = {
  getAll: async (params: GetCommissionsParams = {}) => {
    const response = await api.get('/commissions', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/commissions/${id}`);
    return response.data;
  },

  create: async (data: Partial<Commission>) => {
    const response = await api.post('/commissions', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Commission>) => {
    const response = await api.put(`/commissions/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/commissions/${id}`);
  },

  getMembers: async (id: string) => {
    const response = await api.get(`/commissions/${id}/members`);
    return response.data;
  },

  updateMemberRole: async (commissionId: string, memberId: string, role: string) => {
    const response = await api.put(`/commissions/${commissionId}/members/${memberId}/role`, {
      role,
    });
    return response.data;
  },

  getHistory: async (id: string) => {
    const response = await api.get(`/commissions/${id}/history`);
    return response.data;
  },
};
