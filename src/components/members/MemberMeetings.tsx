import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Meeting, MeetingStatus, MeetingType } from '@/types/meeting';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MemberMeetingsProps {
  memberId: number;
}

/**
 * Composant pour afficher l'historique des réunions d'un membre.
 * Affiche les réunions par type (AG, CA, Commission) avec leur statut de participation.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {number} props.memberId - L'identifiant du membre
 * 
 * @example
 * ```tsx
 * <MemberMeetings memberId={1} />
 * ```
 */
export function MemberMeetings({ memberId }: MemberMeetingsProps) {
  const navigate = useNavigate();

  const { data: meetings, isLoading } = useQuery({
    queryKey: ['member-meetings', memberId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/members/${memberId}/meetings`);
      return data.meetings;
    },
  });

  const statusLabels: Record<MeetingStatus, { label: string; className: string }> = {
    PLANNED: { label: 'Planifiée', className: 'bg-blue-100 text-blue-800' },
    IN_PROGRESS: { label: 'En cours', className: 'bg-yellow-100 text-yellow-800' },
    COMPLETED: { label: 'Terminée', className: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Annulée', className: 'bg-red-100 text-red-800' },
  };

  const typeLabels: Record<MeetingType, string> = {
    GENERAL: 'Assemblée Générale',
    BOARD: 'Conseil d\'Administration',
    COMMISSION: 'Commission',
    OTHER: 'Autre',
  };

  const columns: ColumnDef<Meeting>[] = [
    {
      accessorKey: 'title',
      header: 'Réunion',
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.getValue('date')), 'PPP', { locale: fr }),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as MeetingType;
        return typeLabels[type];
      },
    },
    {
      accessorKey: 'location',
      header: 'Lieu',
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.getValue('status') as MeetingStatus;
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
        const meeting = row.original;
        return (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/meetings/${meeting.id}`)}
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

  // Grouper les réunions par type
  const meetingsByType = meetings?.reduce((acc, meeting) => {
    const type = meeting.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(meeting);
    return acc;
  }, {} as Record<MeetingType, Meeting[]>);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Réunions</h3>
          <div className="flex space-x-2">
            <Badge variant="outline">
              Total: {meetings?.length || 0}
            </Badge>
            {Object.entries(meetingsByType || {}).map(([type, meetings]) => (
              <Badge key={type} variant="outline">
                {typeLabels[type as MeetingType]}: {meetings.length}
              </Badge>
            ))}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={meetings || []}
          searchPlaceholder="Rechercher une réunion..."
        />
      </div>
    </Card>
  );
}
