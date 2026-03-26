import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid electronic mail format').required('Email identifier strictly required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Authentication Hash required'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const authenticatedUser = await login(values.email, values.password);
      toast.success(`Authentication Successful. Welcome aboard, ${authenticatedUser.role || 'Guest'}.`, { icon: '🗝️' });
      navigate(`/${authenticatedUser.role === 'admin' ? 'admin' : authenticatedUser.role || 'guest'}`);
    } catch (error) {
      toast.error(error.message || 'Invalid Credentials', { icon: '❌' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 relative overflow-hidden py-10 px-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d14d8373?q=80&w=1200')] opacity-20 object-cover bg-cover bg-center"></div>
      
      <div className="bg-white p-8 md:p-14 rounded-2xl shadow-2xl max-w-[420px] w-full relative z-10 border border-gray-100 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif text-gray-900 mb-3">LuxuryStay</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Secure Access Portal Endpoint</p>
        </div>
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-5">
              <div>
                <Field name="email" type="email" placeholder="Email Address Identification" className={`w-full p-4 bg-gray-50 border rounded-lg focus:bg-white outline-none transition text-sm font-semibold tracking-wide ${errors.email && touched.email ? 'border-red-500 text-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`} />
                <ErrorMessage name="email" component="div" className="text-red-500 text-[11px] font-bold uppercase tracking-widest mt-1.5" />
              </div>

              <div>
                <Field name="password" type="password" placeholder="Secure Password Hash" className={`w-full p-4 bg-gray-50 border rounded-lg focus:bg-white outline-none transition text-sm font-semibold tracking-wide ${errors.password && touched.password ? 'border-red-500 text-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`} />
                <ErrorMessage name="password" component="div" className="text-red-500 text-[11px] font-bold uppercase tracking-widest mt-1.5" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-zinc-900 text-white p-4.5 rounded-lg hover:bg-black uppercase tracking-widest text-xs font-bold shadow-xl transition hover:-translate-y-0.5 disabled:opacity-50 mt-6 flex py-4 justify-center items-center">
                {isSubmitting ? 'Authenticating...' : 'Establish Session'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-8 text-center text-xs text-gray-500 font-bold uppercase tracking-widest">
          <p>Lacking Credentials? <Link to="/register" className="text-[#D4AF37] hover:underline ml-1">Register Node</Link></p>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100 text-center text-[9px] text-gray-400 uppercase tracking-widest">
          <p>Live MongoDB Integration Enabled. Requires secure database credentials.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
