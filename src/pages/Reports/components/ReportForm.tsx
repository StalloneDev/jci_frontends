import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { reportSchema } from '@/validations/schemas';
import { Report } from '@/types';
import Button from '@/components/shared/Button';
import { Card, CardBody, CardFooter } from '@/components/shared/Card';
import { useNotificationContext } from '@/providers/NotificationProvider';
import { handleError } from '@/utils/errorHandler';
import api from '@/utils/api';

interface ReportFormProps {
  report?: Report;
  onSuccess?: () => void;
}

export default function ReportForm({ report, onSuccess }: ReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifySuccess, notifyError } = useNotificationContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(reportSchema),
    defaultValues: report
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      // Ajout des champs texte
      Object.keys(data).forEach(key => {
        if (key !== 'attachments') {
          formData.append(key, data[key]);
        }
      });
      
      // Ajout des fichiers
      if (data.attachments) {
        Array.from(data.attachments).forEach((file: File) => {
          formData.append('attachments', file);
        });
      }

      if (report) {
        await api.put(`/reports/${report.id}`, formData);
        notifySuccess('Succès', 'Rapport mis à jour avec succès');
      } else {
        await api.post('/reports', formData);
        notifySuccess('Succès', 'Rapport créé avec succès');
        reset();
      }
      
      onSuccess?.();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardBody>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Informations du Rapport
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Titre
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('title')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type
                  </label>
                  <div className="mt-1">
                    <select
                      {...register('type')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="ACTIVITY">Rapport d'activité</option>
                      <option value="MEETING">Compte rendu de réunion</option>
                      <option value="TRAINING">Rapport de formation</option>
                      <option value="FINANCIAL">Rapport financier</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.type.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contenu
                  </label>
                  <div className="mt-1">
                    <textarea
                      {...register('content')}
                      rows={10}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.content.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="attachments"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pièces jointes
                  </label>
                  <div className="mt-1">
                    <input
                      type="file"
                      multiple
                      {...register('attachments')}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        hover:file:bg-primary-100"
                    />
                    {errors.attachments && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.attachments.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex justify-end space-x-3">
            <Button
              variant="white"
              type="button"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Réinitialiser
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {report ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
