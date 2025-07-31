import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  fetchSignInMethodsForEmail
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
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    throw error;
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
