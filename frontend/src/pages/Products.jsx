import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoIosArrowDropdownCircle } from 'react-icons/io';

function Products() {
  // State for storing products fetched from the API
  const [products, setProducts] = useState([]);
  
  // State for tracking the selected category filter
  const [category, setCategory] = useState('all');

  // State for tracking the selected sorting order (price)
  const [sortOrder, setSortOrder] = useState('default');

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Request products from the backend API
        const response = await axios.get('http://localhost:3000/api/products');
        // Store the products in the state
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this runs once after the component mounts

  // Filter products based on the selected category
  let filteredProducts = category === 'all'
    ? products  // If "all" is selected, show all products
    : products.filter((product) => product.category === category); // Filter by selected category

  // Quick Sort Algorithm to sort products based on price
  const quickSort = (arr, order) => {
    if (arr.length <= 1) return arr; // Base case for recursion: if the array has 1 or no elements, it's already sorted

    const pivot = arr[arr.length - 1]; // Choose the last element as the pivot
    const left = []; // Array to store elements less than pivot
    const right = []; // Array to store elements greater than pivot

    // Partition the array into two halves
    for (let i = 0; i < arr.length - 1; i++) {
      if (order === 'lowToHigh') {
        if (arr[i].price < pivot.price) left.push(arr[i]); // If current price is less than pivot price, add to left
        else right.push(arr[i]); // Otherwise, add to right
      } else if (order === 'highToLow') {
        if (arr[i].price > pivot.price) left.push(arr[i]); // If current price is greater than pivot price, add to left
        else right.push(arr[i]); // Otherwise, add to right
      }
    }

    // Recursively apply quickSort to the left and right arrays, then concatenate them with the pivot in the middle
    return [...quickSort(left, order), pivot, ...quickSort(right, order)];
  };

  // Sort the filtered products based on the selected sorting order
  let sortedProducts = filteredProducts;

  if (sortOrder === 'lowToHigh' || sortOrder === 'highToLow') {
    sortedProducts = quickSort(filteredProducts, sortOrder); // Apply quickSort
  }

  return (
    <div className="max-w-6xl mx-auto p-8 mt-20">
      <h1 className="text-5xl font-extrabold text-center mb-8 text-gray-900">Our Collection</h1>
      
      {/* Filters and Sorting */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <div className="flex gap-4">
          {/* Buttons to filter by category */}
          {['all', 'marvel', 'exclusive'].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 border rounded-md transition-all ${
                category === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => setCategory(cat)} // Set the category when a button is clicked
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} {/* Capitalize the category name */}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="relative w-1/5">
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white shadow-sm text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:bg-gray-50 transition-all appearance-none"
            onChange={(e) => setSortOrder(e.target.value)} // Update sort order based on selection
            value={sortOrder} // Set the current value of the dropdown
          >
            <option value="default">Sort by: Default</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>

          {/* Custom Dropdown Arrow */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <IoIosArrowDropdownCircle size={20} />
          </div>
        </div>
      </div>

      {/* Display the products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id} className="group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
                <img
                  src={`http://localhost:3000${product.image}`}
                  alt={product.name}
                  className="w-full h-auto max-h-[180px] object-contain bg-gray-100 p-4"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-indigo-600 text-xl font-bold">${product.price.toFixed(2)}</p>
                  {/* <p className="text-sm text-gray-500">Category: {product.category.toUpperCase()}</p> */}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Products;