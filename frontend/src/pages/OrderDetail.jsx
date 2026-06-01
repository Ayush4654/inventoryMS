import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/common/Button';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(res => setOrder(res.data)).catch(() => navigate('/orders'));
  }, [id, navigate]);

  if (!order) return <div className="text-gray-500">Loading...</div>;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="secondary" onClick={() => navigate('/orders')}>&larr; Back to Orders</Button>

      <div className="bg-white rounded-lg shadow p-6 mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Order #{order.id}</h2>
          <span className={`px-3 py-1 rounded text-sm font-semibold ${statusColors[order.status] || 'bg-gray-100'}`}>
            {order.status}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Customer Information</h3>
          <p className="text-gray-800 font-medium">{order.customer_name}</p>
          <p className="text-gray-500 text-sm">Customer ID: {order.customer_id}</p>
        </div>

        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.product_name}</td>
                  <td className="px-4 py-3 text-gray-500">{item.product_sku}</td>
                  <td className="px-4 py-3 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">₹{parseFloat(item.unit_price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-medium">₹{(item.quantity * parseFloat(item.unit_price)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold text-gray-800">₹{parseFloat(order.total_amount).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
