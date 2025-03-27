import { useState, useCallback } from 'react';
import { meetingService } from '@/services/meeting.service';
import { Meeting } from '@/types';
import { useNotificationContext } from '@/providers/NotificationProvider';

interface UseMeetings {
  meetings: Meeting[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchMeetings: (params?: any) => Promise<void>;
  createMeeting: (data: Partial<Meeting>) => Promise<Meeting>;
  updateMeeting: (id: string, data: Partial<Meeting>) => Promise<Meeting>;
  deleteMeeting: (id: string) => Promise<void>;
  addParticipant: (meetingId: string, memberId: string) => Promise<void>;
  removeParticipant: (meetingId: string, memberId: string) => Promise<void>;
  getParticipants: (id: string) => Promise<any>;
  updateMinutes: (id: string, minutes: string) => Promise<void>;
}

export const useMeetings = (): UseMeetings => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess, notifyError } = useNotificationContext();

  const fetchMeetings = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await meetingService.getAll(params);
      setMeetings(response.meetings);
      setTotal(response.total);
    } catch (err) {
      setError('Erreur lors du chargement des réunions');
      notifyError('Erreur', 'Impossible de charger les réunions');
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  const createMeeting = useCallback(async (data: Partial<Meeting>) => {
    try {
      setLoading(true);
      const meeting = await meetingService.create(data);
      setMeetings(prev => [...prev, meeting]);
      notifySuccess('Succès', 'Réunion créée avec succès');
      return meeting;
    } catch (err) {
      notifyError('Erreur', 'Impossible de créer la réunion');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const updateMeeting = useCallback(async (id: string, data: Partial<Meeting>) => {
    try {
      setLoading(true);
      const meeting = await meetingService.update(id, data);
      setMeetings(prev => prev.map(m => m.id === id ? meeting : m));
      notifySuccess('Succès', 'Réunion mise à jour avec succès');
      return meeting;
    } catch (err) {
      notifyError('Erreur', 'Impossible de mettre à jour la réunion');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const deleteMeeting = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await meetingService.delete(id);
      setMeetings(prev => prev.filter(m => m.id !== id));
      notifySuccess('Succès', 'Réunion supprimée avec succès');
    } catch (err) {
      notifyError('Erreur', 'Impossible de supprimer la réunion');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const addParticipant = useCallback(async (meetingId: string, memberId: string) => {
    try {
      await meetingService.addParticipant(meetingId, memberId);
      notifySuccess('Succès', 'Participant ajouté avec succès');
    } catch (err) {
      notifyError('Erreur', 'Impossible d\'ajouter le participant');
      throw err;
    }
  }, [notifySuccess, notifyError]);

  const removeParticipant = useCallback(async (meetingId: string, memberId: string) => {
    try {
      await meetingService.removeParticipant(meetingId, memberId);
      notifySuccess('Succès', 'Participant retiré avec succès');
    } catch (err) {
      notifyError('Erreur', 'Impossible de retirer le participant');
      throw err;
    }
  }, [notifySuccess, notifyError]);

  const getParticipants = useCallback(async (id: string) => {
    try {
      const participants = await meetingService.getParticipants(id);
      return participants;
    } catch (err) {
      notifyError('Erreur', 'Impossible de récupérer les participants');
      throw err;
    }
  }, [notifyError]);

  const updateMinutes = useCallback(async (id: string, minutes: string) => {
    try {
      await meetingService.updateMinutes(id, minutes);
      notifySuccess('Succès', 'Compte-rendu mis à jour avec succès');
    } catch (err) {
      notifyError('Erreur', 'Impossible de mettre à jour le compte-rendu');
      throw err;
    }
  }, [notifySuccess, notifyError]);

  return {
    meetings,
    total,
    loading,
    error,
    fetchMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    addParticipant,
    removeParticipant,
    getParticipants,
    updateMinutes
  };
};
