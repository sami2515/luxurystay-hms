import React, { useState, useEffect } from 'react';
import { AlertTriangle, Wrench, CheckCircle, Clock } from 'lucide-react';
import api from '../../api/axiosConfig';

const MaintenanceDashboard = () => {
  const [requests, setRequests] = useState([]);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/maintenance');
      setRequests(res.data);
    } catch(err) { console.error('Failed mapping absolute maintenance metrics', err); }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/maintenance/${id}/status`, { status: newStatus });
      setRequests(requests.map(req => req._id === id ? { ...req, status: newStatus } : req));
    } catch(err) { console.error('Put sequence fault', err); }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif text-orange-900">Maintenance Requests</h2>
          <p className="text-orange-700 mt-1">Manage active facility issues and structural repairs.</p>
        </div>
        <div className="bg-orange-100 border border-orange-200 shadow-sm text-orange-800 px-4 py-2 rounded-lg font-bold">
          {requests.filter(r => r.status !== 'Resolved').length} Active Tickets
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.filter(r => r.status !== 'Resolved').map(req => (
          <div key={req._id} className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:-translate-y-1 hover:shadow-md transition flex flex-col">
            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xl font-bold text-gray-800 mb-1 block">Room {req.room?.roomNumber || 'Unknown'}</span>
                <span className="text-[10px] font-bold uppercase text-orange-600 tracking-widest bg-orange-50 px-2 py-0.5 rounded border border-orange-200">Ticket #{req._id.substring(0,8)}</span>
              </div>
              <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-widest border shadow-sm ${req.status === 'Reported' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                {req.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-6 flex-1">
              <p className="text-gray-800 font-medium bg-gray-50/50 p-4 rounded-lg border border-gray-200 italic shadow-sm">
                "{req.issueDescription}"
              </p>
              <div className="flex items-center text-gray-500 text-xs uppercase font-bold tracking-wider mt-4">
                <Clock className="w-4 h-4 mr-2 text-orange-400" />
                Reported at: <span className="text-gray-800 ml-1">{new Date(req.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {req.status === 'Reported' && (
                <button 
                  onClick={() => updateStatus(req._id, 'In Progress')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-widest uppercase text-xs py-3.5 px-4 rounded-lg flex items-center justify-center transition shadow-md"
                >
                  <Wrench className="w-4 h-4 mr-2" /> Start Work
                </button>
              )}
              {req.status === 'In Progress' && (
                <button 
                  onClick={() => updateStatus(req._id, 'Resolved')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold tracking-widest uppercase text-xs py-3.5 px-4 rounded-lg flex items-center justify-center transition shadow-md"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}

        {requests.filter(r => r.status !== 'Resolved').length === 0 && (
          <div className="col-span-full bg-orange-50 border border-orange-200 rounded-xl p-10 text-center text-orange-800 shadow-sm">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-orange-400 opacity-60" />
            <h3 className="text-xl font-bold">No Active Requests</h3>
            <p className="mt-1 font-medium">All facilities and operational architectures are healthy!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
