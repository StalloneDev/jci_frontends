import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import Button from '@/components/shared/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import TrainingList from './components/TrainingList';
import TrainingForm from './components/TrainingForm';
import { Training } from '@/types';
import { Dialog } from '@headlessui/react';

export default function Trainings() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | undefined>();

  const handleEdit = (training: Training) => {
    setSelectedTraining(training);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setSelectedTraining(undefined);
  };

  return (
    <div>
      <PageHeader
        title="Gestion des Formations"
        actions={
          <Button icon={PlusIcon} onClick={() => setIsFormOpen(true)}>
            Ajouter une formation
          </Button>
        }
      />

      <div className="mt-8">
        <TrainingList onEdit={handleEdit} />
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
                {selectedTraining ? 'Modifier une formation' : 'Ajouter une formation'}
              </Dialog.Title>
            </div>

            <div className="p-6">
              <TrainingForm training={selectedTraining} onSuccess={handleSuccess} />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
