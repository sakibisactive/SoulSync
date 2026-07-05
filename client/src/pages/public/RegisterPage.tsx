import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation, useVerifyEmailMutation } from '../../redux/services/authApi';
import { setCredentials } from '../../redux/slices/authSlice';
import { Heart, Mail, Lock, User, Calendar, UserCheck, ShieldAlert, KeyRound, CheckCircle2, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<'register' | 'verify-otp'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState(24);
  const [otpCode, setOtpCode] = useState('');

  const [pendingToken, setPendingToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await registerUser({ name, email, password, gender, age }).unwrap();
      setPendingToken(res.pendingToken);
      setSuccessInfo(`6-digit OTP sent to ${email}. Check your email inbox!`);
      setStep('verify-otp');
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await verifyEmail({ pendingToken, otpCode }).unwrap();

      // ONLY NOW IS THE USER CREATED IN MONGODB & LOGGED IN
      if (res.user && res.accessToken) {
        dispatch(
          setCredentials({
            user: res.user,
            token: res.accessToken,
          })
        );
      }
      navigate('/edit-profile');
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'Invalid 6-digit OTP code. Please check your email inbox.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10">
      <div className="w-full max-w-lg space-y-8 glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-outfit">
            {step === 'register' ? 'Create SoulSync Account' : 'Verify Email OTP'}
          </h2>
          <p className="text-slate-400 text-sm">
            {step === 'register'
              ? 'Join the compatibility matching platform'
              : `Enter the 6-digit OTP sent to ${email}`}
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successInfo && step === 'verify-otp' && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{successInfo}</span>
          </div>
        )}

        {step === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address (OTP will be sent here)
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-slate-900"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Age
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min={18}
                    max={99}
                    required
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-rose-500 to-amber-500 hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isRegistering ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserCheck className="w-4 h-4" /> Send Email OTP & Register
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: INSERT 6-DIGIT OTP CODE */
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                6-Digit Verification OTP Code
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-lg font-mono tracking-widest font-extrabold text-center transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-rose-500 to-indigo-600 hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Verify OTP & Create Account
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('register')}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors text-center"
            >
              ← Back to Registration Form
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-semibold">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};
