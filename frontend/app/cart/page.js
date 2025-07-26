"use client";

import { useState, useEffect } from 'react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium Brake Pads Set",
      brand: "Brembo",
      price: 89.99,
      originalPrice: 119.99,
      quantity: 2,
      image: "/images/placeholder-product.jpg",
      inStock: true,
      compatibility: "2018-2023 Honda Accord",
      partNumber: "BRM-BP001"
    },
    {
      id: 2,
      name: "High Performance Air Filter",
      brand: "K&N",
      price: 45.99,
      originalPrice: 65.99,
      quantity: 1,
      image: "/images/placeholder-product.jpg",
      inStock: true,
      compatibility: "2019-2024 Toyota Camry",
      partNumber: "KN-AF245"
    },
    {
      id: 3,
      name: "LED Headlight Assembly",
      brand: "OSRAM",
      price: 299.99,
      originalPrice: 399.99,
      quantity: 1,
      image: "/images/placeholder-product.jpg",
      inStock: false,
      compatibility: "2020-2025 BMW 3 Series",
      partNumber: "OSR-HL890",
      estimatedArrival: "2-3 weeks"
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    // Simple promo code logic
    if (promoCode === 'SAVE10') {
      setAppliedPromo({ code: 'SAVE10', discount: 0.1, description: '10% off entire order' });
    } else if (promoCode === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', discount: 0, description: 'Free shipping', freeShipping: true });
    } else {
      alert('Invalid promo code');
    }
    setPromoCode('');
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const promoDiscount = appliedPromo && appliedPromo.discount ? subtotal * appliedPromo.discount : 0;
  const shipping = appliedPromo && appliedPromo.freeShipping ? 0 : (subtotal > 100 ? 0 : 15.99);
  const tax = (subtotal - promoDiscount) * 0.08;
  const total = subtotal - promoDiscount + shipping + tax;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <header className="fixed w-full z-50 bg-white shadow-lg top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AP</span>
                </div>
                <span className="text-xl font-bold text-gray-900">AutoParts Pro</span>
              </div>
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
                <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Products</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Categories</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-8">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6-5V4a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 text-center max-w-md">Start shopping to add items to your cart and build your perfect vehicle setup.</p>
          <a href="/products" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white shadow-lg top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AutoParts Pro</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
              <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Products</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Categories</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Product</span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-gray-600 mb-1">Brand: {item.brand}</p>
                        <p className="text-sm text-gray-500 mb-1">Part #: {item.partNumber}</p>
                        <p className="text-sm text-blue-600">{item.compatibility}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-4">
                      {item.inStock ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                          Back Order ({item.estimatedArrival})
                        </span>
                      )}
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-lg text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">Qty:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Need more parts?</h3>
                  <p className="text-gray-600">Continue browsing our extensive catalog</p>
                </div>
                <a
                  href="/products"
                  className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all transform hover:scale-105"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="mt-3 flex items-center justify-between bg-green-50 px-4 py-2 rounded-lg">
                    <span className="text-sm text-green-800">{appliedPromo.description}</span>
                    <button onClick={removePromo} className="text-green-600 hover:text-green-800">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You save</span>
                    <span className="font-semibold">-${savings.toFixed(2)}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo discount</span>
                    <span className="font-semibold">-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Banner */}
              {subtotal < 100 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm">
                      <p className="text-blue-800 font-medium">Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!</p>
                    </div>
                  </div>
                  <div className="mt-2 bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isCheckingOut ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure checkout with 256-bit SSL encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}