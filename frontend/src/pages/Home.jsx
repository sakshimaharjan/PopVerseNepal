import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [limitedOffers, setLimitedOffers] = useState([]);
  const [showMoreFeatured, setShowMoreFeatured] = useState(false); // Show More for Featured
  const [showMoreLimited, setShowMoreLimited] = useState(false);   // Show More for Limited Offers

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        const products = response.data;
  
        // Products with 'exclusive' category go to Featured Items
        const featured = products.filter(p => p.category === 'exclusive');  // Featured
        // Products with any other category go to Limited Time Offers
        const limited = products.filter(p => p.category !== 'exclusive');    // Limited Time Offers
  
        setFeaturedProducts(featured);   // Set the Featured products
        setLimitedOffers(limited);       // Set the Limited Time Offers
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      {/* Limited Time Offers */}
      <section className="py-16 bg-gray-700 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Limited Time Offers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {limitedOffers.slice(0, showMoreLimited ? limitedOffers.length : 3).map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="group">
                <div className="card relative overflow-hidden group">
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                    Limited Edition
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow-lg flex flex-col items-start">
                    <img
                      src={`http://localhost:3000${product.image}`}
                      alt={product.name}
                      className="w-full h-auto max-h-[200px] object-contain mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-xl font-bold text-primary mb-2 text-green-700">${product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Show More Button */}
          {limitedOffers.length > 3 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => setShowMoreLimited(!showMoreLimited)}
                className="text-white bg-amber-700 px-6 py-3  rounded-lg shadow-lg transform transition-transform hover:scale-90 focus:outline-none hover:bg-primary-dark"
              >
                {showMoreLimited ? 'Hide' : 'Show More'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-700 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Items</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.slice(0, showMoreFeatured ? featuredProducts.length : 3).map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="group">
                <div className="card hover:shadow-xl transition-shadow"> 
                  <div className="p-4 bg-gray-100 rounded-lg shadow-lg flex flex-col items-start">
                    <img
                      src={`http://localhost:3000${product.image}`}
                      alt={product.name}
                      className="w-full h-64 object-contain rounded-lg shadow-lg"
                    />
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <p className="text-xl font-bold text-primary">${product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Show More Button */}
          {featuredProducts.length > 3 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 mt-10">
              <button
                onClick={() => setShowMoreFeatured(!showMoreFeatured)}
                className="text-white bg-primary px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-110 focus:outline-none hover:bg-primary-dark"
              >
                {showMoreFeatured ? 'Hide' : 'Show More'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Collection Categories */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Browse Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/products?category=marvel" className="relative h-80 group overflow-hidden rounded-lg">
              <img
                src="/marvel-collection.jpg"
                alt="Marvel Collection"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Marvel Collection</h3>
                  <p className="text-gray-200">Explore the universe of Marvel heroes</p>
                </div>
              </div>
            </Link>
            <Link to="/products?category=exclusive" className="relative h-80 group overflow-hidden rounded-lg">
              <img
                src="/exclusive-collection.jpg"
                alt="Exclusive Collection"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Exclusive Collection</h3>
                  <p className="text-gray-200">Discover our rare and limited editions</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;