import { Container, Text, VStack, Heading, Button } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import { FaPaintBrush } from "react-icons/fa";

const Index = () => {
  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Heading as="h1" size="2xl" mb={4}>Welcome to Your Blank Canvas</Heading>
        <Text fontSize="lg" textAlign="center">Start creating your masterpiece by interacting with the agent.</Text>
        <Button as={Link} to="/events" leftIcon={<FaPaintBrush />} colorScheme="teal" size="lg" mt={6}>
          Go to Event Page
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;