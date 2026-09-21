# Intercity Healthcare — AI-Powered Hospital CRM & Patient Management Platform

**Intercity Healthcare** is an advanced, production-grade Hospital CRM, Clinical Scheduling, and Telemetry platform built for Patients, Physicians, and Hospital Administrators.

---

## 🌟 Key Features

### 1. 🤖 Conversational AI Clinical Scheduling (Gemini 2.0)
- Natural language appointment booking:
  - *"I need a cardiologist tomorrow afternoon."*
  - *"I need a full body health check this Saturday."*
  - *"I want to see someone about knee pain next week."*
- Resolves medical specialties, filters live doctor availability, and confirms bookings with zero medical diagnosis policy.

### 2. ⚡ Genuine Realtime Synchronization
- Multi-dashboard live event propagation across Patient, Doctor, and Admin roles:
  - **Patient books** $\rightarrow$ Doctor queue updates instantly.
  - **Doctor updates status** (Arrived, In Consultation, Completed, No-Show) $\rightarrow$ Patient status badge reflects changes immediately.
  - **Admin approves leave** $\rightarrow$ Doctor is blocked on scheduling calendars in real time.
  - **In-app alerts** $\rightarrow$ Realtime notification badges update without page reload.

### 3. 🩺 Physician Workspace
- Daily patient agenda with step-by-step visit transitions.
- Master schedule calendar (Day, Week, Month views).
- Electronic medical records, consultation notes, and digital prescription generator.
- Working hours, breaks, and leave management requests.

### 4. 🏢 Hospital Executive Command Center
- Real-time hospital occupancy and patient flow telemetry.
- Monthly revenue trajectory and department collections analytics.
- Physician payroll and NEFT batch salary disbursals.
- Staff leave approvals, review ratings, and compliance audit trail.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Radix UI, Framer Motion, Lucide Icons, Recharts
- **State Management**: Zustand with persistent storage
- **Backend & Realtime**: Firebase Firestore & BroadcastChannel Mesh
- **AI / LLM**: Google Gemini 2.0 Flash (`@google/generative-ai`)
- **Build Tool**: Vite 8

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/manojreddye47/INTERCITY-HEALTHCARE.git
cd INTERCITY-HEALTHCARE
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=intercity-healthcare.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=intercity-healthcare
VITE_FIREBASE_STORAGE_BUCKET=intercity-healthcare.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 👥 Hackathon One-Click Demo Portals

The application includes built-in 1-click role logins for instant demonstration:
- **Patient Portal**: `/auth/login?role=patient`
- **Doctor Workspace**: `/auth/login?role=doctor`
- **Hospital Admin**: `/auth/login?role=admin`
