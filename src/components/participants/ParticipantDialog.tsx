import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
} from '@/components/ui/Form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useMembers } from '@/hooks/useMembers';

const participantSchema = z.object({
  memberId: z.string().min(1, 'Veuillez sélectionner un membre'),
  role: z.string().optional(),
  status: z.string(),
});

interface ParticipantDialogProps {
  type: 'training' | 'meeting';
  onAdd: (data: any) => Promise<void>;
  trigger?: React.ReactNode;
}

export function ParticipantDialog({ type, onAdd, trigger }: ParticipantDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { members, fetchMembers } = useMembers();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof participantSchema>>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      status: type === 'training' ? 'REGISTERED' : 'PENDING',
    },
  });

  React.useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const onSubmit = async (values: z.infer<typeof participantSchema>) => {
    try {
      setLoading(true);
      await onAdd(values);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error adding participant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Ajouter un participant</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un participant</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un membre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === 'meeting' && (
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
                        <SelectItem value="ORGANIZER">Organisateur</SelectItem>
                        <SelectItem value="SECRETARY">Secrétaire</SelectItem>
                        <SelectItem value="MEMBER">Membre</SelectItem>
                        <SelectItem value="GUEST">Invité</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                      {type === 'training' ? (
                        <>
                          <SelectItem value="REGISTERED">Inscrit</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmé</SelectItem>
                          <SelectItem value="CANCELLED">Annulé</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="PENDING">En attente</SelectItem>
                          <SelectItem value="PRESENT">Présent</SelectItem>
                          <SelectItem value="ABSENT">Absent</SelectItem>
                          <SelectItem value="EXCUSED">Excusé</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Ajout...' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
