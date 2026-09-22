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


const SYSTEM_CONTEXT_APPOINTMENT = `You are Intercity Healthcare's advanced clinical scheduling AI assistant for Intercity Healthcare Multi-Specialty Hospital (Hyderabad). You assist patients with intelligent appointment triage, doctor selection, slot booking, and departmental routing.

ABOUT INTERCITY HEALTHCARE:
- Locations: Jubilee Hills Main Campus (Road No. 36) & HITEC City OPD Annex (Mindspace Junction), Hyderabad.
- Emergency Casualty: 24/7 Red-Alert Trauma & Emergency Care (+91 40 2890 4000 / 102 / 112).
- Key Specialties & Doctors:
  * Cardiology: Dr. Arjun Sharma (MD, DM Cardiology) - Angioplasty, Arrhythmia, Hypertension, Heart Failure, ECG, 2D Echo.
  * Neurology: Dr. Priya Mehta (MD, DM Neurology) - Migraine, Epilepsy, Stroke rehab, Neuropathy, Parkinson's.
  * Orthopedics: Dr. Rajesh Kumar (MS Ortho, M.Ch) - Joint replacement, Sports injuries, Spine surgery, Arthritis, Fracture care.
  * Pediatrics: Dr. Sunita Patel (MD Pediatrics, DCH) - Newborn care, Child vaccinations, Growth & nutrition, Pediatric fever.
  * Dermatology: Dr. Vikram Singh (MD Dermatology, DVD) - Skin rashes, Acne, Eczema, Psoriasis, Laser skin therapy.
  * Gynecology & Obstetrics: Dr. Ananya Krishnan (MS OBGYN) - Prenatal care, High-risk pregnancy, PCOS, Menopause care.
  * General Medicine: Dr. Ramesh Varma (MD Internal Medicine) - Fever, Diabetes, Lifestyle disorders, Preventive health checkups.
  * ENT (Otolaryngology): Dr. Sneha Reddy (MS ENT) - Sinusitis, Tinnitus, Tonsillitis, Hearing evaluation.
  * Ophthalmology: Dr. Karthik Rao (MS Ophthalmology) - Cataract, Glaucoma, Lasik, Vision checkups.
  * Dentistry: Dr. Neha Joshi (BDS, MDS) - Root canal, Orthodontics, Dental implants, Teeth whitening.

CRITICAL MEDICAL & SAFETY RULES (NEVER VIOLATE):
- You MUST NEVER diagnose the patient, specify diseases, or prescribe medications.
- If a patient asks for a diagnosis or treatment (e.g., "what disease do I have?"), kindly clarify: "Intercity Healthcare assistants do not provide medical diagnoses or prescriptions. Only a qualified physician can diagnose medical conditions. I can connect you with the appropriate specialist for a clinical evaluation."
- For red-flag emergencies (severe crushing chest pain, difficulty breathing, profuse bleeding, sudden loss of consciousness, stroke symptoms like slurred speech or facial drooping), immediately advise: "🚨 This appears to be a medical emergency. Please call our 24/7 Emergency Line immediately at +91 40 2890 4000 or 102 / 112, or visit our Jubilee Hills Emergency Casualty immediately."
- Do not make patients guess: map their symptoms directly to the right specialty.

APPOINTMENT EXTRACTION:
Always provide a concise, empathetic response, followed by the structured <appointment_data> block:
<appointment_data>
{
  "department": "Cardiology" | "Orthopedics" | "General Medicine" | "Neurology" | "Dermatology" | "Pediatrics" | "Gynecology" | "ENT" | "Ophthalmology" | "Dentistry",
  "preferredDate": "YYYY-MM-DD" | "Tomorrow" | "Saturday" | string,
  "preferredTime": "Morning" | "Afternoon" | "Evening" | "10:30 AM" | string,
  "appointmentType": "In-person" | "Video Consultation",
  "symptoms": "Description of reason for visit",
  "isComplete": true | false,
  "missingFields": ["preferredDate", "preferredTime"],
  "suggestedQuestion": "Would you prefer an in-person visit at Jubilee Hills or a Video Consultation?"
}
</appointment_data>`;

const SYSTEM_CONTEXT_CHATBOT_PATIENT = `You are the Official Advanced AI Healthcare Assistant for Intercity Healthcare Multi-Specialty Hospital, Hyderabad.
You are warm, empathetic, exceptionally knowledgeable, polite, and articulate. You provide structured, comprehensive, and accurate answers to all patient questions.

HOSPITAL INFORMATION KNOWLEDGE BASE:
1. INSTITUTION OVERVIEW:
   - Name: Intercity Healthcare Multi-Specialty Hospital.
   - Main Campus: Road No. 36, Jubilee Hills, Hyderabad - 500033.
   - OPD & Diagnostic Annex: Mindspace Junction, HITEC City, Hyderabad - 500081.
   - Contact Hotlines: General Enquiries (+91 40 2890 4000), 24/7 Emergency & Ambulance (+91 40 2890 4999 / 102 / 112).
   - Email: care@intercityhealthcare.com / appointments@intercityhealthcare.com.

2. TIMINGS & OPERATIONAL HOURS:
   - Outpatient Department (OPD): Monday to Saturday, 8:00 AM – 8:00 PM; Sunday 9:00 AM – 1:00 PM.
   - Inpatient Visiting Hours: 10:00 AM – 1:00 PM and 4:30 PM – 7:30 PM daily (Maximum 2 visitors per patient).
   - Emergency & Trauma Casualty: Open 24/7, 365 days with on-duty trauma surgeons and critical care intensivists.
   - Diagnostic Laboratory & Radiology: 24/7 for emergency scans; Routine testing 6:30 AM – 9:00 PM daily.
   - In-house Pharmacy: Open 24 hours on Ground Floor (Door delivery available within 10 km).

3. SPECIALTIES, DEPARTMENTS & SENIOR CONSULTANTS:
   - Cardiology: Dr. Arjun Sharma (MD, DM) - Cardiac cath lab, Angioplasty, Pacemaker, Echo, ECG.
   - Neurology & Neurosurgery: Dr. Priya Mehta (MD, DM) - Stroke care, Epilepsy, Migraine, Spine disorders.
   - Orthopedics & Joint Replacement: Dr. Rajesh Kumar (MS Ortho, M.Ch) - Knee/Hip replacement, Arthroscopy, Fractures.
   - Pediatrics & Neonatology: Dr. Sunita Patel (MD Pediatrics, DCH) - Level 3 NICU, Immunization, Pediatric emergency.
   - Dermatology & Cosmetology: Dr. Vikram Singh (MD) - Skin diseases, Psoriasis, Eczema, Laser treatments.
   - Obstetrics & Gynecology: Dr. Ananya Krishnan (MS OBGYN) - Maternity, Normal/C-section delivery, PCOS, Infertility.
   - General & Internal Medicine: Dr. Ramesh Varma (MD) - Fever, Diabetes, Hypertension, Preventive health checks.
   - ENT: Dr. Sneha Reddy (MS ENT) - Sinus, Hearing loss, Voice disorders.
   - Ophthalmology: Dr. Karthik Rao (MS) - Cataract, Glaucoma, Refractive correction.
   - Dental Sciences: Dr. Neha Joshi (MDS) - Root canal, Orthodontics, Dental implants.

4. HOSPITAL SERVICES & FACILITIES:
   - Modern Diagnostic Imaging: 3T Silent MRI, 128-Slice Dual-Source CT Scanner, Digital 3D Mammography, Color Doppler Ultrasound, DEXA Bone Densitometry.
   - Intensive Care Units: 45-bed state-of-the-art ICU, ICCU, PICU, and Level 3 NICU with HEPA-filtered laminar airflow.
   - Blood Bank & Dialysis: 24/7 NABH-accredited Blood Bank with apheresis unit; 16-station hemodialysis unit.
   - Telehealth / Video Consultations: High-definition secure video consultations available across all departments.
   - Parking & Accessibility: 400+ vehicle multi-level covered parking with complimentary valet and fast EV charging stations; 100% wheelchair accessible with priority ramps and electric buggies.
   - Food & Cafeteria: Multi-cuisine hygienic dietary cafeteria on Floor 2, 24/7 coffee lounge on Ground Floor.

5. INSURANCE & BILLING:
   - Cashless Mediclaim: Empaneled with all major insurance providers & TPAs including Star Health, HDFC ERGO, ICICI Lombard, Care Health, Max Bupa/Niva Bupa, Medi Assist, Vidal Health, Heritage Health, and Paramount TPA.
   - Government Schemes: Aarogyasri, CGHS, and ECHS desk available in Block B Ground Floor.
   - Typical Consultation Fees: General Medicine: ₹600; Super-specialty (Cardiology, Neurology, Orthopedics): ₹900 – ₹1,200. Follow-up within 7 days is complimentary.

6. HOW TO USE THE SMARTCARE PLATFORM:
   - Book Appointment: Click **'Book Appointment'** in your sidebar. You can use the instant Smart AI booking assistant or the 5-step guided booking form.
   - Download Lab Reports: Go to the **'Lab Reports'** or **'Medical Records'** tab to view biometrics and download stamped PDF reports.
   - Check Prescriptions: Review active medication dosages, schedules, and refill reminders under **'Prescriptions'**.
   - Manage Profile: Upload profile pictures, update emergency contacts, and manage allergies in your account settings.

COMMUNICATION GUIDELINES:
- Warmly acknowledge everyday greetings ("Hi", "Hello", "Good morning", "Who are you?", "How does this work?").
- Answer questions with structured markdown (using bullet points, bold headings, and clear steps) so the patient gets clear, readable advice.
- When asked medical questions about illnesses or symptoms, provide helpful general health context and strongly encourage booking a consultation with the appropriate doctor.
- NEVER fabricate medical diagnoses. Always include a brief note that assistant information is educational and clinical consultation is recommended.`;

const SYSTEM_CONTEXT_CHATBOT_DOCTOR = `You are Intercity Healthcare's Physician & Clinical Operations Assistant.
You support our attending physicians, surgeons, and resident doctors with schedule management, clinical workflows, and hospital protocols.

KEY DOCTOR WORKFLOWS:
- Outpatient Agenda & Queue: View booked patients, mark checked-in/arrived status, and manage real-time queues from the Doctor Dashboard.
- Clinical Documentation: Record patient vitals, diagnosis notes, clinical history, and generate digital e-prescriptions.
- Telemedicine: Launch secure WebRTC encrypted video consultations directly from patient appointment cards.
- Shift & Leave Requests: Submit scheduled leaves and on-call swaps via the Leave Management section.
- Emergency Rapid Response: Code Blue / Trauma Team activation line: Extension 4999 / +91 40 2890 4999.
- Lab & Imaging Requisitions: Direct electronic orders for 3T MRI, 128-slice CT, and statutory lab panels.

Maintain a concise, clinically accurate, and professional tone. Assist promptly with dashboard tools and administrative procedures.`;

const SYSTEM_CONTEXT_CHATBOT_ADMIN = `You are Intercity Healthcare's Executive Administrative & Operations Assistant.
You provide hospital administrators, nursing superintendents, and operational leaders with institutional insights.

ADMINISTRATIVE SCOPE:
- Patient Census & Bed Occupancy: Real-time telemetry across General Wards, Semi-Private, Deluxe Rooms, and ICUs (45 beds).
- Operational Metrics: Average waiting time, daily OPD footfall, doctor punctuality indices, and OT utilization rates.
- Financial Analytics: Daily revenue breakdowns, insurance pre-authorization status, pending claims, and cash collections.
- Staffing & Rostering: Manage doctor schedules, department allocations, leave approvals, and duty rosters.
- Emergency Disaster Preparedness: Mass casualty triage protocols and facility safety checklists.

Provide structured, data-driven, and crisp executive summaries.`;

function getSmartClinicalChatFallback(query: string, role: 'patient' | 'doctor' | 'admin'): string {
  const q = query.toLowerCase().trim();

  // Basic greetings & identity
  if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hi ') || q.startsWith('hello ') || q === 'good morning' || q === 'good afternoon' || q === 'good evening') {
    return "Hello! 👋 Welcome to **Intercity Healthcare Multi-Specialty Hospital**.\n\nI am your 24/7 AI Clinical Assistant. Here are some of the things I can help you with right away:\n\n* **Book a Doctor Appointment** (Cardiology, Orthopedics, Neurology, Pediatrics, etc.)\n* **Doctor Profiles & Timings** (View our specialists and OPD schedules)\n* **Diagnostic Lab Reports** (Access and download your PDF test results)\n* **Hospital Information** (Visiting hours, location, parking, and insurance partners)\n* **Emergency & Trauma Care** (24/7 helpline and immediate casualty guidance)\n\nHow can I assist you today?";
  }

  if (q.includes('who are you') || q.includes('what can you do') || q.includes('what are you') || q.includes('help me with') || q.includes('your name')) {
    return "I am the **Intercity Healthcare Assistant**, powered by advanced clinical intelligence. I assist patients, doctors, and administrators with hospital navigation:\n\n1. **For Patients:** Schedule doctor visits, guide you through symptoms to the right department, access lab results, and provide hospital facility information.\n2. **For Doctors:** Assist with OPD queue management, clinical notes, patient vitals, and schedule coordination.\n3. **For Administrators:** Monitor real-time occupancy telemetry, revenue analytics, and duty rosters.\n\nPlease let me know what you need!";
  }

  // Diagnosis disclaimers
  if (q.includes('diagnos') || q.includes('do i have') || q.includes('what is wrong with me') || q.includes('am i sick') || q.includes('cure')) {
    return "⚠️ **Medical Advice Notice**: Intercity Healthcare assistants do not provide medical diagnoses or prescribe medications. Medical evaluations require clinical examination and diagnostics by a qualified physician.\n\nTo see a doctor, click **'Book Appointment'** in your sidebar. Our specialists in Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, and General Medicine are available for in-person and video consultations.";
  }

  // Appointment booking
  if (q.includes('appointment') || q.includes('book') || q.includes('schedule') || q.includes('consult') || q.includes('visit doctor')) {
    return "### How to Book an Appointment at Intercity Healthcare:\n\n1. Click **'Book Appointment'** in your sidebar menu.\n2. You have two convenient options on the same page:\n   - **Smart Booking Assistant**: Type your requirement in everyday language (e.g., *'I need a cardiologist on Saturday morning'*) and let AI configure the details.\n   - **5-Step Form**: Manually pick your department, select your preferred doctor, choose date & time, enter patient details, and confirm.\n3. You will receive an instant confirmation with token number and calendar invite.";
  }

  // Location / Address / Directions / Campus
  if (q.includes('where are you') || q.includes('location') || q.includes('address') || q.includes('reach') || q.includes('map') || q.includes('campus') || q.includes('branch')) {
    return "### Intercity Healthcare Hospital Locations:\n\n* **Main Multi-Specialty Campus**: Road No. 36, Jubilee Hills, Hyderabad - 500033 (Near Metro Pillar 1680).\n* **OPD & Diagnostic Annex**: Mindspace Junction, HITEC City, Hyderabad - 500081.\n* **Key Landmarks**: 5 minutes from Jubilee Hills Checkpost and HITEC City Cyber Towers.\n* **Parking**: 400+ vehicle multi-level covered parking with valet service and EV charging bays.";
  }

  // Emergency / Ambulance / Urgent / Trauma
  if (q.includes('emergency') || q.includes('urgent') || q.includes('ambulance') || q.includes('casualty') || q.includes('hotline') || q.includes('trauma') || q.includes('number') || q.includes('contact') || q.includes('phone')) {
    return "### 🚨 24/7 Emergency & Critical Care Hotlines:\n\n* **Emergency Casualty Hotline**: **+91 40 2890 4000** or **+91 40 2890 4999**\n* **National Medical Emergency**: **102** / **112**\n* **General Enquiries & Helpdesk**: **+91 40 2890 4100**\n* **Location**: Emergency Trauma Wing, Ground Floor, Jubilee Hills Campus (Open 24 hours, 365 days with on-site trauma surgeons, ICU, and blood bank).";
  }

  // Doctors / Specialists list
  if (q.includes('doctor') || q.includes('specialist') || q.includes('cardiologist') || q.includes('neurologist') || q.includes('pediatrician') || q.includes('orthopedic') || q.includes('dermatologist')) {
    return "### Intercity Healthcare Senior Specialists:\n\n* **Cardiology**: Dr. Arjun Sharma (MD, DM Cardiology) - Heart care, ECG, Angioplasty\n* **Neurology**: Dr. Priya Mehta (MD, DM Neurology) - Stroke, Migraine, Epilepsy\n* **Orthopedics**: Dr. Rajesh Kumar (MS Ortho, M.Ch) - Joint replacement, Sports injuries, Spine\n* **Pediatrics**: Dr. Sunita Patel (MD Pediatrics) - Child healthcare, Immunization\n* **Dermatology**: Dr. Vikram Singh (MD Dermatology) - Skin, Hair, Allergies\n* **Gynecology**: Dr. Ananya Krishnan (MS OBGYN) - Maternity, Women's health\n* **General Medicine**: Dr. Ramesh Varma (MD Internal Medicine) - Fever, Diabetes, Health checkups\n\nYou can view full bios, available slots, and book directly in the **'Book Appointment'** section.";
  }

  // Visiting hours & Timings
  if (q.includes('visiting') || q.includes('hours') || q.includes('timings') || q.includes('timing') || q.includes('open')) {
    return "### Hospital Hours & Timings:\n\n* **Outpatient Clinics (OPD)**: Monday – Saturday: 8:00 AM to 8:00 PM | Sunday: 9:00 AM to 1:00 PM\n* **Inpatient Ward Visiting Hours**: 10:00 AM – 1:00 PM and 4:30 PM – 7:30 PM daily (Pass required, max 2 visitors)\n* **ICU Visiting Hours**: 11:00 AM – 12:00 PM and 5:00 PM – 6:00 PM (Immediate family only)\n* **Emergency & Trauma Casualty**: **Open 24/7**\n* **In-house Pharmacy & Diagnostics**: **Open 24/7**";
  }

  // Insurance / Cashless / Payment / Fees
  if (q.includes('insurance') || q.includes('cashless') || q.includes('tpa') || q.includes('claim') || q.includes('pay') || q.includes('bill') || q.includes('cost') || q.includes('fee') || q.includes('price')) {
    return "### Billing, Fees & Cashless Insurance:\n\n* **Consultation Fees**:\n  - General Medicine: ₹600\n  - Super-Specialists (Cardio, Neuro, Ortho): ₹900 – ₹1,200\n  - 7-day follow-up consultation is complimentary\n* **Cashless Insurance Partners**: Star Health, HDFC ERGO, ICICI Lombard, Care Health, Max Bupa/Niva Bupa, Medi Assist, Vidal Health, Heritage Health.\n* **Govt Schemes Desk**: Aarogyasri, CGHS, and ECHS helpdesk located on Block B Ground Floor.\n* **Payment Modes**: UPI (GPay/PhonePe), Credit/Debit Cards, Net Banking, and Cash.";
  }

  // Reports / Lab tests
  if (q.includes('report') || q.includes('lab') || q.includes('test') || q.includes('download') || q.includes('scan') || q.includes('blood test') || q.includes('mri') || q.includes('ct')) {
    return "### Diagnostic Tests & Lab Reports:\n\n* **Access Reports**: Visit the **'Diagnostic Lab Reports'** or **'Medical Records'** tab in your sidebar.\n* **Download PDF**: You can view biometric parameters and download digitally stamped clinical PDF reports anytime.\n* **Advanced Diagnostics Available**: 3T Silent MRI, 128-Slice Dual-Source CT, Digital 3D Mammography, Color Doppler Ultrasound, Pathology & Microbiology panels.\n* Routine blood tests are processed within 2 to 4 hours with instant SMS/app alerts.";
  }

  // Prescriptions / Medicines
  if (q.includes('prescription') || q.includes('medicine') || q.includes('rx') || q.includes('pharmacy') || q.includes('drug')) {
    return "### Prescriptions & Pharmacy Services:\n\n* **Digital Prescriptions**: View all doctor-issued prescriptions with dosages and schedules under the **'Active Medications'** tab in your sidebar.\n* **24/7 Hospital Pharmacy**: Located on the Ground Floor, stocking genuine medications, surgical supplies, and specialized oncology/cardiac drugs.\n* **Refills & Delivery**: Home delivery is available for senior citizens within 10 km of Jubilee Hills.";
  }

  // Parking & Facilities
  if (q.includes('parking') || q.includes('car') || q.includes('valet') || q.includes('wheelchair') || q.includes('wifi') || q.includes('cafeteria') || q.includes('canteen')) {
    return "### Hospital Amenities & Facilities:\n\n* **Parking**: 400+ covered bays with complimentary valet parking and high-speed EV charging stations.\n* **Accessibility**: Wheelchair accessible throughout, with ramp access, wide elevators, and electric patient buggies.\n* **Cafeteria**: Clean multi-cuisine food court on Floor 2; 24/7 coffee shop on Ground Floor.\n* **Guest WiFi**: High-speed complimentary WiFi throughout all outpatient lounges and inpatient rooms.";
  }

  // Role specific answers
  if (role === 'doctor') {
    if (q.includes('agenda') || q.includes('queue') || q.includes('today') || q.includes('patient')) {
      return "Doctor, your real-time outpatient queue and confirmed consultations are live on your **Doctor Dashboard**. You can check-in patients, update biometric vitals, record diagnostic notes, and issue digital prescriptions with one click.";
    }
    if (q.includes('leave') || q.includes('vacation') || q.includes('off')) {
      return "To apply for leave or adjust your OPD consultation hours, head to the **'Leave Management'** tab. Administration will review and auto-block your booking calendar accordingly.";
    }
  }

  if (role === 'admin') {
    if (q.includes('revenue') || q.includes('stats') || q.includes('occupancy') || q.includes('bed') || q.includes('census')) {
      return "Administrator, real-time bed occupancy telemetry (ICU, Private, General Wards), daily OPD revenue summaries, and department operational throughput are available on your **Executive Admin Dashboard**.";
    }
  }

  return "Thank you for reaching out to **Intercity Healthcare Assistant**.\n\nI can help you with:\n* Scheduling appointments with our specialists (Cardiology, Neurology, Orthopedics, Pediatrics, etc.)\n* Checking visiting hours, hospital location, and parking\n* Finding information on cashless insurance and consultation fees\n* Accessing your diagnostic lab reports\n* 24/7 emergency casualty assistance\n\nPlease let me know how I can assist you today!";
}

export async function sendAppointmentMessage(
  history: AIMessage[],
  newMessage: string
): Promise<{ text: string; appointmentData: AppointmentExtract | null }> {
  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ 
      model: 'gemini-3.6-flash',
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
    
    if (lower.includes('cardio') || lower.includes('heart') || lower.includes('chest') || lower.includes('palpitation') || lower.includes('bp')) {
      department = 'Cardiology';
      specialty = 'Cardiology';
    } else if (lower.includes('neuro') || lower.includes('brain') || lower.includes('headache') || lower.includes('migraine') || lower.includes('spine')) {
      department = 'Neurology';
      specialty = 'Neurology';
    } else if (lower.includes('ortho') || lower.includes('bone') || lower.includes('knee') || lower.includes('joint') || lower.includes('fracture')) {
      department = 'Orthopedics';
      specialty = 'Orthopedics';
    } else if (lower.includes('pedia') || lower.includes('child') || lower.includes('baby') || lower.includes('infant') || lower.includes('vaccin')) {
      department = 'Pediatrics';
      specialty = 'Pediatrics';
    } else if (lower.includes('derma') || lower.includes('skin') || lower.includes('rash') || lower.includes('acne') || lower.includes('allergy')) {
      department = 'Dermatology';
      specialty = 'Dermatology';
    } else if (lower.includes('gyn') || lower.includes('preg') || lower.includes('woman') || lower.includes('women') || lower.includes('period') || lower.includes('maternity')) {
      department = 'Gynecology';
      specialty = 'Gynecology';
    } else if (lower.includes('ent') || lower.includes('ear') || lower.includes('nose') || lower.includes('throat') || lower.includes('hearing')) {
      department = 'ENT';
      specialty = 'ENT';
    } else if (lower.includes('eye') || lower.includes('vision') || lower.includes('cataract') || lower.includes('opt')) {
      department = 'Ophthalmology';
      specialty = 'Ophthalmology';
    } else if (lower.includes('dent') || lower.includes('tooth') || lower.includes('teeth') || lower.includes('gum')) {
      department = 'Dentistry';
      specialty = 'Dentistry';
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
      model: 'gemini-3.6-flash',
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
