import React, { useState } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { BookingsScreen, TicketData } from './components/BookingsScreen';
import { BookingDetailsModal } from './components/BookingDetailsModal';
import { TicketBookingScreen } from './components/TicketBookingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SidebarDrawer } from './components/SidebarDrawer';
import { LoginScreen } from './components/LoginScreen';
import { SearchTrainsModal, AddMoneyModal } from './components/InteractiveModals';
import { createNewTicket } from './utils/ticketStorage';
import { CheckCircle2 } from 'lucide-react';

interface UserProfile {
  name: string;
  phone: string;
}

const USER_PROFILE_KEY = 'railone_user_profile_v1';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [bookingFilterTab, setBookingFilterTab] = useState<'upcoming' | 'completed' | 'cancelled' | 'all'>('upcoming');
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [bookingScreenType, setBookingScreenType] = useState<'Unreserved' | 'Reserved' | 'Platform' | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [addMoneyModalOpen, setAddMoneyModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLoginSuccess = (name: string, phone: string) => {
    const profile = { name, phone };
    setUserProfile(profile);
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
    showToast(`Welcome to RailOne, ${name}!`);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setUserProfile(null);
    try {
      localStorage.removeItem(USER_PROFILE_KEY);
    } catch (e) {
      console.error(e);
    }
    setSelectedTicket(null);
    setBookingScreenType(null);
    showToast('Logged out successfully.');
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === 'menu') {
      setIsDrawerOpen(true);
    } else {
      setActiveTab(tab);
      setSelectedTicket(null);
      setBookingScreenType(null);
    }
  };

  const handleSelectService = (serviceName: string) => {
    if (serviceName.includes('Unreserved')) {
      setBookingScreenType('Unreserved');
    } else if (serviceName.includes('Reserved')) {
      setBookingScreenType('Reserved');
    } else if (serviceName.includes('Platform')) {
      setBookingScreenType('Platform');
    } else if (serviceName === 'Search Trains') {
      setSearchModalOpen(true);
    } else {
      showToast(`Selected: ${serviceName}`);
    }
  };

  const handleBookAgain = (ticket: TicketData) => {
    setBookingScreenType(ticket.type);
  };

  const handleProceedToBook = (from: string, to: string) => {
    if (!bookingScreenType) return;
    const newTicket = createNewTicket(bookingScreenType, from, to);
    showToast(`Ticket Booked! ${newTicket.type} (${newTicket.code}) valid for 13 hours.`);
    setBookingScreenType(null);
    setActiveTab('bookings');
    setBookingFilterTab('upcoming');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Main Mobile App Container */}
      <MobileFrame activeTab={activeTab}>
        
        {/* LOGIN GATE: If not logged in, enforce LoginScreen */}
        {!userProfile ? (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            {/* Render Top Header (Aअ Logo, RailOne, Bell Badge 5) */}
            {!selectedTicket && !bookingScreenType && activeTab !== 'bookings' && (
              <Header 
                onLanguageClick={() => showToast('Language switched to English / हिन्दी')}
                onNotificationClick={() => showToast('You have 5 unread notifications')}
              />
            )}

            {/* Screen Routing */}
            {bookingScreenType ? (
              <TicketBookingScreen 
                type={bookingScreenType}
                onClose={() => setBookingScreenType(null)}
                onProceedToBook={handleProceedToBook}
              />
            ) : selectedTicket ? (
              <BookingDetailsModal 
                ticket={selectedTicket}
                userName={userProfile.name}
                userPhone={userProfile.phone}
                onBack={() => setSelectedTicket(null)}
                onShowToast={showToast}
              />
            ) : (
              <>
                {activeTab === 'home' && (
                  <HomeScreen 
                    userName={userProfile.name}
                    onSelectService={handleSelectService} 
                  />
                )}

                {activeTab === 'bookings' && (
                  <BookingsScreen 
                    onBack={() => setActiveTab('home')}
                    onSelectTicket={(ticket) => setSelectedTicket(ticket)}
                    onBookAgain={handleBookAgain}
                    defaultFilterTab={bookingFilterTab}
                  />
                )}

                {activeTab === 'you' && (
                  <ProfileScreen 
                    userName={userProfile.name}
                    userPhone={userProfile.phone}
                    onBack={() => setActiveTab('home')}
                    onAddMoney={() => setAddMoneyModalOpen(true)}
                    onLogout={handleLogout}
                  />
                )}
              </>
            )}

            {/* Bottom Navigation Bar */}
            {!selectedTicket && !bookingScreenType && activeTab !== 'bookings' && (
              <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
            )}

            {/* Right Drawer Side Bar Menu */}
            <SidebarDrawer 
              userName={userProfile.name}
              userPhone={userProfile.phone}
              isOpen={isDrawerOpen} 
              onClose={() => setIsDrawerOpen(false)}
              onAddMoney={() => setAddMoneyModalOpen(true)}
              onLogout={handleLogout}
              onSelectMenuItem={(item) => {
                showToast(`Menu item clicked: ${item}`);
                setIsDrawerOpen(false);
              }}
            />

            {/* Interactive Modals */}
            <SearchTrainsModal 
              isOpen={searchModalOpen} 
              onClose={() => setSearchModalOpen(false)} 
            />
            
            <AddMoneyModal 
              isOpen={addMoneyModalOpen} 
              onClose={() => setAddMoneyModalOpen(false)} 
            />

            {/* Toast Notification */}
            {toastMessage && (
              <div className="absolute top-16 left-4 right-4 bg-emerald-950/95 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center justify-between z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
              </div>
            )}
          </>
        )}

      </MobileFrame>
    </div>
  );
}
