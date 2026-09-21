// ============================================================
// SMARTCARE — Demo / Seed Data
// ============================================================
import { 
  Department, Doctor, Patient, Appointment, Report, 
  Prescription, Payment, Feedback, Leave, Notification,
  Shift, AuditLog
} from '../types';
import { format, subDays, addDays, subHours } from 'date-fns';

const today = new Date();
const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

// ==================== DEPARTMENTS ====================
export const demoDepartments: Department[] = [
  { id: 'dept-01', name: 'Cardiology', description: 'Heart and cardiovascular system specialists providing comprehensive cardiac care.', icon: '❤️', color: 'red', isActive: true, doctorCount: 4, createdAt: '2024-01-01' },
  { id: 'dept-02', name: 'Neurology', description: 'Expert care for brain, spine, and nervous system conditions.', icon: '🧠', color: 'purple', isActive: true, doctorCount: 3, createdAt: '2024-01-01' },
  { id: 'dept-03', name: 'Orthopedics', description: 'Specialized treatment for bones, joints, and musculoskeletal system.', icon: '🦴', color: 'blue', isActive: true, doctorCount: 5, createdAt: '2024-01-01' },
  { id: 'dept-04', name: 'Pediatrics', description: 'Comprehensive healthcare for infants, children, and adolescents.', icon: '👶', color: 'yellow', isActive: true, doctorCount: 4, createdAt: '2024-01-01' },
  { id: 'dept-05', name: 'Dermatology', description: 'Skin, hair, and nail care with advanced dermatological treatments.', icon: '✨', color: 'pink', isActive: true, doctorCount: 2, createdAt: '2024-01-01' },
  { id: 'dept-06', name: 'General Medicine', description: 'Primary care and general health consultations for all ages.', icon: '🏥', color: 'green', isActive: true, doctorCount: 6, createdAt: '2024-01-01' },
  { id: 'dept-07', name: 'Gynecology', description: "Women's health and reproductive medicine specialists.", icon: '🌸', color: 'rose', isActive: true, doctorCount: 3, createdAt: '2024-01-01' },
  { id: 'dept-08', name: 'ENT', description: 'Ear, Nose, and Throat specialists for all related conditions.', icon: '👂', color: 'amber', isActive: true, doctorCount: 2, createdAt: '2024-01-01' },
  { id: 'dept-09', name: 'Ophthalmology', description: 'Comprehensive eye care and vision correction services.', icon: '👁️', color: 'cyan', isActive: true, doctorCount: 2, createdAt: '2024-01-01' },
  { id: 'dept-10', name: 'Dentistry', description: 'Complete dental care from preventive to cosmetic procedures.', icon: '🦷', color: 'teal', isActive: true, doctorCount: 3, createdAt: '2024-01-01' },
  { id: 'dept-11', name: 'Radiology', description: 'Advanced medical imaging and diagnostic radiology services.', icon: '🔬', color: 'indigo', isActive: true, doctorCount: 2, createdAt: '2024-01-01' },
  { id: 'dept-12', name: 'Pathology', description: 'Laboratory diagnostic services and pathological analysis.', icon: '🧪', color: 'orange', isActive: true, doctorCount: 2, createdAt: '2024-01-01' },
];

// ==================== DOCTORS ====================
export const demoDoctors: Doctor[] = [
  {
    id: 'doc-01', userId: 'user-doc-01',
    name: 'Dr. Arjun Sharma', email: 'arjun.sharma@smartcare.com',
    phone: '+91 98765 43210', specialty: 'Cardiologist',
    departmentId: 'dept-01', departmentName: 'Cardiology',
    qualifications: ['MBBS', 'MD (Cardiology)', 'FACC'],
    experience: 15, rating: 4.9, reviewCount: 312,
    consultationFee: 800, bio: 'Senior interventional cardiologist with 15 years of experience in complex cardiac procedures.',
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunSharma&backgroundColor=b6e3f4`,
    isActive: true,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: {
      Monday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Tuesday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Wednesday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Thursday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Friday: { enabled: true, start: '09:00', end: '13:00', breaks: [] },
      Saturday: { enabled: false, start: '', end: '', breaks: [] },
      Sunday: { enabled: false, start: '', end: '', breaks: [] },
    },
    createdAt: '2024-01-15',
  },
  {
    id: 'doc-02', userId: 'user-doc-02',
    name: 'Dr. Priya Mehta', email: 'priya.mehta@smartcare.com',
    phone: '+91 98765 43211', specialty: 'Neurologist',
    departmentId: 'dept-02', departmentName: 'Neurology',
    qualifications: ['MBBS', 'DM (Neurology)', 'FAAN'],
    experience: 12, rating: 4.8, reviewCount: 248,
    consultationFee: 900, bio: 'Specialist in epilepsy, stroke management, and neuro-degenerative conditions.',
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaMehta&backgroundColor=d1d4f9`,
    isActive: true,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    workingHours: {
      Monday: { enabled: true, start: '10:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Tuesday: { enabled: true, start: '10:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Wednesday: { enabled: false, start: '', end: '', breaks: [] },
      Thursday: { enabled: true, start: '10:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Friday: { enabled: true, start: '10:00', end: '14:00', breaks: [] },
      Saturday: { enabled: false, start: '', end: '', breaks: [] },
      Sunday: { enabled: false, start: '', end: '', breaks: [] },
    },
    createdAt: '2024-02-01',
  },
  {
    id: 'doc-03', userId: 'user-doc-03',
    name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@smartcare.com',
    phone: '+91 98765 43212', specialty: 'Orthopedic Surgeon',
    departmentId: 'dept-03', departmentName: 'Orthopedics',
    qualifications: ['MBBS', 'MS (Ortho)', 'DNB'],
    experience: 18, rating: 4.9, reviewCount: 421,
    consultationFee: 750, bio: 'Expert in joint replacement, sports injuries, and minimally invasive orthopedic surgery.',
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshKumar&backgroundColor=c0aede`,
    isActive: true,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    workingHours: {
      Monday: { enabled: true, start: '08:00', end: '16:00', breaks: [{ start: '12:00', end: '13:00' }] },
      Tuesday: { enabled: false, start: '', end: '', breaks: [] },
      Wednesday: { enabled: true, start: '08:00', end: '16:00', breaks: [{ start: '12:00', end: '13:00' }] },
      Thursday: { enabled: false, start: '', end: '', breaks: [] },
      Friday: { enabled: true, start: '08:00', end: '12:00', breaks: [] },
      Saturday: { enabled: false, start: '', end: '', breaks: [] },
      Sunday: { enabled: false, start: '', end: '', breaks: [] },
    },
    createdAt: '2024-01-20',
  },
  {
    id: 'doc-04', userId: 'user-doc-04',
    name: 'Dr. Sunita Patel', email: 'sunita.patel@smartcare.com',
    phone: '+91 98765 43213', specialty: 'Pediatrician',
    departmentId: 'dept-04', departmentName: 'Pediatrics',
    qualifications: ['MBBS', 'DCH', 'MD (Pediatrics)'],
    experience: 10, rating: 4.7, reviewCount: 186,
    consultationFee: 600, bio: 'Caring pediatrician specializing in child development, immunization, and adolescent health.',
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=SunitaPatel&backgroundColor=ffd5dc`,
    isActive: true,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: {
      Monday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Tuesday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Wednesday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Thursday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Friday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Saturday: { enabled: true, start: '09:00', end: '13:00', breaks: [] },
      Sunday: { enabled: false, start: '', end: '', breaks: [] },
    },
    createdAt: '2024-03-01',
  },
  {
    id: 'doc-05', userId: 'user-doc-05',
    name: 'Dr. Vikram Singh', email: 'vikram.singh@smartcare.com',
    phone: '+91 98765 43214', specialty: 'Dermatologist',
    departmentId: 'dept-05', departmentName: 'Dermatology',
    qualifications: ['MBBS', 'MD (Dermatology)'],
    experience: 8, rating: 4.6, reviewCount: 134,
    consultationFee: 700, bio: 'Specialist in skin disorders, cosmetic dermatology, and hair restoration treatments.',
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=VikramSingh&backgroundColor=b6e3f4`,
    isActive: true,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    workingHours: {
      Monday: { enabled: false, start: '', end: '', breaks: [] },
      Tuesday: { enabled: true, start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
      Wednesday: { enabled: true, start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
      Thursday: { enabled: true, start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
      Friday: { enabled: false, start: '', end: '', breaks: [] },
      Saturday: { enabled: true, start: '10:00', end: '14:00', breaks: [] },
      Sunday: { enabled: false, start: '', end: '', breaks: [] },
    },
    createdAt: '2024-02-15',
  },
  {
    id: 'doc-06', userId: 'user-doc-06',
    name: 'Dr. Ananya Krishnan', email: 'ananya.krishnan@smartcare.com',
    phone: '+91 98765 43215', specialty: 'Gynecologist',
    departmentId: 'dept-07', departmentName: 'Gynecology',
    qualifications: ['MBBS', 'MD (OBG)', 'DGO'],
    experience: 14, rating: 4.9, reviewCount: 298,
    consultationFee: 850, bio: "Expert in women's reproductive health, high-risk pregnancies, and minimally invasive gynecological surgery.",
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=AnanyaKrishnan&backgroundColor=ffdfbf`,
    isActive: true,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: {
      Monday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Tuesday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Wednesday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Thursday: { enabled: true, start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      Friday: { enabled: true, start: '09:00', end: '13:00', breaks: [] },
      Saturday: { enabled: false, start: '', end: '', breaks: [] },
      Sunday: { enabled: false, start: '', end: '', breaks: [] },
    },
    createdAt: '2024-01-10',
  },
];

// ==================== DEMO PATIENT ====================
export const demoPatient: Patient = {
  id: 'pat-01', userId: 'demo-patient',
  name: 'Rahul Verma', email: 'patient@smartcare.com',
  phone: '+91 98765 11111',
  dateOfBirth: '1990-05-15',
  gender: 'male',
  bloodGroup: 'O+',
  address: 'Flat 4B, Sunrise Apartments, Bandra West, Mumbai - 400050',
  emergencyContact: { name: 'Priya Verma', phone: '+91 98765 22222', relation: 'Spouse' },
  allergies: ['Penicillin', 'Aspirin'],
  conditions: ['Mild Hypertension'],
  photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=RahulVerma&backgroundColor=b6e3f4`,
  isActive: true,
  createdAt: '2024-01-01',
};

// ==================== APPOINTMENTS ====================
export const demoAppointments: Appointment[] = [
  {
    id: 'apt-01', patientId: 'pat-01', patientName: 'Rahul Verma',
    doctorId: 'doc-01', doctorName: 'Dr. Arjun Sharma',
    departmentId: 'dept-01', departmentName: 'Cardiology',
    appointmentType: 'In-person',
    date: fmt(addDays(today, 2)), time: '10:00',
    status: 'Confirmed',
    reason: 'Annual cardiac checkup and ECG review',
    consultationFee: 800, paymentStatus: 'paid',
    createdAt: fmt(subDays(today, 5)), updatedAt: fmt(subDays(today, 5)),
  },
  {
    id: 'apt-02', patientId: 'pat-01', patientName: 'Rahul Verma',
    doctorId: 'doc-02', doctorName: 'Dr. Priya Mehta',
    departmentId: 'dept-02', departmentName: 'Neurology',
    appointmentType: 'Video Consultation',
    date: fmt(addDays(today, 7)), time: '11:30',
    status: 'Scheduled',
    reason: 'Follow-up for migraine treatment',
    consultationFee: 900, paymentStatus: 'unpaid',
    createdAt: fmt(subDays(today, 3)), updatedAt: fmt(subDays(today, 3)),
  },
  {
    id: 'apt-03', patientId: 'pat-01', patientName: 'Rahul Verma',
    doctorId: 'doc-01', doctorName: 'Dr. Arjun Sharma',
    departmentId: 'dept-01', departmentName: 'Cardiology',
    appointmentType: 'In-person',
    date: fmt(subDays(today, 30)), time: '09:30',
    status: 'Completed',
    reason: 'Chest discomfort evaluation',
    consultationFee: 800, paymentStatus: 'paid',
    createdAt: fmt(subDays(today, 35)), updatedAt: fmt(subDays(today, 29)),
  },
  {
    id: 'apt-04', patientId: 'pat-01', patientName: 'Rahul Verma',
    doctorId: 'doc-04', doctorName: 'Dr. Sunita Patel',
    departmentId: 'dept-04', departmentName: 'Pediatrics',
    appointmentType: 'In-person',
    date: fmt(subDays(today, 60)), time: '14:00',
    status: 'Completed',
    reason: 'General health checkup',
    consultationFee: 600, paymentStatus: 'paid',
    createdAt: fmt(subDays(today, 65)), updatedAt: fmt(subDays(today, 59)),
  },
  // Doctor's today appointments
  {
    id: 'apt-05', patientId: 'pat-02', patientName: 'Sneha Gupta',
    doctorId: 'doc-01', doctorName: 'Dr. Arjun Sharma',
    departmentId: 'dept-01', departmentName: 'Cardiology',
    appointmentType: 'In-person',
    date: fmt(today), time: '09:00',
    status: 'Completed',
    reason: 'Post-surgery follow-up',
    consultationFee: 800, paymentStatus: 'paid',
    createdAt: fmt(subDays(today, 7)), updatedAt: fmt(today),
  },
  {
    id: 'apt-06', patientId: 'pat-03', patientName: 'Amit Joshi',
    doctorId: 'doc-01', doctorName: 'Dr. Arjun Sharma',
    departmentId: 'dept-01', departmentName: 'Cardiology',
    appointmentType: 'In-person',
    date: fmt(today), time: '10:00',
    status: 'Patient Arrived',
    reason: 'Chest pain evaluation',
    consultationFee: 800, paymentStatus: 'unpaid',
    createdAt: fmt(subDays(today, 2)), updatedAt: fmt(today),
  },
  {
    id: 'apt-07', patientId: 'pat-04', patientName: 'Kavya Reddy',
    doctorId: 'doc-01', doctorName: 'Dr. Arjun Sharma',
    departmentId: 'dept-01', departmentName: 'Cardiology',
    appointmentType: 'Video Consultation',
    date: fmt(today), time: '11:00',
    status: 'Scheduled',
    reason: 'Hypertension monitoring',
    consultationFee: 800, paymentStatus: 'paid',
    createdAt: fmt(subDays(today, 1)), updatedAt: fmt(subDays(today, 1)),
  },
  {
    id: 'apt-08', patientId: 'pat-05', patientName: 'Mohan Das',
    doctorId: 'doc-01', doctorName: 'Dr. Arjun Sharma',
    departmentId: 'dept-01', departmentName: 'Cardiology',
    appointmentType: 'Follow-up',
    date: fmt(today), time: '14:00',
    status: 'Scheduled',
    reason: 'Medication review',
    consultationFee: 500, paymentStatus: 'unpaid',
    createdAt: fmt(subDays(today, 14)), updatedAt: fmt(subDays(today, 14)),
  },
];

// ==================== REPORTS ====================
export const demoReports: Report[] = [
  {
    id: 'rpt-01', patientId: 'pat-01', appointmentId: 'apt-03',
    name: 'Complete Blood Count (CBC)', category: 'Blood Test',
    date: fmt(subDays(today, 29)), hospital: 'SmartCare Diagnostics',
    status: 'Available', size: '245 KB',
    createdAt: fmt(subDays(today, 29)),
  },
  {
    id: 'rpt-02', patientId: 'pat-01',
    name: 'Chest X-Ray', category: 'Imaging',
    date: fmt(subDays(today, 30)), hospital: 'SmartCare Radiology',
    status: 'Available', size: '1.2 MB',
    createdAt: fmt(subDays(today, 30)),
  },
  {
    id: 'rpt-03', patientId: 'pat-01',
    name: 'Lipid Profile', category: 'Blood Test',
    date: fmt(subDays(today, 28)), hospital: 'SmartCare Diagnostics',
    status: 'Available', size: '189 KB',
    createdAt: fmt(subDays(today, 28)),
  },
  {
    id: 'rpt-04', patientId: 'pat-01',
    name: 'Full Body Health Checkup', category: 'Health Checkup',
    date: fmt(subDays(today, 60)), hospital: 'SmartCare Diagnostics',
    status: 'Available', size: '3.4 MB',
    createdAt: fmt(subDays(today, 60)),
  },
  {
    id: 'rpt-05', patientId: 'pat-01',
    name: 'ECG Report', category: 'Other',
    date: fmt(addDays(today, 2)), hospital: 'SmartCare Cardiology',
    status: 'Pending',
    createdAt: fmt(today),
  },
];

// ==================== PRESCRIPTIONS ====================
export const demoPrescriptions: Prescription[] = [
  {
    id: 'prx-01', patientId: 'pat-01', appointmentId: 'apt-03',
    doctorId: 'doc-01', doctorName: 'Dr. Arjun Sharma',
    date: fmt(subDays(today, 30)),
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning with water' },
      { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take after meals' },
    ],
    notes: 'Follow up in 1 month. Maintain low-sodium diet.',
    createdAt: fmt(subDays(today, 30)),
  },
  {
    id: 'prx-02', patientId: 'pat-01', appointmentId: 'apt-04',
    doctorId: 'doc-04', doctorName: 'Dr. Sunita Patel',
    date: fmt(subDays(today, 60)),
    medications: [
      { name: 'Vitamin D3', dosage: '60,000 IU', frequency: 'Once weekly', duration: '8 weeks', instructions: 'Take with milk' },
      { name: 'Omega-3', dosage: '1000mg', frequency: 'Twice daily', duration: '60 days', instructions: 'Take after meals' },
    ],
    notes: 'Increase physical activity. Regular sun exposure recommended.',
    createdAt: fmt(subDays(today, 60)),
  },
];

// ==================== PAYMENTS ====================
export const demoPayments: Payment[] = [
  {
    id: 'pay-01', patientId: 'pat-01', appointmentId: 'apt-01',
    invoiceId: 'INV-2024-0891', amount: 800,
    status: 'paid', method: 'upi',
    description: 'Consultation - Dr. Arjun Sharma (Cardiology)',
    date: fmt(subDays(today, 5)), createdAt: fmt(subDays(today, 5)),
  },
  {
    id: 'pay-02', patientId: 'pat-01', appointmentId: 'apt-03',
    invoiceId: 'INV-2024-0712', amount: 1650,
    status: 'paid', method: 'card',
    description: 'Consultation + CBC + Chest X-Ray - Cardiology',
    date: fmt(subDays(today, 30)), createdAt: fmt(subDays(today, 30)),
  },
  {
    id: 'pay-03', patientId: 'pat-01', appointmentId: 'apt-04',
    invoiceId: 'INV-2024-0543', amount: 600,
    status: 'paid', method: 'netbanking',
    description: 'Consultation - Dr. Sunita Patel (Pediatrics)',
    date: fmt(subDays(today, 60)), createdAt: fmt(subDays(today, 60)),
  },
  {
    id: 'pay-04', patientId: 'pat-01', appointmentId: 'apt-02',
    invoiceId: 'INV-2024-0924', amount: 900,
    status: 'pending', method: undefined,
    description: 'Video Consultation - Dr. Priya Mehta (Neurology)',
    date: fmt(addDays(today, 7)), createdAt: fmt(subDays(today, 3)),
  },
];

// ==================== FEEDBACK ====================
export const demoFeedback: Feedback[] = [
  {
    id: 'fdb-01', patientId: 'pat-01', patientName: 'Rahul Verma',
    appointmentId: 'apt-03', doctorId: 'doc-01', doctorName: 'Dr. Arjun Sharma',
    departmentId: 'dept-01',
    overallRating: 5, doctorRating: 5, hospitalRating: 4, serviceRating: 5,
    comment: 'Dr. Sharma is absolutely brilliant! He explained everything clearly and made me feel at ease. The cardiac evaluation was thorough and professional.',
    isPublic: true, createdAt: fmt(subDays(today, 28)),
  },
  {
    id: 'fdb-02', patientId: 'pat-06', patientName: 'Anita Sharma',
    appointmentId: 'apt-10', doctorId: 'doc-02', doctorName: 'Dr. Priya Mehta',
    departmentId: 'dept-02',
    overallRating: 5, doctorRating: 5, hospitalRating: 5, serviceRating: 5,
    comment: 'Dr. Mehta is exceptional. Her expertise in neurology is outstanding, and she takes time to listen to all concerns.',
    isPublic: true, createdAt: fmt(subDays(today, 20)),
  },
  {
    id: 'fdb-03', patientId: 'pat-07', patientName: 'Ravi Nair',
    appointmentId: 'apt-11', doctorId: 'doc-03', doctorName: 'Dr. Rajesh Kumar',
    departmentId: 'dept-03',
    overallRating: 4, doctorRating: 5, hospitalRating: 4, serviceRating: 4,
    comment: 'Great experience with Dr. Kumar. My knee surgery recovery is progressing well. The hospital facilities are modern.',
    isPublic: true, createdAt: fmt(subDays(today, 15)),
  },
  {
    id: 'fdb-04', patientId: 'pat-08', patientName: 'Meera Iyer',
    appointmentId: 'apt-12', doctorId: 'doc-04', doctorName: 'Dr. Sunita Patel',
    departmentId: 'dept-04',
    overallRating: 5, doctorRating: 5, hospitalRating: 5, serviceRating: 5,
    comment: 'Dr. Patel is wonderful with children. My son was scared initially but she made him comfortable immediately. Highly recommended!',
    isPublic: true, createdAt: fmt(subDays(today, 10)),
  },
];

// ==================== NOTIFICATIONS ====================
export const demoPatientNotifications: Notification[] = [
  {
    id: 'notif-p01', userId: 'demo-patient',
    title: 'Appointment Confirmed', message: 'Your appointment with Dr. Arjun Sharma on ' + fmt(addDays(today, 2)) + ' at 10:00 AM is confirmed.',
    type: 'appointment', isRead: false, createdAt: format(subHours(today, 2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: 'notif-p02', userId: 'demo-patient',
    title: 'Payment Successful', message: 'Payment of ₹800 for consultation with Dr. Arjun Sharma has been received.',
    type: 'payment', isRead: false, createdAt: format(subHours(today, 5), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: 'notif-p03', userId: 'demo-patient',
    title: 'Report Available', message: 'Your CBC Blood Test report is now available for download.',
    type: 'report', isRead: true, createdAt: fmt(subDays(today, 1)),
  },
  {
    id: 'notif-p04', userId: 'demo-patient',
    title: 'Appointment Reminder', message: 'Reminder: You have an appointment with Dr. Priya Mehta in 7 days.',
    type: 'reminder', isRead: true, createdAt: fmt(subDays(today, 2)),
  },
];

// ==================== LEAVES ====================
export const demoLeaves: Leave[] = [
  {
    id: 'lv-01', doctorId: 'doc-02', doctorName: 'Dr. Priya Mehta',
    type: 'Annual', startDate: fmt(addDays(today, 10)), endDate: fmt(addDays(today, 15)),
    reason: 'Family vacation — annual leave',
    status: 'Pending', createdAt: fmt(subDays(today, 2)),
  },
  {
    id: 'lv-02', doctorId: 'doc-03', doctorName: 'Dr. Rajesh Kumar',
    type: 'Sick', startDate: fmt(today), endDate: fmt(addDays(today, 2)),
    reason: 'Fever and flu symptoms',
    status: 'Approved', adminNote: 'Get well soon. Leave approved.',
    createdAt: fmt(subDays(today, 1)),
  },
  {
    id: 'lv-03', doctorId: 'doc-05', doctorName: 'Dr. Vikram Singh',
    type: 'Emergency', startDate: fmt(subDays(today, 3)), endDate: fmt(subDays(today, 3)),
    reason: 'Family emergency',
    status: 'Approved', adminNote: 'Emergency leave approved.',
    createdAt: fmt(subDays(today, 3)),
  },
  {
    id: 'lv-04', doctorId: 'doc-01', doctorName: 'Dr. Arjun Sharma',
    type: 'Casual', startDate: fmt(addDays(today, 20)), endDate: fmt(addDays(today, 21)),
    reason: 'Personal work',
    status: 'Rejected', adminNote: 'Too many appointments scheduled during this period.',
    createdAt: fmt(subDays(today, 5)),
  },
];

// ==================== SHIFTS ====================
export const demoShifts: Shift[] = [
  {
    id: 'shft-01', doctorId: 'doc-01', date: fmt(today),
    shiftType: 'Morning', start: '08:00', end: '14:00',
    department: 'Cardiology', isActive: true,
  },
  {
    id: 'shft-02', doctorId: 'doc-01', date: fmt(addDays(today, 1)),
    shiftType: 'Afternoon', start: '14:00', end: '20:00',
    department: 'Cardiology', isActive: false,
  },
];

// ==================== AUDIT LOGS ====================
export const demoAuditLogs: AuditLog[] = [
  {
    id: 'aud-01', userId: 'admin-01', userName: 'Admin User',
    action: 'APPROVE_LEAVE', resource: 'Leave', resourceId: 'lv-02',
    details: 'Approved sick leave for Dr. Rajesh Kumar (3 days)',
    createdAt: format(subHours(today, 3), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: 'aud-02', userId: 'admin-01', userName: 'Admin User',
    action: 'ADD_DOCTOR', resource: 'Doctor', resourceId: 'doc-06',
    details: 'Added new doctor: Dr. Ananya Krishnan (Gynecology)',
    createdAt: fmt(subDays(today, 1)),
  },
  {
    id: 'aud-03', userId: 'admin-01', userName: 'Admin User',
    action: 'UPDATE_DEPARTMENT', resource: 'Department', resourceId: 'dept-01',
    details: 'Updated Cardiology department settings',
    createdAt: fmt(subDays(today, 2)),
  },
];

// ==================== REVENUE DATA (for charts) ====================
export const monthlyRevenueData = [
  { month: 'Apr', revenue: 485000, appointments: 312 },
  { month: 'May', revenue: 521000, appointments: 334 },
  { month: 'Jun', revenue: 498000, appointments: 318 },
  { month: 'Jul', revenue: 567000, appointments: 361 },
  { month: 'Aug', revenue: 612000, appointments: 389 },
  { month: 'Sep', revenue: 589000, appointments: 375 },
];

export const departmentRevenueData = [
  { department: 'Cardiology', revenue: 182000 },
  { department: 'Orthopedics', revenue: 145000 },
  { department: 'Neurology', revenue: 98000 },
  { department: 'Gynecology', revenue: 87000 },
  { department: 'General', revenue: 76000 },
  { department: 'Others', revenue: 54000 },
];

export const patientGrowthData = [
  { month: 'Apr', patients: 89 },
  { month: 'May', patients: 102 },
  { month: 'Jun', patients: 97 },
  { month: 'Jul', patients: 118 },
  { month: 'Aug', patients: 134 },
  { month: 'Sep', patients: 128 },
];

export const appointmentTrendData = [
  { day: 'Mon', completed: 32, cancelled: 3, noShow: 2 },
  { day: 'Tue', completed: 28, cancelled: 2, noShow: 1 },
  { day: 'Wed', completed: 35, cancelled: 4, noShow: 3 },
  { day: 'Thu', completed: 30, cancelled: 2, noShow: 2 },
  { day: 'Fri', completed: 25, cancelled: 3, noShow: 1 },
  { day: 'Sat', completed: 18, cancelled: 1, noShow: 0 },
];

// Landing page testimonials
export const demoTestimonials = [
  {
    id: 't1', name: 'Priya Chandrasekaran', rating: 5, date: fmt(subDays(today, 5)),
    review: "Intercity Healthcare's AI appointment booking is phenomenal! I described my symptoms and it immediately found the right specialist with slots that worked for me. The entire process took less than 2 minutes.",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaC&backgroundColor=d1d4f9',
    department: 'Cardiology',
  },
  {
    id: 't2', name: 'Arjun Malhotra', rating: 5, date: fmt(subDays(today, 12)),
    review: 'The real-time appointment tracking is outstanding. I could see when my doctor was ready before I even left home. The digital prescriptions and reports make everything so organized.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunM&backgroundColor=b6e3f4',
    department: 'Orthopedics',
  },
  {
    id: 't3', name: 'Deepa Nair', rating: 5, date: fmt(subDays(today, 18)),
    review: "As a working mother, Intercity Healthcare has been a lifesaver. Booking appointments for my children, viewing reports, and getting video consultations — all from one place. Absolutely love it!",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DeepaN&backgroundColor=ffd5dc',
    department: 'Pediatrics',
  },
  {
    id: 't4', name: 'Suresh Bhat', rating: 4, date: fmt(subDays(today, 25)),
    review: 'The hospital management system is top-notch. Transparent billing, instant appointment confirmations, and professional doctors. Intercity Healthcare truly delivers on its promise.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SureshB&backgroundColor=c0aede',
    department: 'General Medicine',
  },
  {
    id: 't5', name: 'Lakshmi Venkatesh', rating: 5, date: fmt(subDays(today, 30)),
    review: "I was skeptical about AI appointment booking, but it understood exactly what I needed! It suggested a neurologist, found an available slot, and even reminded me the day before. Incredible!",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LakshmiV&backgroundColor=ffdfbf',
    department: 'Neurology',
  },
];

export const hospitalFAQs = [
  { q: 'How do I book an appointment?', a: 'You can book an appointment through our online portal, the Intercity Healthcare app, or by calling our reception. Our AI Appointment Booker makes it as simple as describing what you need in plain language.' },
  { q: 'Can I cancel or reschedule an appointment?', a: 'Yes, you can cancel or reschedule your appointment up to 4 hours before the scheduled time without any charges. Late cancellations may incur a nominal fee.' },
  { q: 'What types of appointments are available?', a: 'We offer In-person consultations, Video Consultations, Follow-up visits, and Emergency/Callback requests for all departments.' },
  { q: 'How do I access my medical reports?', a: 'Your medical reports are available in your Intercity Healthcare patient portal under the "Reports" section. You can download, view, and share them with other healthcare providers.' },
  { q: 'What payment methods are accepted?', a: 'We accept credit/debit cards, UPI (GPay, PhonePe, Paytm), Net Banking, and Health Insurance. Cash payments are accepted at the reception.' },
  { q: 'Are video consultations available for all doctors?', a: 'Most of our specialists offer video consultations. You can check doctor availability when booking. Video consultations are conducted through our secure, HIPAA-compliant platform.' },
  { q: 'What are the hospital working hours?', a: 'Our OPD is open Monday–Saturday from 8:00 AM to 8:00 PM. The Emergency Department operates 24/7, 365 days a year.' },
  { q: 'How do I access my patient account?', a: 'Register with your email address on the Intercity Healthcare portal. You can also log in using Google or your mobile number for quick access.' },
];
