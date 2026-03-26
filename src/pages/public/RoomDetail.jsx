import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Wifi, Coffee, Tv, Wind, CheckCircle, CalendarDays, X } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({ checkIn: '', checkOut: '' });
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/rooms/${id}`);
        setRoom(response.data);
      } catch (error) {
        console.error('Error fetching room recursively:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleBookClick = () => {
    if (!user) {
      toast.error('Identity validation required. Routing to Secure Access Panel.', { icon: '🔒' });
      navigate('/login');
    } else {
      setIsModalOpen(true);
    }
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!bookingData.checkIn || !bookingData.checkOut) {
      return toast.error('Check-In and Check-Out chronologies required.');
    }
    
    setIsBooking(true);
    try {
      await api.post('/bookings', {
        room: room._id,
        guest: user._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut
      });
      toast.success('Reservation successfully secured. Welcome to LuxuryStay.', { icon: '✨' });
      setIsModalOpen(false);
      navigate('/guest'); // Take guest to their bookings portal
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed initiating reservation pipeline.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div className="text-center py-32 text-gray-500">Loading details...</div>;
  if (!room) return <div className="text-center py-32 text-red-500">Room not found.</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="h-[50vh] bg-black relative">
        <img src={room.type?.images?.[0] || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000"} alt="Room hero" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-white tracking-wider">{room.type?.name} Room</h1>
          <p className="text-[#D4AF37] mt-4 uppercase tracking-widest font-semibold">${room.type?.basePrice || 0} per night</p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-serif mb-6 text-gray-900">Room Overview</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-10">
            {room.type?.description || "Step into a world of comfort with modern furnishings, breathtaking views, and uncompromising attention to detail. Designed for connoisseurs of luxury, this room provides the perfect sanctuary during your stay."}
          </p>
          
          <h3 className="text-2xl font-serif mb-6 text-gray-900">Premium Amenities</h3>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10">
            <div className="flex items-center text-gray-700"><CheckCircle className="w-5 h-5 text-[#D4AF37] mr-3" /> 24/7 Room Service</div>
            <div className="flex items-center text-gray-700"><Wifi className="w-5 h-5 text-[#D4AF37] mr-3" /> High-Speed Wi-Fi</div>
            <div className="flex items-center text-gray-700"><Wind className="w-5 h-5 text-[#D4AF37] mr-3" /> Climate Control</div>
            <div className="flex items-center text-gray-700"><Tv className="w-5 h-5 text-[#D4AF37] mr-3" /> 55" Smart TV</div>
            <div className="flex items-center text-gray-700"><Coffee className="w-5 h-5 text-[#D4AF37] mr-3" /> Espresso Machine</div>
          </div>
        </div>

        <div className="bg-gray-50 border border-t-4 border-t-[#D4AF37] p-8 h-max sticky top-24 shadow-sm">
          <h3 className="text-xl font-serif mb-2">Reservation</h3>
          <p className="text-gray-500 mb-6 text-sm">Secure your opulent stay today.</p>
          
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <span className="text-gray-600">Price per night:</span>
            <span className="text-2xl font-bold text-gray-900">${room.type?.basePrice || 0}</span>
          </div>

          <div className="mb-6">
            <p className="text-gray-500 mb-2">Status: <span className={room.status === 'Available' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>{room.status}</span></p>
          </div>

          <button 
            disabled={room.status !== 'Available'}
            onClick={handleBookClick}
            className={`w-full block text-center px-6 py-4 uppercase tracking-widest text-sm font-bold transition duration-300 ${room.status === 'Available' ? 'bg-black text-white hover:bg-[#D4AF37]' : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'}`}>
            Secure Booking
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-2xl font-serif text-gray-900 mb-2 border-b border-gray-100 pb-4 flex items-center">
              <CalendarDays className="w-6 h-6 mr-3 text-[#D4AF37]" /> Reserve Node
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
              <p className="text-sm font-bold text-gray-700 uppercase tracking-widest leading-relaxed">
                {room.type?.name} <span className="text-gray-400 font-medium">| {room.roomNumber}</span>
              </p>
              <p className="text-xs text-[#D4AF37] font-bold tracking-widest uppercase mt-1">
                ${room.type?.basePrice}/night
              </p>
            </div>

            <form onSubmit={submitBooking} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Check-In Array</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  required 
                  value={bookingData.checkIn} 
                  onChange={e => setBookingData({...bookingData, checkIn: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-3 font-semibold text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Check-Out Array</label>
                <input 
                  type="date" 
                  min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                  required 
                  value={bookingData.checkOut} 
                  onChange={e => setBookingData({...bookingData, checkOut: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-3 font-semibold text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <button 
                type="submit" 
                disabled={isBooking}
                className="w-full mt-4 bg-black text-white px-6 py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#D4AF37] disabled:bg-gray-400 transition duration-300"
              >
                {isBooking ? 'Processing Lock...' : 'Confirm Reservation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
