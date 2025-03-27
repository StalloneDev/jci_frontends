import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Meeting } from '@/types';
import Button from '@/components/shared/Button';
import { Card, CardBody, CardFooter } from '@/components/shared/Card';
import Alert from '@/components/shared/Alert';
import api from '@/utils/api';

const schema = yup.object({
  title: yup.string().required('Le titre est requis'),
  description: yup.string().required('La description est requise'),
  date: yup.string().required('La date est requise'),
  location: yup.string().required('Le lieu est requis'),
  maxParticipants: yup.number()
    .min(1, 'Le nombre minimum de participants est 1')
    .required('Le nombre maximum de participants est requis'),
  agenda: yup.string().required('L\'ordre du jour est requis'),
}).required();

type FormData = Omit<Meeting, 'id' | 'currentParticipants' | 'status'>;

interface MeetingFormProps {
  meeting?: Meeting;
  onSuccess?: () => void;
}

export default function MeetingForm({ meeting, onSuccess }: MeetingFormProps) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: meeting,
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      if (meeting) {
        await api.put(`/meetings/${meeting.id}`, data);
      } else {
        await api.post('/meetings', data);
      }
      onSuccess?.();
    } catch (error) {
      setError('Une erreur est survenue lors de l\'enregistrement');
      console.error('Error saving meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert
          title="Erreur"
          message={error}
          variant="error"
          onClose={() => setError('')}
        />
      )}

      <Card>
        <CardBody>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Informations de la Réunion
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
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date et heure
                  </label>
                  <div className="mt-1">
                    <input
                      type="datetime-local"
                      {...register('date')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Lieu
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('location')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="maxParticipants"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre maximum de participants
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      {...register('maxParticipants')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.maxParticipants && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.maxParticipants.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="agenda"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ordre du jour
                  </label>
                  <div className="mt-1">
                    <textarea
                      {...register('agenda')}
                      rows={6}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.agenda && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.agenda.message}
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
            <Button variant="white" type="button">
              Annuler
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {meeting ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
