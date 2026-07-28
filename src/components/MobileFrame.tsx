import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-0 sm:p-4 select-none">
      {/* Mobile Device Container */}
      <div className="w-full max-w-[430px] h-screen sm:h-[92vh] sm:max-h-[920px] bg-white sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border-[6px] sm:border-slate-800">
        
        {/* Dynamic Mobile Viewport Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative bg-white">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="bg-[#0066FF] py-1.5 flex justify-center items-center shrink-0 z-40">
          <div className="w-32 h-1 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
