import React, { useState, useEffect } from 'react';
import { Page, Notification } from '../types';
import { Leaf, LayoutDashboard, MessageSquare, MapPin, Users, Bell, X, WifiOff } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, notifications, onMarkAllRead }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NavItem = ({ page, icon: Icon, label }: { page: Page; icon: any; label: string }) => (
    <button
      onClick={() => onNavigate(page)}
      className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${
        currentPage === page
          ? 'text-emerald-600 font-semibold'
          : 'text-slate-500 hover:text-emerald-500'
      }`}
    >
      <Icon size={24} strokeWidth={currentPage === page ? 2.5 : 2} />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden relative">
      {/* Top Bar - Mobile First Sticky Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm shrink-0 z-20 relative">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Leaf className="text-emerald-600" size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">EcoHabit</h1>
        </div>
        
        <div className="flex items-center gap-3">
             <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
             >
                 <Bell size={20} />
                 {unreadCount > 0 && (
                     <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                 )}
             </button>
            <button 
                onClick={() => onNavigate(Page.PROFILE)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-600 text-sm font-bold transition-all ${currentPage === Page.PROFILE ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500' : 'bg-slate-200 hover:bg-slate-300'}`}
            >
            JD
            </button>
        </div>
      </header>

      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-slate-800 text-white text-xs py-1.5 text-center flex items-center justify-center gap-2">
            <WifiOff size={12} /> You are currently offline. Some features may be unavailable.
        </div>
      )}

      {/* Notifications Dropdown (Simulated Modal for Mobile) */}
      {showNotifications && (
          <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={() => setShowNotifications(false)}>
              <div 
                className="absolute top-16 right-4 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
              >
                  <div className="p-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                      <div className="flex items-center gap-2">
                          <button onClick={onMarkAllRead} className="text-xs text-emerald-600 font-semibold hover:underline">Mark all read</button>
                          <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                      </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                      {notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-emerald-50/30' : ''}`}>
                              <div className="flex justify-between items-start mb-1">
                                  <h4 className={`text-sm ${!n.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{n.title}</h4>
                                  <span className="text-[10px] text-slate-400">{n.time}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                          </div>
                      ))}
                      {notifications.length === 0 && (
                          <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 scroll-smooth">
        <div className="max-w-md mx-auto min-h-full">
           {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 safe-area-bottom z-20">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          <NavItem page={Page.DASHBOARD} icon={LayoutDashboard} label="Home" />
          <NavItem page={Page.LOCATE} icon={MapPin} label="Locate" />
          <NavItem page={Page.LOG} icon={Leaf} label="Action" />
          <NavItem page={Page.COMMUNITY} icon={Users} label="Social" />
          <NavItem page={Page.ASSISTANT} icon={MessageSquare} label="AI Chat" />
        </div>
      </nav>
    </div>
  );
};

export default Layout;