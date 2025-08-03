"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if product already exists in cart
      const existingItem = prevItems.find(item => item.product_id === product.product_id);
      
      if (existingItem) {
        // If exists, update quantity
        return prevItems.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // If doesn't exist, add new item with quantity 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
    
    return true; // Return success
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.product_id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price_per_unit * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN')}`;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      formatPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}