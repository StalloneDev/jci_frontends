import api from './api';
import { Meeting } from '@/types';

interface GetMeetingsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  commissionId?: string;
}

export const meetingService = {
  getAll: async (params: GetMeetingsParams = {}) => {
    const response = await api.get('/meetings', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  },

  create: async (data: Partial<Meeting>) => {
    const response = await api.post('/meetings', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Meeting>) => {
    const response = await api.put(`/meetings/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/meetings/${id}`);
  },

  addParticipant: async (meetingId: string, memberId: string) => {
    const response = await api.post(`/meetings/${meetingId}/participants/${memberId}`);
    return response.data;
  },

  removeParticipant: async (meetingId: string, memberId: string) => {
    await api.delete(`/meetings/${meetingId}/participants/${memberId}`);
  },

  getParticipants: async (id: string) => {
    const response = await api.get(`/meetings/${id}/participants`);
    return response.data;
  },

  updateMinutes: async (id: string, minutes: string) => {
    const response = await api.put(`/meetings/${id}/minutes`, { minutes });
    return response.data;
  },
};
