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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from '@/components/files/FileUpload';
import { MemberApplication } from '@/types/member';

const schema = z.object({
  // Informations générales
  lastName: z.string().min(2, 'Le nom est requis'),
  firstName: z.string().min(2, 'Le prénom est requis'),
  education: z.string().min(2, 'La formation est requise'),
  profession: z.string().min(2, 'La profession est requise'),
  employer: z.string().optional(),
  address: z.string().min(2, "L'adresse est requise"),
  birthDate: z.string().min(2, 'La date de naissance est requise'),
  birthPlace: z.string().min(2, 'Le lieu de naissance est requis'),
  permanentContact: z.string().min(2, 'Le contact permanent est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Le numéro de téléphone est requis'),
  fax: z.string().optional(),

  // Questionnaire
  discoveryChannel: z.enum(['MEDIA', 'FRIENDS', 'OTHER']),
  discoveryChannelOther: z.string().optional(),

  expectations: z.object({
    fellowship: z.boolean(),
    business: z.boolean(),
    travel: z.boolean(),
    training: z.boolean(),
    communityService: z.boolean(),
    other: z.boolean(),
    otherDetails: z.string().optional(),
  }),

  belongsToOtherOrg: z.boolean(),
  orgType: z.enum(['NGO', 'POLITICAL_PARTY', 'RELIGIOUS', 'SERVICE_CLUB', 'OTHER']).optional(),
  orgTypeOther: z.string().optional(),
  hasOrgResponsibilities: z.boolean(),
  orgResponsibilities: z.object({
    president: z.boolean(),
    treasurer: z.boolean(),
    secretary: z.boolean(),
    vicePresident: z.boolean(),
    other: z.boolean(),
    otherDetails: z.string().optional(),
  }).optional(),

  knowsProbationPeriod: z.boolean(),
  knowsSponsorRequirement: z.boolean(),
  sponsorName: z.string().optional(),
  knowsTrainingRequirement: z.boolean(),
  acceptsTraining: z.boolean(),
  hasAttendedTrainings: z.boolean(),
  attendedTrainings: z.array(z.object({
    theme: z.string(),
    trainer: z.string(),
  })).optional(),
  knowsFeesRequirement: z.boolean(),
  acceptsFees: z.boolean(),

  // Documents
  photos: z.array(z.instanceof(File)).length(2, 'Deux photos sont requises'),
  identityDocument: z.instanceof(File),
});

interface Props {
  onSubmit: (data: MemberApplication) => void;
  loading?: boolean;
}

export function MemberApplicationForm({ onSubmit, loading }: Props) {
  const form = useForm<MemberApplication>({
    resolver: zodResolver(schema),
    defaultValues: {
      expectations: {
        fellowship: false,
        business: false,
        travel: false,
        training: false,
        communityService: false,
        other: false,
      },
      orgResponsibilities: {
        president: false,
        treasurer: false,
        secretary: false,
        vicePresident: false,
        other: false,
      },
      attendedTrainings: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Section A: Informations générales */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">A. Informations générales</h2>
          
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
          </div>
        </div>

        {/* Section B: Questionnaire */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">B. Questionnaire</h2>

          <FormField
            control={form.control}
            name="discoveryChannel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment avez-vous connu la Jeune Chambre ?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MEDIA">Médias</SelectItem>
                    <SelectItem value="FRIENDS">Amis</SelectItem>
                    <SelectItem value="OTHER">Autres</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Quelles sont vos attentes en venant à la Jeune Chambre ?</FormLabel>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expectations.fellowship"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Camaraderie</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectations.business"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Affaires</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Documents requis</h2>

          <FormField
            control={form.control}
            name="photos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photos d'identité (2)</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept="image/*"
                    multiple
                    maxFiles={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="identityDocument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pièce d'identité</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept=".pdf,image/*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Soumettre la candidature'}
        </Button>
      </form>
    </Form>
  );
}
