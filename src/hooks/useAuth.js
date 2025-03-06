import { useState, useEffect, useCallback } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { 
  getCurrentUser, 
  signOut, 
  onAuthStateChange,
  getUserProfile 
} from '../api/services/authService';

/**
 * Custom hook for authentication management
 * Provides login modal control, auth state, and user information
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch the current user on hook initialization
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoading(true);
      try {
        const { data } = await getCurrentUser();
        if (data?.user) {
          setUser(data.user);
          
          // Fetch user profile if user is logged in
          const profileResponse = await getUserProfile(data.user.id);
          if (profileResponse.success) {
            setProfile(profileResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();

    // Set up auth state change listener
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
        // Fetch user profile on sign in
        const profileResponse = await getUserProfile(session.user.id);
        if (profileResponse.success) {
          setProfile(profileResponse.data);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      } else if (event === 'USER_UPDATED' && session?.user) {
        setUser(session.user);
      }
    });

    // Clean up subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Handle login success
  const handleLoginSuccess = useCallback((data) => {
    if (data?.user) {
      setUser(data.user);
    }
  }, []);

  // Handle logout
  const logout = useCallback(async () => {
    try {
      const { success, error } = await signOut();
      if (success) {
        setUser(null);
        setProfile(null);
      } else if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  }, []);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    loginModalProps: {
      isOpen,
      onClose,
      onLoginSuccess: handleLoginSuccess
    },
    openLoginModal: onOpen,
    closeLoginModal: onClose,
    logout
  };
};

export default useAuth; 