import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserSquare, Bell, Settings, LogOut, Menu, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const links = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'System Alerts', path: '/admin/notifications', icon: Bell },
    { name: 'Hotel Config', path: '/admin/settings', icon: Settings },
    { name: 'Manage Rooms', path: '/admin/rooms', icon: Key },
    { name: 'Manage Staff', path: '/admin/staff', icon: Users },
    { name: 'Manage Guests', path: '/admin/guests', icon: UserSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex w-full font-sans text-gray-900">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-blue-900 text-white flex-col shadow-xl hidden md:flex shrink-0 fixed inset-y-0 left-0 z-50">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-2xl font-bold font-serif whitespace-nowrap overflow-hidden text-[#D4AF37]">LuxuryStay</h1>
          <p className="text-blue-300 text-xs mt-1 uppercase tracking-widest font-semibold">Admin Portal</p>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {links.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.path || pathname === link.path + '/';
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-800 text-white shadow-inner font-semibold' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}
              >
                <Icon className="w-5 h-5 mr-3 shrink-0" />
                <span className="whitespace-nowrap">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button onClick={logout} className="flex items-center w-full px-4 py-2 text-blue-200 hover:text-white hover:bg-red-500/20 rounded-lg transition">
            <LogOut className="w-5 h-5 mr-3 shrink-0" /> <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full md:ml-64 relative min-h-screen overflow-x-hidden">
        {/* Mobile Header */}
        <header className="bg-blue-900 text-white p-4 shadow-md md:hidden flex justify-between items-center sticky top-0 z-40">
           <h1 className="text-xl font-bold font-serif text-[#D4AF37]">LuxuryStay Admin</h1>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 border border-blue-700 rounded hover:bg-blue-800 transition">
             <Menu className="w-6 h-6" />
           </button>
        </header>

         {/* Mobile Menu Dropdown */}
         {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-900 text-white absolute top-16 left-0 right-0 z-40 shadow-xl border-b border-blue-800">
            <nav className="flex flex-col p-4 space-y-2">
              {links.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.path || pathname === link.path + '/';
                return (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-800 text-white font-semibold' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}
                  >
                    <Icon className="w-5 h-5 mr-3 shrink-0" />
                    <span className="whitespace-nowrap">{link.name}</span>
                  </Link>
                );
              })}
              <button onClick={logout} className="flex items-center w-full px-4 py-3 text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-lg transition text-left mt-2 border-t border-blue-800">
                <LogOut className="w-5 h-5 mr-3 shrink-0" /> <span className="font-medium">Sign Out</span>
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1 p-6 md:p-10 w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
