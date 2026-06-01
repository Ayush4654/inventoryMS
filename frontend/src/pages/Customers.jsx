import { useState, useEffect } from 'react';
import api from '../api/axios';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

export default function Customers({ showAlert }) {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch { showAlert('Failed to load customers', 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', form);
      showAlert('Customer created successfully');
      setShowModal(false);
      setForm({ full_name: '', email: '', phone: '' });
      fetchCustomers();
    } catch (err) {
      showAlert(err.response?.data?.detail || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`Delete customer "${customer.full_name}"?`)) return;
    try {
      await api.delete(`/customers/${customer.id}`);
      showAlert('Customer deleted successfully');
      fetchCustomers();
    } catch (err) {
      showAlert(err.response?.data?.detail || 'Delete failed', 'error');
    }
  };

  const columns = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">All Customers</h3>
        <Button onClick={() => setShowModal(true)}>+ Add Customer</Button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={customers} renderActions={(row) => (
          <Button variant="danger" onClick={() => handleDelete(row)}>Delete</Button>
        )} />
      </div>
      {showModal && (
        <Modal title="Add Customer" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="Full Name *" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required className="w-full border rounded-lg px-3 py-2" />
            <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full border rounded-lg px-3 py-2" />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
