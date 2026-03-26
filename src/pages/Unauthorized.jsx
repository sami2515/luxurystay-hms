import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-red-50 text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Access Denied</h2>
      <p className="text-gray-600 mb-8 max-w-md">You do not have the necessary permissions to view this page based on your role.</p>
      <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition">Return to Home</Link>
    </div>
  );
};

export default Unauthorized;
