import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    isExclusive: false,
    image: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Confirm before submitting
    const confirmSubmit = window.confirm('Are you sure you want to add this product?');
    if (!confirmSubmit) return;

    // Debugging - check form data before submission
    console.log('Form Data:', formData);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post('http://localhost:3000/api/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Product added:', response.data); // Debugging - log the response
      fetchProducts();
      setFormData({
        name: '',
        price: '',
        category: '',
        description: '',
        isExclusive: false,
        image: null
      });

      // Alert after successful submission
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="marvel">Marvel</option>
                  <option value="exclusive">Exclusive</option>
                  <option value="limited">Limited Edition</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Exclusive</label>
                <input
                  type="checkbox"
                  name="isExclusive"
                  checked={formData.isExclusive}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn btn-primary mt-4 border transition transform active:scale-95">Add Product</button>
            </form>
          </div>

          {/* product list */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Product List</h2>
            <ul>
              {products.map(product => (
                <li key={product._id} className="mb-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p>{product.description}</p>
                  {product.image && <img src={`http://localhost:3000${product.image}`} alt={product.name} className="mt-2 w-32" />}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ProductManagement;