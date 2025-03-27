import {
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

export const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: HomeIcon },
  { name: 'Membres', href: '/members', icon: UsersIcon },
  { name: 'Formations', href: '/trainings', icon: AcademicCapIcon },
  { name: 'Commissions', href: '/commissions', icon: ClipboardDocumentListIcon },
  { name: 'Réunions', href: '/meetings', icon: CalendarIcon },
];
