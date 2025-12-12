export enum MembershipStatus {
  ACTIVE = 'Activo',
  EXPIRED = 'Vencido',
  PENDING = 'Pendiente',
}

export enum MembershipType {
  MONTHLY = 'Mensual',
  QUARTERLY = 'Trimestral',
  ANNUAL = 'Anual',
  VISIT = 'Visita Diaria',
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  joinDate: string; // ISO Date
  medicalConditions?: string;
  membershipType: MembershipType;
  membershipStartDate: string;
  membershipEndDate: string;
  status: MembershipStatus;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  method: 'Efectivo' | 'Tarjeta' | 'Yape/Plin';
  concept: string;
}

export interface Attendance {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: string; // ISO Date
}

export interface Routine {
  id: string;
  memberId: string;
  memberName: string;
  generatedContent: string;
  goal: string;
  createdAt: string;
}

// Navigation Types
export enum View {
  DASHBOARD = 'dashboard',
  MEMBERS = 'members',
  FINANCE = 'finance',
  ATTENDANCE = 'attendance',
  ROUTINES = 'routines',
}