import { useState, useEffect } from 'react';
import axios from 'axios';

function AddAdminPage() {
  const [admins, setAdmins] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    axios.get('/api/admins')
      .then(response => setAdmins(response.data))
      .catch(error => console.error('Error fetching admins:', error));
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admins', { name, email, photo });
      setAdmins([...admins, response.data]);
      setName('');
      setEmail('');
      setPhoto('');
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 p-6">
      {/* Admin Form */}
      <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded" 
            required
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded" 
            required
          />
          <input 
            type="text" 
            placeholder="Photo URL" 
            value={photo} 
            onChange={(e) => setPhoto(e.target.value)}
            className="w-full p-2 border rounded" 
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Admin
          </button>
        </form>
      </div>

      {/* Admin List */}
      <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Admin List</h2>
        <div className="space-y-4">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <img src={admin.photo || 'https://via.placeholder.com/50'} alt={admin.name} className="w-12 h-12 rounded-full" />
              <div>
                <p className="text-lg font-bold">{admin.name}</p>
                <p className="text-gray-600">{admin.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddAdmin;
