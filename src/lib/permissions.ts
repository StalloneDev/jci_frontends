import { useAuth } from './auth';

export enum Role {
  ADMIN = 'ADMIN',
  PRESIDENT = 'PRESIDENT',
  SECRETARY = 'SECRETARY',
  TREASURER = 'TREASURER',
  MEMBER = 'MEMBER',
}

export enum Permission {
  // Members
  VIEW_MEMBERS = 'VIEW_MEMBERS',
  CREATE_MEMBER = 'CREATE_MEMBER',
  EDIT_MEMBER = 'EDIT_MEMBER',
  DELETE_MEMBER = 'DELETE_MEMBER',

  // Commissions
  VIEW_COMMISSIONS = 'VIEW_COMMISSIONS',
  CREATE_COMMISSION = 'CREATE_COMMISSION',
  EDIT_COMMISSION = 'EDIT_COMMISSION',
  DELETE_COMMISSION = 'DELETE_COMMISSION',

  // Trainings
  VIEW_TRAININGS = 'VIEW_TRAININGS',
  CREATE_TRAINING = 'CREATE_TRAINING',
  EDIT_TRAINING = 'EDIT_TRAINING',
  DELETE_TRAINING = 'DELETE_TRAINING',
  MANAGE_TRAINING_PARTICIPANTS = 'MANAGE_TRAINING_PARTICIPANTS',

  // Meetings
  VIEW_MEETINGS = 'VIEW_MEETINGS',
  CREATE_MEETING = 'CREATE_MEETING',
  EDIT_MEETING = 'EDIT_MEETING',
  DELETE_MEETING = 'DELETE_MEETING',
  MANAGE_MEETING_PARTICIPANTS = 'MANAGE_MEETING_PARTICIPANTS',
  MANAGE_MEETING_MINUTES = 'MANAGE_MEETING_MINUTES',

  // Reports
  VIEW_REPORTS = 'VIEW_REPORTS',
  CREATE_REPORT = 'CREATE_REPORT',
  EDIT_REPORT = 'EDIT_REPORT',
  DELETE_REPORT = 'DELETE_REPORT',
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.PRESIDENT]: [
    Permission.VIEW_MEMBERS,
    Permission.CREATE_MEMBER,
    Permission.EDIT_MEMBER,
    Permission.VIEW_COMMISSIONS,
    Permission.CREATE_COMMISSION,
    Permission.EDIT_COMMISSION,
    Permission.DELETE_COMMISSION,
    Permission.VIEW_TRAININGS,
    Permission.CREATE_TRAINING,
    Permission.EDIT_TRAINING,
    Permission.MANAGE_TRAINING_PARTICIPANTS,
    Permission.VIEW_MEETINGS,
    Permission.CREATE_MEETING,
    Permission.EDIT_MEETING,
    Permission.MANAGE_MEETING_PARTICIPANTS,
    Permission.MANAGE_MEETING_MINUTES,
    Permission.VIEW_REPORTS,
    Permission.CREATE_REPORT,
  ],
  [Role.SECRETARY]: [
    Permission.VIEW_MEMBERS,
    Permission.EDIT_MEMBER,
    Permission.VIEW_COMMISSIONS,
    Permission.VIEW_TRAININGS,
    Permission.MANAGE_TRAINING_PARTICIPANTS,
    Permission.VIEW_MEETINGS,
    Permission.CREATE_MEETING,
    Permission.EDIT_MEETING,
    Permission.MANAGE_MEETING_PARTICIPANTS,
    Permission.MANAGE_MEETING_MINUTES,
    Permission.VIEW_REPORTS,
    Permission.CREATE_REPORT,
  ],
  [Role.TREASURER]: [
    Permission.VIEW_MEMBERS,
    Permission.VIEW_COMMISSIONS,
    Permission.VIEW_TRAININGS,
    Permission.VIEW_MEETINGS,
    Permission.VIEW_REPORTS,
    Permission.CREATE_REPORT,
  ],
  [Role.MEMBER]: [
    Permission.VIEW_MEMBERS,
    Permission.VIEW_COMMISSIONS,
    Permission.VIEW_TRAININGS,
    Permission.VIEW_MEETINGS,
    Permission.VIEW_REPORTS,
  ],
};

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user || !user.role) return false;
    return rolePermissions[user.role as Role]?.includes(permission) || false;
  };

  const hasRole = (role: Role): boolean => {
    return user?.role === role;
  };

  return {
    hasPermission,
    hasRole,
  };
}

interface WithPermissionProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function WithPermission({ permission, children, fallback = null }: WithPermissionProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return children;
}
