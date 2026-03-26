import React, { useState, useEffect } from 'react';
import { UserCheck, UserMinus, Search, CreditCard, UploadCloud, FileDown, Eye, CheckCircle } from 'lucide-react';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

const CheckInOut = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [idFile, setIdFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: null, booking: null });
  const [activeTab, setActiveTab] = useState('operations'); // 'operations' or 'history'
  const [historyFilter, setHistoryFilter] = useState('All'); // 'All', 'Checked-out', 'Cancelled'
  const [viewImage, setViewImage] = useState(null);

  // Computed Values
  const getComputedTotal = () => {
    if (!modal?.booking) return { nights: 1, total: 0 };
    const b = modal.booking;
    const n = Math.max(1, Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 3600 * 24)));
    const t = b.totalAmount || (n * (b.room?.type?.basePrice || 0));
    return { nights: n, total: t };
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch(err) { console.error('Error hydrating chronological bookings array', err); }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = (type, booking) => {
    setModal({ isOpen: true, type, booking });
    setIdFile(null); // Reset on open
  };

  const submitCheckIn = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let toastId = toast.loading('Processing Guest Check-in...', { icon: '🔄' });
    try {
      let idDocumentUrl = null;
      if (idFile) {
        toast.loading('Uploading ID Document securely...', { id: toastId, icon: '⬆️' });
        const formData = new FormData();
        formData.append('image', idFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        idDocumentUrl = uploadRes.data.imageUrl;
      }

      toast.loading('Finalizing room assignment...', { id: toastId, icon: '💾' });
      await api.put(`/bookings/${modal.booking._id}/checkin`, { idDocumentUrl });
      
      toast.success(`Check-in Successful for Guest: ${modal.booking.guest.name}`, { id: toastId, icon: '✅' });
      setModal({ isOpen: false, type: null, booking: null });
      fetchBookings();
    } catch (err) {
      toast.error('Error: ' + (err.response?.data?.message || err.message), { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const submitCheckOut = async (e) => {
    e.preventDefault();
    try {
      const computed = getComputedTotal();
      await api.put(`/bookings/${modal.booking._id}/checkout`, {
        paymentStatus: 'Paid',
        amountPaid: computed.total,
        paymentMethod: 'Card'
      });
      
      // Automatically Generate and Download Official Invoice
      const computedAmount = getComputedTotal();
      generateInvoicePDF({
         id: modal.booking._id,
         guestName: modal.booking.guest?.name || 'Unknown',
         room: modal.booking.room?.roomNumber || 'Unknown',
         dates: `${new Date(modal.booking.checkIn).toLocaleDateString()} to ${new Date(modal.booking.checkOut).toLocaleDateString()}`,
         nights: computedAmount.nights,
         roomTotal: computedAmount.total,
         servicesTotal: 0
      });
      
      toast.success(`Check-out successful. Room sent to Housekeeping. Invoice generated.`, { icon: '🧾', duration: 3500 });
      setModal({ isOpen: false, type: null, booking: null });
      fetchBookings();
    } catch(err) {
      toast.error('Check-out failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b pb-4">
        <div>
          <h2 className="text-3xl font-serif text-gray-800">Front Desk Hub</h2>
          <p className="text-gray-500 mt-1">Manage guest arrivals, document verification, and departures.</p>
        </div>
        
        <div className="flex flex-col items-end gap-4 w-full md:w-auto">
          <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('operations')}
              className={`flex-1 md:w-32 py-2 text-sm font-bold uppercase tracking-widest rounded-md transition ${activeTab === 'operations' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Operations
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex-1 md:w-32 py-2 text-sm font-bold uppercase tracking-widest rounded-md transition ${activeTab === 'history' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              History
            </button>
          </div>
          
          <div className="relative w-full md:w-80 flex gap-2">
            {activeTab === 'history' && (
              <select 
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm transition w-36 bg-white shrink-0"
              >
                <option value="All">All Status</option>
                <option value="Checked-out">Checked-out</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            )}
            <div className="relative w-full">
              <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder={activeTab === 'operations' ? "Search Active Bookings..." : "Search Guest History..."} 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">Booking Ref</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">Guest Name</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest hidden sm:table-cell whitespace-nowrap">Room</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">Status</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings
              .filter(b => {
                 const query = searchQuery.toLowerCase();
                 const matchesQuery = b.guest?.name?.toLowerCase().includes(query) || b._id.toLowerCase().includes(query) || b.room?.roomNumber?.toString().includes(query);
                 
                 if (activeTab === 'operations') {
                    return matchesQuery && (b.status === 'Pending' || b.status === 'Confirmed' || b.status === 'Checked-in');
                 } else {
                    let hMatch = (b.status === 'Checked-out' || b.status === 'Cancelled');
                    if (historyFilter !== 'All') {
                       hMatch = hMatch && (b.status === historyFilter);
                    }
                    return matchesQuery && hMatch;
                 }
              })
              .sort((a, b) => {
                 if (activeTab === 'operations') {
                   const rank = { 'Checked-in': 1, 'Confirmed': 2, 'Pending': 3 };
                   return (rank[a.status] || 99) - (rank[b.status] || 99) || new Date(b.createdAt) - new Date(a.createdAt);
                 } else {
                   return new Date(b.createdAt) - new Date(a.createdAt);
                 }
              })
              .map((booking) => (
              <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4 font-semibold text-gray-400 text-xs tracking-widest uppercase">{booking._id.substring(0,8)}</td>
                <td className="p-4 text-gray-800 font-medium">{booking.guest?.name || 'Undefined'}</td>
                <td className="p-4 text-gray-600 hidden sm:table-cell font-bold">{booking.room?.roomNumber || 'None'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ${booking.status === 'Checked-in' ? 'bg-green-100 text-green-800 border-green-200 shadow-green-100 shadow-sm' : booking.status === 'Checked-out' ? 'bg-gray-100 text-gray-600 border-gray-300' : 'bg-yellow-100 text-yellow-800 border-yellow-200 shadow-sm'}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-4 text-center flex justify-center space-x-2">
                  {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                    <button onClick={() => handleAction('checkin', booking)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md border hover:bg-indigo-700 hover:border-indigo-800 font-bold tracking-wide text-xs transition flex items-center uppercase">
                      <UserCheck className="w-4 h-4 mr-2" /> Check-in
                    </button>
                  )}
                  {booking.status === 'Checked-in' && (
                    <>
                      <button onClick={() => handleAction('checkout', booking)} className="px-5 py-2.5 bg-rose-600 text-white rounded-lg shadow-md border hover:bg-rose-700 hover:border-rose-800 font-bold tracking-wide text-xs transition flex items-center uppercase">
                        <UserMinus className="w-4 h-4 mr-2" /> Check-out
                      </button>
                      {booking.idDocumentUrl && (
                        <button onClick={() => setViewImage(booking.idDocumentUrl)} className="p-2.5 bg-gray-100 text-gray-600 rounded-lg shadow-sm border hover:bg-gray-200 hover:text-gray-900 transition flex items-center" title="View Guest ID">
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                  {(booking.status === 'Checked-out') && booking.idDocumentUrl && (
                     <button onClick={() => setViewImage(booking.idDocumentUrl)} className="p-2.5 bg-gray-100 text-gray-500 rounded-lg border hover:bg-gray-200 hover:text-gray-900 transition flex items-center" title="View Historical ID">
                        <Eye className="w-4 h-4" />
                     </button>
                  )}
                  {(booking.status === 'Checked-out' && !booking.idDocumentUrl) && (
                     <span className="text-[10px] uppercase text-gray-400 font-bold italic py-2">Archived</span>
                  )}
                </td>
              </tr>
            ))}
            {bookings.filter(b => activeTab === 'operations' ? (b.status === 'Pending' || b.status === 'Confirmed' || b.status === 'Checked-in') : ((b.status === 'Checked-out' || b.status === 'Cancelled') && (historyFilter === 'All' || b.status === historyFilter))).length === 0 && (
              <tr><td colSpan="5" className="p-12 text-center text-gray-400 font-medium italic">{activeTab === 'operations' ? 'No pending check-ins or active suites at the moment.' : 'No historical or archived records found in the database.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.isOpen && modal.type === 'checkin' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative">
            <button onClick={() => setModal({isOpen:false})} className="absolute top-4 right-4 text-gray-400 hover:text-black bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition" disabled={isUploading}>&times;</button>
            <h3 className="text-2xl font-serif mb-6 text-gray-900 border-b pb-4">Check-in Guest: {modal.booking.guest?.name}</h3>
            <form onSubmit={submitCheckIn} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-widest">ID Document Upload</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-indigo-50 hover:border-indigo-400 cursor-pointer transition overflow-hidden">
                  <input type="file" onChange={(e) => setIdFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" disabled={isUploading}/>
                  {idFile ? (
                    <div className="text-center text-indigo-700 font-bold">
                       <CheckCircle className="w-8 h-8 text-green-500 mb-2 mx-auto" />
                       {idFile.name}
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 mb-3 text-indigo-500" />
                      <span className="text-sm font-medium">Click here to browse and upload ID image</span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-indigo-50 p-5 border border-indigo-100 rounded-lg flex flex-col space-y-1">
                <p className="text-sm text-indigo-900 flex items-center justify-between"><span className="font-semibold opacity-70">Room Assigned:</span> <span className="font-bold text-lg">{modal.booking.room?.roomNumber}</span></p>
                <hr className="border-indigo-200 my-2" />
                <p className="text-xs text-indigo-700 font-bold tracking-wide">This room will be marked as Occupied immediately.</p>
              </div>
              <div className="text-right pt-4">
                <button type="submit" disabled={isUploading} className="bg-indigo-600 w-full text-white px-8 py-3.5 rounded-lg font-bold tracking-widest uppercase shadow-md hover:bg-indigo-700 transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isUploading ? 'Uploading Document...' : 'Finalize Check-in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal.isOpen && modal.type === 'checkout' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative">
            <button onClick={() => setModal({isOpen:false})} className="absolute top-4 right-4 text-gray-400 hover:text-black bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition">&times;</button>
            <h3 className="text-2xl font-serif mb-6 text-gray-900 border-b pb-4 shrink">Check-out Guest: {modal.booking.guest?.name}</h3>
            <form onSubmit={submitCheckOut} className="space-y-6">
              <div className="bg-gray-50 p-6 border border-gray-200 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Room Charges <span className="text-xs text-gray-400">({getComputedTotal().nights} Nights at ${modal.booking.room?.type?.basePrice || 0}/Night)</span> :</span>
                  <span className="text-gray-900 font-bold">${getComputedTotal().total}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-300">
                  <span className="text-gray-900 font-bold text-lg uppercase tracking-wider">Total Due:</span>
                  <span className="text-green-700 font-bold text-3xl">${getComputedTotal().total}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Status</label>
                  <select className="w-full border border-gray-300 rounded-lg p-3 font-semibold text-gray-800 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition">
                    <option value="Paid">Fully Paid</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Method</label>
                  <select className="w-full border border-gray-300 rounded-lg p-3 font-semibold text-gray-800 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition">
                    <option value="Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="bg-rose-50 p-5 border border-rose-100 rounded-lg flex items-center">
                <CreditCard className="w-6 h-6 text-rose-600 mr-4 shrink-0" />
                <p className="text-sm text-rose-800 font-medium leading-relaxed">This room will be moved directly into the <span className="font-bold underline">Cleaning Queue</span> for housekeeping.</p>
              </div>
              <div className="text-right pt-2">
                <button type="submit" className="bg-rose-600 w-full text-white px-8 py-3.5 rounded-lg font-bold tracking-widest uppercase shadow-md hover:bg-rose-700 transition hover:-translate-y-1">Confirm Check-out</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image View Modal (Native Popup) */}
      {viewImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[60] transition-opacity duration-300">
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button 
              onClick={() => setViewImage(null)} 
              className="absolute -top-12 right-0 text-white hover:text-red-400 bg-white/10 hover:bg-white/20 p-2 rounded-full transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <img src={viewImage} alt="Guest ID Document" className="max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/20" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInOut;
