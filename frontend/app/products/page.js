"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Grid, List, Star, Filter, Search, TrendingUp, Shield, Zap, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Steel products data
const steelProducts = {
  categories: [
    {
      id: 1,
      name: "Structural Steel",
      slug: "structural-steel",
      icon: "🏗️",
      description: "High-strength structural components for construction",
      totalProducts: 150,
      image: "/steel-warehouse.jpg",
      products: [
        {
          id: 101,
          name: "I-Beam H200x200x8/12",
          brand: "SteelCorp",
          price: 45000,
          originalPrice: 52000,
          currency: "₹",
          image: "/steel-warehouse.jpg",
          rating: 4.8,
          reviews: 45,
          inStock: true,
          partNumber: "IB-H200-8-12",
          specifications: {
            "height": "200mm",
            "width": "200mm",
            "thickness": "8-12mm",
            "length": "6m standard"
          },
          features: [
            "High tensile strength",
            "Weldable construction",
            "Corrosion resistant",
            "CE certified"
          ],
          category: "structural-steel",
          tags: ["I-beam", "structural", "construction", "H200"]
        },
        {
          id: 102,
          name: "Steel Plate Q345 20mm",
          brand: "MetalMax",
          price: 85000,
          originalPrice: 95000,
          currency: "₹",
          image: "/steel-warehouse-2.jpg",
          rating: 4.9,
          reviews: 32,
          inStock: true,
          partNumber: "SP-Q345-20",
          specifications: {
            "thickness": "20mm",
            "grade": "Q345",
            "width": "2000mm",
            "length": "6000mm"
          },
          features: [
            "High yield strength",
            "Excellent weldability",
            "Impact resistant",
            "ASTM certified"
          ],
          category: "structural-steel",
          tags: ["steel plate", "Q345", "20mm", "structural"]
        }
      ]
    },
    {
      id: 2,
      name: "Steel Pipes & Tubes",
      slug: "pipes-tubes",
      icon: "🔧",
      description: "Seamless and welded pipes for various applications",
      totalProducts: 200,
      image: "/steel-warehouse.jpg",
      products: [
        {
          id: 201,
          name: "Seamless Steel Pipe 6\" SCH40",
          brand: "PipePro",
          price: 125000,
          originalPrice: 140000,
          currency: "₹",
          image: "/steel-warehouse-2.jpg",
          rating: 4.7,
          reviews: 28,
          inStock: true,
          partNumber: "SSP-6-SCH40",
          specifications: {
            "diameter": "6 inches",
            "schedule": "SCH40",
            "thickness": "7.11mm",
            "length": "6m standard"
          },
          features: [
            "Seamless construction",
            "High pressure rating",
            "Corrosion resistant",
            "API 5L certified"
          ],
          category: "pipes-tubes",
          tags: ["seamless", "pipe", "SCH40", "6 inch"]
        }
      ]
    },
    {
      id: 3,
      name: "Steel Sheets & Coils",
      slug: "sheets-coils",
      icon: "📦",
      description: "Hot and cold rolled steel sheets and coils",
      totalProducts: 180,
      image: "/steel-warehouse.jpg",
      products: [
        {
          id: 301,
          name: "Cold Rolled Steel Sheet 1.5mm",
          brand: "SheetMetal",
          price: 65000,
          originalPrice: 72000,
          currency: "₹",
          image: "/steel-warehouse-2.jpg",
          rating: 4.6,
          reviews: 41,
          inStock: true,
          partNumber: "CRSS-1.5",
          specifications: {
            "thickness": "1.5mm",
            "width": "1250mm",
            "length": "2500mm",
            "grade": "SPCC"
          },
          features: [
            "Smooth surface finish",
            "Precise thickness",
            "Excellent formability",
            "JIS standard"
          ],
          category: "sheets-coils",
          tags: ["cold rolled", "sheet", "1.5mm", "SPCC"]
        }
      ]
    },
    {
      id: 4,
      name: "Steel Angles & Channels",
      slug: "angles-channels",
      icon: "📐",
      description: "Structural angles and channels for framing",
      totalProducts: 120,
      image: "/steel-warehouse.jpg",
      products: [
        {
          id: 401,
          name: "Steel Angle 50x50x5mm",
          brand: "AngleSteel",
          price: 35000,
          originalPrice: 40000,
          currency: "₹",
          image: "/steel-warehouse-2.jpg",
          rating: 4.5,
          reviews: 35,
          inStock: true,
          partNumber: "SA-50-50-5",
          specifications: {
            "legs": "50x50mm",
            "thickness": "5mm",
            "length": "6m standard",
            "grade": "S235JR"
          },
          features: [
            "Equal leg angle",
            "Hot rolled finish",
            "Weldable material",
            "EN 10025-2 certified"
          ],
          category: "angles-channels",
          tags: ["angle", "50x50", "5mm", "structural"]
        }
      ]
    }
  ]
};

// Create a wrapper component that uses searchParams
function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const { addToCart, getCartCount } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200000]);
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
  const allProducts = steelProducts.categories.flatMap(category => 
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
    setPriceRange([0, 200000]);
    setSortBy('featured');
    // Update URL to remove category parameter
    window.history.pushState({}, '', '/products');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-22">
        {/* Page Header */}
        <div className="text-center mb-12 mt-22">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Premium Steel Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            High-quality structural steel, pipes, sheets, and components for construction and industrial applications
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{allProducts.length}</p>
                <p className="text-gray-600">Total Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-gray-600">Quality Assured</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">24h</p>
                <p className="text-gray-600">Fast Delivery</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-gray-600">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search steel products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center px-6 py-3 bg-gray-100 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>

            {/* Filters */}
            <div className={`flex flex-col lg:flex-row gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="all">All Categories</option>
                {steelProducts.categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="all">All Brands</option>
                {['SteelCorp', 'MetalMax', 'PipePro', 'SheetMetal', 'AngleSteel'].map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>

              {/* Price Range */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 font-medium">Price:</span>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-32"
                />
                <span className="text-sm text-gray-600 font-medium">₹{priceRange[1].toLocaleString('en-IN')}</span>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-6 py-3 text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 hover:bg-blue-100 rounded-xl"
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
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedProducts.length} of {allProducts.length} steel products
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
          : 'space-y-6'
        }>
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                <div className="relative w-full h-56">
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
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </div>
                )}

                {/* Stock Status */}
                <div className="absolute top-4 right-4">
                  {product.inStock ? (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      In Stock
                    </span>
                  ) : (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      Back Order
                    </span>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {product.categoryName}
                  </span>
                </div>
              </div>
              
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className={viewMode === 'list' ? 'flex justify-between' : ''}>
                  <div>
                    <p className="text-sm text-gray-500 mb-2 font-medium">{product.brand}</p>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-4">
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

                    {/* Specifications Preview */}
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="font-medium">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-3 mb-6">
                      <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
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
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

// Main component with Suspense boundary
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}