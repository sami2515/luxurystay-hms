import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, ConciergeBell, Clock, CheckCircle } from 'lucide-react';
import api from '../../api/axiosConfig';

const GuestDashboard = () => {
  const { user } = useAuth();
  const [currentStay, setCurrentStay] = useState(null);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await api.get('/bookings/my');
        const active = res.data.find(b => b.status === 'Checked-in' || b.status === 'Confirmed' || b.status === 'Pending');
        if (active) {
          setCurrentStay({
            room: `Room ${active.room?.roomNumber || 'Any'}`,
            checkIn: new Date(active.checkIn).toLocaleDateString(),
            checkOut: new Date(active.checkOut).toLocaleDateString(),
            status: active.status,
            balance: `$${active.room?.type?.basePrice || 0}`
          });
        }
      } catch (err) {
        console.error('Context mapping failed heavily:', err);
      }
    };
    fetchActive();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#D4AF37]">
        <h2 className="text-3xl font-serif text-gray-900 mb-2">Welcome back, {user?.name || 'Valued Guest'}</h2>
        <p className="text-gray-500">We are delighted to have you stay with us. How can we make your experience unforgettable today?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {currentStay ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100/60">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-serif font-bold text-gray-800">Current Stay</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded-full tracking-widest shadow-sm flex items-center border border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" /> {currentStay.status}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-lg shadow-sm">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-0.5">Room</span>
              <span className="text-gray-900 font-bold">{currentStay.room}</span>
            </div>
            <div className="flex justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-lg shadow-sm">
               <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-0.5">Dates</span>
               <span className="text-gray-900 font-bold">{currentStay.checkIn} - {currentStay.checkOut}</span>
            </div>
            <div className="flex justify-between p-3.5 bg-green-50 border border-green-100 rounded-lg shadow-sm">
               <span className="text-green-800 text-xs font-bold uppercase tracking-wider mt-0.5">Night Rate</span>
               <span className="text-green-700 font-bold text-lg leading-none">{currentStay.balance}</span>
            </div>
          </div>
        </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100/60 flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">No Active Stays</h3>
            <p className="text-gray-500 text-sm">You currently have no active or upcoming bookings.</p>
            <Link to="/rooms" className="mt-4 border border-black px-6 py-2 uppercase text-xs tracking-widest font-bold hover:bg-black hover:text-white transition shadow-sm">Explore Rooms</Link>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100/60 flex flex-col justify-center items-center text-center">
          <div className="p-4 rounded-full bg-yellow-50 mb-4 border border-yellow-100 shadow-sm">
            <ConciergeBell className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">At Your Service</h3>
          <p className="text-gray-500 mb-6 text-sm px-4">Order room service, request fresh linens, or schedule a wake-up call directly with our front desk staff.</p>
          <Link to="/guest/services" className="bg-zinc-900 hover:bg-black text-white px-8 py-3 rounded-lg font-bold tracking-widest uppercase transition text-xs shadow-md">
            Request Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
