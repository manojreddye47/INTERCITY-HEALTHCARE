import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['patient', 'doctor']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'patient'
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Auto login with demo user for simplicity in this frontend
      useAuthStore.getState().setDemoUser(data.role);
      toast.success('Registration successful!');
      navigate(`/${data.role}/dashboard`);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90 z-0"></div>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10"></div>
        
        <div className="relative z-20">
          <div className="flex items-center gap-2 mb-12 text-white">
            <Heart className="h-8 w-8 text-white fill-white" />
            <span className="text-3xl font-bold">Intercity Healthcare</span>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-white mb-6 leading-tight">
              Join the Future of Healthcare
            </h1>
            <p className="text-blue-100 text-lg mb-12 max-w-md">
              Create an account to manage your health, book appointments, and connect with top doctors seamlessly.
            </p>
          </motion.div>
        </div>

        <div className="relative z-20 space-y-6">
          {[
            { title: 'Personalized Care', desc: 'Tailored healthcare experience' },
            { title: 'Secure Data', desc: 'Your health records are encrypted' },
            { title: '24/7 Access', desc: 'Manage your health anytime, anywhere' }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
              className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm"
            >
              <div className="bg-white/20 p-2 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create an Account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Join Intercity Healthcare today
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('name')}
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer">
                  <input type="radio" value="patient" {...register('role')} className="peer sr-only" />
                  <div className="rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-center hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:text-blue-600 dark:peer-checked:text-blue-400 transition-all">
                    Patient
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" value="doctor" {...register('role')} className="peer sr-only" />
                  <div className="rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-center hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:text-blue-600 dark:peer-checked:text-blue-400 transition-all">
                    Doctor
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
