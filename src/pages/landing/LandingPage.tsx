import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, Menu, X, Activity, ShieldPlus, Clock, 
  MapPin, Phone, Mail, ChevronRight, Star, Quote, ChevronDown,
  Sparkles, Stethoscope, Calendar, ArrowRight, CheckCircle2, Shield, UserCheck, Bot
} from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { demoDepartments, demoDoctors, demoTestimonials, hospitalFAQs } from '@/data/demo';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 }
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  const filteredDepts = selectedDeptFilter === 'all' 
    ? demoDepartments 
    : demoDepartments.filter(d => d.name.toLowerCase().includes(selectedDeptFilter));

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Top Emergency Ribbon */}
      <div className="bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="font-bold">24/7 Trauma & Emergency Helpline:</span> +91 (22) 2890-4000
        </span>
        <span className="hidden md:inline text-blue-200">|</span>
        <span className="hidden md:inline text-blue-100">NABH & JCI Accredited Healthcare Center • Mumbai</span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">Intercity Healthcare</span>
              <p className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest mt-0.5">Clinical Intelligence</p>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#departments" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Specialties</a>
            <a href="#doctors" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Physicians</a>
            <a href="#ai-platform" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
              <span>AI Platform</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[10px] text-blue-700 dark:text-blue-300 font-bold">2.0</span>
            </a>
            <a href="#experience" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Technology</a>
            <a href="#testimonials" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Patient Stories</a>
            <a href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth/login">
              <Button variant="ghost" className="font-semibold text-slate-700 dark:text-slate-200">
                Staff & Patient Login
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 px-5">
                Book Consultation
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button 
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md"
            >
              <div className="flex flex-col p-5 space-y-4">
                <a href="#departments" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-900 dark:text-slate-100">Specialties</a>
                <a href="#doctors" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-900 dark:text-slate-100">Specialists</a>
                <a href="#ai-platform" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-900 dark:text-slate-100">AI Platform</a>
                <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-900 dark:text-slate-100">Hospital Technology</a>
                <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-900 dark:text-slate-100">Reviews</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-900 dark:text-slate-100">Contact & Hours</a>
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                  <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl">Portal Login</Button>
                  </Link>
                  <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl">Book Appointment</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-36">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Hero Content */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 max-w-2xl"
              >
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-teal-500" />
                  <span>Next-Gen Healthcare Management & Clinical AI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span className="text-teal-600 dark:text-teal-400">v2.0 Live</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                  Healthcare, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500">
                    Connected Around You.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  Intercity Healthcare delivers hospital CRM, intelligent patient triaging, automated appointment booking with Gemini AI, and real-time clinical workflows for doctors, patients, and administrators.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 mb-10">
                  <Link to="/auth/login">
                    <Button size="lg" className="h-13 px-8 text-sm font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all">
                      Book an Appointment
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>

                  <a href="#ai-platform">
                    <Button size="lg" variant="outline" className="h-13 px-7 text-sm font-semibold rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Bot className="mr-2 w-4 h-4 text-teal-500" />
                      Explore AI Booker
                    </Button>
                  </a>
                </div>

                {/* Instant Demo Role Access Chips */}
                <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur max-w-xl">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Hackathon Quick-Access (One-Click Demo Portals):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/auth/login?role=patient"
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
                    >
                      👤 Patient Portal
                    </Link>
                    <Link
                      to="/auth/login?role=doctor"
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-semibold text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
                    >
                      🩺 Doctor Workspace
                    </Link>
                    <Link
                      to="/auth/login?role=admin"
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
                    >
                      🏢 Hospital Admin
                    </Link>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 mt-10 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">25+</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Top Specialists</p>
                  </div>
                  <div>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">12</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Departments</p>
                  </div>
                  <div>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">10,000+</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Treated Patients</p>
                  </div>
                  <div>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">24/7</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Active ER & ICU</p>
                  </div>
                </div>
              </motion.div>

              {/* Right Hero: Live Clinical Telemetry Mockup */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-5 relative"
              >
                {/* Visual Glass Card Container */}
                <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-b from-slate-100 to-slate-200/60 dark:from-slate-800/70 dark:to-slate-900/90 p-1.5 shadow-2xl border border-slate-200/80 dark:border-slate-700/60">
                  <div className="rounded-[22px] bg-white dark:bg-slate-950 p-5 space-y-4 overflow-hidden">
                    {/* Header Widget */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-live-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">SmartCare Clinical OS</span>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        ONLINE • 99.98%
                      </span>
                    </div>

                    {/* Vitals Telemetry Box */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-teal-500/5 to-transparent border border-blue-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Continuous Patient Telemetry</span>
                        <Activity className="w-4 h-4 text-teal-500 animate-pulse" />
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">74 <span className="text-xs font-medium text-slate-500">BPM</span></span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Normal Sinus Rhythm</span>
                      </div>
                      {/* Animated SVG Pulse Wave */}
                      <svg className="w-full h-10 mt-2 text-teal-500 overflow-visible" viewBox="0 0 300 40" fill="none">
                        <path
                          d="M0 20 L40 20 L50 5 L60 35 L70 12 L80 25 L90 20 L160 20 L170 5 L180 35 L190 12 L200 25 L210 20 L300 20"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* Next Queue Consultation Card */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={demoDoctors[0].photoURL} 
                          alt="Doctor" 
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/20"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Dr. {demoDoctors[0].name}</p>
                          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">{demoDoctors[0].specialty}</p>
                          <p className="text-[10px] text-slate-400">Next Slot: Today at 4:30 PM</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-lg">
                        Available
                      </span>
                    </div>

                    {/* AI Assistant Chat Preview */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/50 to-teal-50/50 dark:from-slate-900 dark:to-slate-900 border border-blue-200/50 dark:border-blue-900/40">
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">Gemini Clinical Assistant</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                            "I matched your symptoms to Dr. Sarah Jenkins (Cardiology). Would you like to confirm the 4:30 PM slot?"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Accreditation Pill */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-5 -left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 z-20 flex items-center gap-3"
                >
                  <div className="bg-emerald-100 dark:bg-emerald-950/50 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <ShieldPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">NABH Accredited</p>
                    <p className="text-[10px] font-medium text-slate-500">Tier-1 Multi-Specialty Hospital</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* AI Platform Capabilities Showcase */}
        <section id="ai-platform" className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.25),rgba(255,255,255,0))]" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
                Cutting-Edge Medical AI
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-4 mb-4 tracking-tight">
                Designed for Clinical Precision & Seamless Access
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                SmartCare pairs Google Gemini 2.0 generative intelligence with a robust hospital management architecture.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Natural Language Appointment Booker</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Patients simply state: "I've had chest palpitations and shortness of breath since morning" — the AI extracts cardiology urgency, suggests available doctors, and sets the slot.
                </p>
                <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Structured XML & JSON Payload Extraction</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-teal-600/20 text-teal-400 flex items-center justify-center mb-5">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Dynamic Clinical Agenda & Queue</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Doctors receive a live queue with arrival notifications, patient record timelines, prescription quick-generators, and consultation status timers.
                </p>
                <div className="flex items-center gap-1.5 text-xs text-teal-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Real-time Patient Flow Management</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-5">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Admin Command & Analytics</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Hospital executives get deep visibility into bed occupancy, daily revenues, doctor productivity, staff leave approvals, and patient satisfaction trends.
                </p>
                <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Audit Logs & Financial Telemetry</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section id="departments" className="py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                Centers of Clinical Excellence
              </motion.h2>
              <motion.p {...fadeInUp} className="text-base text-slate-600 dark:text-slate-400">
                12 comprehensive departments staffed by renowned consultants with modern diagnostic infrastructure.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredDepts.map((dept, index) => (
                <motion.div 
                  key={dept.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-slate-50 dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all hover:-translate-y-1 group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left">{dept.icon}</div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{dept.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">{dept.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/40 dark:border-blue-800/40">
                      {dept.doctorCount} Specialists
                    </span>
                    <Link to="/auth/login" className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Book</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section id="doctors" className="py-24 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl">
                <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                  Meet Our Senior Specialists
                </motion.h2>
                <motion.p {...fadeInUp} className="text-base text-slate-600 dark:text-slate-400">
                  World-class clinicians committed to empathetic patient recovery and advanced treatments.
                </motion.p>
              </div>
              <motion.div {...fadeInUp}>
                <Link to="/auth/login">
                  <Button variant="outline" className="rounded-xl border-slate-300 dark:border-slate-700">
                    View All 25+ Doctors
                  </Button>
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoDoctors.slice(0, 6).map((doctor, index) => (
                <motion.div 
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="p-5 flex gap-4 items-start">
                    <img
                      src={doctor.photoURL}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">Dr. {doctor.name}</h3>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md shrink-0">
                          <Star className="h-3 w-3 fill-amber-400" />
                          {doctor.rating}
                        </span>
                      </div>
                      <p className="text-teal-600 dark:text-teal-400 font-semibold text-xs mt-0.5">{doctor.specialty}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">{doctor.qualifications.join(' • ')}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{doctor.experience} yrs clinical experience</p>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultation Fee</span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">₹{doctor.consultationFee}</span>
                    </div>
                    <Link to="/auth/login">
                      <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4">
                        Book Visit
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Hospital Experience & Facilities */}
        <section id="experience" className="py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                Designed for Patient Safety & Comfort
              </motion.h2>
              <motion.p {...fadeInUp} className="text-base text-slate-600 dark:text-slate-400">
                World-class hospital facilities designed to meet global accreditation benchmarks.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Advanced Robotic Surgery', desc: 'Precision robotic-assisted procedures minimizing recovery time and incision trauma.', icon: Activity },
                { title: 'Level 1 Trauma & 24/7 ICU', desc: 'Dedicated intensive care units with round-the-clock emergency anesthesiology.', icon: Clock },
                { title: '100% Cashless Insurance', desc: 'Direct tie-ups with 35+ major health insurance networks and corporate TPAs.', icon: ShieldPlus },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/20">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Patient Reviews / Testimonials */}
        <section id="testimonials" className="py-24 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                Trusted by 10,000+ Recovered Patients
              </motion.h2>
              <p className="text-sm text-slate-500">Verified patient testimonials across our specialties</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {demoTestimonials.slice(0, 3).map((testimonial, i) => (
                <motion.div 
                  key={testimonial.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 relative flex flex-col justify-between"
                >
                  <Quote className="absolute top-5 right-5 h-7 w-7 text-slate-200 dark:text-slate-800" />
                  <div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed">
                      "{testimonial.review}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Avatar fallback={testimonial.name} size="sm" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{testimonial.name}</p>
                      <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium capitalize">{testimonial.department.replace('-', ' ')} Care</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <div className="text-center mb-12">
              <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                Frequently Asked Questions
              </motion.h2>
              <p className="text-sm text-slate-500">Everything you need to know about SmartCare hospital services</p>
            </div>
            
            <Accordion.Root type="single" collapsible className="w-full space-y-3">
              {hospitalFAQs.map((faq, i) => (
                <Accordion.Item key={i} value={`item-${i}`} className="bg-slate-50 dark:bg-slate-900/60 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80">
                  <Accordion.Header className="flex">
                    <Accordion.Trigger className="flex flex-1 items-center justify-between py-4 px-5 text-left font-semibold text-xs sm:text-sm transition-all hover:bg-slate-100/60 dark:hover:bg-slate-800/60 [&[data-state=open]>svg]:rotate-180 text-slate-900 dark:text-white">
                      {faq.q}
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 text-slate-400" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-5 pb-4 pt-1">
                    {faq.a}
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </section>

        {/* Contact & Location */}
        <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Reach Out</span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 mb-6 tracking-tight">
                  Hospital Location & Direct Lines
                </h2>
                
                <div className="space-y-4">
                  <div className="flex gap-3.5 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Hospital Address</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Plot 42, Medical Enclave, Bandra West, Mumbai, Maharashtra 400050</p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Phone & Emergency</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">OPD Appointments: +91 (22) 2890-4001 • Trauma: +91 (22) 2890-4000</p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Email Inquiries</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">care@smartcare-hospital.in • appointments@smartcare.org</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Hospital Badge Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-600 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">Experience Intercity Healthcare Today</h3>
                    <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
                      Instant appointment confirmation, zero waiting queues, and direct consultation with top clinicians.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link to="/auth/login">
                      <Button size="lg" className="w-full h-13 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg">
                        Get Started in 60 Seconds
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-900">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-bold text-white text-sm">Intercity Healthcare Platform</span>
          </div>
          <p>© 2026 Intercity Healthcare Systems. Hackathon Production Build.</p>
        </div>
      </footer>
    </div>
  );
}
