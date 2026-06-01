import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Alert from './components/common/Alert';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';

export default function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products showAlert={showAlert} />} />
            <Route path="/customers" element={<Customers showAlert={showAlert} />} />
            <Route path="/orders" element={<Orders showAlert={showAlert} />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
