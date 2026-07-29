import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { getSavedTickets } from '../utils/ticketStorage';
import { CleanTicketPopupModal } from './BookingDetailsModal';

export interface TicketData {
  id: string;
  type: 'Unreserved' | 'Reserved';
  codeType: 'UTS' | 'PNR';
  code: string;
  ticketCategory: string;
  bookingDate: string;
  fromStation: string;
  toStation: string;
  distanceOrTime: string;
  trainName?: string;
  passengers: string;
  classDetails: string;
  fare: string;
  bookedTimestamp: string;
  expiryTimestamp?: number;
  status: string;
}

interface BookingsScreenProps {
  onBack: () => void;
  onSelectTicket: (ticket: TicketData) => void;
  onBookAgain: (ticket: TicketData) => void;
  defaultFilterTab?: 'upcoming' | 'completed' | 'cancelled' | 'all';
}

// Ticket Card Component with Dynamic SVG path for true inward semicircular notch cutouts
const TicketCardItem: React.FC<{
  ticket: TicketData;
  currentTime: number;
  onSelectTicket: (ticket: TicketData) => void;
  onBookAgain: (ticket: TicketData) => void;
}> = ({ ticket, currentTime, onSelectTicket, onBookAgain }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 340, height: 165 });
  const [notchY, setNotchY] = useState(122);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const holdTimerRef = useRef<any>(null);

  const handleHoldStart = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      setIsPopupOpen(true);
    }, 1500); // 1.5 - 2 seconds hold duration
  };

  const handleHoldEnd = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDimensions({ width: rect.width, height: rect.height });
        }
      }
      if (footerRef.current) {
        const footerTop = footerRef.current.offsetTop;
        if (footerTop > 0) {
          setNotchY(footerTop);
        }
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isTicketActive = ticket.expiryTimestamp ? currentTime < ticket.expiryTimestamp : false;
  const strokeColor = isTicketActive ? '#F97316' : '#10B981';
  const dashedColor = isTicketActive ? '#FDBA74' : '#6EE7B7';

  const w = dimensions.width || 340;
  const h = dimensions.height || 165;
  const r = 11; // Smooth semicircle radius for notch cutout (22px diameter)
  const cr = 16; // Corner radius
  const ny = notchY || h - 38;

  // Single unbroken SVG path for rounded rectangle with smooth inward semicircular notch cutouts on left and right
  const pathD = `
    M ${cr} 0
    L ${w - cr} 0
    A ${cr} ${cr} 0 0 1 ${w} ${cr}
    L ${w} ${ny - r}
    A ${r} ${r} 0 0 0 ${w} ${ny + r}
    L ${w} ${h - cr}
    A ${cr} ${cr} 0 0 1 ${w - cr} ${h}
    L ${cr} ${h}
    A ${cr} ${cr} 0 0 1 0 ${h - cr}
    L 0 ${ny + r}
    A ${r} ${r} 0 0 0 0 ${ny - r}
    L 0 ${cr}
    A ${cr} ${cr} 0 0 1 ${cr} 0
    Z
  `;

  return (
    <>
      {isPopupOpen && (
        <CleanTicketPopupModal 
          ticket={ticket} 
          onClose={() => setIsPopupOpen(false)} 
        />
      )}
      <div 
        ref={containerRef}
        onClick={() => onSelectTicket(ticket)}
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        className="relative w-full cursor-pointer group rounded-2xl select-none shadow-xs hover:shadow-md transition-shadow active:scale-[0.99]"
      >
      {/* SVG Background Frame with True Inward Curved Notch Cutouts */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox={`0 0 ${w} ${h}`}
      >
        {/* Background Fill + Smooth Inward Curved Border */}
        <path 
          d={pathD} 
          fill="#FFFFFF" 
          stroke={strokeColor} 
          strokeWidth="1.5" 
          vectorEffect="non-scaling-stroke"
        />
        {/* Dashed Separator Line connecting left and right notches */}
        <line 
          x1={r} 
          y1={ny} 
          x2={w - r} 
          y2={ny} 
          stroke={dashedColor} 
          strokeWidth="1.2" 
          strokeDasharray="4 3" 
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Ticket Content Area */}
      <div className="relative z-10 p-3.5 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-3 py-0.5 rounded-lg text-xs font-semibold ${
            ticket.type === 'Unreserved' 
              ? 'bg-[#F0E6FF] text-[#7E22CE]' 
              : 'bg-[#D0F0FD] text-[#0369A1]'
          }`}>
            {ticket.type}
          </span>

          <span className="text-xs font-bold text-slate-900 tracking-tight">
            {ticket.codeType}: {ticket.code}
          </span>
        </div>

        <div className="flex justify-between items-start my-1 text-xs">
          <div>
            <span className="text-slate-400 text-[11px] block">
              {ticket.trainName ? 'Train No.' : 'Ticket Type'}
            </span>
            <span className="font-bold text-slate-800 text-[13px]">
              {ticket.trainName || ticket.ticketCategory}
            </span>
          </div>

          <div className="text-right">
            <span className="text-slate-400 text-[11px] block">
              {ticket.trainName ? 'Journey Date' : 'Booking Date'}
            </span>
            <span className="font-semibold text-slate-800 text-[13px]">
              {ticket.bookingDate}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between my-2 pt-1">
          <span className="font-extrabold text-slate-900 text-sm tracking-tight">
            {ticket.fromStation}
          </span>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
            <span>—</span>
            <span>{ticket.distanceOrTime}</span>
            <span>—</span>
          </div>
          <span className="font-extrabold text-slate-900 text-sm tracking-tight text-right">
            {ticket.toStation}
          </span>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div 
        ref={footerRef}
        className="relative z-10 grid grid-cols-2 text-center py-2.5 bg-slate-50/10 rounded-b-2xl"
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onBookAgain(ticket);
          }}
          className="font-bold text-[#0066FF] text-[13px] hover:text-blue-700 transition-colors"
        >
          Book Again
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelectTicket(ticket);
          }}
          className="font-bold text-[#0066FF] text-[13px] border-l border-slate-200 hover:text-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
    </>
  );
};

export const BookingsScreen: React.FC<BookingsScreenProps> = ({
  onBack,
  onSelectTicket,
  onBookAgain,
  defaultFilterTab = 'all'
}) => {
  const [filterTab, setFilterTab] = useState<'upcoming' | 'completed' | 'cancelled' | 'all'>(defaultFilterTab);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Load tickets from browser cache (localStorage)
  const refreshTickets = () => {
    const data = getSavedTickets();
    setTickets(data);
    setCurrentTime(Date.now());
  };

  useEffect(() => {
    refreshTickets();
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter tickets based on 13-hour active window & tab selection
  const upcomingTickets = tickets.filter(
    (t) => (t.status === 'Upcoming' || t.status === 'Active') && (t.expiryTimestamp ? currentTime < t.expiryTimestamp : true)
  );

  const completedTickets = tickets.filter(
    (t) => t.status === 'Completed' || t.status === 'Ticket Expired' || (t.expiryTimestamp ? currentTime >= t.expiryTimestamp : false)
  );

  const cancelledTickets = tickets.filter((t) => t.status === 'Cancelled');

  const displayedTickets = 
    filterTab === 'upcoming' 
      ? upcomingTickets 
      : filterTab === 'completed' 
      ? completedTickets 
      : filterTab === 'cancelled' 
      ? cancelledTickets 
      : tickets;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      {/* Top Header Bar - My Bookings */}
      <div className="bg-[#0066FF] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">My Bookings</h1>
        </div>
        <button 
          onClick={refreshTickets}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Refresh Tickets"
        >
          <SlidersHorizontal className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24">
        {filterTab === 'upcoming' && upcomingTickets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[380px] text-center px-4">
            <div className="w-28 h-20 bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 rounded-2xl p-2">
              <img src="/images/image-removebg-preview.png" alt="No Tickets" className="w-16 h-12 object-contain" />
            </div>
            <p className="text-slate-400 font-medium text-sm">
              No Active Upcoming Tickets. Book a ticket to see it here!
            </p>
          </div>
        )}

        {displayedTickets.length > 0 && (
          <div>
            {/* Title Header */}
            <div className="flex items-center justify-between my-2 px-1">
              <h2 className={`font-bold text-base flex items-center gap-1.5 ${
                filterTab === 'upcoming' ? 'text-[#F97316]' : filterTab === 'completed' ? 'text-[#10B981]' : 'text-slate-800'
              }`}>
                {filterTab === 'upcoming' 
                  ? `Upcoming (${displayedTickets.length})` 
                  : filterTab === 'completed' 
                  ? `Completed (${displayedTickets.length})` 
                  : filterTab === 'cancelled' 
                  ? `Cancelled (${displayedTickets.length})` 
                  : `All Tickets (${displayedTickets.length})`}
              </h2>
              <button 
                onClick={refreshTickets}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Ticket Cards List */}
            <div className="flex flex-col gap-4 mt-2">
              {displayedTickets.map((ticket) => (
                <TicketCardItem 
                  key={ticket.id}
                  ticket={ticket}
                  currentTime={currentTime}
                  onSelectTicket={onSelectTicket}
                  onBookAgain={onBookAgain}
                />
              ))}
            </div>
          </div>
        )}

        {filterTab === 'cancelled' && (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 text-sm">
            No cancelled tickets found.
          </div>
        )}
      </div>

      {/* Floating Bottom Sub-Navigation Filter Bar */}
      <div className="absolute bottom-3 left-3 right-3 bg-[#EBF5FB]/95 backdrop-blur-md p-1.5 rounded-2xl border border-sky-100 shadow-md flex items-center justify-between z-20">
        <button 
          onClick={() => setFilterTab('upcoming')}
          className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
            filterTab === 'upcoming' 
              ? 'bg-white text-[#F97316] shadow-xs border border-orange-300 font-bold' 
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          <img 
            src={filterTab === 'upcoming' ? "/images/after_completed-removebg-preview.png" : "/images/no clcik default.png"} 
            alt="Upcoming" 
            className="w-10 h-7 object-contain mb-0.5" 
          />
          <span className="text-[11px] font-medium">Upcoming ({upcomingTickets.length})</span>
        </button>

        <button 
          onClick={() => setFilterTab('completed')}
          className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
            filterTab === 'completed' 
              ? 'bg-white text-[#10B981] shadow-xs border border-emerald-300 font-bold' 
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          <img 
            src={filterTab === 'completed' ? "/images/completed_on_click-removebg-preview.png" : "/images/no clcik default.png"} 
            alt="Completed" 
            className="w-10 h-7 object-contain mb-0.5" 
          />
          <span className="text-[11px] font-medium">Completed ({completedTickets.length})</span>
        </button>

        <button 
          onClick={() => setFilterTab('cancelled')}
          className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
            filterTab === 'cancelled' 
              ? 'bg-white text-rose-600 shadow-xs border border-rose-300 font-bold' 
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          <img 
            src={filterTab === 'cancelled' ? "/images/cancelled_on_click-removebg-preview.png" : "/images/no clcik default.png"} 
            alt="Cancelled" 
            className="w-10 h-7 object-contain mb-0.5" 
          />
          <span className="text-[11px] font-medium">Cancelled</span>
        </button>

        <button 
          onClick={() => setFilterTab('all')}
          className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
            filterTab === 'all' 
              ? 'bg-white text-[#0066FF] shadow-xs border border-sky-300 font-bold' 
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          <img 
            src={filterTab === 'all' ? "/images/all_on_click-removebg-preview.png" : "/images/no clcik default.png"} 
            alt="All" 
            className="w-10 h-7 object-contain mb-0.5" 
          />
          <span className="text-[11px] font-bold">All</span>
        </button>
      </div>
    </div>
  );
};
