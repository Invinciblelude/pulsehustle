import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  IconButton,
  useDisclosure,
  HStack,
  Container
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoginModal from './LoginModal';

/**
 * Navbar Component
 * Main navigation bar with authentication integration
 */
const Navbar = () => {
  const { isOpen: isMobileNavOpen, onToggle } = useDisclosure();
  const {
    user,
    profile,
    isAuthenticated,
    loginModalProps,
    openLoginModal,
    logout
  } = useAuth();

  return (
    <Box 
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      position="sticky"
      top={0}
      zIndex={10}
      shadow="sm"
    >
      <Container maxW="container.xl" px={4}>
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
        >
          <IconButton
            size="md"
            icon={isMobileNavOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={onToggle}
          />
          
          <HStack spacing={8} alignItems="center">
            <Box fontWeight="bold" fontSize="xl" color="cyan.500">
              <Link to="/">PulseHustle</Link>
            </Box>
            <HStack
              as="nav"
              spacing={6}
              display={{ base: 'none', md: 'flex' }}
            >
              <Link to="/gigs">
                <Text fontWeight="medium" _hover={{ color: 'cyan.500' }}>
                  Find Gigs
                </Text>
              </Link>
              <Link to="/workers">
                <Text fontWeight="medium" _hover={{ color: 'cyan.500' }}>
                  Find Workers
                </Text>
              </Link>
              <Link to="/pricing">
                <Text fontWeight="medium" _hover={{ color: 'cyan.500' }}>
                  Pricing
                </Text>
              </Link>
              <Link to="/about">
                <Text fontWeight="medium" _hover={{ color: 'cyan.500' }}>
                  About
                </Text>
              </Link>
            </HStack>
          </HStack>
          
          <Flex alignItems="center">
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <HStack>
                    <Avatar 
                      size="sm" 
                      src={profile?.avatar_url || user?.user_metadata?.avatar_url}
                      name={profile?.full_name || user?.user_metadata?.full_name || user?.email}
                    />
                    <ChevronDownIcon />
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={Link} to="/dashboard">Dashboard</MenuItem>
                  <MenuItem as={Link} to="/profile">Profile</MenuItem>
                  <MenuItem as={Link} to="/gigs/create">Create Gig</MenuItem>
                  <MenuItem as={Link} to="/settings">Settings</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={logout}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Stack
                direction="row"
                spacing={4}
              >
                <Button
                  fontSize="sm"
                  fontWeight={600}
                  variant="ghost"
                  color="gray.600"
                  onClick={openLoginModal}
                  _hover={{
                    bg: 'gray.50',
                  }}
                >
                  Sign In
                </Button>
                <Button
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize="sm"
                  fontWeight={600}
                  color="white"
                  bg="cyan.400"
                  onClick={openLoginModal}
                  _hover={{
                    bg: 'cyan.500',
                  }}
                >
                  Sign Up
                </Button>
              </Stack>
            )}
          </Flex>
        </Flex>

        {/* Mobile Nav */}
        {isMobileNavOpen && (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as="nav" spacing={4}>
              <Link to="/gigs">
                <Text py={2} fontWeight="medium">
                  Find Gigs
                </Text>
              </Link>
              <Link to="/workers">
                <Text py={2} fontWeight="medium">
                  Find Workers
                </Text>
              </Link>
              <Link to="/pricing">
                <Text py={2} fontWeight="medium">
                  Pricing
                </Text>
              </Link>
              <Link to="/about">
                <Text py={2} fontWeight="medium">
                  About
                </Text>
              </Link>
            </Stack>
          </Box>
        )}
      </Container>
      
      {/* Login Modal */}
      <LoginModal {...loginModalProps} />
    </Box>
  );
};

export default Navbar; 