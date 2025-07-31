"use client";

import { useCart } from '../context/CartContext';
import { 
  Search, 
  Menu, 
  LogIn,
  ShoppingBag,
  ChevronDown,
} from 'lucide-react';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const { user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Steel categories mapping
  const categories = [
    {
      name: "Structural Steel",
      image: "/structural_steel.jpg",
      count: "500+ products",
      description: "I-beams, H-beams, channels, and angles for construction",
      slug: "structural-steel"
    },
    {
      name: "Steel Sheets & Plates",
      image: "/steel_sheets.jpg", 
      count: "300+ products",
      description: "Hot rolled, cold rolled, and galvanized sheets",
      slug: "sheets-plates"
    },
    {
      name: "Steel Bars & Rods",
      image: "/steel_bars.jpg",
      count: "250+ products", 
      description: "TMT bars, round bars, and reinforcement steel",
      slug: "bars-rods"
    },
    {
      name: "Steel Pipes & Tubes",
      image: "/steel_pipes.jpg",
      count: "400+ products",
      description: "ERW pipes, seamless tubes, and hollow sections",
      slug: "pipes-tubes"
    },
    {
      name: "Wire & Wire Products",
      image: "/steel_wire.jpg",
      count: "150+ products",
      description: "Binding wire, mesh, and specialty wire products",
      slug: "wire-products"
    },
    {
      name: "Specialty Steel",
      image: "/specialty_steel.jpg",
      count: "200+ products",
      description: "Stainless steel, alloy steel, and custom grades",
      slug: "specialty-steel"
    }
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrollY > 100 ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-10 bg-gradient-to-r from-orange-600 to-red-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">SAIL</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">SAIL Steel</span>
              <span className="text-xs text-gray-600">Ministry of Steel, Govt. of India</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Home
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Products
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                {categories.map((category, index) => (
                  <Link 
                    key={index}
                    href={`/products?category=${category.slug}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="hidden lg:block relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={user.photoURL || '/default-avatar.png'}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-orange-500 bg-slate-100"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {user.displayName || 'User'}
                    </span>
                    <button 
                      onClick={logout}
                      className="text-xs text-gray-500 hover:text-orange-600 transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => router.push('/auth?mode=login')} 
                    className="flex items-center text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    <LogIn className="w-5 h-5 mr-1" />
                    Login
                  </button>
                  <button 
                    onClick={() => router.push('/auth?mode=signup')}
                    className="bg-gradient-to-r from-orange-600 to-red-700 text-white px-6 py-2 
                      rounded-full hover:from-orange-700 hover:to-red-800 transition-all transform 
                      hover:scale-105 font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-orange-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
              Home
            </Link>
            <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
              Products
            </Link>
            <Link href="/bulk-orders" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
              Bulk Orders
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
              About SAIL
            </Link>
            <div className="pt-4 border-t">
              {user ? (
                <div className="flex items-center space-x-3 px-3 py-2">
                  <img
                    src={user.photoURL || '/default-avatar.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-orange-500 bg-slate-100"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {user.displayName || 'User'}
                    </span>
                    <button 
                      onClick={logout}
                      className="text-xs text-gray-500 hover:text-orange-600 transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => router.push('/auth?mode=login')}
                    className="w-full mb-2 flex items-center justify-center text-gray-700 
                      hover:text-orange-600 transition-colors"
                  >
                    <LogIn className="w-5 h-5 mr-1" />
                    Login
                  </button>
                  <button 
                    onClick={() => router.push('/auth?mode=signup')}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-white 
                      px-6 py-2 rounded-full hover:from-orange-700 hover:to-red-800 transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}