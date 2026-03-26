import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';

const RoomsList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Failed to fetch rooms natively:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filtered = rooms.filter(room => {
    const matchType = filterType === 'All' || (room.type && room.type.name === filterType);
    const matchPrice = (room.type?.basePrice || 0) <= maxPrice;
    return matchType && matchPrice;
  });

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-serif text-center mb-4">Our Rooms & Suites</h1>
        <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-10"></div>
        
        {/* Filters */}
        <div className="bg-white p-6 shadow-sm mb-10 flex flex-col md:flex-row gap-6 items-center justify-between border-t-2 border-[#D4AF37]">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <label className="uppercase tracking-widest text-sm text-gray-600 font-semibold whitespace-nowrap">Room Type:</label>
            <select 
              className="border-b-2 border-gray-200 outline-none pb-1 bg-transparent text-gray-800"
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <label className="uppercase tracking-widest text-sm text-gray-600 font-semibold whitespace-nowrap">Max Price: ${maxPrice}</label>
            <input 
              type="range" 
              min="100" 
              max="2000" 
              step="50" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-48 md:w-64 accent-[#D4AF37]" 
            />
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading exquisite rooms...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(room => (
              <div key={room._id} className="bg-white shadow group overflow-hidden border border-gray-100 flex flex-col">
                <div className="h-64 bg-gray-200 overflow-hidden relative">
                  <img 
                    src={room.type?.images?.[0] || 'https://images.unsplash.com/photo-1590490359854-dfba196cece5?q=80&w=800'} 
                    alt="Room Overview" 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-black/80 text-[#D4AF37] px-4 py-1 uppercase text-xs tracking-widest font-bold">
                    ${room.type?.basePrice || 0} / Night
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-serif mb-2">{room.type?.name || 'Luxury'} Room</h3>
                  <p className="text-sm text-gray-500 mb-6 uppercase tracking-widest flex-1">Room #{room.roomNumber}</p>
                  <Link to={`/rooms/${room._id}`} className="block text-center border border-black px-6 py-3 uppercase text-sm tracking-widest font-semibold hover:bg-black hover:text-white transition group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white mt-auto">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">No rooms match your filter criteria.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsList;
