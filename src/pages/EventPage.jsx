import React, { useState } from 'react';
import { Container, Heading, VStack, Button, Input, Textarea, Box, Text, HStack } from '@chakra-ui/react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent } from '../integrations/supabase';

const EventPage = () => {
  const { data: events, isLoading, isError } = useEvents();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [newEvent, setNewEvent] = useState({ name: '', date: '', description: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = () => {
    addEvent.mutate(newEvent);
    setNewEvent({ name: '', date: '', description: '' });
  };

  const handleUpdateEvent = (event) => {
    updateEvent.mutate(event);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id) => {
    deleteEvent.mutate(id);
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading events</Text>;

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="xl" mb={6}>Event Management</Heading>
      <VStack spacing={4} mb={8}>
        <Input
          placeholder="Event Name"
          name="name"
          value={newEvent.name}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Event Date"
          name="date"
          value={newEvent.date}
          onChange={handleInputChange}
        />
        <Textarea
          placeholder="Event Description"
          name="description"
          value={newEvent.description}
          onChange={handleInputChange}
        />
        <Button colorScheme="teal" onClick={handleAddEvent}>Add Event</Button>
      </VStack>
      <VStack spacing={4}>
        {events.map((event) => (
          <Box key={event.id} p={4} borderWidth="1px" borderRadius="md" w="100%">
            {editingEvent?.id === event.id ? (
              <>
                <Input
                  placeholder="Event Name"
                  name="name"
                  value={editingEvent.name}
                  onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                />
                <Input
                  placeholder="Event Date"
                  name="date"
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                />
                <Textarea
                  placeholder="Event Description"
                  name="description"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                />
                <HStack spacing={2} mt={2}>
                  <Button colorScheme="teal" onClick={() => handleUpdateEvent(editingEvent)}>Save</Button>
                  <Button onClick={() => setEditingEvent(null)}>Cancel</Button>
                </HStack>
              </>
            ) : (
              <>
                <Heading as="h3" size="md">{event.name}</Heading>
                <Text>{event.date}</Text>
                <Text>{event.description}</Text>
                <HStack spacing={2} mt={2}>
                  <Button onClick={() => setEditingEvent(event)}>Edit</Button>
                  <Button colorScheme="red" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                </HStack>
              </>
            )}
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default EventPage;