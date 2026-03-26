import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const ContactSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  message: Yup.string().min(10, 'Message must be at least 10 characters long').required('Required'),
});

const Contact = () => {
  return (
    <div className="py-20 bg-white min-h-[70vh] w-full flex justify-center">
      <div className="max-w-6xl w-full px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-black mb-4">Contact Us</h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-serif mb-6 text-gray-800">Get in Touch</h2>
            <Formik
              initialValues={{ name: '', email: '', message: '' }}
              validationSchema={ContactSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                setTimeout(() => {
                  toast.success('Your message has been securely mapped to our Executive Concierge!', { icon: '📨' });
                  resetForm();
                  setSubmitting(false);
                }, 1000);
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2 uppercase tracking-wide">Name</label>
                    <Field name="name" type="text" className={`w-full bg-transparent border-b outline-none py-2 transition ${errors.name && touched.name ? 'border-red-500 focus:border-red-500 text-red-500' : 'border-gray-300 focus:border-[#D4AF37]'}`} placeholder="John Doe" />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2 uppercase tracking-wide">Email</label>
                    <Field name="email" type="email" className={`w-full bg-transparent border-b outline-none py-2 transition ${errors.email && touched.email ? 'border-red-500 focus:border-red-500 text-red-500' : 'border-gray-300 focus:border-[#D4AF37]'}`} placeholder="john@example.com" />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2 uppercase tracking-wide">Message</label>
                    <Field name="message" as="textarea" rows="4" className={`w-full bg-transparent border-b outline-none py-2 transition ${errors.message && touched.message ? 'border-red-500 focus:border-red-500 text-red-500' : 'border-gray-300 focus:border-[#D4AF37]'}`} placeholder="How can we help you?" />
                    <ErrorMessage name="message" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-[#D4AF37] disabled:opacity-50 transition border border-transparent hover:border-[#D4AF37]">
                    {isSubmitting ? 'Transmitting...' : 'Send Message'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
          
          <div className="bg-gray-50 border border-gray-100 shadow-sm p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-serif mb-8 text-gray-800">Our Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="text-[#D4AF37] mr-4 w-6 h-6 shrink-0" />
                <p className="text-gray-600">123 Luxury Avenue, Prestige Center<br />Metropolis, NY 10001</p>
              </div>
              <div className="flex items-center">
                <Phone className="text-[#D4AF37] mr-4 w-6 h-6 shrink-0" />
                <p className="text-gray-600">+1 (800) LUX-STAY</p>
              </div>
              <div className="flex items-center">
                <Mail className="text-[#D4AF37] mr-4 w-6 h-6 shrink-0" />
                <p className="text-gray-600">reservations@luxurystay.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
