import api from './api';
import { Member } from '@/types';

interface GetMembersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  commissionId?: string;
}

export const memberService = {
  getAll: async (params: GetMembersParams = {}) => {
    const response = await api.get('/members', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  create: async (data: Partial<Member>) => {
    const response = await api.post('/members', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Member>) => {
    const response = await api.put(`/members/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/members/${id}`);
  },

  addToCommission: async (memberId: string, commissionId: string, role: string) => {
    const response = await api.post('/members/commission', {
      memberId,
      commissionId,
      role,
    });
    return response.data;
  },

  removeFromCommission: async (memberId: string, commissionId: string) => {
    await api.delete(`/members/${memberId}/commissions/${commissionId}`);
  },

  getCommissions: async (memberId: string) => {
    const response = await api.get(`/members/${memberId}/commissions`);
    return response.data;
  },

  updateProfilePicture: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await api.put(`/members/${id}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
