import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MembershipRenewal } from '@/types/member';

const schema = z.object({
  lastName: z.string().min(2, 'Le nom est requis'),
  firstName: z.string().min(2, 'Le prénom est requis'),
  education: z.string().min(2, 'La formation est requise'),
  profession: z.string().min(2, 'La profession est requise'),
  address: z.string().min(2, "L'adresse est requise"),
  birthDate: z.string().min(2, 'La date de naissance est requise'),
  birthPlace: z.string().min(2, 'Le lieu de naissance est requis'),
  joinDate: z.string().min(2, "La date d'adhésion est requise"),
  originalChapter: z.string().min(2, "L'OLM d'adhésion est requise"),
  currentChapter: z.string().min(2, "L'OLM d'appartenance est requise"),
  duesReceiptNumber: z.string().min(2, 'Le numéro de quittance est requis'),
  permanentCommission: z.string().optional(),
  projectCommittee: z.string().optional(),
  localBoardRole: z.string().optional(),
  nationalBoardRole: z.string().optional(),
  otherRole: z.string().optional(),
  year: z.number().min(2000).max(2100),
});

interface Props {
  onSubmit: (data: MembershipRenewal) => void;
  loading?: boolean;
  initialData?: Partial<MembershipRenewal>;
}

export function MembershipRenewalForm({ onSubmit, loading, initialData }: Props) {
  const form = useForm<MembershipRenewal>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...initialData,
      year: new Date().getFullYear(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lastName"
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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénoms</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formation</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profession</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="joinDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'adhésion à la Jeune Chambre</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="originalChapter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OLM d'adhésion</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentChapter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OLM d'appartenance</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duesReceiptNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>N° Quittance de cotisation</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="permanentCommission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission Permanente</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectCommittee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comité de projet</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="localBoardRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsabilité au CDL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nationalBoardRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsabilité au CDN</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Renouveler l\'adhésion'}
        </Button>
      </form>
    </Form>
  );
}
