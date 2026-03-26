import React, { useState, useEffect } from 'react';
import { Calendar, FileDown } from 'lucide-react';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import api from '../../api/axiosConfig';

const MyBookings = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState(null);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await api.get('/bookings/my');
        setHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your luxury data...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-serif text-gray-900 mb-8 border-b border-gray-200 pb-4">Booking History</h2>
      
      <div className="space-y-6">
        {history.length === 0 ? (
          <div className="text-gray-500 text-center py-10 bg-white shadow-sm rounded-xl">No booking history available yet.</div>
        ) : history.map(booking => (
          <div key={booking._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center md:items-start gap-4 hover:-translate-y-1 hover:shadow-md transition duration-200">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-200">BK-{booking._id.substring(0,6)}</span>
                <span className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase rounded shadow-sm ${booking.status === 'Checked-in' || booking.status === 'Confirmed' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                  {booking.status}
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Room {booking.room?.roomNumber}</h3>
              <div className="flex items-center text-gray-600 text-sm font-medium">
                <Calendar className="w-4 h-4 mr-2 text-[#D4AF37]" /> {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
              </div>
            </div>
            
            <div className="md:border-l md:pl-6 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 w-full md:w-auto flex md:flex-col justify-between items-center md:items-end">
              <div className="text-right">
                 <span className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1 block">Night Rate</span>
                 <span className="text-2xl font-bold text-[#D4AF37] tracking-tight">${booking.room?.type?.basePrice || 0}</span>
              </div>
              {booking.status === 'Checked-out' && (
                 <button 
                   onClick={() => generateInvoicePDF({ id: booking._id, guestName: 'Luxury Guest', room: `Room ${booking.room?.roomNumber}`, dates: `${new Date(booking.checkIn).toLocaleDateString()}`, nights: 1, roomTotal: booking.room?.type?.basePrice || 100, servicesTotal: 0 })}
                   className="mt-3 w-full justify-center bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest flex items-center transition shadow-sm"
                 >
                   <FileDown className="w-4 h-4 mr-1.5 text-gray-400" /> Invoice
                 </button>
              )}
              {booking.idDocumentUrl && (
                <button onClick={() => setViewImage(booking.idDocumentUrl)} className="mt-2 text-center w-full block text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:text-yellow-600 hover:underline transition">
                  View Uploaded ID
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {viewImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[60] transition-opacity duration-300">
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button 
              onClick={() => setViewImage(null)} 
              className="absolute -top-12 right-0 text-white hover:text-red-400 bg-white/10 hover:bg-white/20 p-2 rounded-full transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <img src={viewImage} alt="Guest Official ID" className="max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/20" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
