import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Training, TrainingStatus } from '@/types/training';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MemberTrainingsProps {
  memberId: number;
}

/**
 * Composant pour afficher l'historique des formations d'un membre.
 * Affiche les formations passées, en cours et à venir avec leur statut de participation.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {number} props.memberId - L'identifiant du membre
 * 
 * @example
 * ```tsx
 * <MemberTrainings memberId={1} />
 * ```
 */
export function MemberTrainings({ memberId }: MemberTrainingsProps) {
  const navigate = useNavigate();

  const { data: trainings, isLoading } = useQuery({
    queryKey: ['member-trainings', memberId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/members/${memberId}/trainings`);
      return data.trainings;
    },
  });

  const statusLabels: Record<TrainingStatus, { label: string; className: string }> = {
    PLANNED: { label: 'Planifiée', className: 'bg-blue-100 text-blue-800' },
    IN_PROGRESS: { label: 'En cours', className: 'bg-yellow-100 text-yellow-800' },
    COMPLETED: { label: 'Terminée', className: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Annulée', className: 'bg-red-100 text-red-800' },
  };

  const columns: ColumnDef<Training>[] = [
    {
      accessorKey: 'title',
      header: 'Formation',
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.getValue('date')), 'PPP', { locale: fr }),
    },
    {
      accessorKey: 'location',
      header: 'Lieu',
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.getValue('status') as TrainingStatus;
        const { label, className } = statusLabels[status];
        return <Badge className={className}>{label}</Badge>;
      },
    },
    {
      accessorKey: 'participationStatus',
      header: 'Participation',
      cell: ({ row }) => {
        const status = row.getValue('participationStatus');
        return (
          <Badge
            className={
              status === 'ATTENDED'
                ? 'bg-green-100 text-green-800'
                : status === 'REGISTERED'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }
          >
            {status === 'ATTENDED'
              ? 'Présent'
              : status === 'REGISTERED'
              ? 'Inscrit'
              : 'Absent'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const training = row.original;
        return (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/trainings/${training.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Formations suivies</h3>
          <div className="flex space-x-2">
            <Badge variant="outline">
              Total: {trainings?.length || 0}
            </Badge>
            <Badge variant="outline" className="bg-green-100">
              Terminées: {trainings?.filter(t => t.status === 'COMPLETED').length || 0}
            </Badge>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={trainings || []}
          searchPlaceholder="Rechercher une formation..."
        />
      </div>
    </Card>
  );
}
