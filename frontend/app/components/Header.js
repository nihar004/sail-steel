import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ... existing header content ... */}
          
          <Link 
            href="/cart" 
            className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}