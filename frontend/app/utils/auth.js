import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '@/app/lib/firebase'; // Adjust the import path as necessary

export const registerWithEmail = async (email, password, userData) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with additional data
    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });
    
    // Store additional user data in Firestore
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

    // You'll need to set up Firestore and create a users collection
    // await setDoc(doc(db, 'users', user.uid), userDoc);

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
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};