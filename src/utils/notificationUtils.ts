import { addDays, isPast, isWithinInterval } from 'date-fns';
import { RoleMandate } from '@/types/member';

export interface MandateNotification {
  type: 'WARNING' | 'INFO';
  message: string;
  mandateId: number;
}

/**
 * Vérifie les mandats qui vont bientôt expirer
 * @param mandates Liste des mandats
 * @param daysBeforeWarning Nombre de jours avant l'expiration pour notifier
 */
export const checkExpiringMandates = (
  mandates: RoleMandate[],
  daysBeforeWarning = 30
): MandateNotification[] => {
  const today = new Date();
  const notifications: MandateNotification[] = [];

  mandates.forEach(mandate => {
    if (!mandate.isActive) return;

    const endDate = new Date(mandate.endDate);
    const warningDate = addDays(today, daysBeforeWarning);

    if (isPast(endDate)) {
      notifications.push({
        type: 'WARNING',
        message: `Le mandat de ${mandate.role} est expiré`,
        mandateId: mandate.id
      });
    } else if (isWithinInterval(endDate, { start: today, end: warningDate })) {
      const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      notifications.push({
        type: 'INFO',
        message: `Le mandat de ${mandate.role} expire dans ${daysLeft} jours`,
        mandateId: mandate.id
      });
    }
  });

  return notifications;
};

/**
 * Vérifie les chevauchements de mandats
 */
export const checkMandateOverlaps = (mandates: RoleMandate[]): MandateNotification[] => {
  const notifications: MandateNotification[] = [];
  const activeMandates = mandates.filter(m => m.isActive);

  for (let i = 0; i < activeMandates.length; i++) {
    for (let j = i + 1; j < activeMandates.length; j++) {
      const mandate1 = activeMandates[i];
      const mandate2 = activeMandates[j];

      if (mandate1.role === mandate2.role) {
        const start1 = new Date(mandate1.startDate);
        const end1 = new Date(mandate1.endDate);
        const start2 = new Date(mandate2.startDate);
        const end2 = new Date(mandate2.endDate);

        if (
          isWithinInterval(start1, { start: start2, end: end2 }) ||
          isWithinInterval(end1, { start: start2, end: end2 }) ||
          isWithinInterval(start2, { start: start1, end: end1 }) ||
          isWithinInterval(end2, { start: start1, end: end1 })
        ) {
          notifications.push({
            type: 'WARNING',
            message: `Chevauchement détecté pour le rôle ${mandate1.role}`,
            mandateId: mandate1.id
          });
        }
      }
    }
  }

  return notifications;
};
