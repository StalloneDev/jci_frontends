import { useState, useCallback } from 'react';
import { commissionService } from '@/services/commission.service';
import { Commission } from '@/types';
import { useNotificationContext } from '@/providers/NotificationProvider';

interface UseCommissions {
  commissions: Commission[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchCommissions: (params?: any) => Promise<void>;
  createCommission: (data: Partial<Commission>) => Promise<Commission>;
  updateCommission: (id: string, data: Partial<Commission>) => Promise<Commission>;
  deleteCommission: (id: string) => Promise<void>;
  getMembers: (id: string) => Promise<any>;
  updateMemberRole: (commissionId: string, memberId: string, role: string) => Promise<void>;
}

export const useCommissions = (): UseCommissions => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess, notifyError } = useNotificationContext();

  const fetchCommissions = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await commissionService.getAll(params);
      setCommissions(response.commissions);
      setTotal(response.total);
    } catch (err) {
      setError('Erreur lors du chargement des commissions');
      notifyError('Erreur', 'Impossible de charger les commissions');
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  const createCommission = useCallback(async (data: Partial<Commission>) => {
    try {
      setLoading(true);
      const commission = await commissionService.create(data);
      setCommissions(prev => [...prev, commission]);
      notifySuccess('Succès', 'Commission créée avec succès');
      return commission;
    } catch (err) {
      notifyError('Erreur', 'Impossible de créer la commission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const updateCommission = useCallback(async (id: string, data: Partial<Commission>) => {
    try {
      setLoading(true);
      const commission = await commissionService.update(id, data);
      setCommissions(prev => prev.map(c => c.id === id ? commission : c));
      notifySuccess('Succès', 'Commission mise à jour avec succès');
      return commission;
    } catch (err) {
      notifyError('Erreur', 'Impossible de mettre à jour la commission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const deleteCommission = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await commissionService.delete(id);
      setCommissions(prev => prev.filter(c => c.id !== id));
      notifySuccess('Succès', 'Commission supprimée avec succès');
    } catch (err) {
      notifyError('Erreur', 'Impossible de supprimer la commission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const getMembers = useCallback(async (id: string) => {
    try {
      const members = await commissionService.getMembers(id);
      return members;
    } catch (err) {
      notifyError('Erreur', 'Impossible de récupérer les membres de la commission');
      throw err;
    }
  }, [notifyError]);

  const updateMemberRole = useCallback(async (commissionId: string, memberId: string, role: string) => {
    try {
      await commissionService.updateMemberRole(commissionId, memberId, role);
      notifySuccess('Succès', 'Rôle du membre mis à jour avec succès');
    } catch (err) {
      notifyError('Erreur', 'Impossible de mettre à jour le rôle du membre');
      throw err;
    }
  }, [notifySuccess, notifyError]);

  return {
    commissions,
    total,
    loading,
    error,
    fetchCommissions,
    createCommission,
    updateCommission,
    deleteCommission,
    getMembers,
    updateMemberRole
  };
};
