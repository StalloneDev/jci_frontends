import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Member } from '@/types';
import Button from '@/components/shared/Button';
import { Card, CardBody, CardFooter } from '@/components/shared/Card';
import Alert from '@/components/shared/Alert';
import api from '@/utils/api';

const schema = yup.object({
  firstName: yup.string().required('Le prénom est requis'),
  lastName: yup.string().required('Le nom est requis'),
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  phone: yup.string().required('Le téléphone est requis'),
  birthDate: yup.string().required('La date de naissance est requise'),
  birthPlace: yup.string().required('Le lieu de naissance est requis'),
  profession: yup.string().required('La profession est requise'),
  employer: yup.string().required('L\'employeur est requis'),
  address: yup.string().required('L\'adresse est requise'),
  membershipDate: yup.string().required('La date d\'adhésion est requise'),
  olmAppartenance: yup.string().required('L\'OLM est requis'),
}).required();

type FormData = Omit<Member, 'id' | 'membershipStatus' | 'photoUrl'>;

interface MemberFormProps {
  member?: Member;
  onSuccess?: () => void;
}

export default function MemberForm({ member, onSuccess }: MemberFormProps) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: member,
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      if (member) {
        await api.put(`/members/${member.id}`, data);
      } else {
        await api.post('/members', data);
      }
      onSuccess?.();
    } catch (error) {
      setError('Une erreur est survenue lors de l\'enregistrement');
      console.error('Error saving member:', error);
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
                Informations Personnelles
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Prénom
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('firstName')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nom
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('lastName')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      {...register('email')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Téléphone
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      {...register('phone')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date de naissance
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      {...register('birthDate')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.birthDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.birthDate.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Autres champs similaires... */}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Informations Professionnelles
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="profession"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Profession
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('profession')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.profession && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.profession.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="employer"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employeur
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('employer')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.employer && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.employer.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Informations JCI
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="olmAppartenance"
                    className="block text-sm font-medium text-gray-700"
                  >
                    OLM
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('olmAppartenance')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.olmAppartenance && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.olmAppartenance.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="membershipDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date d'adhésion
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      {...register('membershipDate')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    {errors.membershipDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.membershipDate.message}
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
              {member ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
