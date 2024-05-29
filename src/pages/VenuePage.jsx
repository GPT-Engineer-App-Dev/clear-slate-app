import React, { useState } from 'react';
import { Container, Heading, VStack, Button, Input, Textarea, Box, Text, HStack } from '@chakra-ui/react';
import { useVenues, useAddVenue, useUpdateVenue, useDeleteVenue } from '../integrations/supabase';

const VenuePage = () => {
  const { data: fetchedVenues, isLoading, isError } = useVenues();
  const [venues, setVenues] = useState([]);
  const addVenue = useAddVenue();
  const updateVenue = useUpdateVenue();
  const deleteVenue = useDeleteVenue();

  useEffect(() => {
    if (fetchedVenues) {
      setVenues(fetchedVenues);
    }
  }, [fetchedVenues]);

  const [newVenue, setNewVenue] = useState({ name: '', location: '', description: '' });
  const [editingVenue, setEditingVenue] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVenue({ ...newVenue, [name]: value });
  };

  const handleAddVenue = () => {
    addVenue.mutate(newVenue);
    setNewVenue({ name: '', location: '', description: '' });
  };

  const handleUpdateVenue = (venue) => {
    updateVenue.mutate(venue);
    setEditingVenue(null);
  };

  const handleDeleteVenue = (id) => {
    deleteVenue.mutate(id);
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading venues</Text>;

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="xl" mb={6}>Venue Management</Heading>
      <VStack spacing={4} mb={8}>
        <Input
          placeholder="Venue Name"
          name="name"
          value={newVenue.name}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Venue Location"
          name="location"
          value={newVenue.location}
          onChange={handleInputChange}
        />
        <Textarea
          placeholder="Venue Description"
          name="description"
          value={newVenue.description}
          onChange={handleInputChange}
        />
        <Button colorScheme="teal" onClick={handleAddVenue}>Add Venue</Button>
      </VStack>
      <VStack spacing={4}>
        {venues.map((venue) => (
          <Box key={venue.id} p={4} borderWidth="1px" borderRadius="md" w="100%">
            {editingVenue?.id === venue.id ? (
              <>
                <Input
                  placeholder="Venue Name"
                  name="name"
                  value={editingVenue.name}
                  onChange={(e) => setEditingVenue({ ...editingVenue, name: e.target.value })}
                />
                <Input
                  placeholder="Venue Location"
                  name="location"
                  value={editingVenue.location}
                  onChange={(e) => setEditingVenue({ ...editingVenue, location: e.target.value })}
                />
                <Textarea
                  placeholder="Venue Description"
                  name="description"
                  value={editingVenue.description}
                  onChange={(e) => setEditingVenue({ ...editingVenue, description: e.target.value })}
                />
                <HStack spacing={2} mt={2}>
                  <Button colorScheme="teal" onClick={() => handleUpdateVenue(editingVenue)}>Save</Button>
                  <Button onClick={() => setEditingVenue(null)}>Cancel</Button>
                </HStack>
              </>
            ) : (
              <>
                <Heading as="h3" size="md">{venue.name}</Heading>
                <Text>{venue.location}</Text>
                <Text>{venue.description}</Text>
                <HStack spacing={2} mt={2}>
                  <Button onClick={() => setEditingVenue(venue)}>Edit</Button>
                  <Button colorScheme="red" onClick={() => handleDeleteVenue(venue.id)}>Delete</Button>
                </HStack>
              </>
            )}
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default VenuePage;