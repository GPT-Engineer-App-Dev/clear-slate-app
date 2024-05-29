import React, { useState, useEffect } from 'react';
import { Container, Heading, VStack, Button, Input, Textarea, Box, Text, HStack, Select } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent, useVenues } from '../integrations/supabase';

const EventPage = () => {
  const { data: events, isLoading, isError } = useEvents();
  const { data: venues, isLoading: venuesLoading, isError: venuesError } = useVenues();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [newEvent, setNewEvent] = useState({ name: '', date: '', description: '', venue_id: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      const formattedDate = new Date(value).toISOString().split('T')[0];
      setNewEvent({ ...newEvent, [name]: formattedDate });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  const handleAddEvent = () => {
    addEvent.mutate(newEvent);
    setNewEvent({ name: '', date: '', description: '', venue_id: '' });
  };

  const handleUpdateEvent = (event) => {
    updateEvent.mutate(event);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id) => {
    deleteEvent.mutate(id);
  };

  if (isLoading || venuesLoading) return <Text>Loading...</Text>;
  if (isError || venuesError) return <Text>Error loading events or venues</Text>;

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
          type="date"
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
        <Select
          placeholder="Select Venue"
          name="venue_id"
          value={newEvent.venue_id}
          onChange={handleInputChange}
        >
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>{venue.name}</option>
          ))}
        </Select>
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
                  type="date"
                  placeholder="Event Date"
                  name="date"
                  value={editingEvent.date}
                  onChange={(e) => {
                    const formattedDate = new Date(e.target.value).toISOString().split('T')[0];
                    setEditingEvent({ ...editingEvent, date: formattedDate });
                  }}
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
                <Text>{new Date(event.date).toLocaleDateString()}</Text>
                <Text>{event.description}</Text>
                <HStack spacing={2} mt={2}>
                  <Button onClick={() => setEditingEvent(event)}>Edit</Button>
                  <Button colorScheme="red" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                  <Button as={Link} to={`/events/${event.id}`}>View Details</Button>
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