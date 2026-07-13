import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../store/useDashboardStore';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerUser = useDashboardStore(state => state.registerUser);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Confirm password does not match original password.');
      return;
    }

    setLoading(true);
    const success = await registerUser(fullName, email, password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('An operator with this email is already registered in the registry.');
    }
  };

  return (
    <div className="bg-[#030712] text-slate-100 min-h-screen font-sans flex items-center justify-center p-6 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Register Card */}
      <div className="w-full max-w-md bg-slate-950/65 backdrop-blur-md border border-slate-900 rounded-2xl p-8 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <Link to="/" className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all">
            <img src="/logo.jpg" className="w-full h-full object-cover" alt="Logo" />
          </Link>
          <div>
            <h2 className="text-lg font-bold text-slate-200 uppercase tracking-wider">
              Enlist Operator
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Create an operator account to monitor causal event graphs.
            </p>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-950/40 border border-rose-900/60 rounded-xl flex items-start space-x-2.5 text-xs text-rose-400 animate-in slide-in-from-top-4 duration-205">
            <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
            <div>
              <span className="font-semibold block mb-0.5">Enlistment Error</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center space-x-1.5">
              <User size={12} className="text-slate-500" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Sarah Jenkins"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3.5 py-2 text-slate-300 placeholder-slate-655 focus:outline-none focus:border-emerald-600/50 text-xs transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center space-x-1.5">
              <Mail size={12} className="text-slate-500" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3.5 py-2 text-slate-300 placeholder-slate-655 focus:outline-none focus:border-emerald-600/50 text-xs transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center space-x-1.5">
                <Lock size={12} className="text-slate-500" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3.5 py-2 pr-8 text-slate-300 placeholder-slate-655 focus:outline-none focus:border-emerald-600/50 text-xs transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center space-x-1.5">
                <Lock size={12} className="text-slate-500" />
                <span>Confirm Password</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3.5 py-2 text-slate-300 placeholder-slate-655 focus:outline-none focus:border-emerald-600/50 text-xs transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center space-x-1 transition-colors"
            >
              {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed rounded-lg text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 border border-emerald-400 transition-all mt-4"
          >
            <span>{loading ? 'Registering Operator...' : 'Register & Initialize'}</span>
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-900/50">
          <span>Already registered? </span>
          <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
