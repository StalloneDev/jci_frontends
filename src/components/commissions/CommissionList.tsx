import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Commission } from '@/types';
import { useCommissions } from '@/hooks/useCommissions';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

const columns = [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return type.replace(/_/g, ' ');
    },
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status');
      return (
        <span className={`px-2 py-1 rounded-full text-sm ${
          status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status === 'ACTIVE' ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
  {
    accessorKey: 'members',
    header: 'Membres',
    cell: ({ row }) => {
      const members = row.getValue('members') as any[];
      return members?.length || 0;
    },
  },
];

export function CommissionList() {
  const navigate = useNavigate();
  const {
    commissions,
    total,
    loading,
    error,
    fetchCommissions
  } = useCommissions();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    fetchCommissions({ page, limit: pageSize, search });
  }, [fetchCommissions, page, pageSize, search]);

  const handleRowClick = (commission: Commission) => {
    navigate(`/commissions/${commission.id}`);
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Commissions</h1>
        <Button onClick={() => navigate('/commissions/new')}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nouvelle commission
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={commissions}
        onRowClick={handleRowClick}
        searchPlaceholder="Rechercher une commission..."
        onSearch={setSearch}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        page={page}
        onPageChange={setPage}
        total={total}
        loading={loading}
      />

      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}
    </div>
  );
}
