import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <div className="relative bg-gray-800 h-[600px]">
    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent">
      <div className="container mx-auto px-4 h-full flex flex-col lg:flex-row items-center justify-between">
        <div className="max-w-2xl text-white mb-8 lg:mb-0 mt-20 px-4 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Heroes Pop, Collect, Marvel On.</h1>
          <p className="text-lg lg:text-xl mb-12">Explore and collect iconic Marvel heroes in vibrant Funko Pop figures</p>
          <Link to="/products" className="text-lg bg-amber-700 text-gray-200 border p-4 hover:bg-amber-600">
            Browse Collection
          </Link>
        </div>
        <div className="w-full lg:w-auto mt-0 lg:mt-10 px-4 lg:px-15">
          <img
            src="https://cdn11.bigcommerce.com/s-b4ioc4fed9/images/stencil/500x659/products/359641/1769861/1575465498-73546500__10050.1723887097.png?c=1"
            alt="Marvel Funko Pop Collection"
            className="w-full h-auto lg:h-[500px] object-contain rounded-lg transform transition-transform hover:scale-105"
          />
        </div>
      </div>
    </div>
  </div>
);

export default Hero;