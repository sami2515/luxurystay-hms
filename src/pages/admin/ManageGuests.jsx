import React, { useState, useEffect } from 'react';
import { Search, Eye, FileText, CheckCircle } from 'lucide-react';
import api from '../../api/axiosConfig';

const ManageGuests = () => {
  const [guests, setGuests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, bookingsRes] = await Promise.all([
          api.get('/auth/users?role=guest'),
          api.get('/bookings')
        ]);
        setGuests(usersRes.data);
        setBookings(bookingsRes.data);
      } catch (err) { console.error('Failed bringing generic guest metrics:', err); }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-serif text-gray-800">Manage Guests</h2>
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 w-full transition"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest">Guest Name</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest hidden sm:table-cell">Email</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest">Visits</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest">Spent</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => {
              const guestBookings = bookings.filter(b => b.guest?._id === guest._id);
              const totalVisits = guestBookings.length;
              const totalSpent = guestBookings.reduce((sum, b) => {
                const nights = Math.max(1, Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 3600 * 24)));
                return sum + (b.totalAmount || (nights * (b.room?.type?.basePrice || 0)));
              }, 0);
              
              return (
                <tr key={guest._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-semibold text-gray-800">{guest.name}</td>
                  <td className="p-4 text-gray-600 hidden sm:table-cell">{guest.email}</td>
                  <td className="p-4 text-gray-700 font-medium">{totalVisits} time(s)</td>
                  <td className="p-4 text-green-700 font-bold">${totalSpent.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedGuest({ ...guest, guestBookings })}
                      className="p-2 text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 rounded-lg shadow-sm transition inline-flex items-center" 
                      title="View History"
                    >
                      <Eye className="w-5 h-5 mr-0 md:mr-2" /> <span className="hidden md:inline font-semibold text-sm">View</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedGuest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative transform scale-100 transition-transform flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setSelectedGuest(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black hover:bg-gray-100 p-2 rounded-full transition"
            >
              &times;
            </button>
            <h3 className="text-2xl font-serif mb-2 text-gray-900 border-b pb-4 shrink-0">{selectedGuest.name}'s Profile</h3>
            <p className="text-gray-500 mb-6 flex items-center mt-4 font-medium shrink-0"><FileText className="w-5 h-5 mr-2 text-blue-600" /> Booking History & Preferences</p>
            
            <div className="space-y-4 overflow-y-auto pr-2 flex-1">
              {selectedGuest.guestBookings?.length === 0 ? (
                <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-center shadow-sm">
                  <CheckCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-gray-700 font-bold mb-1">No Historical Records Found</h4>
                  <p className="text-gray-500 text-sm">This guest has zero previous reservations in the system.</p>
                </div>
              ) : (
                selectedGuest.guestBookings?.map(booking => (
                  <div key={booking._id} className="p-5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-800 text-lg">
                        Stay: {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full border ${booking.status === 'Checked-out' ? 'bg-gray-100 text-gray-800 border-gray-300' : 'bg-green-100 text-green-800 border-green-200'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-semibold text-gray-800">Room:</span> {booking.room?.roomNumber || 'Any'} ({booking.room?.type?.name || 'Standard'})</p>
                      <p><span className="font-semibold text-gray-800">Spent:</span> ${booking.totalAmount || (Math.max(1, Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 3600 * 24))) * (booking.room?.type?.basePrice || 0))}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-8 pt-4 border-t text-right flex justify-end gap-4">
              <button 
                onClick={() => setSelectedGuest(null)}
                className="bg-black text-white px-6 py-2.5 rounded-lg font-bold tracking-wide shadow-md hover:bg-gray-800 transition"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGuests;
