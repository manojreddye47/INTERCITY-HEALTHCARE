import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Heart, Mail, Lock, Eye, EyeOff, User, Stethoscope, Shield, 
  Loader2, ArrowLeft, CheckCircle2, Sparkles, ChevronRight 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Medical3DCanvas } from '@/components/shared/Medical3DCanvas';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleDemoLogin = (role: 'patient' | 'doctor' | 'admin') => {
    try {
      useAuthStore.getState().setDemoUser(role);
      toast.success(`Welcome back! Authenticated as ${role.toUpperCase()}`);
      navigate(`/${role}/dashboard`);
    } catch {
      toast.error('Failed to log in with demo account');
    }
  };

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'patient' || roleParam === 'doctor' || roleParam === 'admin') {
      handleDemoLogin(roleParam);
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      let role: 'patient' | 'doctor' | 'admin' = 'patient';
      if (data.email.toLowerCase().includes('doctor')) role = 'doctor';
      if (data.email.toLowerCase().includes('admin')) role = 'admin';
      
      handleDemoLogin(role);
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Left Clinical 3D Brand Showcase Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-between p-10 text-white border-r border-slate-800 select-none">
        {/* 3D Canvas Background & Geometry */}
        <div className="absolute inset-0 z-0">
          <Medical3DCanvas speedMultiplier={1} themePreset="azure" />
        </div>

        {/* Ambient overlay shadows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group backdrop-blur-md bg-slate-900/40 p-2 pr-4 rounded-2xl border border-slate-800/80 hover:border-teal-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight">Intercity Healthcare</span>
              <p className="text-[10px] uppercase font-bold text-teal-400 tracking-widest leading-none mt-0.5">Hyderabad • Multi-Specialty</p>
            </div>
          </Link>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80 backdrop-blur-sm">
          <span>HITEC City & Jubilee Hills • Hyderabad</span>
          <span>ER 24/7 Helpline: +91 40 2890 4000</span>
        </div>
      </div>

      {/* Right Login Action Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 relative">
        {/* Top bar controls */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hospital Site</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Center Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6 pt-6 pb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sign In to Intercity Healthcare
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Choose a one-click demo role or sign in with your email.
            </p>
          </div>

          {/* Quick Access Demo Cards */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                ⚡ One-Click Instant Role Demo
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                Instant Access
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('patient')}
                className="flex flex-col text-left p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <User className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Patient</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Appointments & Rx</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('doctor')}
                className="flex flex-col text-left p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200/80 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 shadow-sm transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Doctor</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Queue & Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="flex flex-col text-left p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/80 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 shadow-sm transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Admin</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Finance & Operations</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-50 dark:bg-slate-950 px-3 text-slate-400 uppercase tracking-wider font-semibold">
                Or sign in with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="patient@smartcare.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link to="/auth/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
              Don't have an account yet?{' '}
              <Link to="/auth/register" className="font-bold text-blue-600 hover:underline dark:text-blue-400">
                Register New Patient
              </Link>
            </p>
          </form>
        </div>

        {/* Bottom copyright */}
        <p className="text-center text-xs text-slate-400">
          Protected by Intercity Healthcare Security • 256-bit SSL
        </p>
      </div>
    </div>
  );
}
