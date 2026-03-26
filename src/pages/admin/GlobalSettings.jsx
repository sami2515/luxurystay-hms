import React, { useState } from 'react';
import { Settings, Save, Percent, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const GlobalSettings = () => {
  const [settings, setSettings] = useState({
    taxPercentage: 13,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    hotelPolicy: 'Smoking is strictly prohibited in all rooms. A $250 cleaning fee applies automatically upon violation. Pets are accommodated exclusively within designated ground-floor suites subject to prior executive approval.'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Global Settings saved successfully.', { icon: '⚙️' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-serif text-gray-900 flex items-center">
          <Settings className="w-8 h-8 mr-3 text-indigo-600" /> Hotel Configuration
        </h2>
        <p className="text-gray-500 mt-2 font-medium">Manage hotel settings, standard policies, and operational details.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-10">
        {/* Tax Configuration */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-5 uppercase tracking-widest text-sm bg-gray-50 px-4 py-2 rounded-md">
            <Percent className="w-5 h-5 mr-2 text-indigo-500" /> Billing & Taxation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
                Standard Tax Rate (%)
              </label>
              <input 
                type="number" 
                className="w-full p-4 font-bold border border-gray-200 bg-gray-50 hover:bg-white focus:bg-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-sm text-gray-700"
                value={settings.taxPercentage}
                onChange={(e) => setSettings({...settings, taxPercentage: e.target.value})}
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Timings */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-5 uppercase tracking-widest text-sm bg-gray-50 px-4 py-2 rounded-md">
            <Clock className="w-5 h-5 mr-2 text-indigo-500" /> Operational Timings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
                Check-In Time
              </label>
              <input 
                type="time" 
                className="w-full p-4 font-bold border border-gray-200 bg-gray-50 hover:bg-white focus:bg-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-sm text-gray-700"
                value={settings.checkInTime}
                onChange={(e) => setSettings({...settings, checkInTime: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
                Check-Out Time
              </label>
              <input 
                type="time" 
                className="w-full p-4 font-bold border border-gray-200 bg-gray-50 hover:bg-white focus:bg-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-sm text-gray-700"
                value={settings.checkOutTime}
                onChange={(e) => setSettings({...settings, checkOutTime: e.target.value})}
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Policy */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-5 uppercase tracking-widest text-sm bg-gray-50 px-4 py-2 rounded-md">
            <FileText className="w-5 h-5 mr-2 text-indigo-500" /> Hotel Policy
          </h3>
          <div className="pl-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
              Terms & Conditions
            </label>
            <textarea 
              rows="5"
              className="w-full p-5 font-semibold leading-relaxed text-gray-700 border border-gray-200 bg-gray-50 hover:bg-white focus:bg-white rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition shadow-sm"
              value={settings.hotelPolicy}
              onChange={(e) => setSettings({...settings, hotelPolicy: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold tracking-widest uppercase py-4 rounded-lg shadow-xl drop-shadow transition flex items-center justify-center hover:-translate-y-0.5">
            <Save className="w-6 h-6 mr-3 shrink-0" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default GlobalSettings;
