import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
  Flex, 
  Spinner, 
  Text, 
  VStack, 
  Heading, 
  Alert, 
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { authCallbackConfig } from '../config/authConfig';

/**
 * AuthCallback Component
 * Handles OAuth redirects and sets up the user session
 */
const AuthCallback = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse the URL hash - Supabase auth will add parameters to the URL
        const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const expiresIn = hashParams.get('expires_in');
        const tokenType = hashParams.get('token_type');
        
        if (!accessToken) {
          throw new Error('No access token found in URL');
        }
        
        // Set the session in Supabase
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: parseInt(expiresIn || '0', 10),
          token_type: tokenType || 'bearer',
        });
        
        if (error) {
          throw error;
        }
        
        // Get the user data
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not found after authentication');
        }
        
        // Check if this is a new user and create profile if needed
        await ensureUserProfile(user);
        
        // Navigate to the dashboard or the intended destination
        const intendedPath = sessionStorage.getItem('authRedirectTo') || authCallbackConfig.defaultRedirectPath;
        sessionStorage.removeItem('authRedirectTo');
        
        navigate(intendedPath, { replace: true });
      } catch (err) {
        console.error('Error during auth callback:', err);
        setError(err.message || 'Authentication failed');
      } finally {
        setIsLoading(false);
      }
    };

    // Function to ensure user has a profile record
    const ensureUserProfile = async (user) => {
      try {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        
        // If no profile, create one
        if (!existingProfile) {
          const { error } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || '',
              avatar_url: user.user_metadata?.avatar_url || '',
              email: user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (error) {
            console.error('Error creating user profile:', error);
          }
        }
      } catch (error) {
        console.error('Error checking/creating profile:', error);
      }
    };

    // Execute the callback handler
    handleAuthCallback();
  }, [navigate, location]);

  // Display loading UI
  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg="gray.50">
        <VStack spacing={6}>
          <Spinner size="xl" color="cyan.500" thickness="4px" />
          <Heading size="md">Setting up your session...</Heading>
          <Text color="gray.600">Please wait while we redirect you</Text>
        </VStack>
      </Flex>
    );
  }

  // Display error if something went wrong
  if (error) {
    return (
      <Flex justify="center" align="center" minH="100vh" p={4} bg="gray.50">
        <Alert 
          status="error" 
          variant="subtle" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          textAlign="center" 
          height="auto" 
          p={6} 
          borderRadius="md"
          maxW="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Authentication Failed
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error}. Please try signing in again.
          </AlertDescription>
        </Alert>
      </Flex>
    );
  }

  // Default render while redirect happens
  return (
    <Flex justify="center" align="center" minH="100vh" bg="gray.50">
      <VStack spacing={6}>
        <Spinner size="xl" color="cyan.500" thickness="4px" />
        <Heading size="md">Redirecting...</Heading>
      </VStack>
    </Flex>
  );
};

export default AuthCallback; 