// ============================================================
// SMARTCARE — Core TypeScript Types
// ============================================================

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  allergies?: string[];
  conditions?: string[];
  photoURL?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  departmentId: string;
  departmentName: string;
  qualifications: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  photoURL?: string;
  bio?: string;
  isActive: boolean;
  availableDays: string[];
  workingHours: WorkingHours;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  doctorCount: number;
  headDoctor?: string;
  createdAt: string;
}

export type AppointmentStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Patient Arrived'
  | 'Consultation Started'
  | 'Completed'
  | 'Patient Did Not Arrive'
  | 'Cancelled'
  | 'Rescheduled';

export type AppointmentType = 'In-person' | 'Video Consultation' | 'Follow-up' | 'Emergency/Callback';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  appointmentType: AppointmentType;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
  reason?: string;
  symptoms?: string;
  notes?: string;
  consultationFee: number;
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface WorkingHours {
  [day: string]: {
    enabled: boolean;
    start: string;
    end: string;
    breaks: { start: string; end: string }[];
  };
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  date: string;
  slots: TimeSlot[];
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  appointmentId?: string;
  doctorId?: string;
  doctorName?: string;
  type: 'diagnosis' | 'prescription' | 'report' | 'procedure' | 'note';
  title: string;
  content: string;
  date: string;
  attachments?: string[];
  createdAt: string;
}

export interface Report {
  id: string;
  patientId: string;
  appointmentId?: string;
  name: string;
  category: 'Blood Test' | 'Imaging' | 'Health Checkup' | 'Pathology' | 'Other';
  date: string;
  hospital: string;
  status: 'Available' | 'Pending' | 'Processing';
  fileUrl?: string;
  size?: string;
  createdAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  appointmentId?: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  patientId: string;
  appointmentId?: string;
  invoiceId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  method?: 'card' | 'upi' | 'netbanking' | 'cash' | 'insurance';
  description: string;
  date: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  overallRating: number;
  doctorRating: number;
  hospitalRating: number;
  serviceRating: number;
  comment: string;
  isPublic: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'payment' | 'report' | 'reminder' | 'system' | 'leave' | 'feedback';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface Leave {
  id: string;
  doctorId: string;
  doctorName: string;
  type: 'Annual' | 'Sick' | 'Emergency' | 'Casual' | 'Maternity' | 'Other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNote?: string;
  createdAt: string;
}

export interface Shift {
  id: string;
  doctorId: string;
  date: string;
  shiftType: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  start: string;
  end: string;
  department: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ip?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface HospitalSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  website?: string;
  workingHours: string;
  logo?: string;
  yearEstablished: number;
  bedCount: number;
  doctorCount: number;
  patientCount: number;
}
