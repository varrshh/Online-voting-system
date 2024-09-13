import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const VotingContainer = styled.div`
  margin: 100px auto;
  max-width: 600px;
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #1a1a2e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #16213e;
  }
`;

function VotingPage() {
  const [vote, setVote] = useState('');
  const [imagePath, setImagePath] = useState('');

  const handleVote = async () => {
    const formData = new FormData();
    formData.append('vote', vote);
    formData.append('imagePath', imagePath);

    try {
      const { data } = await axios.post('/api/votes/submit', formData);
      console.log('Vote submitted:', data);
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  return (
    <VotingContainer>
      <h2>Cast Your Vote</h2>
      <Input 
        type="text" 
        placeholder="Your Vote" 
        value={vote} 
        onChange={(e) => setVote(e.target.value)} 
      />
      <Input 
        type="file" 
        onChange={(e) => setImagePath(e.target.files[0])} 
      />
      <Button onClick={handleVote}>Submit Vote</Button>
    </VotingContainer>
  );
}

export default VotingPage;
