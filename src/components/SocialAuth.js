import React, { useState } from 'react';
import { signInWithGoogle, signInWithX, signInWithGitHub } from '../api/services/authService';
import { FaGoogle, FaXTwitter, FaGithub } from 'react-icons/fa6';
import { Button, Box, Text, VStack, HStack, Divider, useToast, Center } from '@chakra-ui/react';

/**
 * Social Authentication Component
 * Provides buttons for social login options with a modern UI
 */
const SocialAuth = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState({
    google: false,
    x: false,
    github: false
  });
  const toast = useToast();

  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading({ ...isLoading, [provider]: true });
      
      let response;
      switch(provider) {
        case 'google':
          response = await signInWithGoogle();
          break;
        case 'x':
          response = await signInWithX();
          break;
        case 'github':
          response = await signInWithGitHub();
          break;
        default:
          throw new Error('Unknown provider');
      }

      if (response.error) {
        toast({
          title: 'Authentication Error',
          description: response.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (onSuccess && response.success) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error(`Error during ${provider} sign-in:`, error);
      toast({
        title: 'Authentication Error',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading({ ...isLoading, [provider]: false });
    }
  };

  return (
    <VStack spacing={4} width="100%" p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        Continue with
      </Text>
      
      <Button
        onClick={() => handleSocialLogin('google')}
        isLoading={isLoading.google}
        colorScheme="red"
        leftIcon={<FaGoogle />}
        width="100%"
        height="50px"
        fontSize="md"
      >
        Continue with Google
      </Button>
      
      <Button
        onClick={() => handleSocialLogin('x')}
        isLoading={isLoading.x}
        colorScheme="gray"
        leftIcon={<FaXTwitter />}
        width="100%"
        height="50px"
        fontSize="md"
      >
        Continue with X
      </Button>
      
      <Button
        onClick={() => handleSocialLogin('github')}
        isLoading={isLoading.github}
        colorScheme="gray"
        variant="outline"
        leftIcon={<FaGithub />}
        width="100%"
        height="50px"
        fontSize="md"
      >
        Continue with GitHub
      </Button>
      
      <HStack width="100%" my={4}>
        <Divider />
        <Text fontSize="sm" color="gray.500" px={2}>
          OR
        </Text>
        <Divider />
      </HStack>
    </VStack>
  );
};

export default SocialAuth; 