import AdminLayout from '../../components/AdminLayout';
import { useState } from 'react';

function Dashboard() {
  const [stats] = useState({
    totalProducts: 150,
    totalOrders: 1234,
    revenue: 45678,
    activeUsers: 890
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-600 mb-2">Total Products</h3>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-600 mb-2">Total Orders</h3>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-600 mb-2">Revenue</h3>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-600 mb-2">Active Users</h3>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;