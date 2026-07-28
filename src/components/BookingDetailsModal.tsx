import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TicketData } from './BookingsScreen';
import { generatePdfInvoice } from '../utils/generatePdfInvoice';

interface BookingDetailsModalProps {
  ticket: TicketData;
  userName?: string;
  userPhone?: string;
  onBack: () => void;
  onShowToast?: (msg: string) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ 
  ticket, 
  userName = 'Ajay Kumar Reddy k', 
  userPhone = '6303945563', 
  onBack,
  onShowToast 
}) => {

  const handlePrintPdf = () => {
    generatePdfInvoice(ticket, userName, userPhone);
    if (onShowToast) {
      onShowToast(`Downloading invoice: ${ticket.code}_journey_invoice.pdf`);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden relative">
      {/* Top Header */}
      <div className="bg-[#0066FF] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Booking Details</h1>
        </div>

        {/* Print Ticket Button - Generates & Downloads exact PDF Invoice */}
        <button 
          onClick={handlePrintPdf}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all p-1"
          title="Download PDF Invoice"
        >
          <img 
            src="/images/ticketprint.png" 
            alt="Print Ticket" 
            className="w-6 h-6 object-contain" 
          />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Ticket Header Cyan Container with Side Notches */}
        <div className="relative bg-[#D2EBF1] rounded-2xl p-4 shadow-sm border border-cyan-200/80 mb-6">
          {/* Top Notch Left & Right cutouts */}
          <div className="absolute left-[-12px] top-[-12px] w-6 h-6 rounded-full bg-[#F8FAFC]"></div>
          <div className="absolute right-[-12px] top-[-12px] w-6 h-6 rounded-full bg-[#F8FAFC]"></div>

          {/* Row 1: Journey & Code */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">
              {ticket.ticketCategory}
            </span>
            <span className="text-xs font-bold text-slate-900 tracking-wider">
              {ticket.code}
            </span>
          </div>

          {/* Row 2: Stations */}
          <div className="flex justify-between items-center mb-3">
            <span className="font-extrabold text-slate-900 text-base tracking-tight">
              {ticket.fromStation}
            </span>
            <span className="font-extrabold text-slate-900 text-base tracking-tight">
              {ticket.toStation}
            </span>
          </div>

          {/* Row 3: Via & Timestamp */}
          <div className="flex justify-between items-end pt-1">
            <div className="text-xs text-slate-600">
              <span className="block text-[11px] text-slate-500">Via</span>
              <span className="font-semibold text-slate-800">---</span>
            </div>
            <div className="text-right">
              <span className="block text-[11px] text-slate-500">Booked on</span>
              <span className="text-xs font-semibold text-slate-800">
                {ticket.bookedTimestamp}
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Status & Passenger Info */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
          <div>
            <span className="text-slate-500 text-sm font-semibold block">
              {ticket.status}
            </span>
          </div>

          <div>
            <h3 className="text-slate-900 font-semibold text-base">
              Passenger(s) : {ticket.passengers}
            </h3>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-slate-900 font-bold text-sm tracking-wide uppercase">
              {ticket.classDetails} | {ticket.fare}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
