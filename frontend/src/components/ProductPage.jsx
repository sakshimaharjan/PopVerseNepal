import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle quantity change
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Add to Cart (mock function for now)
  const addToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart`);
    // Here, you would integrate with a cart management system
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-20">
      <div className="container mx-auto bg-white p-6 shadow-lg rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Product Image */}
        <div className="flex justify-center items-center border border-gray-200 rounded-lg overflow-hidden">
            <img
                src={`http://localhost:3000${product.image}`}
                alt={product.name}
                className="w-full h-auto max-h-[300px] object-contain transition"
            />
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-between">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-green-600 mb-6">${product.price}</p>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={decreaseQuantity}
              className="px-4 py-2 bg-gray-300 text-xl rounded-full hover:bg-gray-400 transition"
            >
              -
            </button>
            <span className="text-2xl font-semibold">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="px-4 py-2 bg-gray-300 text-xl rounded-full hover:bg-gray-400 transition"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            className="w-full py-3 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>

          {/* Additional Info (optional) */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Product Details</h3>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Category: {product.category}</li>
              <li>SKU: {product._id}</li>
              <li>Condition: New</li>
              {/* You can add more product-related information here */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;