import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Commission } from '@/types';
import Button from '@/components/shared/Button';
import { Card, CardBody, CardFooter } from '@/components/shared/Card';
import Alert from '@/components/shared/Alert';
import api from '@/utils/api';

const schema = yup.object({
  name: yup.string().required('Le nom est requis'),
  description: yup.string().required('La description est requise'),
  director: yup.string().required('Le directeur est requis'),
  budget: yup.number()
    .min(0, 'Le budget ne peut pas être négatif')
    .required('Le budget est requis'),
  totalObjectives: yup.number()
    .min(1, 'Il doit y avoir au moins un objectif')
    .required('Le nombre d\'objectifs est requis'),
}).required();

type FormData = Omit<Commission, 'id' | 'membersCount' | 'objectivesAchieved'>;

interface CommissionFormProps {
  commission?: Commission;
  onSuccess?: () => void;
}

export default function CommissionForm({ commission, onSuccess }: CommissionFormProps) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: commission,
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      if (commission) {
        await api.put(`/commissions/${commission.id}`, data);
      } else {
        await api.post('/commissions', data);
      }
      onSuccess?.();
    } catch (error) {
      setError('Une erreur est survenue lors de l\'enregistrement');
      console.error('Error saving commission:', error);
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
                Informations de la Commission
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nom
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('name')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
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

                <div className="sm:col-span-4">
                  <label
                    htmlFor="director"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Directeur
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('director')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.director && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.director.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="budget"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Budget
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      step="0.01"
                      {...register('budget')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.budget && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.budget.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="totalObjectives"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre d'objectifs
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      {...register('totalObjectives')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.totalObjectives && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.totalObjectives.message}
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
              {commission ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
