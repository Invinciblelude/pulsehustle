import React from 'react';
import { Box, Heading, Text, Button, VStack, Flex, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

/**
 * NotFound Component
 * 404 page to display when a route is not found
 */
const NotFound = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="calc(100vh - 80px)"
      px={4}
      py={10}
    >
      <VStack spacing={8} textAlign="center" maxW="600px">
        <Image
          src="/404.svg"
          fallbackSrc="https://via.placeholder.com/300x200?text=404+Not+Found"
          alt="404 Illustration"
          maxW="300px"
          mb={4}
        />
        
        <Heading size="2xl" color="gray.700">
          Oops! Page Not Found
        </Heading>
        
        <Text fontSize="lg" color="gray.500">
          The page you're looking for doesn't exist or has been moved. But don't worry,
          there are plenty of gigs and opportunities waiting for you!
        </Text>
        
        <Box pt={6}>
          <Button
            as={Link}
            to="/"
            colorScheme="cyan"
            size="lg"
            fontWeight="bold"
            px={8}
          >
            Return to Home
          </Button>
        </Box>
        
        <Text fontSize="sm" color="gray.400" mt={8}>
          Want to report this issue? <br />
          <Link to="/contact" style={{ color: "#0BC5EA", textDecoration: "underline" }}>
            Contact our support team
          </Link>
        </Text>
      </VStack>
    </Flex>
  );
};

export default NotFound; 