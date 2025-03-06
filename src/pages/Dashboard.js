import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  GridItem, 
  Heading, 
  Text, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  Flex, 
  Icon, 
  Button, 
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { FaBriefcase, FaStar, FaMoneyBillWave, FaUsers, FaArrowUp, FaSearch, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Dashboard Component
 * Main dashboard for authenticated users
 */
const Dashboard = () => {
  const { user, profile } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  
  // Sample data for display purposes
  const dashboardData = {
    earnings: 1710,
    availableGigs: 24,
    applicationsCount: 3,
    rating: 4.9,
    activeGigs: [],
    recentActivity: [
      { id: 1, type: 'view', message: 'Someone viewed your profile', time: '2 hours ago' },
      { id: 2, type: 'application', message: 'Your application was shortlisted', time: '1 day ago' },
      { id: 3, type: 'payment', message: 'Payment of $570 was processed', time: '3 days ago' },
    ],
    recommendedGigs: [
      { id: 101, title: 'UI/UX Designer Needed', rate: 600, skills: ['Design', 'Figma', 'UI/UX'] },
      { id: 102, title: 'React Developer for E-commerce', rate: 800, skills: ['React', 'JavaScript', 'API'] },
    ]
  };

  return (
    <Box as="main" py={8}>
      <Container maxW="container.xl">
        {/* Welcome section */}
        <Flex 
          justify="space-between" 
          align="center" 
          mb={8}
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 4, md: 0 }}
        >
          <Box>
            <Heading as="h1" size="xl">
              Welcome back, {profile?.full_name || user?.user_metadata?.full_name || user?.email}
            </Heading>
            <Text mt={2} color="gray.600">
              Here's what's happening with your gigs today
            </Text>
          </Box>
          <HStack spacing={4}>
            <Button 
              leftIcon={<FaSearch />} 
              colorScheme="gray" 
              variant="outline"
              as={Link}
              to="/gigs"
            >
              Find Gigs
            </Button>
            <Button 
              leftIcon={<FaPlus />} 
              colorScheme="cyan"
              as={Link}
              to="/gigs/create"
            >
              Create Gig
            </Button>
          </HStack>
        </Flex>
        
        {/* Stats Grid */}
        <Grid 
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={6}
          mb={8}
        >
          <GridItem>
            <Stat
              px={6}
              py={5}
              bg={cardBg}
              borderWidth="1px"
              borderColor={cardBorder}
              rounded="lg"
              shadow="sm"
            >
              <Flex justifyContent="space-between">
                <Box>
                  <StatLabel>Total Earnings</StatLabel>
                  <StatNumber>${dashboardData.earnings}</StatNumber>
                  <StatHelpText>
                    <Icon as={FaArrowUp} color="green.400" />
                    {' '}23% from last month
                  </StatHelpText>
                </Box>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  rounded="full"
                  bg="cyan.100"
                  color="cyan.700"
                  boxSize={12}
                >
                  <Icon as={FaMoneyBillWave} boxSize={6} />
                </Flex>
              </Flex>
            </Stat>
          </GridItem>
          
          <GridItem>
            <Stat
              px={6}
              py={5}
              bg={cardBg}
              borderWidth="1px"
              borderColor={cardBorder}
              rounded="lg"
              shadow="sm"
            >
              <Flex justifyContent="space-between">
                <Box>
                  <StatLabel>Available Gigs</StatLabel>
                  <StatNumber>{dashboardData.availableGigs}</StatNumber>
                  <StatHelpText>
                    <Icon as={FaArrowUp} color="green.400" />
                    {' '}7 new today
                  </StatHelpText>
                </Box>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  rounded="full"
                  bg="blue.100"
                  color="blue.700"
                  boxSize={12}
                >
                  <Icon as={FaBriefcase} boxSize={6} />
                </Flex>
              </Flex>
            </Stat>
          </GridItem>
          
          <GridItem>
            <Stat
              px={6}
              py={5}
              bg={cardBg}
              borderWidth="1px"
              borderColor={cardBorder}
              rounded="lg"
              shadow="sm"
            >
              <Flex justifyContent="space-between">
                <Box>
                  <StatLabel>Your Applications</StatLabel>
                  <StatNumber>{dashboardData.applicationsCount}</StatNumber>
                  <StatHelpText>
                    1 in review
                  </StatHelpText>
                </Box>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  rounded="full"
                  bg="purple.100"
                  color="purple.700"
                  boxSize={12}
                >
                  <Icon as={FaUsers} boxSize={6} />
                </Flex>
              </Flex>
            </Stat>
          </GridItem>
          
          <GridItem>
            <Stat
              px={6}
              py={5}
              bg={cardBg}
              borderWidth="1px"
              borderColor={cardBorder}
              rounded="lg"
              shadow="sm"
            >
              <Flex justifyContent="space-between">
                <Box>
                  <StatLabel>Rating</StatLabel>
                  <StatNumber>{dashboardData.rating}</StatNumber>
                  <StatHelpText>
                    From 7 reviews
                  </StatHelpText>
                </Box>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  rounded="full"
                  bg="yellow.100"
                  color="yellow.700"
                  boxSize={12}
                >
                  <Icon as={FaStar} boxSize={6} />
                </Flex>
              </Flex>
            </Stat>
          </GridItem>
        </Grid>
        
        {/* Main content area */}
        <Grid
          templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
          gap={8}
        >
          {/* Left column */}
          <GridItem>
            <VStack spacing={8} align="stretch">
              {/* Active gigs */}
              <Box
                bg={cardBg}
                borderWidth="1px"
                borderColor={cardBorder}
                rounded="lg"
                shadow="sm"
                p={6}
              >
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Heading as="h2" size="md">Active Gigs</Heading>
                  <Button size="sm" variant="ghost" colorScheme="cyan">
                    View All
                  </Button>
                </Flex>
                
                {dashboardData.activeGigs.length > 0 ? (
                  dashboardData.activeGigs.map(gig => (
                    <Box key={gig.id}>
                      {/* Gig item content */}
                    </Box>
                  ))
                ) : (
                  <Box 
                    textAlign="center" 
                    py={10} 
                    px={6} 
                    borderWidth="1px" 
                    borderStyle="dashed"
                    borderColor="gray.200"
                    borderRadius="md"
                  >
                    <Icon as={FaBriefcase} boxSize={10} color="gray.300" mb={4} />
                    <Heading as="h3" size="md" mb={2}>No active gigs</Heading>
                    <Text color="gray.500" mb={6}>
                      You don't have any active gigs at the moment.
                    </Text>
                    <Button 
                      colorScheme="cyan" 
                      as={Link} 
                      to="/gigs/create"
                      leftIcon={<FaPlus />}
                    >
                      Create a Gig
                    </Button>
                  </Box>
                )}
              </Box>
              
              {/* Recommended gigs */}
              <Box
                bg={cardBg}
                borderWidth="1px"
                borderColor={cardBorder}
                rounded="lg"
                shadow="sm"
                p={6}
              >
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Heading as="h2" size="md">Recommended for You</Heading>
                  <Button size="sm" variant="ghost" colorScheme="cyan">
                    View More
                  </Button>
                </Flex>
                
                <VStack spacing={4} align="stretch">
                  {dashboardData.recommendedGigs.map(gig => (
                    <Box 
                      key={gig.id} 
                      p={4} 
                      borderWidth="1px" 
                      borderColor="gray.200" 
                      borderRadius="md"
                      _hover={{ shadow: 'md', borderColor: 'cyan.200' }}
                      transition="all 0.2s"
                    >
                      <Flex justify="space-between" align="flex-start">
                        <VStack align="flex-start" spacing={1}>
                          <Heading as="h3" size="sm">
                            {gig.title}
                          </Heading>
                          <HStack spacing={2}>
                            {gig.skills.map((skill, index) => (
                              <Badge key={index} colorScheme="cyan" variant="subtle">
                                {skill}
                              </Badge>
                            ))}
                          </HStack>
                        </VStack>
                        <Text fontWeight="bold" color="cyan.500">
                          ${gig.rate}
                        </Text>
                      </Flex>
                      <Flex justify="flex-end" mt={4}>
                        <Button size="sm" colorScheme="cyan" variant="outline">
                          View Details
                        </Button>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </GridItem>
          
          {/* Right column */}
          <GridItem>
            <VStack spacing={8} align="stretch">
              {/* Recent activity */}
              <Box
                bg={cardBg}
                borderWidth="1px"
                borderColor={cardBorder}
                rounded="lg"
                shadow="sm"
                p={6}
              >
                <Heading as="h2" size="md" mb={4}>Recent Activity</Heading>
                
                <VStack spacing={4} align="stretch" divider={<Divider />}>
                  {dashboardData.recentActivity.map(activity => (
                    <Flex key={activity.id} justify="space-between" align="center">
                      <VStack align="flex-start" spacing={0}>
                        <Text>{activity.message}</Text>
                        <Text fontSize="sm" color="gray.500">{activity.time}</Text>
                      </VStack>
                      <Badge colorScheme={
                        activity.type === 'view' ? 'blue' :
                        activity.type === 'application' ? 'green' :
                        activity.type === 'payment' ? 'purple' : 'gray'
                      }>
                        {activity.type}
                      </Badge>
                    </Flex>
                  ))}
                </VStack>
              </Box>
              
              {/* Profile completion */}
              <Box
                bg={cardBg}
                borderWidth="1px"
                borderColor={cardBorder}
                rounded="lg"
                shadow="sm"
                p={6}
              >
                <Heading as="h2" size="md" mb={4}>Profile Completion</Heading>
                
                <VStack spacing={4} align="stretch">
                  <Flex justify="space-between">
                    <Text>Profile Strength</Text>
                    <Text fontWeight="bold">70%</Text>
                  </Flex>
                  
                  <Box
                    w="100%"
                    bg="gray.100"
                    borderRadius="full"
                    h="10px"
                    overflow="hidden"
                  >
                    <Box
                      w="70%"
                      h="100%"
                      bg="cyan.400"
                      borderRadius="full"
                    />
                  </Box>
                  
                  <Button
                    colorScheme="cyan"
                    variant="outline"
                    as={Link}
                    to="/profile"
                    mt={2}
                  >
                    Complete Your Profile
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 