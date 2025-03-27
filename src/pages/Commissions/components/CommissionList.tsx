import { useState, useEffect } from 'react';
import { Commission } from '@/types';
import {
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { Card, CardBody } from '@/components/shared/Card';
import { classNames } from '@/utils/classNames';
import api from '@/utils/api';

interface CommissionListProps {
  onEdit?: (commission: Commission) => void;
}

export default function CommissionList({ onEdit }: CommissionListProps) {
  const [commissions, setCommissions] = useState<Commission[]>([]);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const response = await api.get('/commissions');
      setCommissions(response.data);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    }
  };

  const handleDelete = async (commissionId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commission ?')) {
      try {
        await api.delete(`/commissions/${commissionId}`);
        fetchCommissions();
      } catch (error) {
        console.error('Error deleting commission:', error);
      }
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
                <UserGroupIcon
                  className="h-6 w-6 text-primary-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">
                    Total commissions
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {commissions.length}
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
                <ChartBarIcon
                  className="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">
                    Objectifs atteints
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {commissions.filter((c) => c.objectivesAchieved).length}
                  </dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Liste des commissions */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Commission
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Responsable
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Membres
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Objectifs
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Budget
                </th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {commissions.map((commission) => (
                <tr key={commission.id}>
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
                          {commission.name}
                        </div>
                        <div className="text-gray-500">{commission.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {commission.director}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {commission.membersCount}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {commission.objectivesAchieved}/{commission.totalObjectives}
                      </span>
                      <div className="ml-4 flex-1 max-w-[100px]">
                        <div className="h-2 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-primary-600"
                            style={{
                              width: `${(commission.objectivesAchieved / commission.totalObjectives) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {commission.budget.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
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
                              onClick={() => onEdit?.(commission)}
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
                              onClick={() => handleDelete(commission.id)}
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
