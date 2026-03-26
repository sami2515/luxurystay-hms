import React, { useState } from 'react';
import { Send, Coffee, Shirt, ConciergeBell } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

const ServiceRequest = () => {
  const [requestType, setRequestType] = useState('Dining / Food');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await api.post('/services', {
        serviceType: requestType,
        details: details
      });
      toast.success(`Concierge request sent successfully [${requestType}]`, { icon: '🛎️' });
      setDetails('');
    } catch (error) {
       toast.error(error.response?.data?.message || 'Failed connecting to reception desk');
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 flex flex-col items-center">
      <div className="w-full text-center mb-8">
        <h2 className="text-3xl font-serif text-gray-900 mb-2">Concierge Services</h2>
        <p className="text-gray-500">Unparalleled service, delivered directly to your door.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 border-b pb-2">Select Service Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => setRequestType('Dining / Food')}
              className={`border-2 rounded-xl p-6 cursor-pointer flex flex-col items-center justify-center text-center transition duration-200 ${requestType === 'Dining / Food' ? 'border-[#D4AF37] bg-yellow-50 shadow-md transform -translate-y-1' : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
            >
              <div className={`p-4 rounded-full mb-3 ${requestType === 'Dining / Food' ? 'bg-[#D4AF37] text-white shadow-sm' : 'bg-gray-200 text-gray-500'}`}>
                <Coffee className="w-8 h-8" />
              </div>
              <span className="font-bold text-gray-800 tracking-wide">Food & Beverage</span>
            </div>
            
            <div 
              onClick={() => setRequestType('Laundry Operations')}
              className={`border-2 rounded-xl p-6 cursor-pointer flex flex-col items-center justify-center text-center transition duration-200 ${requestType === 'Laundry Operations' ? 'border-[#D4AF37] bg-yellow-50 shadow-md transform -translate-y-1' : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
            >
              <div className={`p-4 rounded-full mb-3 ${requestType === 'Laundry Operations' ? 'bg-[#D4AF37] text-white shadow-sm' : 'bg-gray-200 text-gray-500'}`}>
                <Shirt className="w-8 h-8" />
              </div>
              <span className="font-bold text-gray-800 tracking-wide">Housekeeping & Laundry</span>
            </div>

            <div 
              onClick={() => setRequestType('Generic Room Upgrades')}
              className={`border-2 rounded-xl p-6 cursor-pointer flex flex-col items-center justify-center text-center transition duration-200 ${requestType === 'Generic Room Upgrades' ? 'border-[#D4AF37] bg-yellow-50 shadow-md transform -translate-y-1' : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
            >
              <div className={`p-4 rounded-full mb-3 ${requestType === 'Generic Room Upgrades' ? 'bg-[#D4AF37] text-white shadow-sm' : 'bg-gray-200 text-gray-500'}`}>
                <ConciergeBell className="w-8 h-8" />
              </div>
              <span className="font-bold text-gray-800 tracking-wide">General Amenities</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Special Instructions & Details</label>
          <textarea 
            rows="5" 
            value={details} 
            onChange={(e) => setDetails(e.target.value)} 
            placeholder="E.g., 2 club sandwiches to Room 301, requesting extra ironing boards, late checkout..."
            className="w-full p-4 font-medium text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] bg-gray-50 focus:bg-white shadow-sm resize-none transition"
            required
          ></textarea>
        </div>

        <button type="submit" disabled={submitted} className="w-full bg-zinc-900 hover:bg-black text-white py-4 rounded-lg font-bold tracking-widest uppercase text-sm shadow-xl transition flex items-center justify-center disabled:opacity-50 hover:-translate-y-0.5">
           <Send className="w-5 h-5 mr-3" /> Send Request to Concierge
        </button>
      </form>
    </div>
  );
};

export default ServiceRequest;
