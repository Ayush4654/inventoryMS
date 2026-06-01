import { useState, useEffect } from 'react';
import api from '../api/axios';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

export default function Products({ showAlert }) {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', sku: '', price: '', quantity: '' });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch { showAlert('Failed to load products', 'error'); }
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm({ name: '', sku: '', price: '', quantity: '' });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({ name: product.name, sku: product.sku, price: product.price, quantity: product.quantity });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) };
      if (editProduct) {
        await api.put(`/products/${editProduct.id}`, payload);
        showAlert('Product updated successfully');
      } else {
        await api.post('/products', payload);
        showAlert('Product created successfully');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      showAlert(err.response?.data?.detail || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) return;
    try {
      await api.delete(`/products/${product.id}`);
      showAlert('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      showAlert(err.response?.data?.detail || 'Delete failed', 'error');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'price', label: 'Price', render: (val) => `₹${parseFloat(val).toFixed(2)}` },
    { key: 'quantity', label: 'Stock' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">All Products</h3>
        <Button onClick={openCreate}>+ Add Product</Button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={products} renderActions={(row) => (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
            <Button variant="danger" onClick={() => handleDelete(row)}>Delete</Button>
          </div>
        )} />
      </div>
      {showModal && (
        <Modal title={editProduct ? 'Edit Product' : 'Add Product'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full border rounded-lg px-3 py-2" />
            <input placeholder="SKU *" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} required className="w-full border rounded-lg px-3 py-2" />
            <input type="number" step="0.01" placeholder="Price *" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-full border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Quantity *" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required className="w-full border rounded-lg px-3 py-2" />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit">{editProduct ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
