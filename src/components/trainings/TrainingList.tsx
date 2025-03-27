import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainings } from '@/hooks/useTrainings';
import { DataTable } from '@/components/ui/DataTable';
import { Plus } from 'lucide-react';
import { ActionButton } from '@/components/common/ActionButton';
import { ExportButton } from '@/components/common/ExportButton';
import { trainingColumns } from '@/lib/exports';
import { Permission } from '@/lib/permissions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function TrainingList() {
  const navigate = useNavigate();
  const { trainings, loading } = useTrainings();

  const columns = [
    {
      accessorKey: 'title',
      header: 'Titre',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.getValue('date')), 'PPP', { locale: fr }),
    },
    {
      accessorKey: 'commission.name',
      header: 'Commission',
    },
    {
      accessorKey: 'participants',
      header: 'Participants',
      cell: ({ row }) => (row.getValue('participants') as any[])?.length || 0,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const training = row.original;
        return (
          <div className="flex items-center space-x-2">
            <ActionButton
              size="sm"
              variant="outline"
              onClick={() => navigate(`/trainings/${training.id}`)}
              permission={Permission.VIEW_TRAININGS}
            >
              Voir
            </ActionButton>
            <ActionButton
              size="sm"
              variant="outline"
              onClick={() => navigate(`/trainings/${training.id}/edit`)}
              permission={Permission.EDIT_TRAINING}
            >
              Modifier
            </ActionButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Formations</h1>
        <div className="flex items-center space-x-4">
          <ExportButton
            data={trainings || []}
            columns={trainingColumns}
            filename="formations"
            title="Liste des formations"
            permission={Permission.VIEW_TRAININGS}
          />
          <ActionButton
            onClick={() => navigate('/trainings/new')}
            permission={Permission.CREATE_TRAINING}
          >
            <Plus className="mr-2 h-4 w-4" /> Nouvelle formation
          </ActionButton>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={trainings || []}
        loading={loading}
        searchPlaceholder="Rechercher une formation..."
      />
    </div>
  );
}
