import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, UserX, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'receptionist' });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get('/auth/users?role=staff');
        setStaff(res.data);
      } catch (err) { console.error('Error fetching global staff metrics: ', err); }
    };
    fetchStaff();
  }, []);

  const toggleStatus = (id) => {
    // Backend API would need an endpoint to toggle active statuses, mocked locally for presentation UI
    setStaff(staff.map(s => s._id === id ? { ...s, active: !s.active } : s));
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/staff', formData);
      toast.success('Staff account provisioned successfully', { icon: '✅' });
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'receptionist' });
      const res = await api.get('/auth/users?role=staff');
      setStaff(res.data);
    } catch(err) {
      toast.error(err.response?.data?.message || 'Error parsing Staff Creation metrics');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif text-gray-800">Manage Staff</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-900 text-white px-4 py-2 rounded shadow hover:bg-blue-800 transition flex items-center font-medium">
          <UserPlus className="w-5 h-5 mr-2" /> Add Staff Account
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">Name</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">Email</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">Role</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">Status</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg mr-3 shadow-sm border border-blue-200 shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-gray-800">{member.name}</span>
                </td>
                <td className="p-4 text-gray-600">{member.email}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gray-200 text-gray-700 flex items-center w-max border border-gray-300">
                    <Shield className="w-3 h-3 mr-1" /> {member.role}
                  </span>
                </td>
                <td className="p-4">
                  {member.active !== false ? (
                    <span className="text-green-600 font-bold flex items-center"><UserCheck className="w-5 h-5 mr-1"/> Active</span>
                  ) : (
                    <span className="text-red-500 font-bold flex items-center"><UserX className="w-5 h-5 mr-1"/> Inactive</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => toggleStatus(member._id)}
                    className={`px-4 py-2 text-sm font-bold rounded-lg border shadow-sm transition ${member.active !== false ? 'border-red-500 text-red-600 hover:bg-red-50' : 'border-green-600 text-green-700 hover:bg-green-50'}`}
                  >
                    {member.active !== false ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition">&times;</button>
            <h3 className="text-2xl font-serif mb-6 text-gray-900 border-b pb-4">Provision Staff Account</h3>
            <form onSubmit={handleAddStaff} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-widest">Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-widest">Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-widest">Password Protocol</label>
                <input type="password" required minLength="6" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-widest">Department Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-900">
                  <option value="receptionist">Receptionist</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-900 text-white font-bold uppercase tracking-widest py-3 rounded-lg shadow-md hover:bg-blue-800 transition mt-4">Generate Account</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
