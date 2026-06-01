import { useState, useEffect } from 'react';
import api from '../api/axios';
import Table from '../components/common/Table';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(res => setStats(res.data)).catch(() => {});
  }, []);

  if (!stats) return <div className="text-gray-500">Loading...</div>;

  const cards = [
    { label: 'Total Products', value: stats.total_products, color: 'bg-blue-500' },
    { label: 'Total Customers', value: stats.total_customers, color: 'bg-green-500' },
    { label: 'Total Orders', value: stats.total_orders, color: 'bg-purple-500' },
    { label: 'Low Stock Items', value: stats.low_stock_products.length, color: 'bg-red-500' },
  ];

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    {
      key: 'quantity',
      label: 'Qty',
      render: (val) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${val < 5 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
          {val}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-lg shadow p-5">
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white text-xl font-bold">{card.value}</span>
            </div>
            <p className="text-gray-600 text-sm">{card.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Low Stock Products</h3>
        <Table columns={columns} data={stats.low_stock_products} />
      </div>
    </div>
  );
}
