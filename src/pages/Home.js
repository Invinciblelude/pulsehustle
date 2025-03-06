import React from 'react';
import { Box, Heading, Text, Button, Flex, VStack, HStack, Image, Container, SimpleGrid, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaBriefcase, FaMoneyBillWave, FaUserTie, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SocialShare from '../components/SocialShare';

/**
 * Home Component
 * Landing page for the application
 */
const Home = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const bgGradient = useColorModeValue(
    'linear(to-b, cyan.50, white)',
    'linear(to-b, gray.900, gray.800)'
  );

  const features = [
    {
      title: 'High-Paying Gigs',
      description: 'Access premium gig opportunities with better pay than traditional platforms.',
      icon: FaBriefcase,
    },
    {
      title: '95/5 Revenue Split',
      description: 'Keep 95% of your earnings with our industry-leading revenue model.',
      icon: FaMoneyBillWave,
    },
    {
      title: 'Verified Employers',
      description: 'Work with vetted companies and individuals you can trust.',
      icon: FaUserTie,
    },
    {
      title: 'Secure Payments',
      description: 'Get paid reliably and on time with our secure payment system.',
      icon: FaLock,
    },
  ];

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      // Redirect to dashboard or gig creation
      window.location.href = '/dashboard';
    }
  };

  return (
    <Box as="main">
      {/* Hero Section */}
      <Box bg={bgGradient} pt={20} pb={16}>
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            align="center" 
            justify="space-between"
            gap={10}
          >
            <VStack 
              align={{ base: 'center', md: 'flex-start' }}
              spacing={6}
              maxW={{ base: 'full', md: '50%' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              <Heading 
                size="4xl" 
                fontWeight="bold"
                bgGradient="linear(to-r, cyan.400, blue.500, purple.600)"
                bgClip="text"
              >
                PulseHustle
              </Heading>
              <Heading as="h2" size="xl" fontWeight="medium" color="gray.700">
                Next-Gen Gig Platform
              </Heading>
              <Text fontSize="xl" color="gray.600">
                Connect with high-paying gigs and keep 95% of your earnings. Start earning $570+ per gig today.
              </Text>
              
              <HStack spacing={4} pt={4}>
                <Button 
                  colorScheme="cyan" 
                  size="lg" 
                  height="60px" 
                  px={10}
                  onClick={handleGetStarted}
                >
                  {isAuthenticated ? 'View Dashboard' : 'Get Started'}
                </Button>
                <Button 
                  variant="outline" 
                  colorScheme="cyan" 
                  size="lg"
                  height="60px"
                  as={Link}
                  to="/gigs"
                >
                  Browse Gigs
                </Button>
              </HStack>
              
              <HStack pt={2} spacing={10}>
                <VStack align={{ base: 'center', md: 'flex-start' }} spacing={0}>
                  <Text fontSize="3xl" fontWeight="bold" color="cyan.500">$600</Text>
                  <Text fontSize="sm" color="gray.500">Average Gig Value</Text>
                </VStack>
                <VStack align={{ base: 'center', md: 'flex-start' }} spacing={0}>
                  <Text fontSize="3xl" fontWeight="bold" color="cyan.500">$570</Text>
                  <Text fontSize="sm" color="gray.500">Worker Earnings</Text>
                </VStack>
                <VStack align={{ base: 'center', md: 'flex-start' }} spacing={0}>
                  <Text fontSize="3xl" fontWeight="bold" color="cyan.500">5%</Text>
                  <Text fontSize="sm" color="gray.500">Platform Fee</Text>
                </VStack>
              </HStack>
            </VStack>
            
            <Box 
              w={{ base: 'full', md: '45%' }}
              maxW="600px"
              borderRadius="xl"
              overflow="hidden"
              shadow="2xl"
            >
              <Image 
                src="/hero-image.jpg" 
                fallbackSrc="https://via.placeholder.com/600x400?text=PulseHustle"
                alt="PulseHustle Hero" 
                w="full"
              />
            </Box>
          </Flex>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={5} textAlign="center">
              <Heading as="h2" size="2xl">
                Why Choose PulseHustle?
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="800px">
                PulseHustle is built for the modern gig economy, offering more value to workers and quality to hirers.
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
              {features.map((feature, index) => (
                <VStack 
                  key={index}
                  align="flex-start"
                  p={8}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                  _hover={{ 
                    shadow: 'lg', 
                    transform: 'translateY(-5px)',
                    borderColor: 'cyan.200'
                  }}
                  transition="all 0.3s"
                >
                  <Icon as={feature.icon} boxSize={12} color="cyan.500" />
                  <Heading as="h3" size="md" mt={4}>
                    {feature.title}
                  </Heading>
                  <Text color="gray.600" mt={2}>
                    {feature.description}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box bg="cyan.50" py={16}>
        <Container maxW="container.xl">
          <VStack spacing={10} textAlign="center">
            <Heading as="h2" size="xl">
              Ready to Elevate Your Gig Experience?
            </Heading>
            <Text fontSize="lg" maxW="800px">
              Join thousands of professionals who've made the switch to PulseHustle for better gigs and higher earnings.
            </Text>
            <HStack spacing={4}>
              <Button 
                colorScheme="cyan" 
                size="lg" 
                height="60px" 
                px={10}
                onClick={handleGetStarted}
              >
                {isAuthenticated ? 'View Dashboard' : 'Sign Up Now'}
              </Button>
              <Button 
                variant="ghost" 
                colorScheme="cyan" 
                size="lg"
                height="60px"
              >
                Learn More
              </Button>
            </HStack>
            
            {/* Social Share */}
            <Box pt={6}>
              <SocialShare 
                title="I just discovered PulseHustle - the next-gen gig platform with a 95/5 earnings split!" 
                description="Check out PulseHustle - connect with high-paying gigs and keep 95% of your earnings. Start earning $570+ per gig today."
                compact={false}
              />
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 