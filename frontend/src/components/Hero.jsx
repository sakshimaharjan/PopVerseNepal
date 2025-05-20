import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const images = [
    '../../hero.png',
    '../../hero-2.png',
    '../../hero-3.png',
    '../../hero-4.png',
    '../../hero-5.png',
    '../../hero-6.png'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative bg-gradient-to-br from-white to-indigo-50 mt-20 py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Section */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-indigo-700 leading-tight mb-6">
            Pop the Legends.<br />Marvel Your Shelf.
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
            Dive into the universe of Marvel Pop Figures – iconic, colorful, and crafted for collectors.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium text-lg shadow-md transition duration-300"
          >
            Explore Collection
          </Link>
        </div>

        {/* Image Carousel with Slide Animation */}
        <div className="relative w-full overflow-hidden max-w-xl mx-auto">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Slide ${idx}`}
                className="w-full flex-shrink-0 object-contain h-[450px] p-4"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;