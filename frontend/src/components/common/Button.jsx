export default function Button({ children, onClick, variant = 'primary', type = 'button', disabled = false }) {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
