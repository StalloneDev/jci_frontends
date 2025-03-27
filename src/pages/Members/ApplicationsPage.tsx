import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ActionButton } from '@/components/common/ActionButton';
import { ExportButton } from '@/components/common/ExportButton';
import { memberColumns } from '@/lib/exports';
import { Permission } from '@/lib/permissions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MemberStatus } from '@/types/member';
import { useMembers } from '@/hooks/useMembers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ApplicationsPage() {
  const navigate = useNavigate();
  const { members, loading } = useMembers();

  const pendingMembers = members?.filter(m => m.status === MemberStatus.PENDING) || [];
  const probationMembers = members?.filter(m => m.status === MemberStatus.PROBATION) || [];
  const activeMembers = members?.filter(m => m.status === MemberStatus.ACTIVE) || [];

  const columns = [
    {
      accessorKey: 'firstName',
      header: 'Prénom',
    },
    {
      accessorKey: 'lastName',
      header: 'Nom',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Téléphone',
    },
    {
      accessorKey: 'applicationDate',
      header: 'Date de candidature',
      cell: ({ row }) => format(new Date(row.getValue('applicationDate')), 'PPP', { locale: fr }),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="flex items-center space-x-2">
            <ActionButton
              size="sm"
              variant="outline"
              onClick={() => navigate(`/members/${member.id}`)}
              permission={Permission.VIEW_MEMBERS}
            >
              Voir
            </ActionButton>
            <ActionButton
              size="sm"
              variant="outline"
              onClick={() => navigate(`/members/${member.id}/edit`)}
              permission={Permission.EDIT_MEMBER}
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
        <h1 className="text-3xl font-bold">Gestion des membres</h1>
        <div className="flex items-center space-x-4">
          <ExportButton
            data={members || []}
            columns={memberColumns}
            filename="membres"
            title="Liste des membres"
            permission={Permission.VIEW_MEMBERS}
          />
          <ActionButton
            onClick={() => navigate('/members/new')}
            permission={Permission.CREATE_MEMBER}
          >
            <Plus className="mr-2 h-4 w-4" /> Nouvelle candidature
          </ActionButton>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Candidatures en attente ({pendingMembers.length})
          </TabsTrigger>
          <TabsTrigger value="probation">
            Membres en probation ({probationMembers.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Membres actifs ({activeMembers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <DataTable
            columns={columns}
            data={pendingMembers}
            loading={loading}
            searchPlaceholder="Rechercher une candidature..."
          />
        </TabsContent>

        <TabsContent value="probation">
          <DataTable
            columns={columns}
            data={probationMembers}
            loading={loading}
            searchPlaceholder="Rechercher un membre en probation..."
          />
        </TabsContent>

        <TabsContent value="active">
          <DataTable
            columns={columns}
            data={activeMembers}
            loading={loading}
            searchPlaceholder="Rechercher un membre actif..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
