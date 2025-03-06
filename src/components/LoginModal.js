import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  useToast,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider
} from '@chakra-ui/react';
import SocialAuth from './SocialAuth';
import { signInWithEmail, signUpWithEmail } from '../api/services/authService';

/**
 * LoginModal Component
 * A modal dialog that offers both traditional and social login options
 */
const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const initialRef = useRef();

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      let response;
      
      if (isLogin) {
        response = await signInWithEmail(email, password);
      } else {
        response = await signUpWithEmail(email, password);
      }
      
      if (response.error) {
        toast({
          title: 'Authentication Error',
          description: response.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: isLogin ? 'Login Successful' : 'Account Created',
          description: isLogin 
            ? 'Welcome back to PulseHustle!' 
            : 'Your account has been created successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }
        
        onClose();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login success
  const handleSocialSuccess = (data) => {
    if (onLoginSuccess) {
      onLoginSuccess(data);
    }
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      initialFocusRef={initialRef}
      size="md"
    >
      <ModalOverlay />
      <ModalContent borderRadius="md">
        <ModalHeader textAlign="center">
          {isLogin ? 'Sign In to PulseHustle' : 'Create an Account'}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6}>
          <Tabs variant="soft-rounded" colorScheme="cyan" isFitted>
            <TabList mb={4}>
              <Tab 
                onClick={() => setIsLogin(true)}
                fontWeight={isLogin ? "bold" : "normal"}
              >
                Sign In
              </Tab>
              <Tab 
                onClick={() => setIsLogin(false)}
                fontWeight={!isLogin ? "bold" : "normal"}
              >
                Sign Up
              </Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <VStack as="form" spacing={4} onSubmit={handleSubmit}>
                  <FormControl isInvalid={errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      ref={initialRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="******"
                    />
                    {errors.password ? (
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    ) : (
                      <FormHelperText textAlign="right">
                        <Text 
                          as="span" 
                          color="cyan.500" 
                          cursor="pointer"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          Forgot Password?
                        </Text>
                      </FormHelperText>
                    )}
                  </FormControl>
                  
                  <Button
                    colorScheme="cyan"
                    width="100%"
                    type="submit"
                    isLoading={isLoading}
                    height="50px"
                    mt={2}
                  >
                    Sign In
                  </Button>
                </VStack>
              </TabPanel>
              
              <TabPanel>
                <VStack as="form" spacing={4} onSubmit={handleSubmit}>
                  <FormControl isInvalid={errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      ref={initialRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="******"
                    />
                    {errors.password && (
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={errors.confirmPassword}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="******"
                    />
                    {errors.confirmPassword && (
                      <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                    )}
                  </FormControl>
                  
                  <Button
                    colorScheme="cyan"
                    width="100%"
                    type="submit"
                    isLoading={isLoading}
                    height="50px"
                    mt={2}
                  >
                    Create Account
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
          
          <SocialAuth onSuccess={handleSocialSuccess} />
        </ModalBody>
        
        <ModalFooter justifyContent="center">
          <Text fontSize="sm" color="gray.500">
            By continuing, you agree to PulseHustle's{' '}
            <Text as="span" color="cyan.500" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text as="span" color="cyan.500" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
              Privacy Policy
            </Text>
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal; 