import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, ConciergeBell } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../../api/axiosConfig';

const socket = io('http://localhost:5000');

const HousekeepingDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [services, setServices] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [roomsRes, servicesRes] = await Promise.all([
        api.get('/rooms'),
        api.get('/services')
      ]);
      const dirtyRooms = roomsRes.data.filter(r => r.status === 'Cleaning');
      setTasks(dirtyRooms);
      
      const pendingServices = servicesRes.data.filter(s => s.status === 'Pending');
      setServices(pendingServices);
    } catch (err) {
      console.error('Data pull pipeline broken securely:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    socket.on('roomStatusUpdated', fetchDashboardData);
    return () => socket.off('roomStatusUpdated', fetchDashboardData);
  }, []);

  const markAvailable = async (roomId, roomNumber) => {
    try {
      await api.put(`/rooms/${roomId}/status`, { status: 'Available' });
      setTasks(tasks.filter(t => t._id !== roomId));
      socket.emit('updateRoomStatus', { roomNumber, status: 'Available' });
    } catch(err) { console.error(err); }
  };

  const markServiceCompleted = async (serviceId) => {
    try {
      await api.put(`/services/${serviceId}/status`, { status: 'Completed' });
      setServices(services.filter(s => s._id !== serviceId));
    } catch(err) { console.error(err); }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif text-teal-900">Cleaning Tasks</h2>
          <p className="text-teal-700 mt-1">Rooms queued for cleaning and inspection.</p>
        </div>
        <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-lg font-bold shadow-sm">
          {tasks.length} Rooms Pending
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div key={task._id} className="bg-white rounded-xl shadow-sm border border-teal-100 p-6 hover:-translate-y-1 hover:shadow-md transition duration-200">
            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
              <div>
                <span className="text-3xl font-bold text-gray-800">Room {task.roomNumber}</span>
                <span className="ml-2 px-2 py-1 bg-gray-100 text-[10px] font-bold uppercase rounded text-gray-500 tracking-widest border">{task.type?.name}</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-sm bg-red-100 border border-red-200 text-red-700`}>
                High Priority
              </span>
            </div>
            
            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-center text-gray-600 text-sm font-medium">
                <Clock className="w-4 h-4 mr-2 text-teal-600" />
                Wait Time: <span className="text-gray-900 ml-1">Standard</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm font-medium">
                <span className="w-3 h-3 mr-2 rounded-full bg-yellow-400 border border-yellow-500 shadow-sm ml-0.5" />
                Current Status: <span className="text-gray-900 ml-1 uppercase">{task.status}</span>
              </div>
            </div>

            <button 
              onClick={() => markAvailable(task._id, task.roomNumber)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold tracking-wider uppercase text-sm py-3 px-4 rounded-lg flex items-center justify-center transition shadow-md"
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Mark Available
            </button>
          </div>
        ))}

        {tasks.length === 0 && services.length === 0 && (
          <div className="col-span-full bg-teal-50 border border-teal-200 rounded-xl p-10 text-center text-teal-800 shadow-sm">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-teal-400 opacity-60" />
            <h3 className="text-xl font-bold">No Pending Tasks</h3>
            <p className="mt-1 font-medium">All queued rooms have been cleaned and released to front desk algorithms!</p>
          </div>
        )}

        {/* Guest Services Queue */}
        {services.map(service => (
          <div key={service._id} className="bg-white rounded-xl shadow-sm border border-yellow-100 p-6 hover:-translate-y-1 hover:shadow-md transition duration-200">
            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
              <div>
                <span className="text-2xl font-bold text-gray-800 block">Room {service.booking?.room?.roomNumber || 'Unknown'}</span>
                <span className="px-2 py-0.5 mt-1 inline-block bg-yellow-100 text-[10px] font-bold uppercase rounded text-yellow-700 border border-yellow-200 tracking-wider">
                  Guest Request
                </span>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm bg-orange-100 border border-orange-200 text-orange-800`}>
                {service.serviceType}
              </span>
            </div>
            
            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-start text-gray-600 text-sm font-medium bg-gray-50 p-3 rounded border border-gray-100">
                <ConciergeBell className="w-4 h-4 mr-2 text-yellow-600 mt-0.5 shrink-0" />
                <span className="text-gray-800">{service.details}</span>
              </div>
            </div>

            <button 
              onClick={() => markServiceCompleted(service._id)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold tracking-wider uppercase text-sm py-3 px-4 rounded-lg flex items-center justify-center transition shadow-md"
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Mark Completed
            </button>
          </div>
        ))}

      </div>
    </div>
  );
};

export default HousekeepingDashboard;
