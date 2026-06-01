import { useEffect } from 'react';

export default function Alert({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  return (
    <div className={`mb-4 px-4 py-3 rounded border ${colors[type]} flex items-center justify-between`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-lg leading-none ml-4">&times;</button>
    </div>
  );
}
