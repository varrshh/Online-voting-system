import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components for layout
const VoteContainer = styled.div`
  margin: 100px auto;
  max-width: 600px;
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Select = styled.select`
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
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

const Loader = styled.div`
  margin: 20px auto;
  width: 50px;
  height: 50px;
  border: 6px solid #ddd;
  border-top-color: #1a1a2e;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function VotingPage() {
  const [candidate, setCandidate] = useState('');  // Store the selected candidate
  const [file, setFile] = useState(null);         // Store the uploaded file
  const [loading, setLoading] = useState(false);  // Track loading state

  // Handle form submission
  const handleVote = async (e) => {
    e.preventDefault();

    if (!candidate || !file) {
      alert('Please select a candidate and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('candidate', candidate);  // Add the selected candidate to the form data
    formData.append('file', file);            // Add the uploaded file (steganography)

    setLoading(true);  // Set loading state to true

    try {
      const token = localStorage.getItem('token');  // Get the JWT token
      const response = await axios.post('/api/votes/submit', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);  // Set loading state to false
      alert('Vote submitted successfully!');
      console.log('Vote Response:', response.data);
    } catch (error) {
      setLoading(false);  // Set loading state to false
      console.error('Error submitting vote:', error);
      alert('Error submitting vote. Please try again.');
    }
  };

  return (
    <VoteContainer>
      <h2>Cast Your Vote</h2>
      <form onSubmit={handleVote}>
        <Select
          value={candidate}
          onChange={(e) => setCandidate(e.target.value)}
        >
          <option value="">Select a Candidate</option>
          <option value="Candidate A">Candidate A</option>
          <option value="Candidate B">Candidate B</option>
          <option value="Candidate C">Candidate C</option>
        </Select>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Button type="submit" disabled={loading}>Submit Vote</Button>
      </form>
      {loading && <Loader />}
    </VoteContainer>
  );
}

export default VotingPage;
