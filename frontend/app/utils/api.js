import { auth } from './firebase';

const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user');
  }

  return {
    'Content-Type': 'application/json',
    'firebase-uid': user.uid
  };
};

export const checkAdminStatus = async (firebaseUid) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch('http://localhost:5000/auth/check-admin', {
      method: 'POST',
      headers,
      body: JSON.stringify({ firebaseUid }),
    });

    if (!response.ok) throw new Error('Failed to verify admin status');
    const data = await response.json();
    return data.isAdmin;
  } catch (error) {
    console.error('Admin check failed:', error);
    return false;
  }
};

// Update all admin API calls to use auth headers
export const fetchUsers = async (filters = {}) => {
  try {
    const headers = await getAuthHeader();
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(
      `http://localhost:5000/admin/users?${queryParams}`,
      { headers }
    );

    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const toggleUserStatus = async (userId) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(
      `http://localhost:5000/admin/users/${userId}/toggle-status`,
      {
        method: 'PATCH',
        headers
      }
    );

    if (!response.ok) throw new Error('Failed to toggle user status');
    return await response.json();
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(
      `http://localhost:5000/admin/users/${userId}/role`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ role })
      }
    );

    if (!response.ok) throw new Error('Failed to update user role');
    return await response.json();
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Add fetchStats to the API utilities
export const fetchStats = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch('http://localhost:5000/admin/users/stats', {
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const fetchProducts = async (filters = {}) => {
  try {
    const headers = await getAuthHeader();
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(
      `http://localhost:5000/admin/products?${queryParams}`,
      { headers }
    );

    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const updateProduct = async (productId, data) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(
      `http://localhost:5000/admin/products/${productId}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const addProduct = async (data) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(
      `http://localhost:5000/admin/products`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) throw new Error('Failed to add product');
    return await response.json();
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch('http://localhost:5000/admin/categories', {
      headers
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const addCategory = async (data) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch('http://localhost:5000/admin/categories', {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to add category');
    return await response.json();
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId, data) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`http://localhost:5000/admin/categories/${categoryId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update category');
    return await response.json();
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`http://localhost:5000/admin/categories/${categoryId}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return await response.json();
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(
      `http://localhost:5000/admin/products/${productId}`,
      {
        method: 'DELETE',
        headers
      }
    );

    if (!response.ok) throw new Error('Failed to delete product');
    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};