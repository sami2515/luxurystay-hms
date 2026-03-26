import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  const slides = [
    { id: 1, image: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8373?q=80&w=2000&auto=format&fit=crop', title: 'Unparalleled Luxury', subtitle: 'Discover your perfect getaway' },
    { id: 2, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop', title: 'Exquisite Comfort', subtitle: 'Indulge in premium suites' },
    { id: 3, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2000&auto=format&fit=crop', title: 'A World of Relaxation', subtitle: 'Exclusive spa and wellness' }
  ];
  
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full">
      {/* Hero Slider */}
      <div className="relative h-[80vh] overflow-hidden bg-black w-full">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`absolute inset-0 w-full h-full text-white transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover scale-105 transform origin-center transition-transform duration-[10s] ease-out" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 tracking-wide shadow-sm">{slide.title}</h1>
              <p className="text-xl md:text-2xl text-[#D4AF37] mb-8 font-light tracking-widest uppercase">{slide.subtitle}</p>
              <button className="bg-white text-black px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-[#D4AF37] hover:text-white transition duration-300 flex items-center group">
                Discover More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Section */}
      <div className="py-24 bg-white text-center px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-serif text-black mb-6">Welcome to LuxuryStay</h2>
        <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-10"></div>
        <p className="text-gray-600 leading-relaxed text-lg">
          Immerse yourself in a world where elegance meets modern comfort. At LuxuryStay, we are dedicated to curating an unforgettable experience tailored solely to your desires. From gourmet dining to our world-class spa facilities, every moment here is crafted with precision.
        </p>
      </div>
    </div>
  );
};
export default Home;
