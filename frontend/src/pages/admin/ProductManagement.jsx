"use client"

import { useState, useEffect } from "react"
import { FiPlus, FiEdit, FiSearch } from "react-icons/fi"
import axios from "axios"
import AdminLayout from "../../components/AdminLayout"

function ProductManagement() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    isExclusive: false,
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [currentProductId, setCurrentProductId] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get("import.meta.env.VITE_API_URL/api/products")
      setProducts(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editMode && !window.confirm("Are you sure you want to update this product?")) {
      return
    } else if (!editMode && !window.confirm("Are you sure you want to add this product?")) {
      return
    }

    const formDataToSend = new FormData()
    Object.keys(formData).forEach((key) => {
      if (key === "image" && (!formData[key] || formData[key] === null)) {
        // Skip if no image is selected during edit
        if (!editMode) {
          formDataToSend.append(key, formData[key])
        }
      } else {
        formDataToSend.append(key, formData[key])
      }
    })

    try {
      let response

      if (editMode) {
        response = await axios.put(`import.meta.env.VITE_API_URL/api/products/${currentProductId}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        alert("Product updated successfully!")
      } else {
        response = await axios.post("import.meta.env.VITE_API_URL/api/products", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        alert("Product added successfully!")
      }

      fetchProducts()
      resetForm()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Error saving product. Please try again.")
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target

    if (type === "file" && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }))

      // Create image preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(files[0])
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      description: "",
      isExclusive: false,
      image: null,
    })
    setImagePreview(null)
    setEditMode(false)
    setCurrentProductId(null)
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      isExclusive: product.isExclusive || false,
      // Don't set image here, as we don't want to force image re-upload
    })
    setImagePreview(product.image)
    setEditMode(true)
    setCurrentProductId(product._id)

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      fetchProducts()
      alert("Product deleted successfully!")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product. Please try again.")
    }
  }

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 cursor-pointer">{editMode ? "Edit Product" : "Add New Product"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="marvel">Marvel</option>
                    <option value="exclusive">Exclusive</option>
                    <option value="limited">Limited Edition</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Product Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    accept="image/*"
                    {...(editMode ? {} : { required: true })}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-32 object-contain" />
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isExclusive"
                    checked={formData.isExclusive}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Mark as Exclusive</label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {editMode ? (
                      <>
                        <FiEdit size={16} />
                        <span>Update Product</span>
                      </>
                    ) : (
                      <>
                        <FiPlus size={16} />
                        <span>Add Product</span>
                      </>
                    )}
                  </button>
                  {editMode && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Product List</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No products found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={product.image || "/placeholder.svg?height=50&width=50"}
                              alt={product.name}
                              className="h-12 w-12 object-cover rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {product.isExclusive && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                Exclusive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${Number.parseFloat(product.price).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 hover:text-red-900 cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ProductManagement
