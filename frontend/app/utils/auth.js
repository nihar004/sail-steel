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

export const registerWithEmail = async (email, password, userData) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });

    // You can store this data later in your own PostgreSQL via API
    const userDoc = {
      uid: user.uid,
      email: user.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      company: userData.company || '',
      phone: userData.phone,
      businessType: userData.businessType,
      createdAt: new Date().toISOString()
    };

    return { user, userData: userDoc };
  } catch (error) {
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
    return result;
  } catch (error) {
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
