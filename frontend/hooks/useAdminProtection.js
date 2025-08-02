import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { checkAdminStatus } from '@/app/utils/api';

export function useAdminProtection() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      if (!loading) {
        if (!user) {
          router.replace('/auth?mode=login');
          setIsChecking(false);
          return;
        }

        try {
          const isAdmin = await checkAdminStatus(user.uid);
          if (isAdmin) {
            setIsVerified(true);
          } else {
            router.replace('/');
          }
        } catch (error) {
          console.error('Admin verification failed:', error);
          router.replace('/');
        } finally {
          setIsChecking(false);
        }
      }
    };

    verifyAccess();
  }, [user, loading, router]);

  return { 
    isLoading: loading || isChecking,
    isVerified 
  };
}