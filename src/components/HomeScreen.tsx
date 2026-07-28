import React from 'react';

interface HomeScreenProps {
  userName?: string;
  onSelectService: (serviceName: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  userName = 'Ajay Kumar Reddy k', 
  onSelectService 
}) => {
  return (
    <div className="flex-1 pb-6 px-4 bg-white overflow-y-auto">
      {/* Greeting Header */}
      <div className="pt-3 pb-2">
        <h2 className="text-slate-800 text-[15px] font-semibold tracking-tight">
          Hi, {userName}!
        </h2>
      </div>

      {/* Section 1: Journey Planner */}
      <div className="mt-2">
        <h3 className="text-slate-900 font-extrabold text-[17px] tracking-tight mb-3">
          Journey Planner
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {/* Card 1: Reserved */}
          <button 
            onClick={() => onSelectService('Reserved Train Booking')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border border-blue-100 group-hover:scale-105 transition-transform duration-200 bg-blue-50">
              <img 
                src="/images/reserved.png" 
                alt="Reserved" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[13px] font-medium text-slate-700 mt-2">Reserved</span>
          </button>

          {/* Card 2: Unreserved */}
          <button 
            onClick={() => onSelectService('Unreserved Booking (UTS)')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border border-amber-100 group-hover:scale-105 transition-transform duration-200 bg-amber-50">
              <img 
                src="/images/unreserved.png" 
                alt="Unreserved" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[13px] font-medium text-slate-700 mt-2">Unreserved</span>
          </button>

          {/* Card 3: Platform */}
          <button 
            onClick={() => onSelectService('Platform Ticket')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border border-slate-200 group-hover:scale-105 transition-transform duration-200 bg-slate-50">
              <img 
                src="/images/platform.png" 
                alt="Platform" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[13px] font-medium text-slate-700 mt-2">Platform</span>
          </button>
        </div>
      </div>

      {/* Section 2: More Offerings */}
      <div className="mt-6">
        <h3 className="text-slate-900 font-extrabold text-[17px] tracking-tight mb-3">
          More Offerings
        </h3>

        <div className="grid grid-cols-4 gap-2.5">
          {/* Tile 1: Search Trains */}
          <button 
            onClick={() => onSelectService('Search Trains')}
            className="flex flex-col items-center group"
          >
            <div className="w-full aspect-square rounded-2xl bg-[#FFEBF0] flex items-center justify-center p-2 group-hover:bg-[#ffd9e2] transition-colors shadow-xs overflow-hidden">
              <img src="/images/search trains.png" alt="Search Trains" className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight mt-1.5 px-0.5">
              Search Trains
            </span>
          </button>

          {/* Tile 2: PNR Status */}
          <button 
            onClick={() => onSelectService('PNR Status')}
            className="flex flex-col items-center group"
          >
            <div className="w-full aspect-square rounded-2xl bg-[#E6F8EF] flex items-center justify-center p-2 group-hover:bg-[#d0f3e2] transition-colors shadow-xs overflow-hidden">
              <img src="/images/PNR status.png" alt="PNR Status" className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight mt-1.5 px-0.5">
              PNR Status
            </span>
          </button>

          {/* Tile 3: Coach Position */}
          <button 
            onClick={() => onSelectService('Coach Position')}
            className="flex flex-col items-center group"
          >
            <div className="w-full aspect-square rounded-2xl bg-[#E6F4FE] flex items-center justify-center p-2 group-hover:bg-[#d1ebfe] transition-colors shadow-xs overflow-hidden">
              <img src="/images/Coach position.png" alt="Coach Position" className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight mt-1.5 px-0.5">
              Coach Position
            </span>
          </button>

          {/* Tile 4: Track Your Train */}
          <button 
            onClick={() => onSelectService('Track Your Train')}
            className="flex flex-col items-center group"
          >
            <div className="w-full aspect-square rounded-2xl bg-[#FFF8E6] flex items-center justify-center p-2 group-hover:bg-[#feefcd] transition-colors shadow-xs overflow-hidden">
              <img src="/images/Track your train.png" alt="Track Your Train" className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight mt-1.5 px-0.5">
              Track Your Train
            </span>
          </button>

          {/* Tile 5: Order Food */}
          <button 
            onClick={() => onSelectService('Order Food')}
            className="flex flex-col items-center group"
          >
            <div className="w-full aspect-square rounded-2xl bg-[#EEF0FE] flex items-center justify-center p-2 group-hover:bg-[#dfdcfd] transition-colors shadow-xs overflow-hidden">
              <img src="/images/order food.png" alt="Order Food" className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight mt-1.5 px-0.5">
              Order Food
            </span>
          </button>

          {/* Tile 6: File Refund */}
          <button 
            onClick={() => onSelectService('File Refund')}
            className="flex flex-col items-center group"
          >
            <div className="w-full aspect-square rounded-2xl bg-[#F1F5F9] flex items-center justify-center p-2 group-hover:bg-[#e2e8f0] transition-colors shadow-xs overflow-hidden">
              <img src="/images/File refund.png" alt="File Refund" className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight mt-1.5 px-0.5">
              File Refund
            </span>
          </button>

          {/* Tile 7: Rail Madad */}
          <button 
            onClick={() => onSelectService('Rail Madad')}
            className="flex flex-col items-center group"
          >
            <div className="w-full aspect-square rounded-2xl bg-[#FFEBF0] flex items-center justify-center p-2 group-hover:bg-[#ffd9e2] transition-colors shadow-xs overflow-hidden">
              <img src="/images/rail madad.png" alt="Rail Madad" className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight mt-1.5 px-0.5">
              Rail Madad
            </span>
          </button>

          {/* Tile 8: Go To WAVES */}
          <button 
            onClick={() => onSelectService('Go To WAVES')}
            className="flex flex-col items-center group"
          >
            <div className="w-full aspect-square rounded-2xl bg-[#64748B] flex items-center justify-center p-2 group-hover:bg-[#475569] transition-colors shadow-xs overflow-hidden">
              <img src="/images/go to waves.png" alt="Go To WAVES" className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight mt-1.5 px-0.5">
              Go To WAVES
            </span>
          </button>
        </div>
      </div>

      {/* Section 3: Do You know? */}
      <div className="mt-6">
        <h3 className="text-slate-900 font-extrabold text-[17px] tracking-tight mb-3">
          Do You know?
        </h3>

        {/* Horizontal scroll cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
          {/* Fact 1 */}
          <div className="min-w-[240px] max-w-[240px] snap-start flex flex-col">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200">
              <img 
                src="/images/Douknoww1.png" 
                alt="First passenger train 1853" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-snug mt-2">
              First ever passenger train was run between Bori Bandar to Thane on April 16, 1853.
            </p>
          </div>

          {/* Fact 2 */}
          <div className="min-w-[240px] max-w-[240px] snap-start flex flex-col">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200">
              <img 
                src="/images/Douknow2.png" 
                alt="Chenab Railway Bridge" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-snug mt-2">
              Chenab Railway Bridge in Dharot, Jammu & Kashmir is the World's highest Railway Bridge.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Follow Us On Social Media Platforms */}
      <div className="mt-6">
        <h3 className="text-slate-900 font-extrabold text-[17px] tracking-tight mb-3">
          Follow Us On Social Media Platforms
        </h3>

        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <img 
            src="/images/Social media -home.png" 
            alt="Follow Us On Social Media Platforms" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
