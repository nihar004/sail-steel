"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Home,
  Calendar,
  ChevronDown,
  Menu,
  X,
  LayoutList,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { useAdminProtection } from '@/hooks/useAdminProtection';
import UsersTable from '../components/UsersTable' // Adjust the import path as necessary
import { fetchStats, fetchProducts, addProduct, deleteProduct, fetchCategories, addCategory, updateCategory, deleteCategory,updateProduct } from '../utils/api'; // Add fetchProducts and addProduct imports
import ProductForm from '../components/ProductForm'; // Import the new ProductForm component
import { toast } from 'react-toastify'; // Import toast for notifications
import CategoryForm from '../components/CategoryForm'; // Import the new CategoryForm component

const AdminDashboard = () => {
  const { isLoading, isVerified } = useAdminProtection();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userStats, setUserStats] = useState(null); // Add stats state
  const [showProductForm, setShowProductForm] = useState(false); // State to control product form visibility
  const [products, setProducts] = useState([]); // Add products state
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // Add this state for selected product
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    grade: ''
  }); // State for filters

  // Mock data
  const recentOrders = [
    { id: 'ORD-2024-001', customer: 'ABC Steel Ltd', amount: 125000, status: 'MILL_CONFIRMED', date: '2024-01-15', items: 3 },
    { id: 'ORD-2024-002', customer: 'XYZ Industries', amount: 89000, status: 'QUOTE_REQUESTED', date: '2024-01-14', items: 2 },
    { id: 'ORD-2024-003', customer: 'Steel Works Co', amount: 234000, status: 'DISPATCHED', date: '2024-01-13', items: 5 },
    { id: 'ORD-2024-004', customer: 'Metal Craft Ltd', amount: 156000, status: 'DELIVERED', date: '2024-01-12', items: 4 },
    { id: 'ORD-2024-005', customer: 'Industrial Corp', amount: 198000, status: 'QUALITY_APPROVED', date: '2024-01-11', items: 3 }
  ];

  // Fetch stats when dashboard loads
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStats();
        setUserStats(data);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    loadStats();
  }, []);

  // Fetch products when the component mounts
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        toast.error('Failed to load products');
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  // Fetch categories when the component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to load categories');
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleProductSubmit = async (productData) => {
    try {
      await addProduct(productData);
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
      setShowProductForm(false);
      toast.success('Product added successfully');
    } catch (error) {
      toast.error('Failed to add product');
      console.error('Error adding product:', error);
    }
  };

  const handleCategorySubmit = async (categoryData) => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.category_id, categoryData);
      } else {
        await addCategory(categoryData);
      }
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      setShowCategoryForm(false);
      setSelectedCategory(null);
      toast.success(`Category ${selectedCategory ? 'updated' : 'added'} successfully`);
    } catch (error) {
      toast.error('Failed to save category');
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        setCategories(categories.filter(c => c.category_id !== categoryId));
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await deleteProduct(productId);
      // Refresh the products list
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const StatusBadge = ({ status, type = 'order' }) => {
    const getStatusConfig = () => {
      if (type === 'order') {
        switch (status) {
          case 'MILL_CONFIRMED': return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Mill Confirmed' };
          case 'QUOTE_REQUESTED': return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Quote Requested' };
          case 'DISPATCHED': return { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Dispatched' };
          case 'DELIVERED': return { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Delivered' };
          case 'QUALITY_APPROVED': return { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', label: 'Quality Approved' };
          case 'CANCELLED': return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Cancelled' };
          default: return { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500', label: status };
        }
      } else if (type === 'product') {
        return status === 'active' 
          ? { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Active' }
          : { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500', label: 'Inactive' };
      } else {
        return status === 'active' 
          ? { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Active' }
          : { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Inactive' };
      }
    };

    const config = getStatusConfig();

    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>
        {config.label}
      </div>
    );
  };

  const TabButton = ({ id, icon: Icon, label, active, onClick, count }) => (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-3" />
        {label}
      </div>
      {count && (
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  const ActionDropdown = () => (
    <div className="relative">
      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );

  const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    return (
      <div className="relative w-24 h-24 group">
        <Image
          src={images[currentIndex].image_path}
          alt={images[currentIndex].alt_text || 'Product image'}
          width={96}  // 24 * 4 = 96px
          height={96} // 24 * 4 = 96px
          className="w-full h-full object-cover rounded-lg"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex(i => (i > 0 ? i - 1 : images.length - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentIndex(i => (i < images.length - 1 ? i + 1 : 0))}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/50 px-2 py-1 rounded-full text-white text-xs">
              {currentIndex + 1}/{images.length}
            </div>
          </>
        )}
      </div>
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.grade.toLowerCase().includes(searchQuery.toLowerCase());

      // Update category filtering logic to work with single category
      const matchesCategory = !filters.category || 
        (product.category && product.category.category_id.toString() === filters.category);

      const matchesStatus = !filters.status || 
        (filters.status === 'active' ? product.is_active : !product.is_active);

      const matchesGrade = !filters.grade || 
        product.grade === filters.grade;

      return matchesSearch && matchesCategory && matchesStatus && matchesGrade;
    });
  }, [products, searchQuery, filters]);

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, Admin!</h2>
            <p className="text-blue-100 mb-6">Here&lsquo;s what&lsquo;s happening with your steel trading business today</p>
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors mr-4"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Today: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 text-left group">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Add Product</h3>
          <p className="text-sm text-gray-500">Add new steel products to inventory</p>
        </button>

        <button className="bg-white p-6 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-200 text-left group">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
            <ShoppingCart className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">New Order</h3>
          <p className="text-sm text-gray-500">Create order for customers</p>
        </button>

        <button className="bg-white p-6 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-200 text-left group">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Add Client</h3>
          <p className="text-sm text-gray-500">Register new business client</p>
        </button>

        <button className="bg-white p-6 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200 text-left group">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
            <BarChart3 className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">View Reports</h3>
          <p className="text-sm text-gray-500">Business analytics & insights</p>
        </button>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.items} items • {order.date}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">₹{order.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <ActionDropdown />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-500 mt-1">Manage your steel product inventory</p>
        </div>
        <button
          onClick={() => setShowProductForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {showProductForm ? (
        <ProductForm
          product={selectedProduct}
          onSubmit={async (data) => {
            try {
              if (selectedProduct) {
                await updateProduct(selectedProduct.product_id, data);
                toast.success('Product updated successfully');
              } else {
                await addProduct(data);
                toast.success('Product added successfully');
              }
              const updatedProducts = await fetchProducts();
              setProducts(updatedProducts);
              setShowProductForm(false);
              setSelectedProduct(null);
            } catch (error) {
              toast.error(selectedProduct ? 'Failed to update product' : 'Failed to add product');
              console.error('Error saving product:', error);
            }
          }}
          onCancel={() => {
            setShowProductForm(false);
            setSelectedProduct(null);
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name, SKU, or grade..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                <select 
                  className="px-4 py-3 border border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id.toString()}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select 
                  className="px-4 py-3 border border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <select 
                  className="px-4 py-3 border border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
                >
                  <option value="">All Grades</option>
                  {Array.from(new Set(products.map(p => p.grade))).map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Product Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media & Documents</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price & Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No products match your search criteria
                    </td>
                  </tr>
                )}
                {filteredProducts.map((product) => (
                  <tr key={product.product_id}>
                    <td className="px-6 py-4">
                      <div className="space-y-1 max-w-xs">
                        <div className="font-semibold text-gray-900 line-clamp-2">{product.name}</div>
                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                        {product.description && (
                          <div className="text-sm text-gray-600 line-clamp-2">{product.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <ImageSlider images={product.images} />
                        {product.documents?.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap">
                            {product.documents.map((doc) => (
                              <a
                                key={doc.document_id}
                                href={doc.file_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors gap-1"
                                title={`${doc.document_type.toUpperCase()}: ${doc.reference_number || 'No reference'}`}
                              >
                                <FileText className="w-3 h-3" />
                                {doc.document_type}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Grade:</span>
                          <span className="font-medium text-gray-900">{product.grade}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">W/U:</span> {/* mean Weight/Unit */}
                          <span className="font-medium text-gray-900">
                            {product.weight_per_unit} {product.unit_of_measure}
                          </span>
                        </div>
                        {product.dimensions && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Type:</span>
                            <span className="font-medium text-gray-900 capitalize">
                              {product.dimensions.type}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">HSN:</span>
                          <span className="font-medium text-gray-900">{product.hsn_code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-900">
                          ₹{(product.price_per_unit || 0).toLocaleString('en-IN', {
                            maximumFractionDigits: 2,
                          })}
                          <span className="text-sm text-gray-500 ml-1">/{product.unit_of_measure}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-sm">
                            <span className="text-gray-500">Min. Order:</span>
                            <span className="ml-1 font-medium text-gray-900">
                              {product.minimum_order_qty} {product.unit_of_measure}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.is_active ? 'active' : 'inactive'} type="product" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.product_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-500 mt-1">Manage product categories and their organization</p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setShowCategoryForm(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {showCategoryForm ? (
        <CategoryForm
          category={selectedCategory}
          onSubmit={handleCategorySubmit}
          onCancel={() => {
            setShowCategoryForm(false);
            setSelectedCategory(null);
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name & Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category.category_id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">Slug: {category.slug}</div>
                        {category.description && (
                          <div className="text-sm text-gray-600 max-w-md">{category.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Order: {category.sort_order}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                          category.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            category.is_active ? 'bg-green-600' : 'bg-red-600'
                          }`}></span>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {category.is_bulk_only && (
                          <div className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Bulk Only
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCategoryForm(true);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.category_id)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users Management</h2>
      </div>
      <UsersTable />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProducts();
      case 'categories':
        return renderCategories();
      case 'users':
        return renderUsers();
      case 'orders':
        return <div className="text-center py-16 text-gray-500">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Orders Management</h3>
          <p>Coming soon - Advanced order tracking and management</p>
        </div>;
      case 'inventory':
        return <div className="text-center py-16 text-gray-500">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Inventory Management</h3>
          <p>Coming soon - Real-time stock tracking and alerts</p>
        </div>;
      case 'payments':
        return <div className="text-center py-16 text-gray-500">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payments Management</h3>
          <p>Coming soon - Payment verification and tracking</p>
        </div>;
      case 'shipments':
        return <div className="text-center py-16 text-gray-500">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Shipments Management</h3>
          <p>Coming soon - Logistics and delivery tracking</p>
        </div>;
      case 'analytics':
        return <div className="text-center py-16 text-gray-500">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics & Reports</h3>
          <p>Coming soon - Business insights and performance metrics</p>
        </div>;
      case 'settings':
        return <div className="text-center py-16 text-gray-500">
          <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
          <p>Coming soon - Application configuration and preferences</p>
        </div>;
      default:
        return renderDashboard();
    }
  };

  const renderSidebar = () => (
    <div className="space-y-2">
      <TabButton
        id="dashboard"
        icon={Home}
        label="Dashboard"
        active={activeTab === 'dashboard'}
        onClick={setActiveTab}
      />
      <TabButton
        id="users"
        icon={Users}
        label="Users"
        active={activeTab === 'users'}
        onClick={setActiveTab}
        count={userStats?.active_users || '0'}
      />
      <TabButton
        id="categories"
        icon={LayoutList}
        label="Categories"
        active={activeTab === 'categories'}
        onClick={setActiveTab}
        count={categories.length || '0'}
      />
      <TabButton
        id="products"
        icon={Package}
        label="Products"
        active={activeTab === 'products'}
        onClick={setActiveTab}
        count={products.length || '0'}
      />
      <TabButton
        id="orders"
        icon={ShoppingCart}
        label="Orders"
        active={activeTab === 'orders'}
        onClick={setActiveTab}
      />
      <TabButton
        id="inventory"
        icon={Package}
        label="Inventory"
        active={activeTab === 'inventory'}
        onClick={setActiveTab}
      />
      <TabButton
        id="payments"
        icon={CreditCard}
        label="Payments"
        active={activeTab === 'payments'}
        onClick={setActiveTab}
      />
      <TabButton
        id="shipments"
        icon={Truck}
        label="Shipments"
        active={activeTab === 'shipments'}
        onClick={setActiveTab}
      />
      <TabButton
        id="analytics"
        icon={BarChart3}
        label="Analytics"
        active={activeTab === 'analytics'}
        onClick={setActiveTab}
      />
      <TabButton
        id="settings"
        icon={Settings}
        label="Settings"
        active={activeTab === 'settings'}
        onClick={setActiveTab}
      />
    </div>
  );

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't redirect, just don't render if not verified
  if (!isVerified) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors mr-4"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">ST</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Steel Trading</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="hidden sm:block w-64 pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">Admin User</div>
                  <div className="text-xs text-gray-500">admin@steeltrading.com</div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar and Main Content */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="sticky top-24">
              {renderSidebar()}
            </nav>
          </div>
          
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;