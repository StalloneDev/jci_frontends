import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Role } from '@/types/member';
import { useMandates } from '@/hooks/useMandates';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import { exportMandatesToExcel, exportMandatesToPDF } from '@/utils/exportUtils';
import { checkExpiringMandates, checkMandateOverlaps } from '@/utils/notificationUtils';
import { useToast } from '@/components/ui/use-toast';
import { useMember } from '@/hooks/useMember';
import { MandateTimeline } from './MandateTimeline';
import { MandateStats } from './MandateStats';
import { AdvancedFilters } from './AdvancedFilters';
import { isWithinInterval } from 'date-fns';

const mandateSchema = z.object({
  role: z.nativeEnum(Role),
  startDate: z.string(),
  endDate: z.string(),
});

interface MemberMandatesProps {
  memberId: number;
}

/**
 * Composant pour afficher et gérer les mandats d'un membre.
 * Permet d'ajouter, modifier et visualiser l'historique des mandats.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {number} props.memberId - L'identifiant du membre
 * 
 * @example
 * ```tsx
 * <MemberMandates memberId={1} />
 * ```
 */
export function MemberMandates({ memberId }: MemberMandatesProps) {
  const { mandates, isLoading, error, addMandate, updateMandate } = useMandates({
    memberId,
  });
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const member = useMember(memberId);
  const [filterOptions, setFilterOptions] = useState({
    search: '',
    status: 'all',
    dateRange: { from: null, to: null },
  });

  // Vérifier les notifications au chargement et lors des changements
  useEffect(() => {
    if (!mandates || !member?.data) return;

    const expiringNotifications = checkExpiringMandates(mandates);
    const overlapNotifications = checkMandateOverlaps(mandates);

    [...expiringNotifications, ...overlapNotifications].forEach(notification => {
      toast({
        title: notification.type === 'WARNING' ? 'Attention' : 'Information',
        description: notification.message,
        variant: notification.type === 'WARNING' ? 'destructive' : 'default',
      });
    });
  }, [mandates, member?.data, toast]);

  const form = useForm({
    resolver: zodResolver(mandateSchema),
    defaultValues: {
      role: Role.MEMBER,
      startDate: '',
      endDate: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof mandateSchema>) => {
    await addMandate.mutateAsync(values);
    form.reset();
  };

  const handleUpdateMandate = async (mandateId: number, isActive: boolean) => {
    await updateMandate.mutateAsync({
      mandateId,
      data: { isActive },
    });
  };

  const handleExportExcel = () => {
    if (!mandates || !member?.data) return;
    exportMandatesToExcel(mandates, member.data.firstName + ' ' + member.data.lastName);
  };

  const handleExportPDF = () => {
    if (!mandates || !member?.data) return;
    exportMandatesToPDF(mandates, member.data.firstName + ' ' + member.data.lastName);
  };

  // Filtrer les mandats
  const filteredMandates = useMemo(() => {
    if (!mandates) return [];
    
    return mandates.filter(mandate => {
      // Filtre par recherche
      const searchMatch = mandate.role.toLowerCase().includes(filterOptions.search.toLowerCase());
      
      // Filtre par statut
      const statusMatch = filterOptions.status === 'all' 
        ? true 
        : filterOptions.status === 'active' 
          ? mandate.isActive 
          : !mandate.isActive;
      
      // Filtre par date
      const dateMatch = !filterOptions.dateRange.from || !filterOptions.dateRange.to
        ? true
        : isWithinInterval(new Date(mandate.startDate), {
            start: filterOptions.dateRange.from,
            end: filterOptions.dateRange.to,
          });
      
      return searchMatch && statusMatch && dateMatch;
    });
  }, [mandates, filterOptions]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const roleLabels: Record<Role, string> = {
    [Role.ADMIN]: 'Administrateur',
    [Role.PRESIDENT]: 'Président',
    [Role.VICE_PRESIDENT_COMMISSIONS]: 'Vice-président Commissions',
    [Role.SECRETARY]: 'Secrétaire',
    [Role.TREASURER]: 'Trésorier',
    [Role.MEMBER]: 'Membre',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-4 mb-4">
        <Button
          variant="outline"
          onClick={handleExportExcel}
          disabled={isLoading || !mandates}
        >
          Exporter Excel
        </Button>
        <Button
          variant="outline"
          onClick={handleExportPDF}
          disabled={isLoading || !mandates}
        >
          Exporter PDF
        </Button>
        <Button onClick={() => setShowDialog(true)}>
          Nouveau mandat
        </Button>
      </div>

      <AdvancedFilters
        options={filterOptions}
        onFilterChange={setFilterOptions}
      />

      <div className="grid grid-cols-1 gap-6">
        <MandateTimeline mandates={filteredMandates} />
        <MandateStats mandates={filteredMandates} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredMandates.map((mandate) => (
          <Card key={mandate.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{roleLabels[mandate.role]}</h3>
                <p className="text-sm text-gray-500">
                  Du {format(new Date(mandate.startDate), 'PPP', { locale: fr })}
                  {' au '}
                  {format(new Date(mandate.endDate), 'PPP', { locale: fr })}
                </p>
              </div>
              <Button
                variant={mandate.isActive ? 'default' : 'outline'}
                onClick={() =>
                  handleUpdateMandate(mandate.id, !mandate.isActive)
                }
              >
                {mandate.isActive ? 'Actif' : 'Inactif'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          {showDialog && (
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nouveau mandat
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un mandat</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(roleLabels)
                          .filter(([role]) => role !== Role.ADMIN)
                          .map(([role, label]) => (
                            <SelectItem key={role} value={role}>
                              {label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          type="date"
                          {...field}
                          className="w-full"
                        />
                        <CalendarIcon className="ml-2 h-4 w-4 text-gray-500" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          type="date"
                          {...field}
                          className="w-full"
                        />
                        <CalendarIcon className="ml-2 h-4 w-4 text-gray-500" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Ajouter
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
