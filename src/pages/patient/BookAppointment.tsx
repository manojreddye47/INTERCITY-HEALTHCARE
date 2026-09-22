import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, 
  User, CheckCircle, CheckCircle2, Search, Stethoscope, Video, 
  Activity, Heart, CreditCard, QrCode, Building, Sparkles, Bot
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { demoDepartments, demoDoctors, demoPatient } from '@/data/demo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { createAppointment, isDoctorAvailableOnDate, isSlotBooked } from '@/services/realtimeDb';
import AIAppointmentBooker from '@/pages/patient/AIAppointmentBooker';

const steps = [
  'Department',
  'Physician',
  'Schedule',
  'Consultation Mode',
  'Summary & Pay'
];

export default function BookAppointment() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [departmentId, setDepartmentId] = useState(demoDepartments[0].id);
  const [doctorId, setDoctorId] = useState(demoDoctors[0].id);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(Date.now() + 86400000));
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'video'>('in-person');
  const [reason, setReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const selectedDepartment = demoDepartments.find(d => d.id === departmentId) || demoDepartments[0];
  const selectedDoctor = demoDoctors.find(d => d.id === doctorId) || demoDoctors[0];
  const availableDoctors = demoDoctors.filter(d => d.departmentId === departmentId);

  const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const afternoonSlots = ['12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];
  const eveningSlots = ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'];

  const handleNext = async () => {
    if (currentStep === 2 && selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      if (!isDoctorAvailableOnDate(selectedDoctor.id, dateStr)) {
        toast.error(`Dr. ${selectedDoctor.name} has approved leave on ${dateStr}. Please select another date.`);
        return;
      }
      if (isSlotBooked(selectedDoctor.id, dateStr, selectedTime)) {
        toast.error(`The slot ${selectedTime} on ${dateStr} is already booked. Please pick an alternative slot.`);
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      setIsSubmitting(true);
      try {
        const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
        await createAppointment({
          patientId: user?.uid || 'demo-patient',
          patientName: user?.displayName || 'Rahul Verma',
          patientEmail: user?.email || 'patient@smartcare.com',
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          departmentId: selectedDepartment.id,
          departmentName: selectedDepartment.name,
          appointmentType: appointmentType === 'video' ? 'Video Consultation' : 'In-person',
          date: dateStr,
          time: selectedTime || '10:30 AM',
          status: 'Scheduled',
          reason: reason || 'Routine clinical consultation',
          consultationFee: selectedDoctor.consultationFee,
          paymentStatus: paymentMethod === 'clinic' ? 'unpaid' : 'paid',
        });

        toast.success(`Consultation successfully reserved with Dr. ${selectedDoctor.name}! Realtime synchronized.`);
        navigate('/patient/appointments');
      } catch (e) {
        toast.error('Failed to create appointment');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Book Clinical Consultation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Use our conversational smart assistant or complete the guided 5-step form below. Both are available on this single page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#manual-booking"
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Go to 5-Step Form ↓
          </a>
        </div>
      </div>

      {/* 1. Smart Conversational Assistant */}
      <section id="smart-booking" className="space-y-3 scroll-mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-500" />
              Smart Conversational Assistant
            </h2>
          </div>
          <a
            href="#manual-booking"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Jump to 5-Step Form ↓
          </a>
        </div>
        <AIAppointmentBooker hideHeader={true} />
      </section>

      {/* 2. Step-by-Step Manual Form */}
      <section id="manual-booking" className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 scroll-mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-500" />
              Guided 5-Step Booking Form
            </h2>
          </div>
          <a
            href="#smart-booking"
            className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
          >
            Jump to Smart Assistant ↑
          </a>
        </div>

          {/* Modern Step Indicator */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px]">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition-all",
                  index < currentStep 
                    ? "bg-emerald-600 text-white shadow-sm" 
                    : index === currentStep 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-500/30" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                )}>
                  {index < currentStep ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                </div>
                <span className={cn(
                  "text-xs font-semibold tracking-tight",
                  index <= currentStep ? "text-slate-900 dark:text-white" : "text-slate-400"
                )}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-3 rounded-full transition-colors",
                  index < currentStep ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-800"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm min-h-[420px]">
        {/* Step 0: Department Selection */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Select Clinical Specialty</h2>
              <p className="text-xs text-slate-400">Choose the medical department relevant to your condition.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {demoDepartments.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => {
                    setDepartmentId(dept.id);
                    const matchingDocs = demoDoctors.filter(d => d.departmentId === dept.id);
                    if (matchingDocs.length > 0) setDoctorId(matchingDocs[0].id);
                  }}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all group flex flex-col justify-between",
                    departmentId === dept.id 
                      ? "border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm" 
                      : "border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{dept.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {dept.doctorCount} Doctors
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{dept.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{dept.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Doctor Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Select Physician in {selectedDepartment.name}
              </h2>
              <p className="text-xs text-slate-400">All consultants are board-certified senior faculty specialists.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {availableDoctors.map(doctor => (
                <button
                  key={doctor.id}
                  onClick={() => setDoctorId(doctor.id)}
                  className={cn(
                    "p-4 rounded-2xl border flex items-start gap-4 transition-all text-left group",
                    doctorId === doctor.id 
                      ? "border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm" 
                      : "border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  )}
                >
                  <img
                    src={doctor.photoURL}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0 shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dr. {doctor.name}</h3>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">{doctor.specialty}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{doctor.experience} yrs exp • {doctor.qualifications[0]}</p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">₹{doctor.consultationFee}</span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        Available Today
                      </span>
                    </div>
                  </div>
                </button>
              ))}

              {availableDoctors.length === 0 && (
                <div className="col-span-2 text-center py-12 text-slate-400">
                  No specialists currently on roster for this department. Please select General Medicine.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Picker */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Choose Date & Time Slot</h2>
              <p className="text-xs text-slate-400">Consultations are scheduled in 30-minute intervals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
              <div className="md:col-span-6 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Select Date</span>
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-3 bg-slate-50 dark:bg-slate-950/50 w-full flex justify-center">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={[{ before: new Date() }]}
                    className="dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="md:col-span-6 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Available Slots ({selectedDate ? format(selectedDate, 'MMM d') : 'Select Date'})</span>

                {/* Morning Slots */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">Morning OPD</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {morningSlots.map(time => {
                      const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
                      const isBooked = dateStr ? isSlotBooked(selectedDoctor.id, dateStr, time) : false;
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-2 px-2 text-xs rounded-xl border text-center font-medium transition-all",
                            isBooked
                              ? "border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-800/30 text-slate-400 cursor-not-allowed line-through opacity-60"
                              : selectedTime === time
                                ? "bg-blue-600 border-blue-600 text-white font-bold shadow-sm"
                                : "border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-700 dark:text-slate-300"
                          )}
                          title={isBooked ? 'Slot already reserved' : 'Available for booking'}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Afternoon Slots */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">Afternoon OPD</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {afternoonSlots.map(time => {
                      const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
                      const isBooked = dateStr ? isSlotBooked(selectedDoctor.id, dateStr, time) : false;
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-2 px-2 text-xs rounded-xl border text-center font-medium transition-all",
                            isBooked
                              ? "border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-800/30 text-slate-400 cursor-not-allowed line-through opacity-60"
                              : selectedTime === time
                                ? "bg-blue-600 border-blue-600 text-white font-bold shadow-sm"
                                : "border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-700 dark:text-slate-300"
                          )}
                          title={isBooked ? 'Slot already reserved' : 'Available for booking'}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Evening Slots */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">Evening OPD</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {eveningSlots.map(time => {
                      const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
                      const isBooked = dateStr ? isSlotBooked(selectedDoctor.id, dateStr, time) : false;
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-2 px-2 text-xs rounded-xl border text-center font-medium transition-all",
                            isBooked
                              ? "border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-800/30 text-slate-400 cursor-not-allowed line-through opacity-60"
                              : selectedTime === time
                                ? "bg-blue-600 border-blue-600 text-white font-bold shadow-sm"
                                : "border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-700 dark:text-slate-300"
                          )}
                          title={isBooked ? 'Slot already reserved' : 'Available for booking'}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Consultation Mode & Symptoms */}
        {currentStep === 3 && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Consultation Mode & Clinical Notes</h2>
              <p className="text-xs text-slate-400">Select whether you will visit the hospital in-person or join via secure video link.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => setAppointmentType('in-person')}
                className={cn(
                  "p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all",
                  appointmentType === 'in-person'
                    ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 font-bold"
                    : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300"
                )}
              >
                <Building className="w-6 h-6 text-blue-600" />
                <span className="text-xs">In-Person OPD Visit</span>
                <span className="text-[10px] text-slate-400 font-normal">Hospital OPD Wing</span>
              </button>

              <button
                type="button"
                onClick={() => setAppointmentType('video')}
                className={cn(
                  "p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all",
                  appointmentType === 'video'
                    ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 font-bold"
                    : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300"
                )}
              >
                <Video className="w-6 h-6 text-teal-600" />
                <span className="text-xs">Telehealth Video Call</span>
                <span className="text-[10px] text-slate-400 font-normal">Encrypted WebRTC link</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Symptoms / Reason for Consultation:
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                placeholder="E.g. Recurring headaches for past 4 days, mild sensitivity to bright light..."
              />
            </div>
          </div>
        )}

        {/* Step 4: Review & Payment Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Review Consultation & Billing</h2>
              <p className="text-xs text-slate-400">Verify your appointment details and preferred payment channel.</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-950/70 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <img src={selectedDoctor.photoURL} alt={selectedDoctor.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dr. {selectedDoctor.name}</h3>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">{selectedDoctor.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">₹{selectedDoctor.consultationFee}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Standard OPD Fee</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Appointment Slot:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedDate && format(selectedDate, 'MMMM d, yyyy')} • {selectedTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mode:</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">
                    {appointmentType === 'video' ? 'Telehealth Video Consultation' : 'Hospital In-Person Visit'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[11px]">Clinical Reason:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{reason || 'Routine clinical assessment'}</span>
                </div>
              </div>
            </div>

            {/* Payment Channel Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Payment Channel:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={cn(
                    "p-3 rounded-xl border text-left text-xs transition-all",
                    paymentMethod === 'upi'
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <QrCode className="w-4 h-4 mb-1 text-blue-600" />
                  <span>UPI / QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={cn(
                    "p-3 rounded-xl border text-left text-xs transition-all",
                    paymentMethod === 'card'
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <CreditCard className="w-4 h-4 mb-1 text-purple-600" />
                  <span>Card / Netbanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('clinic')}
                  className={cn(
                    "p-3 rounded-xl border text-left text-xs transition-all",
                    paymentMethod === 'clinic'
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <Building className="w-4 h-4 mb-1 text-emerald-600" />
                  <span>Pay at Hospital</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stepper Navigation Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="rounded-xl text-xs font-semibold px-5"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-xs font-bold px-6 shadow-md shadow-blue-500/20 active:scale-[0.98]"
        >
          {currentStep === steps.length - 1 ? 'Confirm & Book Appointment' : 'Continue'}
          {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>
      </section>
    </div>
  );
}
