import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  fetchSignInMethodsForEmail,
  signOut
} from 'firebase/auth';
import { auth, googleProvider } from '@/app/utils/firebase';
import { createUser } from '@/app/utils/api';

export const registerWithEmail = async (email, password, userData) => {
  try {
    // First create Firebase user
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // Update Firebase profile
    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });

    // Return the Firebase user
    return user;
  } catch (error) {
    console.error('Firebase registration error:', error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    // First authenticate with Firebase
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Then check user status in your database
    const response = await fetch('http://localhost:5000/auth/check-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseUid: result.user.uid,
      }),
    });

    const data = await response.json();

    // If user is not active, sign them out and throw error
    if (!data.isActive) {
      await signOut(auth);
      throw new Error('Your account has been deactivated. Please contact support.');
    }

    return result;
  } catch (error) {
    if (error.message.includes('deactivated')) {
      throw error;
    }
    throw new Error('Invalid email or password');
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Split the display name into first and last name
    const nameParts = result.user.displayName?.split(' ') || ['', ''];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    // Extract user info from Google result with required fields
    const userData = {
      firebase_uid: result.user.uid,
      email: result.user.email,
      firstName: firstName || 'User', // Fallback if no first name
      lastName: lastName || '', // Fallback if no last name
      phone: result.user.phoneNumber || '0000000000', // Default phone number
      company: '', // Default empty company
      gst_number: null // Default null GST
    };

    try {
      // Check if user already exists in our database
      const response = await fetch(`http://localhost:5000/users/check/${result.user.uid}`);
      const exists = await response.json();

      if (!exists.found) {
        // If user doesn't exist, create them
        await createUser(userData);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to create user profile');
    }

    return result;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    // First check if email exists
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    
    if (signInMethods.length === 0) {
      throw new Error('No account found with this email address');
    }

    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};
