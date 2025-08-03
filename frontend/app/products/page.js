"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Grid, List, Star,ShoppingCart, Filter,Package,  Search, TrendingUp, Shield, Zap, Truck, ChevronLeft, ChevronRight, FileText, FileBadge, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPublicProducts, getPublicCategories } from '../utils/api';
import DocumentViewer from '../components/DocumentViewer';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const { addToCart, getCartCount } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set initial category from URL when component mounts
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getPublicProducts(),
          getPublicCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Product Card Component with Image Slider
  const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const images = product.images || [];

    const getDocumentIcon = (type) => {
      switch (type.toLowerCase()) {
        case 'mtr':
          return <FileBadge className="w-4 h-4" />;
        case 'certificate':
          return <Award className="w-4 h-4" />;
        default:
          return <FileText className="w-4 h-4" />;
      }
    };

    // Update the handleAddToCart function in ProductCard
    const handleAddToCart = (e) => {
      e.preventDefault();
      e.stopPropagation();  // Add this line to stop event bubbling
      console.log('Adding product to cart:', product);
      const success = addToCart(product);
      if (success) {
        toast.success('Added to cart!');
      } else {
        toast.error('Failed to add to cart');
      }
    };

    return (
      <>
        <div 
          className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            {images.length > 0 ? (
              <>
                <Image
                  src={images[currentImageIndex].image_path}
                  alt={images[currentImageIndex].alt_text || product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-300" />
              </div>
            )}
            
            {/* Quick Actions */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-center">
                <p className="text-white font-medium truncate">{product.name}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const success = addToCart(product);
                    if (success) {
                      toast.success('Added to cart!');
                    } else {
                      toast.error('Failed to add to cart');
                    }
                  }}
                  className="ml-2 p-2 bg-white rounded-full hover:bg-blue-50 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {product.category && (
              <span className="text-xs font-medium text-blue-600 mb-2 block">
                {product.category.name}
              </span>
            )}
            
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
              {product.name}
            </h3>
            
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-bold text-gray-900">
                ₹{product.price_per_unit?.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-gray-500">
                /{product.unit_of_measure}
              </span>
            </div>

            {/* Documents */}
            {product.documents?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.documents.map((doc) => (
                  <button
                    type="button"
                    key={doc.document_id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedDocument(doc);
                    }}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-50 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {getDocumentIcon(doc.document_type)}
                    <span className="ml-1.5">{doc.document_type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {selectedDocument && (
          <DocumentViewer
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
          />
        )}
      </>
    );
  };

  // Get all products from all categories
  const allProducts = categories?.length 
    ? categories.flatMap(category => 
        category.products?.map(product => ({
          ...product,
          categoryName: category.name
        })) || []
      )
    : products; // Fallback to products array if categories is empty

  // Filter products based on current filters
  const filteredProducts = products?.filter(product => {
    if (!product) return false;
    
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.tags || []).some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                          product.category?.slug === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || 
                        product.brand === selectedBrand;
    const matchesPrice = (!product.price_per_unit || 
                        (product.price_per_unit >= priceRange[0] && 
                         product.price_per_unit <= priceRange[1]));

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  }) || [];

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories?.map(category => (
                    <option key={category.category_id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Clear All
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
        <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'}>
          {loading ? (
            // Loading skeletons
            Array(6).fill().map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden">
                {/* Add skeleton structure */}
              </div>
            )))
          : sortedProducts?.length > 0 ?(
            sortedProducts.map(product => (
              <ProductCard key={product.product_id} product={product} />
            )))
          : (
            <div className="text-center py-16 col-span-full">
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
      </div>

      <Footer />
    </div>
  );
}

// Update the ProductSkeleton component
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden animate-pulse border border-gray-100">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4">
      <div className="w-20 h-4 bg-gray-200 rounded mb-2" />
      <div className="w-full h-5 bg-gray-200 rounded mb-3" />
      <div className="w-32 h-6 bg-gray-200 rounded mb-3" />
      <div className="flex gap-2">
        <div className="w-24 h-8 bg-gray-200 rounded" />
        <div className="w-24 h-8 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

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