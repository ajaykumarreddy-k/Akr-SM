import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
  onLanguageClick?: () => void;
  onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLanguageClick, onNotificationClick }) => {
  return (
    <header className="bg-white px-4 py-2.5 flex items-center justify-between shadow-xs sticky top-0 z-20 shrink-0 border-b border-slate-100">
      {/* Left Language Selector Icon */}
      <button 
        onClick={onLanguageClick}
        className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center hover:opacity-85 transition-opacity p-0.5"
        title="Change Language"
      >
        <img 
          src="/images/english to hindi icon.png" 
          alt="Change Language" 
          className="w-full h-full object-contain"
        />
      </button>

      {/* Center Logo - RailOne (Increased size slightly to h-8.5) */}
      <div className="flex items-center justify-center h-9">
        <img 
          src="/images/Railone.png" 
          alt="RailOne" 
          className="h-8.5 object-contain"
        />
      </div>

      {/* Right Notification Bell with Red Badge "5" */}
      <button 
        onClick={onNotificationClick}
        className="relative w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-slate-700" />
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
          5
        </span>
      </button>
    </header>
  );
};
