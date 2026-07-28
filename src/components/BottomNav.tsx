import React from 'react';
import { Home, User, Menu } from 'lucide-react';

export type TabType = 'home' | 'bookings' | 'you' | 'menu';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-[#0066FF] text-white px-2 py-2 flex items-center justify-around shadow-lg border-t border-blue-500 shrink-0 sticky bottom-0 z-30">
      {/* Home Tab */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 ${
          activeTab === 'home' ? 'text-white font-bold scale-105' : 'text-blue-100/70 hover:text-white opacity-80'
        }`}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <Home className={`w-6 h-6 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">
          Home
        </span>
      </button>

      {/* My Bookings Tab */}
      <button
        onClick={() => onTabChange('bookings')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 ${
          activeTab === 'bookings' ? 'text-white font-bold scale-105' : 'text-blue-100/70 hover:text-white opacity-80'
        }`}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <img 
            src="/images/booking_nav-removebg-preview.png" 
            alt="My Bookings" 
            className="w-6 h-6 object-contain"
          />
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">
          My Bookings
        </span>
      </button>

      {/* You Tab */}
      <button
        onClick={() => onTabChange('you')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 ${
          activeTab === 'you' ? 'text-white font-bold scale-105' : 'text-blue-100/70 hover:text-white opacity-80'
        }`}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <User className={`w-6 h-6 ${activeTab === 'you' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">
          You
        </span>
      </button>

      {/* Menu Tab */}
      <button
        onClick={() => onTabChange('menu')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 ${
          activeTab === 'menu' ? 'text-white font-bold scale-105' : 'text-blue-100/70 hover:text-white opacity-80'
        }`}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <Menu className={`w-6 h-6 ${activeTab === 'menu' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">
          Menu
        </span>
      </button>
    </nav>
  );
};
