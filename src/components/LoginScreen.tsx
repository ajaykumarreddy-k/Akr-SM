import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, ArrowRight, ShieldCheck, Train, Fingerprint, ScanFace } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (name: string, phone: string) => void;
}

const TEMP_USER_KEY = 'railone_temp_user_v1';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  // Step state: 'register' (Image 1) or 'mpin' (Image 2)
  const [step, setStep] = useState<'register' | 'mpin'>('register');
  const [tempUser, setTempUser] = useState<{ name: string; phone: string } | null>(null);

  // Form states for Registration (Image 1)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [registerError, setRegisterError] = useState('');

  // States for mPIN screen (Image 2)
  const [mpin, setMpin] = useState<string[]>(['', '', '', '', '', '']);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const mpinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check local temp storage on mount
  useEffect(() => {
    try {
      const savedTemp = localStorage.getItem(TEMP_USER_KEY);
      if (savedTemp) {
        const parsed = JSON.parse(savedTemp);
        if (parsed && parsed.name) {
          setTempUser(parsed);
          setStep('mpin');
        }
      }
    } catch (e) {
      console.error('Error loading temp user:', e);
    }
  }, []);

  // Handle Registration Submit (Image 1 -> Image 2)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setRegisterError('Please enter your full name');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setRegisterError('Please enter a valid 10-digit mobile number');
      return;
    }
    setRegisterError('');

    const userData = { name: name.trim(), phone: cleanPhone };
    setTempUser(userData);
    try {
      localStorage.setItem(TEMP_USER_KEY, JSON.stringify(userData));
    } catch (err) {
      console.error('Error saving temp user:', err);
    }

    setStep('mpin');
  };

  // Handle mPIN input change
  const handleMpinChange = (index: number, value: string) => {
    const char = value.slice(-1);
    const newMpin = [...mpin];
    newMpin[index] = char;
    setMpin(newMpin);

    // Auto-advance focus to next input box
    if (char && index < 5) {
      mpinInputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits entered, complete login
    const fullPin = newMpin.join('');
    if (fullPin.length === 6 && tempUser) {
      setTimeout(() => {
        onLoginSuccess(tempUser.name, tempUser.phone);
      }, 200);
    }
  };

  // Handle mPIN key down (backspace support)
  const handleMpinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !mpin[index] && index > 0) {
      mpinInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle "Different User?" action
  const handleDifferentUser = () => {
    try {
      localStorage.removeItem(TEMP_USER_KEY);
    } catch (e) {
      console.error(e);
    }
    setTempUser(null);
    setName('');
    setPhone('');
    setMpin(['', '', '', '', '', '']);
    setStep('register');
  };

  // Direct login trigger for mPIN
  const triggerLogin = () => {
    if (tempUser) {
      onLoginSuccess(tempUser.name, tempUser.phone);
    }
  };

  // RENDER STEP 1: Registration Form (Image 1)
  if (step === 'register') {
    return (
      <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-[#0066FF] via-[#0052CC] to-[#0B1E48] text-white p-6 overflow-y-auto select-none">
        
        {/* Top Branding Section */}
        <div className="pt-6 flex flex-col items-center text-center space-y-3">
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

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
              {registerError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-600 font-semibold text-center animate-in fade-in duration-200">
                  {registerError}
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
  }

  // RENDER STEP 2: Login using mPIN (Image 2)
  return (
    <div className="flex-1 flex flex-col justify-between bg-[#EBF7FD] text-slate-800 p-6 overflow-y-auto select-none">
      {/* Top Header Logo */}
      <div className="pt-6 flex flex-col items-center">
        <img 
          src="/images/Railone.png" 
          alt="RailOne" 
          className="h-9 object-contain" 
        />
      </div>

      {/* Main mPIN Card Body */}
      <div className="my-auto py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-[#0B1E48] tracking-tight">
            Login using mPIN
          </h1>
          <p className="text-slate-600 font-medium text-sm">
            Welcome {tempUser?.name || 'User'}!
          </p>
          <p className="text-slate-400 font-medium text-xs">
            Enter mPIN below
          </p>
        </div>

        {/* 6-Digit mPIN Input Boxes */}
        <div className="flex justify-center items-center gap-2 my-4">
          {mpin.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (mpinInputRefs.current[idx] = el)}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleMpinChange(idx, e.target.value)}
              onKeyDown={(e) => handleMpinKeyDown(idx, e)}
              className="w-11 h-12 bg-white border border-sky-200 rounded-xl text-center text-lg font-extrabold text-slate-900 shadow-xs focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-blue-200 transition-all"
            />
          ))}
        </div>

        {/* Forgot Password & Reset mPIN Links */}
        <div className="flex justify-between items-center px-1 text-xs font-bold">
          <button 
            type="button" 
            onClick={triggerLogin}
            className="text-[#0066FF] hover:underline"
          >
            Forgot Password?
          </button>
          <button 
            type="button" 
            onClick={triggerLogin}
            className="text-[#0066FF] hover:underline"
          >
            Reset mPIN?
          </button>
        </div>

        {/* Biometric Toggle Section */}
        <div className="pt-4">
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-dashed border-slate-300"></div>
            <span className="flex-shrink mx-3 text-slate-500 text-xs font-medium">
              Enable biometric ?
            </span>
            <div className="flex-grow border-t border-dashed border-slate-300"></div>
          </div>

          <div className="flex items-center justify-between py-2 px-1">
            <div className="flex items-center gap-3 text-slate-700">
              <ScanFace className="w-7 h-7" />
              <Fingerprint className="w-7 h-7" />
            </div>

            <button 
              type="button"
              onClick={() => setIsBiometricEnabled(!isBiometricEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                isBiometricEnabled ? 'bg-[#0066FF]' : 'bg-slate-300'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  isBiometricEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-medium text-center leading-relaxed mt-2 px-2">
            By enabling biometric authentication you will be able to login through your device set biometric.
          </p>
        </div>

        {/* Action Button & Different User Link */}
        <div className="pt-4 text-center space-y-3">
          <button
            type="button"
            onClick={triggerLogin}
            className="w-full bg-[#0066FF] text-white py-3.5 rounded-2xl font-extrabold text-sm shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Login to RailOne
          </button>

          <button 
            type="button" 
            onClick={handleDifferentUser}
            className="text-[#0066FF] font-extrabold text-sm hover:underline block w-full text-center"
          >
            Different User?
          </button>
        </div>
      </div>

      {/* Bottom Security Footer */}
      <div className="pb-4 text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured by Centre for Railway Information Systems (CRIS)</span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">
          Version 2.1.62 • Indian Railways Official Application
        </p>
      </div>

    </div>
  );
};

