import React, { useState } from 'react';
import { User, Phone, ArrowRight, ShieldCheck, Train } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (name: string, phone: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    onLoginSuccess(name.trim(), cleanPhone);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-[#0066FF] via-[#0052CC] to-[#0B1E48] text-white p-6 overflow-y-auto select-none">
      
      {/* Top Branding Section */}
      <div className="pt-8 flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
          <Train className="w-9 h-9 text-white" />
        </div>
        
        <div className="flex items-center justify-center">
          <img 
            src="/images/Railone.png" 
            alt="RailOne" 
            className="h-9 object-contain brightness-0 invert" 
          />
        </div>
        
        <p className="text-blue-100 text-xs font-medium max-w-[240px]">
          Official Indian Railways UTS & Ticketing Portal
        </p>
      </div>

      {/* Main Login Form Card */}
      <div className="my-auto pt-6 pb-4">
        <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-[#0B1E48] tracking-tight">
              Welcome to RailOne
            </h2>
            <p className="text-slate-500 text-xs font-medium">
              Enter your details to access tickets & services
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all placeholder-slate-400"
                />
              </div>
            </div>

            {/* Mobile Number Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="text-xs font-bold text-slate-500 absolute left-3.5 flex items-center gap-1 border-r border-slate-200 pr-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> +91
                </span>
                <input 
                  type="tel" 
                  maxLength={10}
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-20 pr-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all placeholder-slate-400"
                />
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-600 font-semibold text-center animate-in fade-in duration-200">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-[#0066FF] text-white py-3.5 rounded-2xl font-extrabold text-sm shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Security Footer */}
      <div className="pb-4 text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-blue-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secured by Centre for Railway Information Systems (CRIS)</span>
        </div>
        <p className="text-[10px] text-blue-300/70 font-medium">
          Version 2.1.62 • Indian Railways Official Application
        </p>
      </div>

    </div>
  );
};
