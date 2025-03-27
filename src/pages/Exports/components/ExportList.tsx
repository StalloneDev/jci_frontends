import { useState, useEffect } from 'react';
import { Export } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Card, CardBody } from '@/components/shared/Card';
import { classNames } from '@/utils/classNames';
import Button from '@/components/shared/Button';
import api from '@/utils/api';

export default function ExportList() {
  const [exports, setExports] = useState<Export[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchExports();
  }, []);

  const fetchExports = async () => {
    try {
      const response = await api.get('/exports');
      setExports(response.data);
    } catch (error) {
      console.error('Error fetching exports:', error);
    }
  };

  const handleExport = async (type: string) => {
    setIsExporting(true);
    try {
      await api.post('/exports', { type });
      fetchExports();
    } catch (error) {
      console.error('Error creating export:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = async (exportItem: Export) => {
    try {
      const response = await api.get(`/exports/${exportItem.id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', exportItem.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading export:', error);
    }
  };

  const getStatusIcon = (status: Export['status']) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Export['status']) => {
    switch (status) {
      case 'PENDING':
        return 'En cours';
      case 'COMPLETED':
        return 'Terminé';
      case 'FAILED':
        return 'Échoué';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions d'export */}
      <div className="flex flex-wrap gap-4">
        <Button
          icon={ArrowDownTrayIcon}
          onClick={() => handleExport('MEMBERS')}
          isLoading={isExporting}
        >
          Exporter les membres
        </Button>
        <Button
          icon={ArrowDownTrayIcon}
          onClick={() => handleExport('TRAININGS')}
          isLoading={isExporting}
        >
          Exporter les formations
        </Button>
        <Button
          icon={ArrowDownTrayIcon}
          onClick={() => handleExport('COMMISSIONS')}
          isLoading={isExporting}
        >
          Exporter les commissions
        </Button>
        <Button
          icon={ArrowDownTrayIcon}
          onClick={() => handleExport('MEETINGS')}
          isLoading={isExporting}
        >
          Exporter les réunions
        </Button>
      </div>

      {/* Liste des exports */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Type
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Date
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
              {exports.map((exportItem) => (
                <tr key={exportItem.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                          <DocumentArrowDownIcon
                            className="h-6 w-6 text-primary-600"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {exportItem.type}
                        </div>
                        <div className="text-gray-500">{exportItem.fileName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {format(new Date(exportItem.createdAt), 'dd MMM yyyy HH:mm', {
                      locale: fr,
                    })}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="flex items-center">
                      {getStatusIcon(exportItem.status)}
                      <span className="ml-2">{getStatusText(exportItem.status)}</span>
                    </div>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    {exportItem.status === 'COMPLETED' && (
                      <Button
                        variant="white"
                        icon={ArrowDownTrayIcon}
                        onClick={() => handleDownload(exportItem)}
                      >
                        Télécharger
                      </Button>
                    )}
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
