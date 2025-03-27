import { useState, useCallback } from 'react';
import { trainingService } from '@/services/training.service';
import { Training } from '@/types';
import { useNotificationContext } from '@/providers/NotificationProvider';

interface UseTrainings {
  trainings: Training[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchTrainings: (params?: any) => Promise<void>;
  createTraining: (data: Partial<Training>) => Promise<Training>;
  updateTraining: (id: string, data: Partial<Training>) => Promise<Training>;
  deleteTraining: (id: string) => Promise<void>;
  registerParticipant: (trainingId: string, memberId: string) => Promise<void>;
  unregisterParticipant: (trainingId: string, memberId: string) => Promise<void>;
  getParticipants: (id: string) => Promise<any>;
  updateMaterials: (id: string, files: File[]) => Promise<void>;
}

export const useTrainings = (): UseTrainings => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess, notifyError } = useNotificationContext();

  const fetchTrainings = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await trainingService.getAll(params);
      setTrainings(response.trainings);
      setTotal(response.total);
    } catch (err) {
      setError('Erreur lors du chargement des formations');
      notifyError('Erreur', 'Impossible de charger les formations');
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  const createTraining = useCallback(async (data: Partial<Training>) => {
    try {
      setLoading(true);
      const training = await trainingService.create(data);
      setTrainings(prev => [...prev, training]);
      notifySuccess('Succès', 'Formation créée avec succès');
      return training;
    } catch (err) {
      notifyError('Erreur', 'Impossible de créer la formation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const updateTraining = useCallback(async (id: string, data: Partial<Training>) => {
    try {
      setLoading(true);
      const training = await trainingService.update(id, data);
      setTrainings(prev => prev.map(t => t.id === id ? training : t));
      notifySuccess('Succès', 'Formation mise à jour avec succès');
      return training;
    } catch (err) {
      notifyError('Erreur', 'Impossible de mettre à jour la formation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const deleteTraining = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await trainingService.delete(id);
      setTrainings(prev => prev.filter(t => t.id !== id));
      notifySuccess('Succès', 'Formation supprimée avec succès');
    } catch (err) {
      notifyError('Erreur', 'Impossible de supprimer la formation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const registerParticipant = useCallback(async (trainingId: string, memberId: string) => {
    try {
      await trainingService.registerParticipant(trainingId, memberId);
      notifySuccess('Succès', 'Inscription réussie');
    } catch (err) {
      notifyError('Erreur', 'Impossible de s\'inscrire à la formation');
      throw err;
    }
  }, [notifySuccess, notifyError]);

  const unregisterParticipant = useCallback(async (trainingId: string, memberId: string) => {
    try {
      await trainingService.unregisterParticipant(trainingId, memberId);
      notifySuccess('Succès', 'Désinscription réussie');
    } catch (err) {
      notifyError('Erreur', 'Impossible de se désinscrire de la formation');
      throw err;
    }
  }, [notifySuccess, notifyError]);

  const getParticipants = useCallback(async (id: string) => {
    try {
      const participants = await trainingService.getParticipants(id);
      return participants;
    } catch (err) {
      notifyError('Erreur', 'Impossible de récupérer les participants');
      throw err;
    }
  }, [notifyError]);

  const updateMaterials = useCallback(async (id: string, files: File[]) => {
    try {
      await trainingService.updateMaterials(id, files);
      notifySuccess('Succès', 'Supports de formation mis à jour avec succès');
    } catch (err) {
      notifyError('Erreur', 'Impossible de mettre à jour les supports de formation');
      throw err;
    }
  }, [notifySuccess, notifyError]);

  return {
    trainings,
    total,
    loading,
    error,
    fetchTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
    registerParticipant,
    unregisterParticipant,
    getParticipants,
    updateMaterials
  };
};
