"use client";

import { useCart } from '../context/CartContext';
import { 
  Search, 
  Menu, 
  LogIn,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { checkAdminStatus } from '../utils/api';

export default function Header() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const { user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (user?.uid) {
        try {
          const adminStatus = await checkAdminStatus(user.uid);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Error verifying admin status:', error);
          setIsAdmin(false);
        } finally {
          setAdminCheckComplete(true);
        }
      } else {
        setIsAdmin(false);
        setAdminCheckComplete(true);
      }
    };

    verifyAdminStatus();
  }, [user]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/categories');
        const data = await response.json();
        // Transform the data to match the dropdown format
        const formattedCategories = data.map(category => ({
          name: category.name,
          image: `/categories/${category.slug}.jpg`, // Make sure you have these images
          count: `${category.product_count}+ products`,
          description: category.description,
          slug: category.slug
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Add this to both desktop and mobile navigation
  const renderAdminLink = () => {
    if (user && isAdmin && adminCheckComplete) {
      return (
        <Link 
          href="/admin" 
          className="text-gray-700 hover:text-orange-600 font-medium transition-colors flex items-center space-x-1"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <span>Admin</span>
        </Link>
      );
    }
    return null;
  };

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
              <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                {categories.map((category) => (
                  <Link 
                    key={category.slug}
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

            {renderAdminLink()}
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