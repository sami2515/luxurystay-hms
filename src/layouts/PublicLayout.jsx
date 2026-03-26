import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicLayout = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col w-full">
      <header className="bg-black text-white p-6 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-serif font-bold text-[#D4AF37] tracking-wider">LUXURYSTAY</Link>
          <nav className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-medium">
            <Link to="/" className="hover:text-[#D4AF37] transition duration-300">Home</Link>
            <Link to="/rooms" className="hover:text-[#D4AF37] transition duration-300">Rooms</Link>
            <Link to="/about" className="hover:text-[#D4AF37] transition duration-300">About Us</Link>
            <Link to="/contact" className="hover:text-[#D4AF37] transition duration-300">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
               <div className="flex items-center space-x-4">
                 <Link to={`/${user.role === 'admin' ? 'admin' : user.role}`} className="hover:text-[#D4AF37] transition uppercase text-sm font-semibold tracking-wider">Dashboard</Link>
                 <button onClick={logout} className="border border-[#D4AF37] text-[#D4AF37] px-4 py-2 hover:bg-[#D4AF37] hover:text-black transition uppercase text-sm font-semibold tracking-wider">Logout</button>
               </div>
            ) : (
              <Link to="/login" className="bg-[#D4AF37] text-black px-6 py-2 hover:bg-yellow-600 transition uppercase text-sm font-semibold tracking-wider">Book Now / Login</Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <footer className="bg-black text-white py-12 border-t border-gray-800 w-full">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif text-[#D4AF37] mb-4">LUXURYSTAY</h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-6">Experience the pinnacle of hospitality. Where every stay is a masterpiece of comfort, elegance, and personalized service.</p>
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} LuxuryStay Hotels & Resorts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
export default PublicLayout;
