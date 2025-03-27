export interface MemberApplication {
  // Informations générales
  lastName: string;
  firstName: string;
  education: string;
  profession: string;
  employer: string;
  address: string;
  birthDate: string;
  birthPlace: string;
  permanentContact: string;
  email: string;
  phone: string;
  fax?: string;

  // Questionnaire
  discoveryChannel: 'MEDIA' | 'FRIENDS' | 'OTHER';
  discoveryChannelOther?: string;

  expectations: {
    fellowship: boolean;
    business: boolean;
    travel: boolean;
    training: boolean;
    communityService: boolean;
    other: boolean;
    otherDetails?: string;
  };

  // Autres organisations
  belongsToOtherOrg: boolean;
  orgType?: 'NGO' | 'POLITICAL_PARTY' | 'RELIGIOUS' | 'SERVICE_CLUB' | 'OTHER';
  orgTypeOther?: string;
  hasOrgResponsibilities: boolean;
  orgResponsibilities?: {
    president: boolean;
    treasurer: boolean;
    secretary: boolean;
    vicePresident: boolean;
    other: boolean;
    otherDetails?: string;
  };

  // Connaissances JCI
  knowsProbationPeriod: boolean;
  knowsSponsorRequirement: boolean;
  sponsorName?: string;
  knowsTrainingRequirement: boolean;
  acceptsTraining: boolean;
  hasAttendedTrainings: boolean;
  attendedTrainings?: Array<{
    theme: string;
    trainer: string;
  }>;
  knowsFeesRequirement: boolean;
  acceptsFees: boolean;

  // Documents
  photos: File[];
  identityDocument: File;
}

export interface MembershipRenewal {
  lastName: string;
  firstName: string;
  education: string;
  profession: string;
  address: string;
  birthDate: string;
  birthPlace: string;
  joinDate: string;
  originalChapter: string;
  currentChapter: string;
  duesReceiptNumber: string;
  permanentCommission: string;
  projectCommittee: string;
  localBoardRole: string;
  nationalBoardRole: string;
  otherRole: string;
  year: number;
}

export enum Role {
  ADMIN = 'ADMIN',
  PRESIDENT = 'PRESIDENT',
  VICE_PRESIDENT_COMMISSIONS = 'VICE_PRESIDENT_COMMISSIONS',
  SECRETARY = 'SECRETARY',
  TREASURER = 'TREASURER',
  MEMBER = 'MEMBER',
}

export interface RoleMandate {
  role: Exclude<Role, Role.ADMIN>;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentRole: Role;
  mandates: RoleMandate[];
  status: MemberStatus;
  commissionId?: number;
  createdAt: string;
  updatedAt: string;
}

export enum MemberStatus {
  PENDING = 'PENDING',
  PROBATION = 'PROBATION',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ALUMNI = 'ALUMNI'
}
