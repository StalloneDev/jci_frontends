import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeetings } from '@/hooks/useMeetings';
import { DataTable } from '@/components/ui/DataTable';
import { Plus } from 'lucide-react';
import { ActionButton } from '@/components/common/ActionButton';
import { ExportButton } from '@/components/common/ExportButton';
import { meetingColumns } from '@/lib/exports';
import { Permission } from '@/lib/permissions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function MeetingList() {
  const navigate = useNavigate();
  const { meetings, total, loading, error, fetchMeetings } = useMeetings();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    fetchMeetings({ page, limit: pageSize, search });
  }, [fetchMeetings, page, pageSize, search]);

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
      accessorKey: 'location',
      header: 'Lieu',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type');
        return type === 'GENERAL' ? 'Assemblée Générale' :
               type === 'BOARD' ? 'Conseil d\'Administration' :
               type === 'COMMISSION' ? 'Commission' : 'Autre';
      },
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.getValue('status');
        return (
          <span className={`px-2 py-1 rounded-full text-sm ${
            status === 'PLANNED' ? 'bg-blue-100 text-blue-800' :
            status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
            status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status === 'PLANNED' ? 'Planifiée' :
             status === 'IN_PROGRESS' ? 'En cours' :
             status === 'COMPLETED' ? 'Terminée' :
             'Annulée'}
          </span>
        );
      },
    },
    {
      accessorKey: 'participants',
      header: 'Participants',
      cell: ({ row }) => (row.getValue('participants') as any[])?.length || 0,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const meeting = row.original;
        return (
          <div className="flex items-center space-x-2">
            <ActionButton
              size="sm"
              variant="outline"
              onClick={() => navigate(`/meetings/${meeting.id}`)}
              permission={Permission.VIEW_MEETINGS}
            >
              Voir
            </ActionButton>
            <ActionButton
              size="sm"
              variant="outline"
              onClick={() => navigate(`/meetings/${meeting.id}/edit`)}
              permission={Permission.EDIT_MEETING}
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
        <h1 className="text-3xl font-bold">Réunions</h1>
        <div className="flex items-center space-x-4">
          <ExportButton
            data={meetings || []}
            columns={meetingColumns}
            filename="reunions"
            title="Liste des réunions"
            permission={Permission.VIEW_MEETINGS}
          />
          <ActionButton
            onClick={() => navigate('/meetings/new')}
            permission={Permission.CREATE_MEETING}
          >
            <Plus className="mr-2 h-4 w-4" /> Nouvelle réunion
          </ActionButton>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={meetings || []}
        loading={loading}
        searchPlaceholder="Rechercher une réunion..."
        onSearch={setSearch}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        page={page}
        onPageChange={setPage}
        total={total}
      />

      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}
    </div>
  );
}
