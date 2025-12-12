import { Member, Payment, Attendance, Routine, MembershipStatus, MembershipType } from '../types';

/**
 * NOTE: In a production environment, this file would interact with Firebase Firestore.
 * For this demo, we use LocalStorage to persist data so the user can test the app immediately
 * without needing to configure Firebase API keys.
 */

const STORAGE_KEYS = {
  MEMBERS: 'crossx_members',
  PAYMENTS: 'crossx_payments',
  ATTENDANCE: 'crossx_attendance',
  ROUTINES: 'crossx_routines',
};

// Seed data if empty
const seedData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const pastMonth = new Date(today);
    pastMonth.setMonth(today.getMonth() - 1);

    const initialMembers: Member[] = [
      {
        id: '1',
        firstName: 'Juan',
        lastName: 'Perez',
        dni: '12345678',
        email: 'juan@example.com',
        phone: '999888777',
        joinDate: pastMonth.toISOString(),
        membershipType: MembershipType.MONTHLY,
        membershipStartDate: pastMonth.toISOString(),
        membershipEndDate: nextMonth.toISOString(),
        status: MembershipStatus.ACTIVE,
        medicalConditions: 'Ninguna',
      },
      {
        id: '2',
        firstName: 'Maria',
        lastName: 'Gomez',
        dni: '87654321',
        email: 'maria@example.com',
        phone: '999111222',
        joinDate: pastMonth.toISOString(),
        membershipType: MembershipType.MONTHLY,
        membershipStartDate: pastMonth.toISOString(),
        membershipEndDate: pastMonth.toISOString(), // Expired
        status: MembershipStatus.EXPIRED,
        medicalConditions: 'Asma leve',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(initialMembers));
  }
};

seedData();

// --- Members ---

export const getMembers = (): Member[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
  return data ? JSON.parse(data) : [];
};

export const addMember = (member: Omit<Member, 'id'>): Member => {
  const members = getMembers();
  const newMember: Member = { ...member, id: crypto.randomUUID() };
  members.push(newMember);
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  return newMember;
};

export const updateMember = (updatedMember: Member): void => {
  const members = getMembers();
  const index = members.findIndex((m) => m.id === updatedMember.id);
  if (index !== -1) {
    members[index] = updatedMember;
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }
};

export const deleteMember = (id: string): void => {
  const members = getMembers().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
};

// --- Payments ---

export const getPayments = (): Payment[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
  return data ? JSON.parse(data) : [];
};

export const addPayment = (payment: Omit<Payment, 'id'>): Payment => {
  const payments = getPayments();
  const newPayment: Payment = { ...payment, id: crypto.randomUUID() };
  payments.push(newPayment);
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  return newPayment;
};

// --- Attendance ---

export const getAttendance = (): Attendance[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  return data ? JSON.parse(data) : [];
};

export const recordAttendance = (memberId: string, memberName: string): Attendance => {
  const records = getAttendance();
  const newRecord: Attendance = {
    id: crypto.randomUUID(),
    memberId,
    memberName,
    checkInTime: new Date().toISOString(),
  };
  records.push(newRecord);
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  return newRecord;
};

// --- Routines ---

export const getRoutines = (): Routine[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
  return data ? JSON.parse(data) : [];
};

export const saveRoutine = (routine: Omit<Routine, 'id' | 'createdAt'>): Routine => {
  const routines = getRoutines();
  const newRoutine: Routine = {
    ...routine,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  routines.push(newRoutine);
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  return newRoutine;
};
