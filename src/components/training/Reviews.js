import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Icon,
  Button,
  Divider
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

/**
 * ReviewCard Component
 * Displays a single review with user information and rating
 */
const ReviewCard = ({ review, colorMode }) => {
  const bgColor = colorMode === 'dark' ? 'gray.700' : 'white';
  const borderColor = colorMode === 'dark' ? 'gray.600' : 'gray.200';
  
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      bg={bgColor}
      shadow="sm"
      width="full"
    >
      <HStack spacing={4} align="start" mb={3}>
        <Avatar size="md" name={review.name} src={review.avatar} />
        <Box flex={1}>
          <Text fontWeight="bold">{review.name}</Text>
          <HStack spacing={1} mt={1}>
            {[...Array(5)].map((_, i) => (
              <Icon 
                key={i}
                as={FaStar} 
                color={i < review.rating ? "yellow.400" : "gray.300"} 
                w={4} 
                h={4}
              />
            ))}
            <Text ml={1} fontSize="sm" color="gray.500">
              {review.date}
            </Text>
          </HStack>
        </Box>
      </HStack>
      
      <Text fontSize="md">{review.content}</Text>
    </Box>
  );
};

/**
 * Reviews Component
 * Displays the reviews section of a training detail page
 */
const Reviews = ({ reviews = [], colorMode }) => {
  // If no reviews provided, use default sample data
  const displayReviews = reviews.length ? reviews : [
    {
      id: 1,
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      date: "June 12, 2023",
      content: "This training was exactly what I needed to advance my career. The instructor was knowledgeable and engaging. I would highly recommend this to anyone in the field."
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      date: "May 28, 2023",
      content: "Great content and well-structured sessions. I would have liked more hands-on exercises, but overall it was a valuable experience that has already helped me in my current role."
    }
  ];

  return (
    <Box pt={8} pb={10}>
      <Heading as="h3" size="lg" mb={6}>
        Reviews
      </Heading>
      
      <VStack spacing={4} align="stretch" mb={6}>
        {displayReviews.map(review => (
          <ReviewCard 
            key={review.id} 
            review={review} 
            colorMode={colorMode}
          />
        ))}
      </VStack>
      
      <Divider mb={6} />
      
      <Box textAlign="center">
        <Button colorScheme="cyan" variant="outline" size="lg">
          Load More Reviews
        </Button>
      </Box>
    </Box>
  );
};

export default Reviews; 