import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name too short').required('Full Name required'),
  email: Yup.string().email('Invalid email address').required('Email required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password required'),
});

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      await register(values.name, values.email, values.password);
      toast.success('Registration successful! Please login to access your portal.', { icon: '✨' });
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration dropped securely', { icon: '❌' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 relative overflow-hidden py-10">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d14d8373?q=80&w=1200')] opacity-20 object-cover bg-cover bg-center"></div>
      
      <div className="bg-white p-8 md:p-14 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative z-10 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-serif text-gray-900 mb-3 block">LuxuryStay</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Create Elite Profile</p>
        </div>
        
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting, errors, touched }) => (
             <Form className="space-y-5">
              <div>
                <Field name="name" type="text" placeholder="Full Legal Name" className={`w-full p-4 text-sm font-semibold bg-gray-50 border rounded-lg focus:bg-white outline-none transition ${errors.name && touched.name ? 'border-red-500 text-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`} />
                <ErrorMessage name="name" component="div" className="text-red-500 text-[11px] mt-1 font-bold uppercase tracking-wider" />
              </div>

              <div>
                <Field name="email" type="email" placeholder="Email Address" className={`w-full p-4 text-sm font-semibold bg-gray-50 border rounded-lg focus:bg-white outline-none transition ${errors.email && touched.email ? 'border-red-500 text-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`} />
                <ErrorMessage name="email" component="div" className="text-red-500 text-[11px] mt-1 font-bold uppercase tracking-wider" />
              </div>

              <div>
                <Field name="password" type="password" placeholder="Secure Password" className={`w-full p-4 text-sm font-semibold bg-gray-50 border rounded-lg focus:bg-white outline-none transition ${errors.password && touched.password ? 'border-red-500 text-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`} />
                <ErrorMessage name="password" component="div" className="text-red-500 text-[11px] mt-1 font-bold uppercase tracking-wider" />
              </div>

              <div>
                <Field name="confirmPassword" type="password" placeholder="Confirm Target Password" className={`w-full p-4 text-sm font-semibold bg-gray-50 border rounded-lg focus:bg-white outline-none transition ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500 text-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`} />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-[11px] mt-1 font-bold uppercase tracking-wider" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-[#D4AF37] text-black p-4.5 rounded-lg hover:bg-yellow-600 uppercase tracking-widest text-xs font-bold shadow-xl transition hover:-translate-y-0.5 disabled:opacity-50 mt-6 flex justify-center py-4">
                {isSubmitting ? 'Configuring Profile...' : 'Complete Registry'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-8 text-center text-xs text-gray-500 font-bold uppercase tracking-widest">
          <p>Existing Guest Node? <Link to="/login" className="text-[#D4AF37] hover:underline ml-1">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
