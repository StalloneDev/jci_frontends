import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import Button from '@/components/shared/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import MeetingList from './components/MeetingList';
import MeetingForm from './components/MeetingForm';
import { Meeting } from '@/types';
import { Dialog } from '@headlessui/react';

export default function Meetings() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | undefined>();

  const handleEdit = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setSelectedMeeting(undefined);
  };

  return (
    <div>
      <PageHeader
        title="Gestion des Réunions"
        actions={
          <Button icon={PlusIcon} onClick={() => setIsFormOpen(true)}>
            Ajouter une réunion
          </Button>
        }
      />

      <div className="mt-8">
        <MeetingList onEdit={handleEdit} />
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
                {selectedMeeting ? 'Modifier une réunion' : 'Ajouter une réunion'}
              </Dialog.Title>
            </div>

            <div className="p-6">
              <MeetingForm meeting={selectedMeeting} onSuccess={handleSuccess} />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
