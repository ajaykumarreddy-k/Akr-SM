import React from 'react';
import { 
  X, 
  Wallet, 
  Grid, 
  MessageSquare, 
  Headphones, 
  Info, 
  ThumbsUp, 
  Share2, 
  LogOut 
} from 'lucide-react';

interface SidebarDrawerProps {
  userName?: string;
  userPhone?: string;
  isOpen: boolean;
  onClose: () => void;
  onAddMoney: () => void;
  onLogout?: () => void;
  onSelectMenuItem: (item: string) => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  userName = 'Ajay Kumar Reddy k',
  userPhone,
  isOpen,
  onClose,
  onAddMoney,
  onLogout,
  onSelectMenuItem
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-[85%] max-w-[340px] h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* User Profile Banner Top */}
        <div className="pt-8 pb-4 px-6 flex flex-col items-center text-center bg-gradient-to-b from-indigo-50/70 to-white">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3 shadow-md border-4 border-white bg-[#38BDF8]">
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
        </div>

        {/* R-Wallet Box inside Sidebar */}
        <div className="mx-5 mb-5 p-3.5 bg-[#EEF2FF] rounded-2xl border border-indigo-100 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#818CF8] flex items-center justify-center text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">R-Wallet</span>
              <span className="text-slate-900 font-extrabold text-sm">₹ 0.00</span>
            </div>
          </div>

          <button 
            onClick={() => {
              onClose();
              onAddMoney();
            }}
            className="bg-[#0066FF] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors"
          >
            Add Money
          </button>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 px-4 space-y-1">
          {/* Item 1: Show/Hide Services */}
          <button 
            onClick={() => onSelectMenuItem('Show/Hide Services')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
              <Grid className="w-4 h-4" />
            </div>
            <span>Show/Hide Services</span>
          </button>

          {/* Item 2: FAQs */}
          <button 
            onClick={() => onSelectMenuItem('FAQs')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span>FAQs</span>
          </button>

          {/* Item 3: Help & Support */}
          <button 
            onClick={() => onSelectMenuItem('Help & Support')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
              <Headphones className="w-4 h-4" />
            </div>
            <span>Help & Support</span>
          </button>

          {/* Item 4: About */}
          <button 
            onClick={() => onSelectMenuItem('About')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-800 font-semibold text-sm hover:bg-[#F8FAFC] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 group-hover:scale-105 transition-transform">
              <Info className="w-4 h-4" />
            </div>
            <span>About</span>
          </button>

          {/* Item 5: Rate Us */}
          <button 
            onClick={() => onSelectMenuItem('Rate Us')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-800 font-semibold text-sm hover:bg-[#F8FAFC] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <span>Rate Us</span>
          </button>

          {/* Item 6: Share */}
          <button 
            onClick={() => onSelectMenuItem('Share')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-800 font-semibold text-sm hover:bg-[#F8FAFC] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
              <Share2 className="w-4 h-4" />
            </div>
            <span>Share</span>
          </button>

          {/* Item 7: Log Out */}
          {onLogout && (
            <button 
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-rose-600 font-semibold text-sm hover:bg-rose-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-105 transition-transform">
                <LogOut className="w-4 h-4" />
              </div>
              <span>Log Out</span>
            </button>
          )}
        </div>

        {/* App Version Footer */}
        <div className="py-6 text-center text-xs font-medium text-slate-400 border-t border-slate-100 mt-2">
          V-2.1.62-231
        </div>
      </div>
    </div>
  );
};
