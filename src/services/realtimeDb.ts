import { 
  collection, doc, onSnapshot, setDoc, updateDoc, getDocs, 
  query, where, orderBy, Timestamp, addDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Appointment, AppointmentStatus, Leave, AuditLog, Notification, Doctor } from '@/types';
import { demoAppointments, demoDoctors, demoLeaves } from '@/data/demo';

// Safe firestore call with timeout to prevent hanging when Firestore API is disabled in GCP
function withTimeout<T>(promise: Promise<T>, timeoutMs = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), timeoutMs))
  ]);
}

export interface RealtimeNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'info' | 'success' | 'alert' | 'feedback';
  read: boolean;
  createdAt: string;
}

// Global cross-window sync channel
const SYNC_CHANNEL_NAME = 'smartcare_realtime_mesh';
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel(SYNC_CHANNEL_NAME)
  : null;

// Local persistent keys
const STORAGE_KEYS = {
  APPOINTMENTS: 'smartcare_db_appointments',
  LEAVES: 'smartcare_db_leaves',
  NOTIFICATIONS: 'smartcare_db_notifications',
  AUDIT_LOGS: 'smartcare_db_audit_logs',
  DOCTORS: 'smartcare_db_doctors',
};

// Helper: load initial seed or stored cache
function getStoredOrSeed<T>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return seed;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

function saveStore<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

// In-Memory cache
let appointmentsCache: Appointment[] = getStoredOrSeed(STORAGE_KEYS.APPOINTMENTS, demoAppointments);
let leavesCache: Leave[] = getStoredOrSeed(STORAGE_KEYS.LEAVES, demoLeaves);
let notificationsCache: RealtimeNotification[] = getStoredOrSeed(STORAGE_KEYS.NOTIFICATIONS, [
  {
    id: 'notif-1',
    userId: 'demo-patient',
    title: 'Consultation Confirmed',
    message: 'Your visit with Dr. Sarah Jenkins is scheduled for tomorrow at 10:30 AM.',
    type: 'appointment',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'demo-doctor',
    title: 'New Patient Scheduled',
    message: 'Rahul Verma has booked a consultation for tomorrow at 10:30 AM.',
    type: 'appointment',
    read: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'demo-admin',
    title: 'Pending Leave Request',
    message: 'Dr. Arjun Sharma submitted an annual leave request.',
    type: 'alert',
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  }
]);
let auditLogsCache: AuditLog[] = getStoredOrSeed(STORAGE_KEYS.AUDIT_LOGS, [
  {
    id: 'audit-1',
    userId: 'system',
    userName: 'SmartCare Core',
    action: 'SYSTEM_BOOT',
    resource: 'System',
    details: 'Realtime clinical event bus initialized',
    createdAt: new Date().toISOString(),
  }
]);

// Listener registries for subscription callbacks
const appointmentListeners = new Set<() => void>();
const leaveListeners = new Set<() => void>();
const notificationListeners = new Set<() => void>();
const auditListeners = new Set<() => void>();

function notifyAppointmentListeners() {
  saveStore(STORAGE_KEYS.APPOINTMENTS, appointmentsCache);
  appointmentListeners.forEach(cb => cb());
}

function notifyLeaveListeners() {
  saveStore(STORAGE_KEYS.LEAVES, leavesCache);
  leaveListeners.forEach(cb => cb());
}

function notifyNotificationListeners() {
  saveStore(STORAGE_KEYS.NOTIFICATIONS, notificationsCache);
  notificationListeners.forEach(cb => cb());
}

function notifyAuditListeners() {
  saveStore(STORAGE_KEYS.AUDIT_LOGS, auditLogsCache);
  auditListeners.forEach(cb => cb());
}

// Listen to broadcast messages from other tabs/windows
if (syncChannel) {
  syncChannel.onmessage = (event) => {
    const { type, payload } = event.data || {};
    if (type === 'APPOINTMENT_UPDATED') {
      appointmentsCache = getStoredOrSeed(STORAGE_KEYS.APPOINTMENTS, demoAppointments);
      appointmentListeners.forEach(cb => cb());
    } else if (type === 'LEAVE_UPDATED') {
      leavesCache = getStoredOrSeed(STORAGE_KEYS.LEAVES, demoLeaves);
      leaveListeners.forEach(cb => cb());
    } else if (type === 'NOTIFICATION_UPDATED') {
      notificationsCache = getStoredOrSeed(STORAGE_KEYS.NOTIFICATIONS, []);
      notificationListeners.forEach(cb => cb());
    } else if (type === 'AUDIT_UPDATED') {
      auditLogsCache = getStoredOrSeed(STORAGE_KEYS.AUDIT_LOGS, []);
      auditListeners.forEach(cb => cb());
    }
  };
}

function broadcastEvent(type: string, payload?: unknown) {
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type, payload });
    } catch {
      // ignore
    }
  }
}

// -----------------------------------------------------------------------------
// 1. APPOINTMENT REALTIME SERVICES
// -----------------------------------------------------------------------------

export function subscribeToAppointments(
  filter: { doctorId?: string; patientId?: string; date?: string },
  callback: (appointments: Appointment[]) => void
): () => void {
  const getFiltered = () => {
    return appointmentsCache.filter(app => {
      if (filter.doctorId && app.doctorId !== filter.doctorId) return false;
      if (filter.patientId && app.patientId !== filter.patientId) return false;
      if (filter.date && app.date !== filter.date) return false;
      return true;
    });
  };

  // Immediate first emission
  callback(getFiltered());

  // Listener for subsequent updates
  const listener = () => {
    callback(getFiltered());
  };

  appointmentListeners.add(listener);

  // Firestore remote subscription (attempt)
  let firestoreUnsub: (() => void) | null = null;
  try {
    const q = collection(db, 'appointments');
    firestoreUnsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const remoteList: Appointment[] = [];
        snap.forEach(docSnap => {
          remoteList.push({ id: docSnap.id, ...(docSnap.data() as Omit<Appointment, 'id'>) });
        });
        if (remoteList.length > 0) {
          appointmentsCache = remoteList;
          notifyAppointmentListeners();
        }
      }
    }, () => {
      // Offline fallback: keep using local cache
    });
  } catch {
    // offline
  }

  return () => {
    appointmentListeners.delete(listener);
    if (firestoreUnsub) firestoreUnsub();
  };
}

export function isSlotBooked(doctorId: string, date: string, time: string): boolean {
  return appointmentsCache.some(app => 
    app.doctorId === doctorId && 
    app.date === date && 
    app.time === time && 
    app.status !== 'Cancelled' && 
    app.status !== 'Patient Did Not Arrive'
  );
}

export async function createAppointment(
  data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Appointment> {
  // Prevent duplicate bookings / race conditions
  if (isSlotBooked(data.doctorId, data.date, data.time)) {
    throw new Error(`This time slot (${data.time}) is already reserved with Dr. ${data.doctorName}. Please select another slot.`);
  }

  const newId = (data as any).id || `apt-${Date.now()}`;
  const now = new Date().toISOString();
  const newAppointment: Appointment = {
    ...data,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };

  // 1. Update local cache
  appointmentsCache = [newAppointment, ...appointmentsCache];
  notifyAppointmentListeners();
  broadcastEvent('APPOINTMENT_UPDATED', newAppointment);

  // 2. Write to Cloud Firestore (background with timeout)
  try {
    await withTimeout(setDoc(doc(db, 'appointments', newId), newAppointment), 1000);
  } catch {
    // Offline / unconfigured GCP mode
  }

  // 3. Trigger Realtime Notification for Doctor
  await createNotification(data.doctorId, {
    title: 'New Consultation Booked',
    message: `${data.patientName} scheduled a visit for ${data.date} at ${data.time}.`,
    type: 'appointment',
  });

  // 4. Trigger Realtime Notification for Patient
  await createNotification(data.patientId, {
    title: 'Appointment Confirmed',
    message: `Your appointment with Dr. ${data.doctorName} is confirmed for ${data.date} at ${data.time}.`,
    type: 'success',
  });

  // 5. Append to Audit Trail
  await logAuditEvent(
    'CREATE_APPOINTMENT',
    'Appointment',
    `Created appointment for ${data.patientName} with Dr. ${data.doctorName} (${data.date} ${data.time})`,
    { uid: data.patientId, displayName: data.patientName, role: 'patient' }
  );

  return newAppointment;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
  note?: string
): Promise<void> {
  let updatedApp: Appointment | null = null;
  const now = new Date().toISOString();

  appointmentsCache = appointmentsCache.map(app => {
    if (app.id === appointmentId) {
      updatedApp = {
        ...app,
        status,
        notes: note || app.notes,
        updatedAt: now,
      };
      return updatedApp;
    }
    return app;
  });

  notifyAppointmentListeners();
  broadcastEvent('APPOINTMENT_UPDATED', { appointmentId, status });

  // Cloud Firestore update
  try {
    await withTimeout(updateDoc(doc(db, 'appointments', appointmentId), {
      status,
      ...(note ? { notes: note } : {}),
      updatedAt: now,
    }), 1000);
  } catch {
    // Offline
  }

  if (updatedApp) {
    const target = updatedApp as Appointment;
    // Dispatch notification to patient about status progression
    await createNotification(target.patientId, {
      title: `Appointment ${status}`,
      message: `Your consultation status with Dr. ${target.doctorName} is now "${status}".`,
      type: status === 'Completed' ? 'success' : 'info',
    });

    await logAuditEvent(
      'UPDATE_APPOINTMENT_STATUS',
      'Appointment',
      `Changed status of appointment ${appointmentId} to "${status}"`,
      { uid: target.doctorId, displayName: `Dr. ${target.doctorName}`, role: 'doctor' }
    );
  }
}

// -----------------------------------------------------------------------------
// 2. DOCTOR AVAILABILITY & LEAVE REALTIME SUBSCRIPTIONS
// -----------------------------------------------------------------------------

export function subscribeToLeaves(
  callback: (leaves: Leave[]) => void
): () => void {
  callback(leavesCache);
  const listener = () => callback([...leavesCache]);
  leaveListeners.add(listener);

  // Firestore attempt
  let firestoreUnsub: (() => void) | null = null;
  try {
    firestoreUnsub = onSnapshot(collection(db, 'leaves'), (snap) => {
      if (!snap.empty) {
        const list: Leave[] = [];
        snap.forEach(d => list.push({ id: d.id, ...(d.data() as Omit<Leave, 'id'>) }));
        leavesCache = list;
        notifyLeaveListeners();
      }
    }, () => {});
  } catch {
    // offline
  }

  return () => {
    leaveListeners.delete(listener);
    if (firestoreUnsub) firestoreUnsub();
  };
}

export async function submitLeaveRequest(
  data: Omit<Leave, 'id' | 'createdAt'>
): Promise<Leave> {
  const newId = `leave-${Date.now()}`;
  const now = new Date().toISOString();
  const newLeave: Leave = {
    ...data,
    id: newId,
    createdAt: now,
  };

  leavesCache = [newLeave, ...leavesCache];
  notifyLeaveListeners();
  broadcastEvent('LEAVE_UPDATED', newLeave);

  try {
    await withTimeout(setDoc(doc(db, 'leaves', newId), newLeave), 1000);
  } catch {
    // offline
  }

  // Notify Admin
  await createNotification('demo-admin', {
    title: 'Staff Leave Requested',
    message: `${data.doctorName} submitted an ${data.type} leave request (${data.startDate} to ${data.endDate}).`,
    type: 'alert',
  });

  await logAuditEvent(
    'SUBMIT_LEAVE',
    'Leave',
    `Dr. ${data.doctorName} requested ${data.type} leave from ${data.startDate} to ${data.endDate}`,
    { uid: data.doctorId, displayName: data.doctorName, role: 'doctor' }
  );

  return newLeave;
}

export async function approveLeaveRequest(
  leaveId: string,
  status: 'Approved' | 'Rejected',
  adminNote?: string
): Promise<void> {
  let targetLeave: Leave | null = null;

  leavesCache = leavesCache.map(l => {
    if (l.id === leaveId) {
      targetLeave = { ...l, status, adminNote };
      return targetLeave;
    }
    return l;
  });

  notifyLeaveListeners();
  broadcastEvent('LEAVE_UPDATED', { leaveId, status });

  try {
    await withTimeout(updateDoc(doc(db, 'leaves', leaveId), {
      status,
      ...(adminNote ? { adminNote } : {}),
    }), 1000);
  } catch {
    // offline
  }

  if (targetLeave) {
    const leave = targetLeave as Leave;
    // Notify Doctor in real time
    await createNotification(leave.doctorId, {
      title: `Leave Request ${status}`,
      message: `Your leave request from ${leave.startDate} to ${leave.endDate} has been ${status.toLowerCase()} by administration.`,
      type: status === 'Approved' ? 'success' : 'alert',
    });

    await logAuditEvent(
      'APPROVE_LEAVE',
      'Leave',
      `Admin marked leave ${leaveId} as "${status}" for Dr. ${leave.doctorName}`,
      { uid: 'demo-admin', displayName: 'Administrator', role: 'admin' }
    );
  }
}

// Check doctor availability on specific date (blocks if doctor has approved leave)
export function isDoctorAvailableOnDate(doctorId: string, dateStr: string): boolean {
  const targetDate = new Date(dateStr).getTime();
  const hasApprovedLeave = leavesCache.some(l => {
    if (l.doctorId !== doctorId || l.status !== 'Approved') return false;
    const start = new Date(l.startDate).getTime();
    const end = new Date(l.endDate).getTime();
    return targetDate >= start && targetDate <= end;
  });

  return !hasApprovedLeave;
}

// -----------------------------------------------------------------------------
// 3. REALTIME NOTIFICATIONS
// -----------------------------------------------------------------------------

export function subscribeToNotifications(
  userId: string,
  callback: (notifications: RealtimeNotification[]) => void
): () => void {
  const getFiltered = () => {
    return notificationsCache.filter(n => n.userId === userId || n.userId === 'all');
  };

  callback(getFiltered());
  const listener = () => callback(getFiltered());
  notificationListeners.add(listener);

  let firestoreUnsub: (() => void) | null = null;
  try {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId));
    firestoreUnsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list: RealtimeNotification[] = [];
        snap.forEach(d => list.push({ id: d.id, ...(d.data() as Omit<RealtimeNotification, 'id'>) }));
        // Merge with local
        notificationsCache = [...list, ...notificationsCache.filter(n => n.userId !== userId)];
        notifyNotificationListeners();
      }
    }, () => {});
  } catch {
    // offline
  }

  return () => {
    notificationListeners.delete(listener);
    if (firestoreUnsub) firestoreUnsub();
  };
}

export async function createNotification(
  userId: string,
  data: { title: string; message: string; type: 'appointment' | 'info' | 'success' | 'alert' | 'feedback' }
): Promise<void> {
  const newNotif: RealtimeNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    title: data.title,
    message: data.message,
    type: data.type,
    read: false,
    createdAt: new Date().toISOString(),
  };

  notificationsCache = [newNotif, ...notificationsCache];
  notifyNotificationListeners();
  broadcastEvent('NOTIFICATION_UPDATED', newNotif);

  try {
    await withTimeout(setDoc(doc(db, 'notifications', newNotif.id), newNotif), 1000);
  } catch {
    // offline
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  notificationsCache = notificationsCache.map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  notifyNotificationListeners();
  broadcastEvent('NOTIFICATION_UPDATED', { notificationId, read: true });

  try {
    await withTimeout(updateDoc(doc(db, 'notifications', notificationId), { read: true }), 1000);
  } catch {
    // offline
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  notificationsCache = notificationsCache.map(n => 
    (n.userId === userId || n.userId === 'all') ? { ...n, read: true } : n
  );
  notifyNotificationListeners();
  broadcastEvent('NOTIFICATION_UPDATED', { userId, readAll: true });

  for (const n of notificationsCache.filter(n => (n.userId === userId || n.userId === 'all'))) {
    try {
      await withTimeout(updateDoc(doc(db, 'notifications', n.id), { read: true }), 500);
    } catch {
      // offline
    }
  }
}

// -----------------------------------------------------------------------------
// 4. COMPLIANCE AUDIT LOGGING
// -----------------------------------------------------------------------------

export async function logAuditEvent(
  action: string,
  resource: string,
  details: string,
  actor?: { uid: string; displayName: string; role: string }
): Promise<void> {
  const newLog: AuditLog = {
    id: `audit-${Date.now()}`,
    userId: actor?.uid || 'anonymous',
    userName: actor?.displayName || 'System Actor',
    action,
    resource,
    details,
    createdAt: new Date().toISOString(),
  };

  auditLogsCache = [newLog, ...auditLogsCache];
  notifyAuditListeners();
  broadcastEvent('AUDIT_UPDATED', newLog);

  try {
    await withTimeout(setDoc(doc(db, 'audit_logs', newLog.id), newLog), 1000);
  } catch {
    // offline
  }
}

export function subscribeToAuditLogs(
  callback: (logs: AuditLog[]) => void
): () => void {
  callback(auditLogsCache);
  const listener = () => callback([...auditLogsCache]);
  auditListeners.add(listener);

  return () => {
    auditListeners.delete(listener);
  };
}
