import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'Products', icon: '📦' },
  { to: '/customers', label: 'Customers', icon: '👥' },
  { to: '/orders', label: 'Orders', icon: '🛒' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-lg font-bold tracking-wide">Inventory<span className="text-blue-400">MS</span></h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        v1.0.0
      </div>
    </aside>
  );
}
