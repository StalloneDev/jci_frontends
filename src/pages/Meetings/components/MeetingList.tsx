import { useState, useEffect } from 'react';
import { Meeting } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { Card, CardBody } from '@/components/shared/Card';
import { classNames } from '@/utils/classNames';
import api from '@/utils/api';

interface MeetingListProps {
  onEdit?: (meeting: Meeting) => void;
}

export default function MeetingList({ onEdit }: MeetingListProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await api.get('/meetings');
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const handleDelete = async (meetingId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réunion ?')) {
      try {
        await api.delete(`/meetings/${meetingId}`);
        fetchMeetings();
      } catch (error) {
        console.error('Error deleting meeting:', error);
      }
    }
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Meeting['status']) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Planifiée';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'COMPLETED':
        return 'Terminée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-primary-100 p-3">
                <CalendarIcon
                  className="h-6 w-6 text-primary-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">
                    Total réunions
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {meetings.length}
                  </dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                <ClockIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">
                    Réunions à venir
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {
                      meetings.filter(
                        (m) =>
                          m.status === 'SCHEDULED' &&
                          new Date(m.date) > new Date()
                      ).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Liste des réunions */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Réunion
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Date et Heure
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
              {meetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                          <UsersIcon
                            className="h-6 w-6 text-primary-600"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {meeting.title}
                        </div>
                        <div className="text-gray-500">{meeting.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div>
                        {format(new Date(meeting.date), 'dd MMM yyyy', {
                          locale: fr,
                        })}
                      </div>
                    </div>
                    <div className="flex items-center mt-1">
                      <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div>
                        {format(new Date(meeting.date), 'HH:mm', {
                          locale: fr,
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <span>{meeting.location}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <UsersIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <span>
                        {meeting.currentParticipants}/{meeting.maxParticipants}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={classNames(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        getStatusColor(meeting.status)
                      )}
                    >
                      {getStatusText(meeting.status)}
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
                              onClick={() => onEdit?.(meeting)}
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
                              onClick={() => handleDelete(meeting.id)}
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
