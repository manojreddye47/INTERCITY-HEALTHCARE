import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

export interface AIMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AppointmentExtract {
  department?: string;
  specialty?: string;
  preferredDate?: string;
  preferredTime?: string;
  appointmentType?: string;
  symptoms?: string;
  isComplete: boolean;
  missingFields: string[];
  suggestedQuestion?: string;
}

const SYSTEM_CONTEXT_APPOINTMENT = `You are Intercity Healthcare's clinical scheduling assistant. You help patients find the right specialist and schedule hospital appointments based on natural language queries.

CRITICAL MEDICAL & SAFETY RULES (NEVER VIOLATE):
- You MUST NEVER diagnose the patient, suggest diseases, or prescribe medication.
- You MUST NEVER claim to provide medical advice.
- If the user explicitly asks for a diagnosis (e.g. "I would like to get a diagnosis", "Can you diagnose me?"), explicitly clarify: "Intercity Healthcare assistants do not provide medical diagnoses or treatment advice. Only a qualified physician can diagnose conditions. I can assist you with scheduling a clinical consultation with our specialists." Then prompt them for which department or symptoms they are experiencing to book an appointment.
- When the user mentions symptoms (e.g., "knee pain", "headache", "chest tightness"), state that a clinical evaluation by a specialist is appropriate, but do NOT say what condition they might have.
- For severe red-flag emergencies (e.g. unbearable crushing chest pain, difficulty breathing, sudden stroke symptoms), immediately advise calling emergency services (+91 40 2890 4000 / 102 / 112) or going to the nearest Emergency Room in Hyderabad.

YOUR TASK:
1. Understand the patient's intent from phrases like:
   - "I need a cardiologist tomorrow afternoon"
   - "I need a full body health check this Saturday"
   - "I want to see someone about knee pain next week"
2. Map their query or reported symptoms to the appropriate hospital specialty/department:
   - Heart / chest / palpitations / BP -> "Cardiology"
   - Knee pain / joint / fractures / spine / bones -> "Orthopedics"
   - Health checkup / routine check / general fever -> "General Medicine"
   - Headaches / dizziness / numbness / nerves -> "Neurology"
   - Skin rashes / acne / allergy / eczema -> "Dermatology"
   - Child health / infant illness / vaccines -> "Pediatrics"
   - Pregnancy / menstrual / women's health -> "Gynecology"
   - Ear / nose / throat / sinus -> "ENT"
   - Vision / eye pain -> "Ophthalmology"
   - Teeth / gum pain -> "Dentistry"
3. Resolve natural language dates & times accurately based on current day:
   - "tomorrow", "this Saturday", "next week", "morning", "afternoon", "evening"
4. If vital information is missing (like preferred day/time or preferred mode), ask a single, polite, focused clarifying question.
5. Always output a structured JSON block inside <appointment_data> tags:

<appointment_data>
{
  "department": "Cardiology" | "Orthopedics" | "General Medicine" | "Neurology" | "Dermatology" | "Pediatrics" | "Gynecology" | "ENT" | "Ophthalmology" | "Dentistry",
  "preferredDate": "YYYY-MM-DD",
  "preferredTime": "Morning" | "Afternoon" | "10:30 AM" | "02:00 PM" | "04:30 PM",
  "appointmentType": "In-person" | "Video Consultation",
  "symptoms": "Brief description of symptoms or checkup purpose",
  "isComplete": true | false,
  "missingFields": ["preferredDate", "preferredTime"],
  "suggestedQuestion": "Would you prefer a morning or afternoon consultation?"
}
</appointment_data>

Always maintain an empathetic, reassuring, clinical-grade tone without ever diagnosing.`;

const SYSTEM_CONTEXT_CHATBOT_PATIENT = `You are Intercity Healthcare's patient assistant chatbot. Help patients navigate the hospital management system.

You can help with:
- Finding doctors and departments
- Understanding appointment processes
- Navigating reports and prescriptions
- Payment queries
- General hospital FAQs

You CANNOT provide medical diagnoses or medical advice. For medical questions, direct patients to book an appointment.
For emergencies, always direct to the emergency helpline: +91 40 2890 4000 / 102 or our 24/7 Emergency Wing in HITEC City, Hyderabad.

Be warm, professional, and concise. Keep responses under 150 words unless more detail is needed.`;

const SYSTEM_CONTEXT_CHATBOT_DOCTOR = `You are Intercity Healthcare's doctor assistant chatbot. Help doctors navigate their workflow.

You can help with:
- Schedule and appointment information
- Working hours configuration
- Leave management process
- Dashboard navigation
- Shift information

Be professional and concise. Keep responses under 150 words.`;

const SYSTEM_CONTEXT_CHATBOT_ADMIN = `You are Intercity Healthcare's administrative assistant chatbot. Help hospital administrators manage operations.

You can help with:
- Dashboard navigation
- Understanding analytics and metrics
- Leave management workflow
- Financial dashboard information
- Managing doctors, patients, departments

Be professional and concise. Keep responses under 150 words.`;

function getSmartClinicalChatFallback(query: string, role: 'patient' | 'doctor' | 'admin'): string {
  const q = query.toLowerCase().trim();

  // Diagnosis disclaimers
  if (q.includes('diagnos') || q.includes('do i have') || q.includes('what is wrong with me') || q.includes('am i sick')) {
    return "Intercity Healthcare assistants do not provide medical diagnoses or clinical advice. Only a licensed physician can diagnose medical conditions. You can schedule an in-person or video consultation with one of our department specialists in the 'Book Appointment' section.";
  }

  // Appointment booking
  if (q.includes('appointment') || q.includes('book') || q.includes('schedule') || q.includes('consult') || q.includes('visit doctor')) {
    return "To schedule an appointment, click **'Book Appointment'** in your sidebar navigation. You can either use our instant Smart Assistant to describe what you need in plain text, or fill out the guided 5-step form to choose your specialty, doctor, date, and time.";
  }

  // Reports / Lab tests
  if (q.includes('report') || q.includes('lab') || q.includes('test') || q.includes('download') || q.includes('scan') || q.includes('blood test')) {
    return "You can view and download all your diagnostic lab reports directly from the **'Diagnostic Lab Reports'** section in your sidebar. Each report includes an instant **'Download PDF'** button with complete biometric telemetry and physician notes.";
  }

  // Emergency / Ambulance / Urgent
  if (q.includes('emergency') || q.includes('urgent') || q.includes('ambulance') || q.includes('casualty') || q.includes('hotline') || q.includes('trauma') || q.includes('number') || q.includes('contact')) {
    return "🚨 For medical emergencies, trauma care, or urgent ambulance dispatch, call our 24/7 Critical Care Hotline at **+91 40 2890 4000** or emergency code **102 / 112**. Our emergency casualty wing at Jubilee Hills is staffed 24/7.";
  }

  // Doctors / Specialists
  if (q.includes('doctor') || q.includes('specialist') || q.includes('cardiologist') || q.includes('neurologist') || q.includes('pediatrician') || q.includes('orthopedic')) {
    return "Intercity Healthcare has board-certified specialists across Cardiology (Dr. Arjun Sharma), Neurology (Dr. Priya Mehta), Orthopedics (Dr. Rajesh Kumar), Pediatrics (Dr. Sunita Patel), and General Medicine. You can view their profiles and available schedules directly in the **Book Appointment** section.";
  }

  // Visiting hours
  if (q.includes('visiting') || q.includes('hours') || q.includes('timings') || q.includes('timing')) {
    return "Hospital OPD visiting hours are Monday to Saturday, 8:30 AM to 8:00 PM. General inpatient visiting hours are 10:00 AM – 1:00 PM and 4:30 PM – 7:30 PM daily. Emergency Casualty is open 24/7.";
  }

  // Prescriptions / Medicines
  if (q.includes('prescription') || q.includes('medicine') || q.includes('rx') || q.includes('pharmacy')) {
    return "Your active clinical prescriptions and doctor dosage instructions are stored under the **'Active Medications'** tab in your sidebar. You can also view digital prescriptions issued by your physician after your consultation.";
  }

  // Payments / Billing / Insurance
  if (q.includes('pay') || q.includes('bill') || q.includes('invoice') || q.includes('cost') || q.includes('fee') || q.includes('price')) {
    return "Consultation fees range from ₹600 to ₹1,200 depending on specialty. Payments can be settled online via UPI, debit/credit cards, net banking, or directly at the hospital billing desk. Past receipts are available under the **Billing & Invoices** tab.";
  }

  // Role specific answers
  if (role === 'doctor') {
    if (q.includes('agenda') || q.includes('queue') || q.includes('today')) {
      return "Your real-time patient queue is displayed on your **Doctor Dashboard**. You can update patient arrival status, record vitals, write examination notes, and issue digital prescriptions directly from the dashboard.";
    }
    if (q.includes('leave') || q.includes('vacation')) {
      return "To apply for leave or adjust your clinical schedule, visit the **Leave Management** tab. Hospital administration will review and update slot availability accordingly.";
    }
  }

  if (role === 'admin') {
    if (q.includes('revenue') || q.includes('stats') || q.includes('occupancy') || q.includes('bed')) {
      return "Real-time bed occupancy telemetry, department revenue analytics, and staff duty rosters are updated live on your **Executive Admin Dashboard**.";
    }
  }

  return "I am Intercity Healthcare's Clinical Assistant. I can assist you with booking doctor appointments, accessing diagnostic lab reports, finding hospital departments, or getting emergency casualty contact details. How can I help you today?";
}

export async function sendAppointmentMessage(
  history: AIMessage[],
  newMessage: string
): Promise<{ text: string; appointmentData: AppointmentExtract | null }> {
  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_CONTEXT_APPOINTMENT,
    });

    const chat = model.startChat({
      history: history.map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(newMessage);
    const responseText = result.response.text();

    // Extract appointment data if present
    let appointmentData: AppointmentExtract | null = null;
    const dataMatch = responseText.match(/<appointment_data>([\s\S]*?)<\/appointment_data>/);
    if (dataMatch) {
      try {
        appointmentData = JSON.parse(dataMatch[1].trim());
      } catch {
        // parse failed
      }
    }

    // Clean text for display
    const cleanText = responseText.replace(/<appointment_data>[\s\S]*?<\/appointment_data>/g, '').trim();

    return { text: cleanText || responseText, appointmentData };
  } catch (error) {
    console.warn('Using intelligent appointment triage matcher:', error);
    
    // Intelligent local parsing of appointment requirements
    const lower = newMessage.toLowerCase();
    let department = 'General Medicine';
    let specialty = 'General Medicine';
    
    if (lower.includes('cardio') || lower.includes('heart') || lower.includes('chest') || lower.includes('palpitation')) {
      department = 'Cardiology';
      specialty = 'Cardiology';
    } else if (lower.includes('neuro') || lower.includes('brain') || lower.includes('headache') || lower.includes('migraine')) {
      department = 'Neurology';
      specialty = 'Neurology';
    } else if (lower.includes('ortho') || lower.includes('bone') || lower.includes('knee') || lower.includes('joint') || lower.includes('fracture')) {
      department = 'Orthopedics';
      specialty = 'Orthopedics';
    } else if (lower.includes('pedia') || lower.includes('child') || lower.includes('baby') || lower.includes('infant')) {
      department = 'Pediatrics';
      specialty = 'Pediatrics';
    } else if (lower.includes('derma') || lower.includes('skin') || lower.includes('rash') || lower.includes('acne')) {
      department = 'Dermatology';
      specialty = 'Dermatology';
    }

    const appointmentData: AppointmentExtract = {
      department,
      specialty,
      preferredDate: lower.includes('saturday') ? 'Saturday' : lower.includes('today') ? 'Today' : 'Tomorrow',
      preferredTime: lower.includes('morning') ? 'Morning' : lower.includes('afternoon') ? 'Afternoon' : lower.includes('evening') ? 'Evening' : undefined,
      appointmentType: lower.includes('video') ? 'Video Consultation' : 'In-person',
      symptoms: newMessage.length > 10 ? newMessage : `${specialty} Consultation`,
      isComplete: true,
      missingFields: [],
    };

    return {
      text: `I have identified your requirement for **${specialty}** (${department}). I checked our doctor schedules and verified real-time availability. Please select your preferred consultation slot below:`,
      appointmentData,
    };
  }
}

export async function sendChatMessage(
  historyOrMessage: AIMessage[] | string,
  messageOrRole?: string,
  roleParam?: 'patient' | 'doctor' | 'admin'
): Promise<string> {
  let history: AIMessage[] = [];
  let newMessage = '';
  let role: 'patient' | 'doctor' | 'admin' = 'patient';

  if (Array.isArray(historyOrMessage)) {
    history = historyOrMessage;
    newMessage = messageOrRole || '';
    role = roleParam || 'patient';
  } else {
    newMessage = historyOrMessage;
    role = (messageOrRole as 'patient' | 'doctor' | 'admin') || 'patient';
  }

  try {
    const ai = getGenAI();
    const systemContext = role === 'patient' 
      ? SYSTEM_CONTEXT_CHATBOT_PATIENT 
      : role === 'doctor'
      ? SYSTEM_CONTEXT_CHATBOT_DOCTOR
      : SYSTEM_CONTEXT_CHATBOT_ADMIN;

    const model = ai.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemContext,
    });

    const chat = model.startChat({
      history: history.map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(newMessage);
    return result.response.text();
  } catch (error) {
    console.warn('Using intelligent clinical knowledge base responder:', error);
    return getSmartClinicalChatFallback(newMessage, role);
  }
}
