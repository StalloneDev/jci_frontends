import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import Button from '@/components/shared/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import ReportList from './components/ReportList';
import ReportForm from './components/ReportForm';
import { Report } from '@/types';
import { Dialog } from '@headlessui/react';

export default function Reports() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | undefined>();

  const handleEdit = (report: Report) => {
    setSelectedReport(report);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setSelectedReport(undefined);
  };

  return (
    <div>
      <PageHeader
        title="Gestion des Rapports"
        actions={
          <Button icon={PlusIcon} onClick={() => setIsFormOpen(true)}>
            Créer un rapport
          </Button>
        }
      />

      <div className="mt-8">
        <ReportList onEdit={handleEdit} />
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
                {selectedReport ? 'Modifier un rapport' : 'Créer un rapport'}
              </Dialog.Title>
            </div>

            <div className="p-6">
              <ReportForm report={selectedReport} onSuccess={handleSuccess} />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
