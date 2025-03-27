import { useState, useCallback } from 'react';
import { memberService } from '@/services/member.service';
import { Member } from '@/types';
import { useNotificationContext } from '@/providers/NotificationProvider';

interface UseMembers {
  members: Member[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchMembers: (params?: any) => Promise<void>;
  createMember: (data: Partial<Member>) => Promise<Member>;
  updateMember: (id: string, data: Partial<Member>) => Promise<Member>;
  deleteMember: (id: string) => Promise<void>;
  addToCommission: (memberId: string, commissionId: string, role: string) => Promise<void>;
  removeFromCommission: (memberId: string, commissionId: string) => Promise<void>;
}

export const useMembers = (): UseMembers => {
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess, notifyError } = useNotificationContext();

  const fetchMembers = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await memberService.getAll(params);
      setMembers(response.members);
      setTotal(response.total);
    } catch (err) {
      setError('Erreur lors du chargement des membres');
      notifyError('Erreur', 'Impossible de charger les membres');
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  const createMember = useCallback(async (data: Partial<Member>) => {
    try {
      setLoading(true);
      const member = await memberService.create(data);
      setMembers(prev => [...prev, member]);
      notifySuccess('Succès', 'Membre créé avec succès');
      return member;
    } catch (err) {
      notifyError('Erreur', 'Impossible de créer le membre');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const updateMember = useCallback(async (id: string, data: Partial<Member>) => {
    try {
      setLoading(true);
      const member = await memberService.update(id, data);
      setMembers(prev => prev.map(m => m.id === id ? member : m));
      notifySuccess('Succès', 'Membre mis à jour avec succès');
      return member;
    } catch (err) {
      notifyError('Erreur', 'Impossible de mettre à jour le membre');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const deleteMember = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await memberService.delete(id);
      setMembers(prev => prev.filter(m => m.id !== id));
      notifySuccess('Succès', 'Membre supprimé avec succès');
    } catch (err) {
      notifyError('Erreur', 'Impossible de supprimer le membre');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const addToCommission = useCallback(async (memberId: string, commissionId: string, role: string) => {
    try {
      await memberService.addToCommission(memberId, commissionId, role);
      notifySuccess('Succès', 'Membre ajouté à la commission avec succès');
    } catch (err) {
      notifyError('Erreur', 'Impossible d\'ajouter le membre à la commission');
      throw err;
    }
  }, [notifySuccess, notifyError]);

  const removeFromCommission = useCallback(async (memberId: string, commissionId: string) => {
    try {
      await memberService.removeFromCommission(memberId, commissionId);
      notifySuccess('Succès', 'Membre retiré de la commission avec succès');
    } catch (err) {
      notifyError('Erreur', 'Impossible de retirer le membre de la commission');
      throw err;
    }
  }, [notifySuccess, notifyError]);

  return {
    members,
    total,
    loading,
    error,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
    addToCommission,
    removeFromCommission
  };
};
