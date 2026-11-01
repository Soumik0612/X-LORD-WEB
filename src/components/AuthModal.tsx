import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, Shield, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, users, switchUser } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email) {
      setErrorMsg('Please enter your email');
      return;
    }
    const ok = login(email);
    if (!ok) {
      setErrorMsg('Account is blocked or credentials invalid.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name || !email) {
      setErrorMsg('Please fill in name and email');
      return;
    }
    const ok = register(name, email, referralCode);
    if (!ok) {
      setErrorMsg('An account with this email already exists.');
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email');
      return;
    }
    setSuccessMsg(`Password reset code dispatched to ${email}. Check your inbox!`);
    setTimeout(() => {
      setMode('reset');
      setSuccessMsg(null);
    }, 1500);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode || !newPassword) {
      setErrorMsg('Please enter reset verification code and new password');
      return;
    }
    setSuccessMsg('Password has been securely reset! You may now sign in.');
    setTimeout(() => {
      setMode('login');
      setSuccessMsg(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10131B] border border-[#1E2536] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2536]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3989E8]/20 border border-[#3989E8]/30 flex items-center justify-center text-[#3989E8]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                {mode === 'login'
                  ? 'Sign In to Account'
                  : mode === 'register'
                  ? 'Create New Account'
                  : mode === 'forgot'
                  ? 'Forgot Password'
                  : 'Reset Password'}
              </h2>
              <span className="text-[10px] text-slate-400">X LORD BOT MANAGEMENT</span>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg bg-[#151A26] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Demo Fast-Switch Pills */}
        <div className="mt-4 p-2.5 bg-[#0A0D15] rounded-xl border border-[#1E2536]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Quick Persona Switch:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {users.slice(0, 3).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  switchUser(u.id);
                  closeAuthModal();
                }}
                className="p-1.5 rounded-lg bg-[#151A26] hover:bg-[#1E273A] border border-[#1E2536] text-[10px] font-bold text-slate-200 transition-colors truncate text-center"
              >
                <span className="block truncate">{u.name}</span>
                <span className="text-[9px] text-[#3989E8] block uppercase">
                  {u.role === 'super_admin' ? 'Super Admin' : u.role === 'sub_admin' ? 'Sub Admin' : 'User'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Notifications */}
        {errorMsg && (
          <div className="mt-4 p-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mt-4 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs">
            {successMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5 mt-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@xlord.host or soumyadey983@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#3989E8]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-[#3989E8] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#3989E8]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-[#3989E8]/20 flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#3989E8] font-bold hover:underline"
              >
                Create Account (Free 50 Coins)
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 mt-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#3989E8]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#3989E8]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#3989E8]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Referral Code <span className="text-slate-500 text-[10px]">(Optional - +25 Bonus)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. XL-CHIEF-01"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#3989E8]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-[#3989E8]/20 flex items-center justify-center gap-2 mt-2"
            >
              <span>Register & Claim 50 Coins</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#3989E8] font-bold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-3.5 mt-4">
            <p className="text-xs text-slate-400">
              Enter the email address registered with your account to receive a 6-digit recovery PIN.
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Account Email</label>
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#3989E8]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Send Reset Code
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Remembered password?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#3989E8] font-bold hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* RESET PASSWORD */}
        {mode === 'reset' && (
          <form onSubmit={handleReset} className="space-y-3.5 mt-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                6-Digit Reset PIN
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 749210"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3 py-2 text-xs font-mono text-center tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-[#3989E8]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                New Secure Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0A0D15] border border-[#1E2536] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#3989E8]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#3989E8] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Update Password & Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
