import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, UserPlus, CheckCircle, Home } from 'lucide-react';
import api from '../../api/axiosConfig';
import { io } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

const Notifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setAlerts(data);
    } catch (error) {
      console.error('Failed fetching native alerts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    socket.on('newNotification', fetchNotifications);
    return () => {
      socket.off('newNotification', fetchNotifications);
    };
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setAlerts(alerts.map(a => ({ ...a, isNewAlert: false })));
    } catch (err) {
      console.error('Failed sweeping unread flags', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Booking': return <UserPlus className="w-5 h-5 text-indigo-500" />;
      case 'Maintenance': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'Review': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Housekeeping': return <Home className="w-5 h-5 text-teal-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-3xl font-serif text-gray-900">System Alerts</h2>
          <p className="text-gray-500 mt-1 font-medium">Real-time operational notifications pushed securely.</p>
        </div>
        <button onClick={markAllRead} className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100 px-4 py-2 rounded-full border border-yellow-200 transition">
          Mark All Read
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 bg-gray-50/50 animate-pulse">Scanning server nodes for immediate alerts...</div>
        ) : alerts.map((alert, index) => (
          <div key={alert._id} className={`p-6 flex items-start ${index !== alerts.length - 1 ? 'border-b border-gray-100' : ''} ${alert.isNewAlert ? 'bg-blue-50/40' : 'bg-white'} hover:bg-gray-50 transition duration-200 cursor-pointer`}>
            <div className={`p-3 rounded-full mr-5 items-center justify-center flex shrink-0 ${alert.isNewAlert ? 'bg-white shadow-sm border border-gray-100' : 'bg-gray-100 border border-transparent'}`}>
              {getIcon(alert.type)}
            </div>
            <div className="flex-1 mt-1">
              <div className="flex justify-between items-start mb-1.5">
                <h4 className={`text-base font-semibold ${alert.isNewAlert ? 'text-gray-900' : 'text-gray-600'}`}>{alert.message}</h4>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 whitespace-nowrap bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{alert.type} Node</p>
            </div>
            {alert.isNewAlert && (
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-2.5 ml-4 shadow-sm shrink-0"></div>
            )}
          </div>
        ))}

        {!loading && alerts.length === 0 && (
          <div className="p-12 text-center text-gray-500 bg-gray-50/50">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300 opacity-60" />
            <p className="font-bold text-lg text-gray-600">No active alerts detected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
