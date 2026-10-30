import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z\d]/,
      'Password must contain at least one special character',
    )
    .regex(
      PASSWORD_REGEX,
      'Password must be at least 8 characters long and contain at least one letter, one number, and one special character',
    ),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const SignUpPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });

  const passwordValue = watch('password', '');

  const passwordChecks = [
    { label: 'At least 8 characters', met: passwordValue.length >= 8 },
    { label: 'At least one letter (a-z, A-Z)', met: /[A-Za-z]/.test(passwordValue) },
    { label: 'At least one number (0-9)', met: /\d/.test(passwordValue) },
    {
      label: 'At least one special character (!@#$...)',
      met: /[^A-Za-z\d]/.test(passwordValue),
    },
  ];

  const onSubmit = async (values: SignUpFormValues) => {
    setApiError(null);
    try {
      await signUp(values);
      navigate('/app', { replace: true });
    } catch (error) {
      setApiError(extractErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign up to access the secure application portal
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur">
          {apiError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-sm text-rose-300"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane.doe@example.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                    errors.email
                      ? 'border-rose-500/60 focus:ring-rose-500/30'
                      : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/30'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Full name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  {...register('name')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                    errors.name
                      ? 'border-rose-500/60 focus:ring-rose-500/30'
                      : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/30'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  {...register('password')}
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                    errors.password
                      ? 'border-rose-500/60 focus:ring-rose-500/30'
                      : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400">
                  {errors.password.message}
                </p>
              )}

              {/* Real-time Password Criteria Checklist */}
              <div className="mt-3 rounded-xl bg-slate-950/70 border border-slate-800/80 p-3 space-y-1.5">
                <p className="text-xs font-medium text-slate-400 mb-1">
                  Password requirements:
                </p>
                {passwordChecks.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 text-xs transition ${
                      item.met ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {item.met ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                    )}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

