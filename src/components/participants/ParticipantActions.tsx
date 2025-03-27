import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, UserMinus, Check, X, Clock } from 'lucide-react';
import { useParticipants } from '@/hooks/useParticipants';

interface ParticipantActionsProps {
  type: 'training' | 'meeting';
  id: string;
  participant: any;
}

export function ParticipantActions({
  type,
  id,
  participant,
}: ParticipantActionsProps) {
  const { removeParticipant, updateParticipantStatus } = useParticipants();

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateParticipantStatus.mutateAsync({
        type,
        id,
        participantId: participant.id,
        status,
      });
    } catch (error) {
      console.error('Error updating participant status:', error);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir retirer ce participant ?')) {
      try {
        await removeParticipant.mutateAsync({
          type,
          id,
          participantId: participant.id,
        });
      } catch (error) {
        console.error('Error removing participant:', error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Menu actions</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {type === 'training' ? (
          <>
            <DropdownMenuItem onClick={() => handleStatusUpdate('REGISTERED')}>
              <Clock className="mr-2 h-4 w-4" />
              Marquer comme inscrit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusUpdate('CONFIRMED')}>
              <Check className="mr-2 h-4 w-4" />
              Marquer comme confirmé
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusUpdate('CANCELLED')}>
              <X className="mr-2 h-4 w-4" />
              Marquer comme annulé
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => handleStatusUpdate('PRESENT')}>
              <Check className="mr-2 h-4 w-4" />
              Marquer comme présent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusUpdate('ABSENT')}>
              <X className="mr-2 h-4 w-4" />
              Marquer comme absent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusUpdate('EXCUSED')}>
              <Clock className="mr-2 h-4 w-4" />
              Marquer comme excusé
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem
          className="text-red-600"
          onClick={handleRemove}
        >
          <UserMinus className="mr-2 h-4 w-4" />
          Retirer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
