import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, Bot, User, Sparkles, Calendar as CalendarIcon, Clock, Stethoscope, 
  CheckCircle2, ArrowRight, Activity, ShieldAlert, Check, RefreshCw, 
  ChevronRight, AlertTriangle, Building2, MapPin, DollarSign, Star,
  CalendarCheck, UserCheck, HeartPulse, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, nextSaturday, isAfter, parseISO } from 'date-fns';
import { sendAppointmentMessage, AIMessage, AppointmentExtract } from '@/lib/gemini';
import { demoDoctors, demoDepartments } from '@/data/demo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { createAppointment, isDoctorAvailableOnDate } from '@/services/realtimeDb';
import { Doctor } from '@/types';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  extracted?: AppointmentExtract | null;
  suggestedSlots?: GeneratedSlotOption[];
  clarifyingOptions?: string[];
};

interface GeneratedSlotOption {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorPhoto: string;
  specialty: string;
  departmentName: string;
  experience: number;
  rating: number;
  consultationFee: number;
  dateStr: string; // YYYY-MM-DD
  dateFormatted: string; // e.g., "Tomorrow, Sep 22" or "Saturday, Sep 26"
  time: string; // "10:30 AM", "02:30 PM", etc.
  period: 'Morning' | 'Afternoon' | 'Evening';
  isAvailable: boolean;
}

const PROMPT_SUGGESTIONS = [
  "I need a cardiologist tomorrow afternoon.",
  "I need a full body health check this Saturday.",
  "I want to see someone about knee pain next week.",
  "Looking for a pediatrician for my child's fever tomorrow morning.",
  "Need to consult a dermatologist for a skin rash this Friday.",
];

export interface AIAppointmentBookerProps {
  hideHeader?: boolean;
}

export default function AIAppointmentBooker({ hideHeader = false }: AIAppointmentBookerProps = {}) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am Intercity Healthcare's Smart Appointment Assistant. Tell me what you need in plain English — for example:\n\n• *\"I need a cardiologist tomorrow afternoon.\"*\n• *\"I need a full body health check this Saturday.\"*\n• *\"I want to see someone about knee pain next week.\"*\n\nI will check our specialist availability and present verified booking options immediately.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<AIMessage[]>([]);
  const [extractedData, setExtractedData] = useState<AppointmentExtract | null>(null);

  // Selected Option for Final Confirmation
  const [selectedSlotOption, setSelectedSlotOption] = useState<GeneratedSlotOption | null>(null);
  const [bookingSuccessData, setBookingSuccessData] = useState<{
    appointmentId: string;
    doctorName: string;
    specialty: string;
    dateFormatted: string;
    time: string;
    fee: number;
  } | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Helper: compute target date from text
  const resolveTargetDate = (text: string, preferredDateStr?: string): { date: Date; dateStr: string; label: string } => {
    const lower = (text + ' ' + (preferredDateStr || '')).toLowerCase();
    const today = new Date();

    if (lower.includes('saturday')) {
      const sat = nextSaturday(today);
      return { date: sat, dateStr: format(sat, 'yyyy-MM-dd'), label: `Saturday, ${format(sat, 'MMM d')}` };
    }
    if (lower.includes('next week')) {
      const nextMon = addDays(today, 7);
      return { date: nextMon, dateStr: format(nextMon, 'yyyy-MM-dd'), label: `Next Week (${format(nextMon, 'MMM d')})` };
    }
    if (lower.includes('today')) {
      return { date: today, dateStr: format(today, 'yyyy-MM-dd'), label: `Today, ${format(today, 'MMM d')}` };
    }
    if (lower.includes('day after')) {
      const dayAfter = addDays(today, 2);
      return { date: dayAfter, dateStr: format(dayAfter, 'yyyy-MM-dd'), label: format(dayAfter, 'EEEE, MMM d') };
    }

    // Default to tomorrow
    const tmrw = addDays(today, 1);
    return { date: tmrw, dateStr: format(tmrw, 'yyyy-MM-dd'), label: `Tomorrow, ${format(tmrw, 'MMM d')}` };
  };

  // Helper: find matched department & doctors
  const findMatchingDoctors = (queryText: string, aiDept?: string): { deptName: string; doctors: Doctor[] } => {
    const q = (queryText + ' ' + (aiDept || '')).toLowerCase();
    let targetDept = 'General Medicine';

    if (q.includes('cardio') || q.includes('heart') || q.includes('chest') || q.includes('palpitation') || q.includes('bp')) {
      targetDept = 'Cardiology';
    } else if (q.includes('ortho') || q.includes('knee') || q.includes('joint') || q.includes('bone') || q.includes('back pain')) {
      targetDept = 'Orthopedics';
    } else if (q.includes('neuro') || q.includes('headache') || q.includes('migraine') || q.includes('dizziness')) {
      targetDept = 'Neurology';
    } else if (q.includes('derma') || q.includes('skin') || q.includes('rash') || q.includes('acne')) {
      targetDept = 'Dermatology';
    } else if (q.includes('pediatric') || q.includes('child') || q.includes('baby') || q.includes('infant')) {
      targetDept = 'Pediatrics';
    } else if (q.includes('health check') || q.includes('full body') || q.includes('general') || q.includes('fever') || q.includes('wellness')) {
      targetDept = 'General Medicine';
    } else if (q.includes('gynec') || q.includes('women') || q.includes('pregnancy')) {
      targetDept = 'Gynecology';
    } else if (aiDept) {
      const found = demoDepartments.find(d => d.name.toLowerCase().includes(aiDept.toLowerCase()));
      if (found) targetDept = found.name;
    }

    const matchedDoctors = demoDoctors.filter(d => 
      d.departmentName.toLowerCase().includes(targetDept.toLowerCase()) ||
      d.specialty.toLowerCase().includes(targetDept.toLowerCase())
    );

    return {
      deptName: targetDept,
      doctors: matchedDoctors.length > 0 ? matchedDoctors : demoDoctors.slice(0, 2),
    };
  };

  // Helper: generate available slots
  const generateAvailableSlots = (
    doctors: Doctor[], 
    deptName: string, 
    dateInfo: { date: Date; dateStr: string; label: string }, 
    periodPreference?: string
  ): GeneratedSlotOption[] => {
    const slots: GeneratedSlotOption[] = [];
    const lowerPref = (periodPreference || '').toLowerCase();

    const morningTimes = ['09:30 AM', '10:30 AM', '11:15 AM'];
    const afternoonTimes = ['02:00 PM', '03:15 PM', '04:00 PM'];
    const eveningTimes = ['05:00 PM', '05:45 PM'];

    let targetTimes = [...morningTimes, ...afternoonTimes];
    if (lowerPref.includes('afternoon') || lowerPref.includes('pm')) {
      targetTimes = [...afternoonTimes, ...eveningTimes];
    } else if (lowerPref.includes('morning') || lowerPref.includes('am')) {
      targetTimes = [...morningTimes];
    }

    doctors.forEach((doc) => {
      // Check real-time leave availability
      const isDocAvailable = isDoctorAvailableOnDate(doc.id, dateInfo.dateStr);

      targetTimes.slice(0, 3).forEach((time) => {
        const isAfternoon = time.includes('PM') && !time.startsWith('11') && !time.startsWith('12');
        const period: 'Morning' | 'Afternoon' | 'Evening' = isAfternoon 
          ? (parseInt(time) >= 5 && parseInt(time) < 12 ? 'Evening' : 'Afternoon') 
          : 'Morning';

        slots.push({
          id: `slot-${doc.id}-${dateInfo.dateStr}-${time.replace(/[: ]/g, '')}`,
          doctorId: doc.id,
          doctorName: doc.name,
          doctorPhoto: doc.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`,
          specialty: doc.specialty,
          departmentName: deptName,
          experience: doc.experience,
          rating: doc.rating,
          consultationFee: doc.consultationFee,
          dateStr: dateInfo.dateStr,
          dateFormatted: dateInfo.label,
          time,
          period,
          isAvailable: isDocAvailable,
        });
      });
    });

    return slots;
  };

  const handleSendMessage = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || isLoading) return;

    // Clear previous booking card if starting a new query
    setBookingSuccessData(null);

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const nextHistory: AIMessage[] = [...chatHistory, { role: 'user', content: textToSend }];
    setChatHistory(nextHistory);

    try {
      // Call Gemini 2.0 Live extraction
      const { text, appointmentData } = await sendAppointmentMessage(chatHistory, textToSend);

      const targetDeptInfo = findMatchingDoctors(textToSend, appointmentData?.department);
      const dateInfo = resolveTargetDate(textToSend, appointmentData?.preferredDate);
      const periodPref = appointmentData?.preferredTime || (textToSend.toLowerCase().includes('afternoon') ? 'Afternoon' : textToSend.toLowerCase().includes('morning') ? 'Morning' : undefined);

      const availableSlots = generateAvailableSlots(
        targetDeptInfo.doctors,
        targetDeptInfo.deptName,
        dateInfo,
        periodPref
      );

      // Default select the first available slot
      const firstAvailable = availableSlots.find(s => s.isAvailable) || availableSlots[0];
      if (firstAvailable) {
        setSelectedSlotOption(firstAvailable);
      }

      setExtractedData({
        department: targetDeptInfo.deptName,
        specialty: firstAvailable?.specialty,
        preferredDate: dateInfo.label,
        preferredTime: firstAvailable?.time,
        appointmentType: 'In-person',
        symptoms: appointmentData?.symptoms || textToSend,
        isComplete: true,
        missingFields: [],
      });

      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        extracted: appointmentData,
        suggestedSlots: availableSlots,
      };

      setMessages(prev => [...prev, assistantMsg]);
      setChatHistory(prev => [...prev, { role: 'model', content: text }]);
    } catch {
      // Intelligent Offline Fallback with exact query recognition
      const targetDeptInfo = findMatchingDoctors(textToSend);
      const dateInfo = resolveTargetDate(textToSend);
      const periodPref = textToSend.toLowerCase().includes('afternoon') ? 'Afternoon' : textToSend.toLowerCase().includes('morning') ? 'Morning' : undefined;

      const availableSlots = generateAvailableSlots(
        targetDeptInfo.doctors,
        targetDeptInfo.deptName,
        dateInfo,
        periodPref
      );

      const firstAvailable = availableSlots.find(s => s.isAvailable) || availableSlots[0];
      if (firstAvailable) {
        setSelectedSlotOption(firstAvailable);
      }

      let fallbackText = `I have mapped your request to our **${targetDeptInfo.deptName}** department. Based on your schedule for **${dateInfo.label}**, here are the verified open consultation slots with our specialists:`;
      if (textToSend.toLowerCase().includes('diagnos') && !textToSend.toLowerCase().includes('report')) {
        fallbackText = `⚠️ **Medical Safety Notice**: Intercity Healthcare assistants do not provide medical diagnoses or treatment advice. Only a qualified physician can diagnose conditions.\n\nTo have your symptoms evaluated by a doctor, here are the verified open consultation slots with our **${targetDeptInfo.deptName}** specialists:`;
      }

      setExtractedData({
        department: targetDeptInfo.deptName,
        specialty: firstAvailable?.specialty,
        preferredDate: dateInfo.label,
        preferredTime: firstAvailable?.time,
        appointmentType: 'In-person',
        symptoms: textToSend,
        isComplete: true,
        missingFields: [],
      });

      setMessages(prev => [
        ...prev,
        {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date(),
          suggestedSlots: availableSlots,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlotOption) {
      toast.error('Please select an appointment slot to proceed');
      return;
    }

    if (!selectedSlotOption.isAvailable) {
      toast.error('This doctor is currently on approved administrative leave for this date. Please pick an alternative specialist.');
      return;
    }

    setIsConfirming(true);
    try {
      const newApt = await createAppointment({
        patientId: user?.uid || 'pat-01',
        patientName: user?.displayName || 'Rahul Verma',
        patientEmail: user?.email || 'patient@smartcare.com',
        doctorId: selectedSlotOption.doctorId,
        doctorName: selectedSlotOption.doctorName,
        departmentId: selectedSlotOption.doctorId === 'doc-01' ? 'dept-01' : 'dept-03',
        departmentName: selectedSlotOption.departmentName,
        appointmentType: 'In-person',
        date: selectedSlotOption.dateStr,
        time: selectedSlotOption.time,
        status: 'Scheduled',
        reason: extractedData?.symptoms || 'Smart Consultation Request',
        consultationFee: selectedSlotOption.consultationFee,
        paymentStatus: 'paid',
      });

      setBookingSuccessData({
        appointmentId: newApt.id,
        doctorName: selectedSlotOption.doctorName,
        specialty: selectedSlotOption.specialty,
        dateFormatted: selectedSlotOption.dateFormatted,
        time: selectedSlotOption.time,
        fee: selectedSlotOption.consultationFee,
      });

      toast.success(`Appointment confirmed with ${selectedSlotOption.doctorName} for ${selectedSlotOption.time}! Realtime synced.`);
    } catch {
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Header */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Smart Appointment Booker
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white text-[10px] font-extrabold uppercase tracking-wide shadow-sm">
                    Instant Triage
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Natural-language clinical scheduling with realtime doctor availability.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMessages([messages[0]]);
                setChatHistory([]);
                setExtractedData(null);
                setSelectedSlotOption(null);
                setBookingSuccessData(null);
              }}
              className="text-xs rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              New Session
            </Button>
          </div>
        </div>
      )}

      {/* Safety Notice Callout */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <span className="font-bold">Medical Disclaimer:</span> This assistant schedules appointments with hospital physicians based on availability. It <span className="underline font-semibold">does not diagnose conditions or provide medical advice</span>. For life-threatening symptoms, dial 102/112 immediately.
        </p>
      </div>

      {/* Two Column Layout: Conversation on Left, Selected Appointment Ticket on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Chat Conversation Interface (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[680px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Channel Header */}
          <div className="px-5 py-3.5 bg-slate-50/90 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Intercity Medical Coordinator
                </p>
                <p className="text-[11px] text-slate-400">Available 24/7 • Realtime Slot Matching</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>HIPAA Compliant</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                {msg.role === 'assistant' ? (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}

                <div className={cn(
                  "max-w-[85%] space-y-3",
                  msg.role === 'user' ? "items-end" : "items-start"
                )}>
                  {/* Bubble */}
                  <div className={cn(
                    "rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm",
                    msg.role === 'user'
                      ? "bg-blue-600 text-white rounded-tr-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60"
                  )}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Available Doctor Slot Cards rendered inside Assistant response */}
                  {msg.suggestedSlots && msg.suggestedSlots.length > 0 && (
                    <div className="space-y-2 pt-1 w-full">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Available Appointment Options:
                      </p>
                      <div className="grid grid-cols-1 gap-2.5">
                        {msg.suggestedSlots.map((slot) => {
                          const isSelected = selectedSlotOption?.id === slot.id;
                          return (
                            <div
                              key={slot.id}
                              onClick={() => {
                                if (slot.isAvailable) {
                                  setSelectedSlotOption(slot);
                                } else {
                                  toast.error(`${slot.doctorName} is on leave on this date.`);
                                }
                              }}
                              className={cn(
                                "p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
                                isSelected
                                  ? "bg-blue-50/90 dark:bg-blue-950/60 border-blue-600 ring-2 ring-blue-500/20 shadow-sm"
                                  : slot.isAvailable
                                  ? "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500"
                                  : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={slot.doctorPhoto}
                                  alt={slot.doctorName}
                                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-700 shrink-0"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                      {slot.doctorName}
                                    </h4>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                      {slot.specialty}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                      <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                                      {slot.dateFormatted}
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                                      <Clock className="w-3.5 h-3.5 text-teal-500" />
                                      {slot.time}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                                <span className="text-xs font-black text-slate-900 dark:text-white">
                                  ₹{slot.consultationFee}
                                </span>
                                {slot.isAvailable ? (
                                  <Button
                                    size="sm"
                                    variant={isSelected ? "default" : "outline"}
                                    className="h-8 text-xs px-3 rounded-xl"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedSlotOption(slot);
                                    }}
                                  >
                                    {isSelected ? (
                                      <span className="flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Selected
                                      </span>
                                    ) : (
                                      'Select Slot'
                                    )}
                                  </Button>
                                ) : (
                                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
                                    On Leave
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing / Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-xs bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center gap-2 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs ml-1.5 font-medium text-slate-500 dark:text-slate-400">
                    Extracting requirements & querying doctor rosters...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Natural Language Prompts */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200/60 dark:border-slate-800/60 overflow-x-auto scrollbar-none flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-500" /> Prompts:
            </span>
            {PROMPT_SUGGESTIONS.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(promptText)}
                className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-[11px] font-medium text-slate-700 dark:text-slate-300 shrink-0 transition-colors shadow-xs"
              >
                "{promptText}"
              </button>
            ))}
          </div>

          {/* User Input Form */}
          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask in natural words (e.g., 'I need a cardiologist tomorrow afternoon')..."
                disabled={isLoading}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="rounded-2xl h-11 px-5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shrink-0 shadow-md shadow-blue-500/20"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Right: Realtime Booking & Doctor Confirmation Card (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Success Card if booked */}
          {bookingSuccessData ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-xl space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Booking Confirmed!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Realtime database synced with doctor OPD queue.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Appointment ID:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {bookingSuccessData.appointmentId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consultant:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {bookingSuccessData.doctorName} ({bookingSuccessData.specialty})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scheduled Date:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {bookingSuccessData.dateFormatted}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scheduled Slot:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {bookingSuccessData.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-600">Confirmed (Paid)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => navigate('/patient/appointments')}
                  className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  View in My Appointments
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBookingSuccessData(null);
                    setSelectedSlotOption(null);
                  }}
                  className="rounded-xl text-xs"
                >
                  Book Another
                </Button>
              </div>
            </div>
          ) : selectedSlotOption ? (
            /* Selected Slot Confirmation Stage */
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Selected Appointment Summary
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  Ready to Confirm
                </span>
              </div>

              {/* Doctor Details */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-950 dark:to-blue-950/20 border border-slate-200/70 dark:border-slate-800 flex items-center gap-4">
                <img
                  src={selectedSlotOption.doctorPhoto}
                  alt={selectedSlotOption.doctorName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    {selectedSlotOption.specialty}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {selectedSlotOption.doctorName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedSlotOption.experience} yrs exp • {selectedSlotOption.departmentName}
                  </p>
                </div>
              </div>

              {/* Consultation Timing Pill */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Consultation Date</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                    {selectedSlotOption.dateFormatted}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Selected Time</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-1">
                    <Clock className="w-3.5 h-3.5 text-teal-500" />
                    {selectedSlotOption.time}
                  </span>
                </div>
              </div>

              {/* Hospital Location & Pricing Details */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> Department:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedSlotOption.departmentName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> OPD Location:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Block B, Floor 2, Room 204
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Consultation Fee:
                  </span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    ₹{selectedSlotOption.consultationFee}
                  </span>
                </div>
              </div>

              {/* Confirm CTA */}
              <Button
                onClick={handleConfirmBooking}
                disabled={isConfirming || !selectedSlotOption.isAvailable}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                {isConfirming ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Reserving & Syncing Slot...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Confirm Booking with {selectedSlotOption.doctorName}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <p className="text-[11px] text-center text-slate-400">
                Instant confirmation updates the doctor's agenda in real time.
              </p>
            </div>
          ) : (
            /* Standby Card when no query has been run yet */
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Awaiting Your Request
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Type your preferred specialist or symptoms on the left to review available doctor slots.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-left space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Example queries:</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">"I need a cardiologist tomorrow afternoon."</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">"I need a full body health check this Saturday."</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">"I want to see someone about knee pain next week."</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
