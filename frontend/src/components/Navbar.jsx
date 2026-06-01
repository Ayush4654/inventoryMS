import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).replace(/^\w/, c => c.toUpperCase());

  return (
    <header className="bg-white shadow px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{path}</h2>
        <span className="text-sm text-gray-500">Inventory Management System</span>
      </div>
    </header>
  );
}
