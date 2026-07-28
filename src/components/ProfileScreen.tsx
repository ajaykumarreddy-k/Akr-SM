import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  Edit3, 
  Wallet, 
  RefreshCw, 
  Users, 
  Lock, 
  CreditCard, 
  Ticket, 
  Bookmark, 
  IdCard,
  LogOut
} from 'lucide-react';

interface ProfileScreenProps {
  userName?: string;
  userPhone?: string;
  onBack: () => void;
  onAddMoney: () => void;
  onLogout?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  userName = 'Ajay Kumar Reddy k', 
  userPhone = '9876543210',
  onBack, 
  onAddMoney,
  onLogout
}) => {
  const [biometricOn, setBiometricOn] = useState<boolean>(true);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-6">
      {/* Top Header Background (Soft Light Cyan Top Area) */}
      <div className="bg-gradient-to-b from-[#D8F3FC] to-white pt-3 pb-4 px-4">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/80 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </button>
          
          {onLogout && (
            <button 
              onClick={onLogout}
              className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 hover:bg-rose-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          )}
        </div>

        {/* Profile Avatar & Name */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-2 shadow-md border-4 border-white bg-[#38BDF8]">
            <img 
              src="/images/Profile-default.png" 
              alt="Profile Avatar" 
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-slate-900 font-extrabold text-lg tracking-tight">
            {userName}
          </h2>
          {userPhone && (
            <span className="text-slate-500 text-xs font-semibold">
              +91 {userPhone}
            </span>
          )}

          <div className="flex items-center gap-3 text-xs font-semibold text-[#0066FF] mt-1.5">
            <button className="flex items-center gap-1 hover:underline">
              <Eye className="w-3.5 h-3.5" /> View Details
            </button>
            <span className="text-slate-300">|</span>
            <button className="flex items-center gap-1 hover:underline">
              <Edit3 className="w-3.5 h-3.5" /> Edit Details
            </button>
          </div>
        </div>

        {/* Card 1: R-Wallet */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#22C55E] flex items-center justify-center text-white shadow-xs">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">R-Wallet</span>
              <span className="text-slate-900 font-extrabold text-base">₹ 0.00</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              title="Refresh Balance"
            >
              <RefreshCw className="w-5 h-5 text-[#0066FF]" />
            </button>
            <button 
              onClick={onAddMoney}
              className="bg-[#0066FF] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 space-y-4">
        {/* Card 2: Profile Incomplete Progress Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-800 font-semibold text-sm">Profile Incomplete</span>
            <span className="text-slate-900 font-bold text-sm">80%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-[#65A30D] h-full w-[80%] rounded-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Card 3: Saved Passengers */}
        <div className="bg-[#FFF5EA] rounded-2xl p-3.5 border border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-900 font-bold text-xs block">Saved Passengers</span>
              <span className="text-slate-500 text-[11px]">Add/Edit Passenger info</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1.5 text-amber-500 hover:text-amber-700">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="bg-[#F59E0B] text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors shadow-xs">
              Add
            </button>
          </div>
        </div>

        {/* Tile Grid (2 x 3) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Tile 1: Change Password */}
          <button className="bg-[#EBF7FF] p-4 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-[#d8effe] transition-colors border border-sky-100">
            <div className="w-10 h-10 rounded-xl bg-sky-200/60 flex items-center justify-center text-sky-600 mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              Change Password
            </span>
          </button>

          {/* Tile 2: My Account */}
          <button className="bg-[#EDF9F1] p-4 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-[#d9f3e2] transition-colors border border-emerald-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-200/60 flex items-center justify-center text-emerald-600 mb-2">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              My Account
            </span>
          </button>

          {/* Tile 3: Biometric */}
          <div className="bg-[#FDF0F5] p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-rose-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-[#0066FF] uppercase">
                {biometricOn ? 'On' : 'Off'}
              </span>
              <button 
                onClick={() => setBiometricOn(!biometricOn)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                  biometricOn ? 'bg-[#0066FF]' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  biometricOn ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              Biometric
            </span>
          </div>

          {/* Tile 4: Transfer Ticket */}
          <button className="bg-[#F0F5FF] p-4 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-[#deebff] transition-colors border border-indigo-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-200/60 flex items-center justify-center text-indigo-600 mb-2">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              Transfer Ticket
            </span>
          </button>

          {/* Tile 5: My Transaction */}
          <button className="bg-[#FFF9EA] p-4 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-[#feefcd] transition-colors border border-amber-100">
            <div className="w-10 h-10 rounded-xl bg-amber-200/60 flex items-center justify-center text-amber-600 mb-2">
              <Bookmark className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              My Transaction
            </span>
          </button>

          {/* Tile 6: Link Your Aadhar */}
          <button className="bg-[#F6F7ED] p-4 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-[#ebedd3] transition-colors border border-lime-100">
            <div className="w-10 h-10 rounded-xl bg-lime-200/60 flex items-center justify-center text-lime-700 mb-2">
              <IdCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">
              Link Your Aadhar
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
