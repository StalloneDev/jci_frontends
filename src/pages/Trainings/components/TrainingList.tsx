import { useState, useEffect } from 'react';
import { Training } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { Card, CardBody } from '@/components/shared/Card';
import { classNames } from '@/utils/classNames';
import api from '@/utils/api';

interface TrainingListProps {
  onEdit?: (training: Training) => void;
}

export default function TrainingList({ onEdit }: TrainingListProps) {
  const [trainings, setTrainings] = useState<Training[]>([]);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await api.get('/trainings');
      setTrainings(response.data);
    } catch (error) {
      console.error('Error fetching trainings:', error);
    }
  };

  const handleDelete = async (trainingId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        await api.delete(`/trainings/${trainingId}`);
        fetchTrainings();
      } catch (error) {
        console.error('Error deleting training:', error);
      }
    }
  };

  const getStatusColor = (status: Training['status']) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Training['status']) => {
    switch (status) {
      case 'UPCOMING':
        return 'À venir';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'COMPLETED':
        return 'Terminé';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Formation
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Lieu
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Participants
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Statut
                </th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trainings.map((training) => (
                <tr key={training.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                          <UserGroupIcon
                            className="h-6 w-6 text-primary-600"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {training.title}
                        </div>
                        <div className="text-gray-500">{training.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div>
                      {format(new Date(training.startDate), 'dd MMM yyyy', {
                        locale: fr,
                      })}
                    </div>
                    <div className="text-gray-400">
                      {format(new Date(training.startDate), 'HH:mm', {
                        locale: fr,
                      })}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {training.location}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {training.currentParticipants}/{training.maxParticipants}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={classNames(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        getStatusColor(training.status)
                      )}
                    >
                      {getStatusText(training.status)}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="p-2 text-gray-500 hover:text-gray-700">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => onEdit?.(training)}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              <PencilIcon className="mr-3 h-5 w-5" />
                              Modifier
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleDelete(training.id)}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'flex w-full items-center px-4 py-2 text-sm text-red-700'
                              )}
                            >
                              <TrashIcon className="mr-3 h-5 w-5" />
                              Supprimer
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
