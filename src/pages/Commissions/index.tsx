import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import Button from '@/components/shared/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import CommissionList from './components/CommissionList';
import CommissionForm from './components/CommissionForm';
import { Commission } from '@/types';
import { Dialog } from '@headlessui/react';

export default function Commissions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | undefined>();

  const handleEdit = (commission: Commission) => {
    setSelectedCommission(commission);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setSelectedCommission(undefined);
  };

  return (
    <div>
      <PageHeader
        title="Gestion des Commissions"
        actions={
          <Button icon={PlusIcon} onClick={() => setIsFormOpen(true)}>
            Ajouter une commission
          </Button>
        }
      />

      <div className="mt-8">
        <CommissionList onEdit={handleEdit} />
      </div>

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-3xl w-full rounded bg-white">
            <div className="px-6 py-4 border-b border-gray-200">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {selectedCommission ? 'Modifier une commission' : 'Ajouter une commission'}
              </Dialog.Title>
            </div>

            <div className="p-6">
              <CommissionForm commission={selectedCommission} onSuccess={handleSuccess} />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
