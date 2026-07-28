import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowUpDown, Info, Train, MapPin, Search } from 'lucide-react';
import { searchStations, Station } from '../data/indianStations';

interface TicketBookingScreenProps {
  type: 'Unreserved' | 'Reserved' | 'Platform';
  onClose: () => void;
  onProceedToBook: (from: string, to: string) => void;
}

export const TicketBookingScreen: React.FC<TicketBookingScreenProps> = ({
  type = 'Unreserved',
  onClose,
  onProceedToBook
}) => {
  const [ticketType, setTicketType] = useState<'normal' | 'season'>('normal');
  const [bookingMode, setBookingMode] = useState<'outside' | 'atStation'>('outside');
  
  // From & To state
  const [source, setSource] = useState('GUINDY, GDY');
  const [destination, setDestination] = useState('TAMBARAM, TBM');

  // Active Dropdowns
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  // Search Results
  const [sourceResults, setSourceResults] = useState<Station[]>([]);
  const [destResults, setDestResults] = useState<Station[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter Source stations on input change
  useEffect(() => {
    setSourceResults(searchStations(source));
  }, [source]);

  // Filter Destination stations on input change
  useEffect(() => {
    setDestResults(searchStations(destination));
  }, [destination]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSourceDropdown(false);
        setShowDestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSelectSource = (station: Station) => {
    setSource(`${station.name}, ${station.code}`);
    setShowSourceDropdown(false);
  };

  const handleSelectDest = (station: Station) => {
    setDestination(`${station.name}, ${station.code}`);
    setShowDestDropdown(false);
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex flex-col bg-[#F4F6F9] overflow-y-auto relative animate-in slide-in-from-bottom duration-200"
    >
      {/* Top Header */}
      <div className="bg-white px-5 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30 shrink-0">
        <div className="w-8"></div>
        <h1 className="text-lg font-extrabold text-[#0B1E48] tracking-tight text-center">
          {type} E-Ticket
        </h1>
        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Main Form Content */}
      <div className="p-4 space-y-5 flex-1">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-5 relative">
          
          {/* Row 1: Segmented Control - Normal vs Season */}
          <div className="bg-[#EFEFEF] p-1 rounded-2xl flex items-center">
            <button 
              onClick={() => setTicketType('normal')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                ticketType === 'normal' 
                  ? 'bg-white text-[#0066FF] shadow-xs' 
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Normal
            </button>
            <button 
              onClick={() => setTicketType('season')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                ticketType === 'season' 
                  ? 'bg-white text-[#0066FF] shadow-xs' 
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Season
            </button>
          </div>

          {/* Row 2: Booking Mode Selector - Outside Station vs At Station */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setBookingMode('outside')}
              className={`py-3 px-3 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                bookingMode === 'outside'
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>Outside Station</span>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                bookingMode === 'outside' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                <Info className="w-3 h-3" />
              </div>
            </button>

            <button 
              onClick={() => setBookingMode('atStation')}
              className={`py-3 px-3 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                bookingMode === 'atStation'
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>At Station</span>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                bookingMode === 'atStation' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                <Info className="w-3 h-3" />
              </div>
            </button>
          </div>

          {/* Row 3: Route Selection Inputs & Autocomplete Dropdowns */}
          <div className="relative space-y-4 pt-1">
            {/* FROM Input & Dropdown */}
            <div className="relative">
              <label className="text-xs font-bold text-sky-500 block mb-1">From</label>
              <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                <Train className="w-5 h-5 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  value={source} 
                  onFocus={() => {
                    setShowSourceDropdown(true);
                    setShowDestDropdown(false);
                  }}
                  onChange={(e) => {
                    setSource(e.target.value);
                    setShowSourceDropdown(true);
                  }}
                  placeholder="Type Source Station or Code (e.g. GUINDY)"
                  className="w-full text-sm font-semibold text-slate-800 focus:outline-none bg-transparent placeholder-slate-300"
                />
                {source && (
                  <button 
                    onClick={() => setSource('')}
                    className="text-slate-300 hover:text-slate-500 text-xs px-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Source Dropdown Menu */}
              {showSourceDropdown && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-56 overflow-y-auto z-40 divide-y divide-slate-100">
                  <div className="p-2 bg-slate-50 text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    <span>Select Source Station ({sourceResults.length} found)</span>
                  </div>
                  {sourceResults.length > 0 ? (
                    sourceResults.map((st) => (
                      <button
                        key={st.code}
                        onClick={() => handleSelectSource(st)}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-sky-50/80 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">
                              {st.name}
                            </span>
                            {st.state && (
                              <span className="text-[10px] font-medium text-slate-400">
                                {st.state}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#0066FF] bg-sky-100 px-2 py-0.5 rounded-lg tracking-wider">
                          {st.code}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No Indian stations found for "{source}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Floating Swap Button */}
            <button 
              onClick={handleSwapStations}
              className="absolute right-0 top-[48%] -translate-y-1/2 w-10 h-10 rounded-full bg-[#D9EAFE] text-[#0066FF] flex items-center justify-center shadow-xs border border-blue-100 hover:scale-105 transition-transform z-20"
              title="Swap Stations"
            >
              <ArrowUpDown className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* TO Input & Dropdown */}
            <div className="relative">
              <label className="text-xs font-bold text-sky-500 block mb-1">To</label>
              <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                <Train className="w-5 h-5 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  value={destination} 
                  onFocus={() => {
                    setShowDestDropdown(true);
                    setShowSourceDropdown(false);
                  }}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowDestDropdown(true);
                  }}
                  placeholder="Type Destination Station or Code (e.g. TAMBARAM)"
                  className="w-full text-sm font-semibold text-slate-800 focus:outline-none bg-transparent placeholder-slate-300"
                />
                {destination && (
                  <button 
                    onClick={() => setDestination('')}
                    className="text-slate-300 hover:text-slate-500 text-xs px-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Destination Dropdown Menu */}
              {showDestDropdown && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-56 overflow-y-auto z-40 divide-y divide-slate-100">
                  <div className="p-2 bg-slate-50 text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    <span>Select Destination Station ({destResults.length} found)</span>
                  </div>
                  {destResults.length > 0 ? (
                    destResults.map((st) => (
                      <button
                        key={st.code}
                        onClick={() => handleSelectDest(st)}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-sky-50/80 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">
                              {st.name}
                            </span>
                            {st.state && (
                              <span className="text-[10px] font-medium text-slate-400">
                                {st.state}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#0066FF] bg-sky-100 px-2 py-0.5 rounded-lg tracking-wider">
                          {st.code}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No Indian stations found for "{destination}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Action Buttons */}
          <div className="space-y-3 pt-2">
            <button 
              onClick={() => onProceedToBook(source, destination)}
              className="w-full bg-[#0066FF] text-white py-3.5 rounded-full font-bold text-sm shadow-md hover:bg-blue-700 transition-colors"
            >
              Proceed To Book
            </button>

            <button 
              onClick={() => alert(`Checking upcoming trains from ${source} to ${destination}`)}
              className="w-full bg-white border-2 border-[#0066FF] text-[#0066FF] py-3 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors"
            >
              Check Upcoming Trains
            </button>
          </div>
        </div>

        {/* Recent Searches Section */}
        <div className="pt-2">
          <h3 className="text-[#0B1E48] font-extrabold text-sm tracking-tight mb-3">
            Recent Searches
          </h3>

          <button 
            onClick={() => {
              setSource('GUINDY, GDY');
              setDestination('POTHERI, POTI');
            }}
            className="w-36 bg-[#DCEBFD] p-3.5 rounded-2xl border border-blue-100 flex flex-col text-left space-y-2 hover:bg-blue-100 transition-colors shadow-xs"
          >
            <span className="text-[11px] font-bold text-slate-800 tracking-tight">
              GUINDY, GDY
            </span>
            <div className="flex items-center gap-1 text-[#0066FF] text-xs">
              <span className="text-[10px]">⤢</span>
            </div>
            <span className="text-[11px] font-bold text-slate-800 tracking-tight">
              POTHERI, POTI
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
