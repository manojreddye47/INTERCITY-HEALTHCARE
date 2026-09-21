import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/authStore';

// Landing
import LandingPage from '@/pages/landing/LandingPage';

// Auth
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

// Layout
import AppLayout from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Patient Pages
import PatientDashboard from '@/pages/patient/PatientDashboard';
import BookAppointment from '@/pages/patient/BookAppointment';
import AIAppointmentBooker from '@/pages/patient/AIAppointmentBooker';
import MyAppointments from '@/pages/patient/MyAppointments';
import MedicalHistory from '@/pages/patient/MedicalHistory';
import ReportsPage from '@/pages/patient/ReportsPage';
import PrescriptionsPage from '@/pages/patient/PrescriptionsPage';
import PaymentsPage from '@/pages/patient/PaymentsPage';
import FeedbackPage from '@/pages/patient/FeedbackPage';
import NotificationsPage from '@/pages/patient/NotificationsPage';
import PatientProfile from '@/pages/patient/PatientProfile';

// Doctor Pages
import DoctorDashboard from '@/pages/doctor/DoctorDashboard';
import DoctorAgenda from '@/pages/doctor/DoctorAgenda';
import DoctorAppointments from '@/pages/doctor/DoctorAppointments';
import DoctorPatients from '@/pages/doctor/DoctorPatients';
import DoctorCalendar from '@/pages/doctor/DoctorCalendar';
import DoctorShifts from '@/pages/doctor/DoctorShifts';
import WorkingHours from '@/pages/doctor/WorkingHours';
import LeaveManagement from '@/pages/doctor/LeaveManagement';
import DoctorProductivity from '@/pages/doctor/DoctorProductivity';
import DoctorProfile from '@/pages/doctor/DoctorProfile';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminPatients from '@/pages/admin/AdminPatients';
import AdminDoctors from '@/pages/admin/AdminDoctors';
import AdminDepartments from '@/pages/admin/AdminDepartments';
import AdminAppointments from '@/pages/admin/AdminAppointments';
import AdminFinances from '@/pages/admin/AdminFinances';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminLeave from '@/pages/admin/AdminLeave';
import FeedbackAnalysis from '@/pages/admin/FeedbackAnalysis';
import AdminAuditLogs from '@/pages/admin/AdminAuditLogs';
import AdminReports from '@/pages/admin/AdminReports';
import HospitalSettings from '@/pages/admin/HospitalSettings';
import AdminProfile from '@/pages/admin/AdminProfile';
import AdminSalaries from '@/pages/admin/AdminSalaries';

// Shared
import { Chatbot } from '@/components/shared/Chatbot';

function RoleRedirect() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/auth/login" replace />;
  return <Navigate to={`/${user.role}/dashboard`} replace />;
}

function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* Patient Routes */}
        <Route path="/patient" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="ai-booker" element={<AIAppointmentBooker />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="medical-history" element={<MedicalHistory />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="prescriptions" element={<PrescriptionsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="settings" element={<PatientProfile />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="agenda" element={<DoctorAgenda />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="calendar" element={<DoctorCalendar />} />
          <Route path="shifts" element={<DoctorShifts />} />
          <Route path="working-hours" element={<WorkingHours />} />
          <Route path="leave" element={<LeaveManagement />} />
          <Route path="productivity" element={<DoctorProductivity />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="settings" element={<DoctorProfile />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="finances" element={<AdminFinances />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="salaries" element={<AdminSalaries />} />
          <Route path="leave" element={<AdminLeave />} />
          <Route path="feedback" element={<FeedbackAnalysis />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<HospitalSettings />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
