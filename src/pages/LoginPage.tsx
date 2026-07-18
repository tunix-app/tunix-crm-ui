import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestOtp, verifyOtp } from '@/lib/authApi';
import { ApiError } from '@/lib/api';
import { useUser } from '@/context/UserContext';
import { UserProfile } from '@/hooks/useSettings';

type Step = 'email' | 'otp';

const OTP_VALIDITY_SECONDS = 600;
const RESEND_COOLDOWN_SECONDS = 30;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, userId, user, isInitializing } = useUser();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(OTP_VALIDITY_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);

  const emailRef = useRef<HTMLInputElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Redirect already-authenticated users
  useEffect(() => {
    if (isInitializing || !userId || !user) return;
    navigate(user.role === 'Admin' ? '/admin/dashboard' : '/coach/dashboard', { replace: true });
  }, [isInitializing, userId, user, navigate]);

  // OTP validity countdown
  useEffect(() => {
    if (step !== 'otp') return;
    const interval = setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      await requestOtp(email.trim());
      setStep('otp');
      setSecondsLeft(OTP_VALIDITY_SECONDS);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 404) setError('No account found with this email address.');
        else if (err.status === 403) setError('This account does not have access to this application.');
        else setError(err.message || 'Something went wrong. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await requestOtp(email);
      setSecondsLeft(OTP_VALIDITY_SECONDS);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    } catch {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (!pasted) return;
    e.preventDefault();
    const newOtp = Array.from({ length: 8 }, (_, i) => pasted[i] ?? '');
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 7)]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length < 8) return;
    setIsLoading(true);
    setError(null);
    try {
      const { access_token, user: apiUser } = await verifyOtp(email, token);
      localStorage.setItem('auth_token', access_token);
      const profile: UserProfile = {
        id: apiUser.id,
        email: apiUser.email,
        role: apiUser.role,
        first_name: apiUser.first_name,
        last_name: apiUser.last_name,
      };
      setUser(apiUser.id, profile);
      // Redirect is handled by the useEffect watching userId/user
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Invalid or expired code. Request a new one if needed.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const isExpired = secondsLeft === 0;
  const countdownDisplay = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden mb-4 ring-2 ring-gray-200">
            <img src="/apple-touch-icon.png" alt="Tunix" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 'email' ? 'Sign in to GetJahBodyRight' : 'Check your email'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {step === 'email'
              ? 'Enter your email to receive a sign-in code'
              : `We sent an 8-digit code to ${email}`}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                ref={emailRef}
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null); }}
                placeholder="you@example.com"
                className="mt-1"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-700 text-white"
              disabled={!email.trim() || isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <Label>Enter your 8-digit code</Label>
              <div className="flex gap-1.5 mt-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    disabled={isLoading || isExpired}
                    className="flex-1 min-w-0 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
                  />
                ))}
              </div>
            </div>

            {isExpired ? (
              <p className="text-sm text-red-500">
                Your code has expired.{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading}
                  className="underline font-medium disabled:opacity-50"
                >
                  Request a new code
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Code expires in{' '}
                <span className="font-medium tabular-nums">{countdownDisplay}</span>
                {' · '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || isLoading}
                  className="underline disabled:no-underline disabled:text-gray-400"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-700 text-white"
              disabled={otp.join('').length < 8 || isLoading || isExpired}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Verify code
            </Button>

            <button
              type="button"
              onClick={() => { setStep('email'); setError(null); setOtp(['', '', '', '', '', '']); }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mx-auto"
            >
              <ArrowLeft className="h-3 w-3" />
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
