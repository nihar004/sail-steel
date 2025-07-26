"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dummyData from '../data/dummy_data.json';
import { Search, Grid, List, ChevronDown, Star, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast, { Toaster } from 'react-hot-toast'; // Update this line

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const { addToCart, getCartCount } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Set initial category from URL when component mounts
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Get all products from all categories
  const allProducts = dummyData.categories.flatMap(category => 
    category.products.map(product => ({
      ...product,
      categoryName: category.name
    }))
  );

  // Filter products based on current filters
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Use the category slug for matching instead of the name
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Update the clearFilters function to handle navigation
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceRange([0, 50000]);
    setSortBy('featured');
    // Update URL to remove category parameter
    window.history.pushState({}, '', '/products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AutoParts Pro</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-blue-600 font-medium">
                Products
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Cart
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Products</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">All Products</h1>
            <p className="text-gray-600">
              Showing {sortedProducts.length} of {allProducts.length} products
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 lg:mt-0 lg:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-4 top-3.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filters
            </button>

            {/* Filters */}
            <div className={`flex flex-col lg:flex-row gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {dummyData.categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Brands</option>
                {['Mobil 1', 'NGK', 'K&N', 'Bosch', 'Monroe'].map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>

              {/* Price Range */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Price:</span>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-24"
                />
                <span className="text-sm text-gray-600">₹{priceRange[1].toLocaleString('en-IN')}</span>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-6'
        }>
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                <div className="relative w-full h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                
                {/* Sale Badge */}
                {product.originalPrice > product.price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </div>
                )}

                {/* Stock Status */}
                <div className="absolute top-4 right-4">
                  {product.inStock ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      In Stock
                    </span>
                  ) : (
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Back Order
                    </span>
                  )}
                </div>
              </div>
              
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className={viewMode === 'list' ? 'flex justify-between' : ''}>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{product.categoryName}</p>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">by {product.brand}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    {/* Update the Add to Cart button */}
                    <button 
                      onClick={() => {
                        addToCart(product);
                        toast.success('Added to cart!', {
                          duration: 2000,
                          position: 'bottom-right',
                          style: {
                            background: '#10B981',
                            color: '#fff',
                          },
                        });
                      }}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all transform hover:scale-105 group-hover:shadow-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}