import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(product => product.category === category);

  return (
    <div className="max-w-5xl mx-auto p-8 mt-20">
      <h1 className="text-5xl font-extrabold text-center mb-6">Our Collection</h1>
      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {['all', 'marvel', 'exclusive'].map((dog) => (
          <button 
            key={dog}
            className={`px-4 py-2 border rounded-md transition-all ${category === dog ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setCategory(dog)}
          >
            {dog.charAt(0).toUpperCase() + dog.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id} className="group">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
              <img src={`http://localhost:3000${product.image}`} alt={product.name} className="w-full h-auto max-h-[170px] mt-10 object-contain" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-indigo-600 text-xl font-bold">${product.price.toFixed(2)}</p>
                <p className="text-gray-700 mt-2">{product.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;