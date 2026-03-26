import React from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address format').required('Email is required'),
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format. Must include country code.')
    .required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  preferences: Yup.string()
});

const GuestProfile = () => {
  const { user } = useAuth();
  
  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    preferences: '',
    address: ''
  };

  const handleSave = (values, { setSubmitting }) => {
    setTimeout(() => {
      toast.success('Profile updated successfully!', { icon: '✅' });
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-zinc-900 p-8 text-center text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d14d8373?q=80&w=600')] opacity-10 object-cover bg-cover bg-center"></div>
        <div className="w-24 h-24 bg-[#D4AF37] text-black text-4xl font-serif flex items-center justify-center rounded-full mx-auto mb-4 shadow-xl border-4 border-zinc-800 relative z-10">
          {user?.name?.charAt(0) || 'G'}
        </div>
        <h2 className="text-3xl font-serif relative z-10">{user?.name || 'Guest User'}</h2>
        <p className="text-[#D4AF37] text-xs mt-2 font-bold tracking-widest uppercase relative z-10 p-2 border border-[#D4AF37] inline-block rounded">{user?.role || 'Guest'} Profile</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={ProfileSchema}
        onSubmit={handleSave}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                <Field type="text" name="name" className={`w-full p-3 font-semibold text-gray-800 bg-gray-50 border rounded-lg focus:bg-white focus:ring-1 outline-none transition ${errors.name && touched.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] shadow-sm'}`} />
                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1 font-bold tracking-wider" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                <Field type="email" name="email" readOnly className={`w-full p-3 font-semibold text-gray-800 bg-gray-100/50 border rounded-lg focus:outline-none cursor-not-allowed ${errors.email && touched.email ? 'border-red-500' : 'border-gray-200 shadow-sm'}`} />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 font-bold tracking-wider" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                <Field type="text" name="phone" className={`w-full p-3 font-semibold text-gray-800 bg-gray-50 border rounded-lg focus:bg-white focus:ring-1 outline-none transition ${errors.phone && touched.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] shadow-sm'}`} />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1 font-bold tracking-wider" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Address</label>
                <Field type="text" name="address" className={`w-full p-3 font-semibold text-gray-800 bg-gray-50 border rounded-lg focus:bg-white focus:ring-1 outline-none transition ${errors.address && touched.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] shadow-sm'}`} />
                <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1 font-bold tracking-wider" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Special Preferences</label>
              <Field as="textarea" rows="3" name="preferences" className="w-full p-3 font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] shadow-sm outline-none transition resize-none" placeholder="Any dietary or room preferences..." />
            </div>

            <div className="pt-8 text-right border-t border-gray-100">
              <button type="submit" disabled={isSubmitting} className="bg-[#D4AF37] hover:bg-yellow-600 disabled:opacity-50 text-black font-bold tracking-widest uppercase text-[11px] px-8 py-3.5 rounded-lg shadow-md transition flex items-center justify-center ml-auto w-full md:w-auto hover:-translate-y-0.5">
                <Save className="w-4 h-4 mr-2" /> {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default GuestProfile;
