import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [limitedOffers, setLimitedOffers] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        const products = response.data;
        
        setFeaturedProducts(products.filter(p => !p.isExclusive).slice(0, 6));
        setLimitedOffers(products.filter(p => p.isExclusive).slice(0, 3));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col lg:flex-row items-center justify-between">
            <div className="max-w-2xl text-white mb-8 lg:mb-0 mt-20 px-4 lg:px-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Heroes Pop, Collect, Marvel On.</h1>
              <p className="text-lg lg:text-xl mb-8">Explore and collect iconic Marvel heroes in vibrant Funko Pop figures</p>
              <Link to="/products" className="btn-primary text-lg">
                Browse Collection
              </Link>
            </div>
            <div className="w-half lg:w-auto mt-0 lg:mt-10 px-4 lg:px-0">
              <img
                src="https://realpopmania.com/cdn/shop/files/FunkoPop_MarvelComics-NewClassics-AvengersAssemble-Bundle_Setof5_-1_700x.png?v=1722786086"
                alt="Marvel Funko Pop Collection"
                className="w-full h-auto lg:h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

     {/* Limited Time Offers */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Limited Time Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {limitedOffers.map((product) => (
              <Link to={`/products/${product._id}`} key={product._id} className="transform hover:scale-105 transition-transform">
                <div className="card relative overflow-hidden group">
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                    Limited Edition
                  </div>
                  <img
                    src={`http://localhost:3000${product.image}`}
                    alt={product.name}
                    className="w-auto h-auto lg:h-[500px] object-cover rounded-lg shadow-lg"
                  />
                  <div className="p-4 bg-white">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary">${product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link to={`/products/${product._id}`} key={product._id} className="group">
                <div className="card hover:shadow-xl transition-shadow">
                  <img
                    src={`http://localhost:3000${product.image}`}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
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
        </div>
      </section>

      {/* Collection Categories */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Browse Collections</h2>
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