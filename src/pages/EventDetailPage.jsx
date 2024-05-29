import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Heading, VStack, Text, Box, Textarea, Button, HStack } from '@chakra-ui/react';
import { useEvent, useComments, useAddComment } from '../integrations/supabase';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const { data: event, isLoading: eventLoading, isError: eventError } = useEvent(eventId);
  const { data: comments, isLoading: commentsLoading, isError: commentsError } = useComments(eventId);
  const addComment = useAddComment();

  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    addComment.mutate({ content: newComment, event_id: eventId });
    setNewComment('');
  };

  if (eventLoading || commentsLoading) return <Text>Loading...</Text>;
  if (eventError || commentsError) return <Text>Error loading event or comments</Text>;

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="xl" mb={6}>{event.name}</Heading>
      <Text fontSize="lg" mb={4}>{new Date(event.date).toLocaleDateString()}</Text>
      <Text mb={8}>{event.description}</Text>
      <Heading as="h2" size="lg" mb={4}>Comments</Heading>
      <VStack spacing={4} mb={8}>
        {comments.map((comment) => (
          <Box key={comment.id} p={4} borderWidth="1px" borderRadius="md" w="100%">
            <Text>{comment.content}</Text>
            <Text fontSize="sm" color="gray.500">{new Date(comment.created_at).toLocaleString()}</Text>
          </Box>
        ))}
      </VStack>
      <Textarea
        placeholder="Add a comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button colorScheme="teal" mt={4} onClick={handleAddComment}>Add Comment</Button>
    </Container>
  );
};

export default EventDetailPage;