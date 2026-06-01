import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

export default function Orders({ showAlert }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ customer_id: '', items: [{ product_id: '', quantity: 1 }] });

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch { showAlert('Failed to load orders', 'error'); }
  };

  const openCreate = async () => {
    try {
      const [custRes, prodRes] = await Promise.all([api.get('/customers'), api.get('/products')]);
      setCustomers(custRes.data);
      setProducts(prodRes.data);
      setForm({ customer_id: '', items: [{ product_id: '', quantity: 1 }] });
      setShowModal(true);
    } catch { showAlert('Failed to load form data', 'error'); }
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { product_id: '', quantity: 1 }] });
  };

  const removeItem = (idx) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  };

  const updateItem = (idx, field, value) => {
    const items = [...form.items];
    items[idx][field] = field === 'quantity' ? parseInt(value) || 0 : value;
    setForm({ ...form, items });
  };

  const calcTotal = () => {
    let total = 0;
    form.items.forEach(item => {
      const prod = products.find(p => p.id === parseInt(item.product_id));
      if (prod && item.quantity) total += parseFloat(prod.price) * item.quantity;
    });
    return total.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        customer_id: parseInt(form.customer_id),
        items: form.items.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
        })),
      };
      await api.post('/orders', payload);
      showAlert('Order created successfully');
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      showAlert(err.response?.data?.detail || 'Operation failed', 'error');
    }
  };

  const handleCancel = async (order) => {
    if (!window.confirm(`Cancel order #${order.id}? Stock will be restored.`)) return;
    try {
      await api.delete(`/orders/${order.id}`);
      showAlert('Order cancelled and stock restored');
      fetchOrders();
    } catch (err) {
      showAlert(err.response?.data?.detail || 'Cancel failed', 'error');
    }
  };

  const statusBadge = (status) => {
    const colors = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' };
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
  };

  const columns = [
    { key: 'id', label: 'Order #', render: (val) => `#${val}` },
    { key: 'customer_name', label: 'Customer' },
    { key: 'items_count', label: 'Items' },
    { key: 'total_amount', label: 'Total', render: (val) => `₹${parseFloat(val).toFixed(2)}` },
    { key: 'status', label: 'Status', render: (val) => statusBadge(val) },
    { key: 'created_at', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">All Orders</h3>
        <Button onClick={openCreate}>+ Create Order</Button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={orders} renderActions={(row) => (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(`/orders/${row.id}`)}>View</Button>
            {row.status === 'pending' && <Button variant="danger" onClick={() => handleCancel(row)}>Cancel</Button>}
          </div>
        )} />
      </div>
      {showModal && (
        <Modal title="Create Order" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select value={form.customer_id} onChange={e => setForm({...form, customer_id: e.target.value})} required className="w-full border rounded-lg px-3 py-2">
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
            </select>
            {form.items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <div className="flex-1">
                  <select value={item.product_id} onChange={e => updateItem(idx, 'product_id', e.target.value)} required className="w-full border rounded-lg px-3 py-2">
                    <option value="">Select Product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (₹{parseFloat(p.price).toFixed(2)})</option>)}
                  </select>
                </div>
                <div className="w-24">
                  <input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} required className="w-full border rounded-lg px-3 py-2" />
                </div>
                {form.items.length > 1 && (
                  <Button variant="danger" onClick={() => removeItem(idx)}>Remove</Button>
                )}
              </div>
            ))}
            <Button variant="secondary" onClick={addItem}>+ Add Item</Button>
            <div className="text-right text-lg font-semibold text-gray-800">Total: ₹{calcTotal()}</div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" disabled={!form.customer_id || form.items.some(i => !i.product_id)}>Create Order</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
