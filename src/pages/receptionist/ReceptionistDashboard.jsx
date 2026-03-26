import React, { useState, useEffect } from 'react';
import { Search, Bed, Users, CalendarCheck, FileText } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../../api/axiosConfig';

const socket = io('http://localhost:5000'); // Standard backend target port

const ReceptionistDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic Data for Room Matrix actively observing state
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({ available: 0, occupied: 0, cleaning: 0, checkins: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          api.get('/rooms'),
          api.get('/bookings')
        ]);
        
        const fetchedRooms = roomsRes.data;
        setRooms(fetchedRooms);

        const available = fetchedRooms.filter(r => r.status === 'Available').length;
        const occupied = fetchedRooms.filter(r => r.status === 'Occupied').length;
        const cleaning = fetchedRooms.filter(r => r.status === 'Cleaning').length;
        
        const today = new Date().toDateString();
        const checkins = bookingsRes.data.filter(b => new Date(b.checkIn).toDateString() === today && b.status === 'Checked-in').length;
        
        setStats({ available, occupied, cleaning, checkins });
      } catch(err) {
        console.error('Error hydrating layout matrix:', err);
      }
    };
    fetchData();

    const handleStatusUpdate = (data) => {
      setRooms(prevRooms => prevRooms.map(room => 
        room.roomNumber === data.roomNumber ? { ...room, status: data.status } : room
      ));
    };

    socket.on('roomStatusUpdated', handleStatusUpdate);
    return () => socket.off('roomStatusUpdated', handleStatusUpdate);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 border-green-500 text-green-900 shadow-green-100';
      case 'Occupied': return 'bg-red-100 border-red-500 text-red-900 shadow-red-100';
      case 'Cleaning': return 'bg-yellow-100 border-yellow-500 text-yellow-900 shadow-yellow-100';
      case 'Maintenance': return 'bg-orange-100 border-orange-500 text-orange-900 shadow-orange-100';
      default: return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner & Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-serif text-gray-800">Front Desk Hub</h2>
          <p className="text-gray-500 mt-1">Manage guest check-ins and overview real-time assignments.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search Guest by NIC or Phone..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Actions / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm uppercase tracking-widest mb-1">Check-ins Today</p>
              <h3 className="text-3xl font-bold">{stats.checkins}</h3>
            </div>
            <Users className="w-8 h-8 text-indigo-200" />
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm uppercase tracking-widest mb-1">Rooms Available</p>
              <h3 className="text-3xl font-bold">{stats.available}</h3>
            </div>
            <Bed className="w-8 h-8 text-green-200" />
        </div>
        <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm uppercase tracking-widest mb-1">Rooms Occupied</p>
              <h3 className="text-3xl font-bold">{stats.occupied}</h3>
            </div>
            <FileText className="w-8 h-8 text-red-200" />
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm uppercase tracking-widest mb-1">Cleaning Queue</p>
              <h3 className="text-3xl font-bold">{stats.cleaning}</h3>
            </div>
            <CalendarCheck className="w-8 h-8 text-yellow-200" />
        </div>
      </div>

      {/* Room Matrix Grid */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-end mb-6 border-b pb-4 shrink-0 overflow-x-auto">
          <h3 className="text-2xl font-serif text-gray-800 pr-4">Room Matrix</h3>
          <div className="flex space-x-4 text-sm font-medium whitespace-nowrap pb-1">
            <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2 shadow-sm"></div> Available</span>
            <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-sm"></div> Occupied</span>
            <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-sm"></div> Cleaning</span>
            <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-500 mr-2 shadow-sm"></div> Maintenance</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {rooms.map(room => (
            <div 
              key={room.roomNumber} 
              className={`p-5 rounded-lg border shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition duration-200 flex flex-col items-center justify-center text-center ${getStatusColor(room.status)}`}
            >
              <span className="text-3xl font-bold mb-1 opacity-90">{room.roomNumber}</span>
              <span className="text-[11px] uppercase tracking-widest font-bold opacity-80 mb-2">{room.type?.name}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-white/60 px-2 py-0.5 rounded-full border border-black/10 shadow-sm">{room.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
