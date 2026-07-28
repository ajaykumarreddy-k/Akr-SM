import React, { useState } from 'react';
import { X, Search, CreditCard, CheckCircle2, Globe, Bell } from 'lucide-react';

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const GenericModal: React.FC<GenericModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const SearchTrainsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [from, setFrom] = useState('GUINDY (GDY)');
  const [to, setTo] = useState('TAMBARAM (TBM)');
  const [searched, setSearched] = useState(false);

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} title="Search Trains">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">From Station</label>
          <input 
            type="text" 
            value={from} 
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">To Station</label>
          <input 
            type="text" 
            value={to} 
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button 
          onClick={() => setSearched(true)}
          className="w-full bg-[#0066FF] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" /> Search Availability
        </button>

        {searched && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1 mt-3">
            <p className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 12 Local Trains Available Today
            </p>
            <p className="text-[11px] text-emerald-700">Next Departure: 22:35 (Exp) from Platform 2</p>
          </div>
        )}
      </div>
    </GenericModal>
  );
};

export const AddMoneyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('100');
  const [success, setSuccess] = useState(false);

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} title="Add Money to R-Wallet">
      {!success ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Enter Amount (₹)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-lg font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {['100', '200', '500'].map((amt) => (
              <button 
                key={amt}
                onClick={() => setAmount(amt)}
                className="flex-1 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
              >
                +₹{amt}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setSuccess(true)}
            className="w-full bg-[#0066FF] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" /> Proceed to Pay ₹{amount}
          </button>
        </div>
      ) : (
        <div className="text-center py-4 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-900">Payment Successful!</h4>
          <p className="text-xs text-slate-500">₹{amount} added to R-Wallet instantly.</p>
          <button 
            onClick={() => {
              setSuccess(false);
              onClose();
            }}
            className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold"
          >
            Done
          </button>
        </div>
      )}
    </GenericModal>
  );
};
