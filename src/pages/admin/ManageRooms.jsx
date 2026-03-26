import React, { useState, useEffect } from 'react';
import { Key, Plus, List, Layers, Trash2, Edit, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

const ManageRooms = () => {
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' or 'types'
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('room'); // 'room' or 'type'
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [uploadingImage, setUploadingImage] = useState(false);

  // Forms
  const [roomFormData, setRoomFormData] = useState({ roomNumber: '', type: '', status: 'Available' });
  const [typeFormData, setTypeFormData] = useState({ name: '', basePrice: 0, capacity: 2, description: '', images: [] });

  const fetchData = async () => {
    try {
      const [rtRes, rRes] = await Promise.all([
        api.get('/room-types'),
        api.get('/rooms')
      ]);
      setRoomTypes(rtRes.data);
      setRooms(rRes.data);
    } catch (err) {
      console.error('Failed fetching core room data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Image Upload Logic utilizing existing Cloudinary upload route
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('document', file); // backend expects 'document' field based on checkin config
    
    setUploadingImage(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTypeFormData(prev => ({ ...prev, images: [...prev.images, data.fileUrl] }));
      toast.success('Image mapped to Cloudinary storage!', { icon: '📸' });
    } catch (err) {
      toast.error('Image proxy relay failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setTypeFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  // ROOM TYPES (Categories) Logic
  const handleSaveRoomType = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/room-types/${editId}`, typeFormData);
        toast.success('Room Category patched dynamically!', { icon: '✅' });
      } else {
        await api.post('/room-types', typeFormData);
        toast.success('Room Category created successfully!', { icon: '✅' });
      }
      closeModal();
      fetchData();
    } catch (err) {
      toast.error('Failed to save Room Category: ' + (err.response?.data?.message || err.message));
    }
  };

  const openEditTypeModal = (rt) => {
    setTypeFormData({ name: rt.name, basePrice: rt.basePrice, capacity: rt.capacity, description: rt.description, images: rt.images || [] });
    setEditId(rt._id);
    setIsEditMode(true);
    setModalType('type');
    setIsModalOpen(true);
  };

  const deleteRoomType = async (id) => {
    if(!window.confirm('Wipe this Category entirely? Active rooms mapped to this category may break.')) return;
    try {
      await api.delete(`/room-types/${id}`);
      toast.success('Category completely erased.');
      fetchData();
    } catch(err) {
      toast.error('Failed to eliminate category.');
    }
  };

  // ROOM Logic
  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/rooms/${editId}`, roomFormData);
        toast.success('Room properties patched securely!', { icon: '✅' });
      } else {
        await api.post('/rooms', roomFormData);
        toast.success('Room Number mapped securely!', { icon: '✅' });
      }
      closeModal();
      fetchData();
    } catch (err) {
      toast.error('Failed to assign Room: ' + (err.response?.data?.message || err.message));
    }
  };

  const openEditRoomModal = (r) => {
    setRoomFormData({ roomNumber: r.roomNumber, type: r.type?._id || '', status: r.status });
    setEditId(r._id);
    setIsEditMode(true);
    setModalType('room');
    setIsModalOpen(true);
  };

  const deleteRoom = async (id) => {
    if(!window.confirm('Permanently delete this room?')) return;
    try {
      await api.delete(`/rooms/${id}`);
      toast.success('Room permanently deleted.');
      fetchData();
    } catch(err) {
      toast.error('Failed to eliminate room.');
    }
  };

  // Modal Controls
  const openNewRoomModal = () => {
    if (roomTypes.length === 0) return toast.error('Create a Room Category first!', { icon: '⚠️' });
    setRoomFormData({ roomNumber: '', type: roomTypes[0]._id, status: 'Available' });
    setIsEditMode(false);
    setEditId(null);
    setModalType('room');
    setIsModalOpen(true);
  };

  const openNewTypeModal = () => {
    setTypeFormData({ name: '', basePrice: 0, capacity: 2, description: '', images: [] });
    setIsEditMode(false);
    setEditId(null);
    setModalType('type');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-gray-800 flex items-center">
            <Key className="w-8 h-8 mr-3 text-indigo-600" /> Manage Rooms
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Control physical infrastructure, structural classifications, and pricing logic.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={openNewTypeModal} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md transition flex items-center font-bold tracking-wide text-sm uppercase">
            <Layers className="w-4 h-4 mr-2" /> New Category
          </button>
          <button onClick={openNewRoomModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition flex items-center font-bold tracking-wide text-sm uppercase">
            <Plus className="w-4 h-4 mr-2" /> Add Room
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('rooms')} 
          className={`pb-4 px-6 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'rooms' ? 'text-indigo-600 border-b-2 border-indigo-600 opacity-100' : 'text-gray-400 hover:text-gray-600 opacity-70'}`}
        >
          Individual Rooms ({rooms.length})
        </button>
        <button 
          onClick={() => setActiveTab('types')} 
          className={`pb-4 px-6 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'types' ? 'text-green-600 border-b-2 border-green-600 opacity-100' : 'text-gray-400 hover:text-gray-600 opacity-70'}`}
        >
          Room Categories ({roomTypes.length})
        </button>
      </div>

      {activeTab === 'rooms' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest">Room Number</th>
                <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest">Category Type</th>
                <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest hidden sm:table-cell">Current Status</th>
                <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-indigo-700 text-lg">{r.roomNumber}</td>
                  <td className="p-4 text-gray-800 font-semibold">{r.type?.name || 'Unknown Type'}</td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border ${
                      r.status === 'Available' ? 'bg-green-100 text-green-800 border-green-200' :
                      r.status === 'Occupied' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      r.status === 'Cleaning' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEditRoomModal(r)} className="p-2 text-indigo-500 hover:bg-indigo-100 rounded-lg transition mr-2" title="Edit Room">
                      <Edit className="w-5 h-5 mx-auto" />
                    </button>
                    <button onClick={() => deleteRoom(r._id)} className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition" title="Delete Room">
                      <Trash2 className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-500 font-medium">No individual rooms have been mapped into the building architecture yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'types' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomTypes.map(rt => (
            <div key={rt._id} className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-gray-200 relative">
                <img src={rt.images?.[0] || 'https://images.unsplash.com/photo-1590490359854-dfba196cece5?q=80&w=800'} alt={rt.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button onClick={() => openEditTypeModal(rt)} className="p-2 bg-white/90 hover:bg-white text-indigo-600 rounded-lg transition shadow">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteRoomType(rt._id)} className="p-2 bg-white/90 hover:bg-white text-rose-600 rounded-lg transition shadow">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold font-serif text-gray-800">{rt.name}</h3>
                  <span className="font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200 text-sm whitespace-nowrap">${rt.basePrice}/night</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 h-12 overflow-hidden">{rt.description}</p>
                <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 pt-4 mt-2">
                  <span>Cap: {rt.capacity} Persons</span>
                  <span className="text-green-500">{rooms.filter(r => r.type?._id === rt._id).length} Rooms</span>
                </div>
              </div>
            </div>
          ))}
          {roomTypes.length === 0 && (
            <div className="col-span-full p-12 text-center text-gray-500 font-medium bg-white rounded-xl shadow-sm border border-gray-100">
              No categories designed yet. Create a Base Category to start assigning individual room doors.
            </div>
          )}
        </div>
      )}

      {/* Dynamic Modal Container */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-black bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition">&times;</button>
            <h3 className="text-2xl font-serif mb-6 text-gray-900 border-b pb-4">
              {isEditMode ? 'Modify Entity Specifications' : (modalType === 'room' ? 'Register New Room' : 'Design Room Category')}
            </h3>
            
            {modalType === 'type' ? (
              <form onSubmit={handleSaveRoomType} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Category Name</label>
                  <input type="text" required value={typeFormData.name} onChange={e => setTypeFormData({...typeFormData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 font-semibold text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="e.g. Deluxe Suite" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Base Price / Night ($)</label>
                    <input type="number" required min="1" value={typeFormData.basePrice} onChange={e => setTypeFormData({...typeFormData, basePrice: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg p-3 font-semibold text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Capacity (Persons)</label>
                    <input type="number" required min="1" max="10" value={typeFormData.capacity} onChange={e => setTypeFormData({...typeFormData, capacity: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg p-3 font-semibold text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Marketing Description</label>
                  <textarea rows="3" required value={typeFormData.description} onChange={e => setTypeFormData({...typeFormData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 font-semibold text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none" placeholder="Experience the pinnacle of luxury..."></textarea>
                </div>
                
                {/* Image Uploader */}
                <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span>Category Images</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px]">{typeFormData.images.length} Arrayed</span>
                  </label>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {typeFormData.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-300 group">
                        <img src={img} alt="Room preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {typeFormData.images.length === 0 && <p className="text-xs text-gray-400 italic">No images populated natively yet.</p>}
                  </div>

                  <label className="cursor-pointer border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50 transition w-full p-3 flex flex-col items-center justify-center rounded-lg">
                    {uploadingImage ? (
                      <span className="text-green-600 font-bold text-sm flex items-center animate-pulse"><Upload className="w-4 h-4 mr-2" /> Pushing stream...</span>
                    ) : (
                      <span className="text-green-600 font-bold text-sm tracking-wide flex items-center"><Upload className="w-4 h-4 mr-2" /> Upload Cloudinary Asset</span>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full bg-green-600 text-white font-bold tracking-widest uppercase py-3.5 rounded-lg shadow-md hover:bg-green-700 transition flex items-center justify-center">
                    {isEditMode ? 'Patch Entity Metadata' : 'Establish Secure Category'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveRoom} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Assigned Room Number</label>
                  <input type="text" required value={roomFormData.roomNumber} onChange={e => setRoomFormData({...roomFormData, roomNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. 101" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Parent Category</label>
                  <select required value={roomFormData.type} onChange={e => setRoomFormData({...roomFormData, type: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white">
                    <option value="" disabled>Select a mapped category...</option>
                    {roomTypes.map(rt => (
                      <option key={rt._id} value={rt._id}>{rt.name} - ${rt.basePrice}/night</option>
                    ))}
                  </select>
                </div>

                {isEditMode && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Live Status Matrix</label>
                    <select value={roomFormData.status} onChange={e => setRoomFormData({...roomFormData, status: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white">
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                )}

                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mt-4">
                  <p className="text-xs text-indigo-800 font-semibold leading-relaxed">This physical room will universally inherit pricing hierarchies and media matrices assigned securely directly inside its parent Room Category.</p>
                </div>
                
                <div className="pt-2">
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold tracking-widest uppercase py-3.5 rounded-lg shadow-md hover:bg-indigo-700 transition">
                    {isEditMode ? 'Modify Hardware Assignation' : 'Mount Room Array Node'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
