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
    const response = await fetch('https://sail-steel.onrender.com/auth/check-admin', {
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
      `https://sail-steel.onrender.com/admin/users?${queryParams}`,
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
      `https://sail-steel.onrender.com/admin/users/${userId}/toggle-status`,
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
      `https://sail-steel.onrender.com/admin/users/${userId}/role`,
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
    const response = await fetch('https://sail-steel.onrender.com/admin/users/stats', {
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
      `https://sail-steel.onrender.com/admin/products?${queryParams}`,
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
      `https://sail-steel.onrender.com/admin/products/${productId}`,
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
      `https://sail-steel.onrender.com/admin/products`,
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
    const response = await fetch('https://sail-steel.onrender.com/admin/categories', {
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
    const response = await fetch('https://sail-steel.onrender.com/admin/categories', {
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
    const response = await fetch(`https://sail-steel.onrender.com/admin/categories/${categoryId}`, {
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
    const response = await fetch(`https://sail-steel.onrender.com/admin/categories/${categoryId}`, {
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
      `https://sail-steel.onrender.com/admin/products/${productId}`,
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

// Add or update this function
export const getPublicCategories = async () => {
  try {
    const response = await fetch('https://sail-steel.onrender.com/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Add this function
export const getPublicProducts = async () => {
  try {
    const response = await fetch('https://sail-steel.onrender.com/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching public products:', error);
    throw error;
  }
};

// Add this new function
export const createUser = async (userData) => {
  try {
    console.log('Creating user with data:', userData);

    // Ensure all required fields have default values
    const userDataWithDefaults = {
      firebase_uid: userData.firebase_uid,
      email: userData.email,
      firstName: userData.firstName || 'User',
      lastName: userData.lastName || '',
      phone: userData.phone || '0000000000',
      company: userData.company || '',
      gst_number: userData.gst_number || null
    };

    const response = await fetch('https://sail-steel.onrender.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDataWithDefaults),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Server error:', data);
      throw new Error(data.details || 'Failed to create user');
    }

    console.log('User created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};