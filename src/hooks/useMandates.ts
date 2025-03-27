import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleMandate } from '@/types/member';
import { api } from '@/utils/api';

const CACHE_TIME = 1000 * 60 * 5; // 5 minutes
const STALE_TIME = 1000 * 30; // 30 secondes

/**
 * Hook personnalisé pour gérer les mandats d'un membre.
 * Fournit les fonctionnalités de lecture, ajout et mise à jour des mandats.
 * 
 * @param {number} memberId - L'identifiant du membre
 * @returns {Object} Retourne un objet contenant :
 *   - mandates: La liste des mandats
 *   - isLoading: État de chargement
 *   - error: Message d'erreur éventuel
 *   - addMandate: Fonction pour ajouter un mandat
 *   - updateMandate: Fonction pour mettre à jour un mandat
 *   - deleteMandate: Fonction pour supprimer un mandat
 * 
 * @example
 * ```tsx
 * const { mandates, isLoading, addMandate } = useMandates(1);
 * 
 * // Ajouter un mandat
 * await addMandate.mutateAsync({
 *   role: 'PRESIDENT',
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31'
 * });
 * ```
 */
export function useMandates(memberId: number) {
  const queryClient = useQueryClient();
  const queryKey = ['mandates', memberId];

  // Optimisation : Mise en cache des mandats avec gestion de la péremption
  const { data: mandates, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await api.get(`/members/${memberId}/mandates`);
      return response.data.mandates;
    },
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
    // Optimisation : Préchargement des données au survol
    onSuccess: (data) => {
      // Précharger les données liées
      data.forEach((mandate: RoleMandate) => {
        queryClient.prefetchQuery({
          queryKey: ['mandate', mandate.id],
          queryFn: () => api.get(`/members/${memberId}/mandates/${mandate.id}`),
          cacheTime: CACHE_TIME,
        });
      });
    },
  });

  // Optimisation : Mise à jour optimiste du cache
  const addMutation = useMutation({
    mutationFn: async (newMandate: Omit<RoleMandate, 'id'>) => {
      const response = await api.post(`/members/${memberId}/mandates`, newMandate);
      return response.data.mandate;
    },
    onMutate: async (newMandate) => {
      await queryClient.cancelQueries({ queryKey });
      const previousMandates = queryClient.getQueryData(queryKey);
      
      queryClient.setQueryData(queryKey, (old: RoleMandate[]) => [
        ...old,
        { ...newMandate, id: Date.now() }, // ID temporaire
      ]);

      return { previousMandates };
    },
    onError: (err, newMandate, context) => {
      queryClient.setQueryData(queryKey, context?.previousMandates);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<RoleMandate> }) => {
      const response = await api.put(`/members/${memberId}/mandates/${id}`, updates);
      return response.data.mandate;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousMandates = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: RoleMandate[]) =>
        old.map((mandate) =>
          mandate.id === id ? { ...mandate, ...updates } : mandate
        )
      );

      return { previousMandates };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousMandates);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/members/${memberId}/mandates/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousMandates = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: RoleMandate[]) =>
        old.filter((mandate) => mandate.id !== id)
      );

      return { previousMandates };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(queryKey, context?.previousMandates);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    mandates,
    isLoading,
    error,
    addMandate: addMutation.mutate,
    updateMandate: (id: number, updates: Partial<RoleMandate>) =>
      updateMutation.mutate({ id, updates }),
    deleteMandate: deleteMutation.mutate,
  };
}
