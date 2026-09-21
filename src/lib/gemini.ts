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

const SYSTEM_CONTEXT_APPOINTMENT = `You are Intercity Healthcare's clinical scheduling AI assistant. You help patients find the right specialist and schedule hospital appointments based on natural language queries.

CRITICAL MEDICAL & SAFETY RULES (NEVER VIOLATE):
- You MUST NEVER diagnose the patient or prescribe medication.
- You MUST NEVER claim to provide medical advice.
- When the user mentions symptoms (e.g., "knee pain", "headache", "chest tightness"), state that a clinical evaluation by a specialist is appropriate, but do NOT say what condition they might have.
- For severe red-flag emergencies (e.g. unbearable crushing chest pain, difficulty breathing, sudden stroke symptoms), immediately advise calling emergency services (102 / 112) or going to the nearest Emergency Room.

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
For emergencies, always direct to the emergency number: 102 or the Emergency Room.

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

export async function sendAppointmentMessage(
  history: AIMessage[],
  newMessage: string
): Promise<{ text: string; appointmentData: AppointmentExtract | null }> {
  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
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
    console.error('Gemini AI error:', error);
    return {
      text: "I'm having trouble connecting right now. Please try again in a moment, or you can book an appointment directly using the booking form.",
      appointmentData: null,
    };
  }
}

export async function sendChatMessage(
  historyOrMessage: AIMessage[] | string,
  messageOrRole?: string,
  roleParam?: 'patient' | 'doctor' | 'admin'
): Promise<string> {
  try {
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

    const ai = getGenAI();
    const systemContext = role === 'patient' 
      ? SYSTEM_CONTEXT_CHATBOT_PATIENT 
      : role === 'doctor'
      ? SYSTEM_CONTEXT_CHATBOT_DOCTOR
      : SYSTEM_CONTEXT_CHATBOT_ADMIN;

    const model = ai.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
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
    console.error('Chatbot error:', error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}
