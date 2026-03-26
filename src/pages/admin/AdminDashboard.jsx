import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bed, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import api from '../../api/axiosConfig';

const AdminDashboard = () => {
  const [metricStats, setMetricStats] = useState({ rooms: 0, todayBookings: 0, revenue: '$0', issues: 0, chartData: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes, maintenanceRes] = await Promise.all([
           api.get('/rooms'),
           api.get('/bookings'),
           api.get('/maintenance')
        ]);
        const rData = roomsRes.data;
        const bData = bookingsRes.data;
        const mData = maintenanceRes.data;

        const totalRooms = rData.length;
        const today = new Date().toDateString();
        const todaysBookings = bData.filter(b => new Date(b.createdAt).toDateString() === today || new Date(b.checkIn).toDateString() === today).length;
        
        let totalRevenue = 0;
        const monthlyRevenue = {};
        const monthsStr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        monthsStr.forEach(m => monthlyRevenue[m] = 0);

        bData.forEach(b => {
           if(b.status === 'Checked-in' || b.status === 'Checked-out') {
             const nights = Math.max(1, Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 3600 * 24)));
             const amt = (b.totalAmount || (nights * (b.room?.type?.basePrice || 0)));
             totalRevenue += amt;
             
             // Aggregate for Chart
             const mName = new Date(b.checkIn).toLocaleString('default', { month: 'short' });
             if (monthlyRevenue[mName] !== undefined) {
               monthlyRevenue[mName] += amt;
             }
           }
        });

        const activeIssues = mData.filter(m => m.status !== 'Resolved').length;

        const mappedChartData = monthsStr.map(m => ({ name: m, revenue: monthlyRevenue[m] }));
        
        // Filter out trailing zero months for better UX, or keep them up to current month
        const currentMonthIndex = new Date().getMonth();
        const filteredChartData = mappedChartData.slice(0, currentMonthIndex + 1);

        setMetricStats({ rooms: totalRooms, todayBookings: todaysBookings, revenue: `$${totalRevenue.toLocaleString()}`, issues: activeIssues, chartData: filteredChartData });
      } catch (err) {
        console.error('Data mapping failed:', err);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { title: 'Total Rooms', value: metricStats.rooms.toString(), icon: Bed, color: 'bg-blue-100 text-blue-800' },
    { title: "Today's Bookings", value: metricStats.todayBookings.toString(), icon: Calendar, color: 'bg-green-100 text-green-800' },
    { title: 'Monthly Revenue', value: metricStats.revenue, icon: DollarSign, color: 'bg-yellow-100 text-yellow-800' },
    { title: 'Pending Issues', value: metricStats.issues.toString(), icon: AlertCircle, color: 'bg-red-100 text-red-800' }
  ];

  const revenueData = metricStats.chartData;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif text-gray-800 mb-8">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-full ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Monthly Revenue</h3>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill: '#666'}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip 
                cursor={{fill: '#f9fafb'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
