import React from 'react';

const About = () => {
  return (
    <div className="py-20 bg-gray-50 min-h-[70vh] flex justify-center w-full">
      <div className="max-w-4xl px-6 text-center w-full">
        <h1 className="text-4xl font-serif text-black mb-4">Our Heritage</h1>
        <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-10"></div>
        <img src="https://images.unsplash.com/photo-1542314831-c6a4d14d8373?q=80&w=1200" alt="Hotel Façade" className="w-full h-64 md:h-96 object-cover mb-10 shadow-xl" />
        <p className="text-gray-700 leading-relaxed text-lg text-left mb-6">
          Founded on the principle of uncompromised quality, LuxuryStay has been the beacon of premium hospitality for over two decades. Our journey began with a single boutique hotel and has since blossomed into a global emblem of luxury.
        </p>
        <p className="text-gray-700 leading-relaxed text-lg text-left">
          We pride ourselves on our meticulous attention to detail, seamlessly blending classic elegance with modern innovation. Our staff forms the heart of LuxuryStay, ensuring that every guest feels not just welcomed, but deeply valued.
        </p>
      </div>
    </div>
  );
};
export default About;
