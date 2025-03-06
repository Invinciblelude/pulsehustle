import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Avatar,
  VStack,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Badge,
  useToast,
  Divider,
  FormErrorMessage,
  useColorModeValue,
  Flex,
  IconButton,
  SimpleGrid
} from '@chakra-ui/react';
import { 
  FaEdit, 
  FaSave, 
  FaGithub, 
  FaLinkedin, 
  FaGlobe, 
  FaPlus, 
  FaTimes, 
  FaStar 
} from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import SocialShare from '../components/SocialShare';

/**
 * Profile Component
 * User profile page with editing capabilities
 */
const Profile = () => {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || user?.user_metadata?.full_name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
    hourlyRate: profile?.hourly_rate || '',
    skills: profile?.skills || ['React', 'JavaScript', 'UI Design'],
    newSkill: ''
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handleAddSkill = () => {
    if (profileData.newSkill.trim() === '') return;
    
    if (!profileData.skills.includes(profileData.newSkill)) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, profileData.newSkill],
        newSkill: ''
      });
    } else {
      toast({
        title: 'Skill already exists',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.fullName) {
      newErrors.fullName = 'Name is required';
    }
    
    if (profileData.hourlyRate && isNaN(profileData.hourlyRate)) {
      newErrors.hourlyRate = 'Hourly rate must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateForm()) return;
    
    // Here you would call your API to update the profile
    // For example: await updateProfile(user.id, profileData);
    
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    setIsEditing(false);
  };
  
  // Mock projects for demonstration
  const projects = [
    {
      id: 1,
      title: 'E-commerce Website Redesign',
      description: 'Redesigned the UI/UX for an e-commerce platform, resulting in 30% increase in conversions.',
      tags: ['UI/UX', 'E-commerce', 'Design'],
      rating: 5
    },
    {
      id: 2,
      title: 'Mobile App Development',
      description: 'Built a React Native app for a fitness tracking service with 10,000+ downloads.',
      tags: ['React Native', 'Mobile', 'Fitness'],
      rating: 4.8
    }
  ];
  
  return (
    <Box as="main" py={8}>
      <Container maxW="container.xl">
        <Grid
          templateColumns={{ base: '1fr', lg: '300px 1fr' }}
          gap={8}
        >
          {/* Left sidebar */}
          <GridItem>
            <VStack spacing={8} align="stretch">
              {/* Profile Card */}
              <Box
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                overflow="hidden"
                shadow="sm"
              >
                <Box bg="cyan.500" h="80px" />
                <Box p={6} pt={0} position="relative">
                  <Avatar
                    size="xl"
                    src={profile?.avatar_url || user?.user_metadata?.avatar_url}
                    name={profileData.fullName || user?.email}
                    border="4px solid white"
                    position="relative"
                    top="-40px"
                    mb="-20px"
                  />
                  
                  <Heading as="h2" size="lg" mt={2}>
                    {profileData.fullName || 'Your Name'}
                  </Heading>
                  
                  <Text color="gray.600" mt={1}>
                    {user?.email}
                  </Text>
                  
                  <HStack mt={4} spacing={4}>
                    {profileData.location && (
                      <Text color="gray.500" fontSize="sm">
                        📍 {profileData.location}
                      </Text>
                    )}
                    
                    {profileData.hourlyRate && (
                      <Text color="cyan.500" fontWeight="bold" fontSize="sm">
                        ${profileData.hourlyRate}/hr
                      </Text>
                    )}
                  </HStack>
                  
                  <Button
                    size="sm"
                    colorScheme={isEditing ? 'green' : 'cyan'}
                    leftIcon={isEditing ? <FaSave /> : <FaEdit />}
                    position="absolute"
                    top={6}
                    right={6}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  >
                    {isEditing ? 'Save' : 'Edit'}
                  </Button>
                  
                  <Divider my={4} />
                  
                  <VStack align="stretch" spacing={3}>
                    {profileData.website && (
                      <HStack>
                        <FaGlobe />
                        <Text fontSize="sm">
                          <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                            {profileData.website.replace(/^https?:\/\//, '')}
                          </a>
                        </Text>
                      </HStack>
                    )}
                    
                    <HStack>
                      <FaGithub />
                      <Text fontSize="sm">GitHub Profile</Text>
                    </HStack>
                    
                    <HStack>
                      <FaLinkedin />
                      <Text fontSize="sm">LinkedIn Profile</Text>
                    </HStack>
                  </VStack>
                  
                  <Box mt={4}>
                    <SocialShare 
                      title={`Check out ${profileData.fullName}'s profile on PulseHustle!`} 
                      description={`Connect with ${profileData.fullName} for freelance opportunities on PulseHustle.`}
                      compact={true}
                    />
                  </Box>
                </Box>
              </Box>
              
              {/* Skills Card */}
              <Box
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                overflow="hidden"
                shadow="sm"
                p={6}
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading as="h3" size="md">
                    Skills
                  </Heading>
                  
                  {isEditing && (
                    <HStack>
                      <Input
                        placeholder="Add skill"
                        size="sm"
                        value={profileData.newSkill}
                        name="newSkill"
                        onChange={handleChange}
                      />
                      <IconButton
                        icon={<FaPlus />}
                        size="sm"
                        aria-label="Add skill"
                        onClick={handleAddSkill}
                      />
                    </HStack>
                  )}
                </Flex>
                
                <Box>
                  {profileData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      m={1}
                      p={2}
                      borderRadius="md"
                      colorScheme="cyan"
                      variant="subtle"
                    >
                      {skill}
                      {isEditing && (
                        <IconButton
                          icon={<FaTimes />}
                          size="xs"
                          variant="ghost"
                          ml={1}
                          aria-label={`Remove ${skill}`}
                          onClick={() => handleRemoveSkill(skill)}
                        />
                      )}
                    </Badge>
                  ))}
                </Box>
              </Box>
            </VStack>
          </GridItem>
          
          {/* Main content */}
          <GridItem>
            <Tabs variant="enclosed" colorScheme="cyan">
              <TabList>
                <Tab>About</Tab>
                <Tab>Portfolio</Tab>
                <Tab>Reviews</Tab>
                <Tab>Settings</Tab>
              </TabList>
              
              <TabPanels>
                {/* About Tab */}
                <TabPanel>
                  <Box
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    shadow="sm"
                    p={6}
                  >
                    <Heading as="h3" size="md" mb={4}>
                      About Me
                    </Heading>
                    
                    {isEditing ? (
                      <FormControl isInvalid={errors.bio} mb={4}>
                        <Textarea
                          placeholder="Tell others about yourself..."
                          name="bio"
                          value={profileData.bio}
                          onChange={handleChange}
                          rows={6}
                        />
                      </FormControl>
                    ) : (
                      <Text mb={6}>
                        {profileData.bio || 'No bio available. Click Edit to add your bio.'}
                      </Text>
                    )}
                    
                    <Divider my={6} />
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <FormControl isInvalid={errors.fullName}>
                        <FormLabel>Full Name</FormLabel>
                        {isEditing ? (
                          <Input
                            name="fullName"
                            value={profileData.fullName}
                            onChange={handleChange}
                          />
                        ) : (
                          <Text>{profileData.fullName || 'Not specified'}</Text>
                        )}
                        {errors.fullName && (
                          <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                        )}
                      </FormControl>
                      
                      <FormControl isInvalid={errors.location}>
                        <FormLabel>Location</FormLabel>
                        {isEditing ? (
                          <Input
                            name="location"
                            value={profileData.location}
                            onChange={handleChange}
                            placeholder="City, Country"
                          />
                        ) : (
                          <Text>{profileData.location || 'Not specified'}</Text>
                        )}
                      </FormControl>
                      
                      <FormControl isInvalid={errors.website}>
                        <FormLabel>Website</FormLabel>
                        {isEditing ? (
                          <Input
                            name="website"
                            value={profileData.website}
                            onChange={handleChange}
                            placeholder="https://yourwebsite.com"
                          />
                        ) : (
                          <Text>
                            {profileData.website ? (
                              <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                                {profileData.website}
                              </a>
                            ) : (
                              'Not specified'
                            )}
                          </Text>
                        )}
                      </FormControl>
                      
                      <FormControl isInvalid={errors.hourlyRate}>
                        <FormLabel>Hourly Rate (USD)</FormLabel>
                        {isEditing ? (
                          <Input
                            name="hourlyRate"
                            value={profileData.hourlyRate}
                            onChange={handleChange}
                            placeholder="e.g. 50"
                          />
                        ) : (
                          <Text>{profileData.hourlyRate ? `$${profileData.hourlyRate}/hr` : 'Not specified'}</Text>
                        )}
                        {errors.hourlyRate && (
                          <FormErrorMessage>{errors.hourlyRate}</FormErrorMessage>
                        )}
                      </FormControl>
                    </SimpleGrid>
                  </Box>
                </TabPanel>
                
                {/* Portfolio Tab */}
                <TabPanel>
                  <Box
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    shadow="sm"
                    p={6}
                  >
                    <Flex justify="space-between" align="center" mb={4}>
                      <Heading as="h3" size="md">
                        Portfolio
                      </Heading>
                      
                      <Button size="sm" colorScheme="cyan" leftIcon={<FaPlus />}>
                        Add Project
                      </Button>
                    </Flex>
                    
                    <VStack spacing={6} align="stretch">
                      {projects.map(project => (
                        <Box
                          key={project.id}
                          borderWidth="1px"
                          borderColor={borderColor}
                          borderRadius="md"
                          p={4}
                        >
                          <Flex justify="space-between" align="flex-start">
                            <Box>
                              <Heading as="h4" size="md" mb={2}>
                                {project.title}
                              </Heading>
                              <Text mb={3}>
                                {project.description}
                              </Text>
                              <HStack spacing={2}>
                                {project.tags.map((tag, idx) => (
                                  <Badge key={idx} colorScheme="cyan">
                                    {tag}
                                  </Badge>
                                ))}
                              </HStack>
                            </Box>
                            <HStack color="yellow.400">
                              <Text fontWeight="bold">{project.rating}</Text>
                              <FaStar />
                            </HStack>
                          </Flex>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </TabPanel>
                
                {/* Reviews Tab */}
                <TabPanel>
                  <Box
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    shadow="sm"
                    p={6}
                  >
                    <Heading as="h3" size="md" mb={4}>
                      Reviews
                    </Heading>
                    
                    <Text color="gray.600" textAlign="center" py={10}>
                      No reviews yet. Complete gigs to receive client reviews.
                    </Text>
                  </Box>
                </TabPanel>
                
                {/* Settings Tab */}
                <TabPanel>
                  <Box
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    shadow="sm"
                    p={6}
                  >
                    <Heading as="h3" size="md" mb={4}>
                      Account Settings
                    </Heading>
                    
                    <SimpleGrid columns={1} spacing={6}>
                      <FormControl>
                        <FormLabel>Email Address</FormLabel>
                        <Input value={user?.email} isReadOnly />
                        <Text fontSize="sm" color="gray.500" mt={1}>
                          Email cannot be changed
                        </Text>
                      </FormControl>
                      
                      <Button colorScheme="cyan" width="fit-content">
                        Change Password
                      </Button>
                      
                      <Divider />
                      
                      <Button colorScheme="red" variant="outline" width="fit-content">
                        Delete Account
                      </Button>
                    </SimpleGrid>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile; 