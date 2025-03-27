export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  education?: string;
  profession?: string;
  employer?: string;
  address?: string;
  birthDate?: Date;
  birthPlace?: string;
  email: string;
  phone?: string;
  fax?: string;
  permanentContact?: string;
  membershipDate?: Date;
  membershipStatus: 'PROBATION' | 'ACTIVE' | 'INACTIVE' | 'ALUMNI';
  olmAdhesion?: string;
  olmAppartenance?: string;
  receiptNumber?: string;
  discoveryChannel?: 'MEDIA' | 'FRIENDS' | 'OTHER';
  discoveryDetails?: string;
  expectations: string[];
  otherExpectations?: string;
  otherOrganizations: boolean;
  organizationType?: 'ONG' | 'POLITICAL_PARTY' | 'RELIGIOUS' | 'SERVICE_CLUB' | 'OTHER';
  organizationRole?: string;
  organizationName?: string;
  skills: string[];
  interests: string[];
  availability: 'WEEKDAY' | 'WEEKEND' | 'BOTH';
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Commission {
  id: string;
  name: string;
  type: 'AFFAIRES_ENTREPRENEURIAT' | 'COMMUNICATION_MARKETING' | 'CROISSANCE_DEVELOPPEMENT' | 'FINANCES' | 'FORMATION' | 'MANAGEMENT' | 'PROJETS_THEME' | 'RELATIONS_EXTERIEURES' | 'SECRETARIAT';
  description: string;
  objectives: string[];
  activities: string[];
  status: 'ACTIVE' | 'INACTIVE';
  members?: Member[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  agenda?: string;
  minutes?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  meetingType: 'REGULAR' | 'EXTRAORDINARY' | 'EMERGENCY';
  commissionId: string;
  commission?: Commission;
  createdBy: string;
  creator?: Member;
  participants?: Member[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
  commissionId: number;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  status: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
  type: 'INTERNAL' | 'EXTERNAL';
  materials: string[];
  objectives: string[];
  price: number;
  currentParticipants: number;
  maxParticipants: number;
}

export interface CommissionHistory {
  id: string;
  commissionId: string;
  memberId: string;
  role: 'PRESIDENT' | 'VICE_PRESIDENT' | 'SECRETARY' | 'MEMBER';
  startDate: Date;
  endDate?: Date;
  status: 'ACTIVE' | 'INACTIVE';
  achievements: string[];
  notes?: string;
  commission?: Commission;
  member?: Member;
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id: number;
  title: string;
  description: string;
  type: 'ACTIVITY' | 'MEETING' | 'TRAINING' | 'FINANCIAL';
  content: string;
  attachments?: File[];
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  author: string;
  createdAt: string;
}

export interface Export {
  id: number;
  type: 'MEMBERS' | 'TRAININGS' | 'COMMISSIONS' | 'MEETINGS';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  fileName: string;
  createdAt: string;
}
