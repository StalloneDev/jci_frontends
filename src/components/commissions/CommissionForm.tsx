import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Commission } from '@/types';
import { useCommissions } from '@/hooks/useCommissions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/Card';

const commissionSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  type: z.enum([
    'AFFAIRES_ENTREPRENEURIAT',
    'COMMUNICATION_MARKETING',
    'CROISSANCE_DEVELOPPEMENT',
    'FINANCES',
    'FORMATION',
    'MANAGEMENT',
    'PROJETS_THEME',
    'RELATIONS_EXTERIEURES',
    'SECRETARIAT'
  ]),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  objectives: z.array(z.string()).min(1, 'Au moins un objectif est requis'),
  activities: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

interface CommissionFormProps {
  commission?: Commission;
  isEditing?: boolean;
}

export function CommissionForm({ commission, isEditing = false }: CommissionFormProps) {
  const navigate = useNavigate();
  const { createCommission, updateCommission } = useCommissions();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof commissionSchema>>({
    resolver: zodResolver(commissionSchema),
    defaultValues: commission || {
      status: 'ACTIVE',
      objectives: [],
      activities: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof commissionSchema>) => {
    try {
      setLoading(true);
      if (isEditing && commission) {
        await updateCommission(commission.id, values);
      } else {
        await createCommission(values);
      }
      navigate('/commissions');
    } catch (error) {
      console.error('Error saving commission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AFFAIRES_ENTREPRENEURIAT">Affaires & Entrepreneuriat</SelectItem>
                        <SelectItem value="COMMUNICATION_MARKETING">Communication & Marketing</SelectItem>
                        <SelectItem value="CROISSANCE_DEVELOPPEMENT">Croissance & Développement</SelectItem>
                        <SelectItem value="FINANCES">Finances</SelectItem>
                        <SelectItem value="FORMATION">Formation</SelectItem>
                        <SelectItem value="MANAGEMENT">Management</SelectItem>
                        <SelectItem value="PROJETS_THEME">Projets & Thème</SelectItem>
                        <SelectItem value="RELATIONS_EXTERIEURES">Relations Extérieures</SelectItem>
                        <SelectItem value="SECRETARIAT">Secrétariat</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/commissions')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
