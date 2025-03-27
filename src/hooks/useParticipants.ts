import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface AddParticipantParams {
  type: 'training' | 'meeting';
  id: string;
  memberId: string;
  role?: string;
  status: string;
}

interface RemoveParticipantParams {
  type: 'training' | 'meeting';
  id: string;
  participantId: string;
}

interface UpdateParticipantStatusParams {
  type: 'training' | 'meeting';
  id: string;
  participantId: string;
  status: string;
}

export function useParticipants() {
  const queryClient = useQueryClient();

  const addParticipant = useMutation({
    mutationFn: async ({ type, id, ...data }: AddParticipantParams) => {
      const response = await api.post(
        `/${type}s/${id}/participants`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([`${variables.type}`, variables.id]);
      toast.success('Participant ajouté avec succès');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Erreur lors de l\'ajout du participant'
      );
    },
  });

  const removeParticipant = useMutation({
    mutationFn: async ({ type, id, participantId }: RemoveParticipantParams) => {
      const response = await api.delete(
        `/${type}s/${id}/participants/${participantId}`
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([`${variables.type}`, variables.id]);
      toast.success('Participant supprimé avec succès');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Erreur lors de la suppression du participant'
      );
    },
  });

  const updateParticipantStatus = useMutation({
    mutationFn: async ({
      type,
      id,
      participantId,
      status,
    }: UpdateParticipantStatusParams) => {
      const response = await api.patch(
        `/${type}s/${id}/participants/${participantId}`,
        { status }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([`${variables.type}`, variables.id]);
      toast.success('Statut mis à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Erreur lors de la mise à jour du statut'
      );
    },
  });

  return useMemo(
    () => ({
      addParticipant,
      removeParticipant,
      updateParticipantStatus,
    }),
    [addParticipant, removeParticipant, updateParticipantStatus]
  );
}
