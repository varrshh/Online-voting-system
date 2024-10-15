import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }

  th {
    background-color: #4CAF50;
    color: white;
  }
`;

const WinnerCard = styled.div`
  background-color: #f9f9f9;
  border: 2px solid #4CAF50;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const WinnerTitle = styled.h2`
  color: #4CAF50;
`;

const WinnerInfo = styled.p`
  font-size: 18px;
  margin: 5px 0;
`;

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [voteCounts, setVoteCounts] = useState({});
  const [winner, setWinner] = useState(null); // To store the winning candidate

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/votes/tallyVotes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token
          },
        });
        
        setResults(response.data.results);
        setVoteCounts(response.data.voteCounts);

        // Calculate the winner after setting results
        calculateWinner(response.data.results, response.data.voteCounts);
      } catch (error) {
        console.error('Error fetching results', error);
      }
    };

    fetchResults();
  }, []); // Only run on mount

  const calculateWinner = (results, voteCounts) => {
    const winningCandidate = results.reduce((prev, current) => {
      return (voteCounts[current.candidateId] || 0) > (voteCounts[prev.candidateId] || 0) ? current : prev;
    });
    setWinner(winningCandidate);
  };

  return (
    <Container>
      <Title>Election Results</Title>
      {winner && (
        <WinnerCard>
          <WinnerTitle>Winner</WinnerTitle>
          <WinnerInfo>Name: {winner.candidateName}</WinnerInfo>
          <WinnerInfo>Party: {winner.party}</WinnerInfo>
          <WinnerInfo>Votes: {voteCounts[winner.candidateId] || 0}</WinnerInfo>
        </WinnerCard>
      )}
      {results.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Candidate ID</th>
              <th>Candidate Name</th>
              <th>Party</th>
              <th>Vote Count</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result.candidateId}>
                <td>{result.candidateId}</td>
                <td>{result.candidateName}</td>
                <td>{result.party}</td>
                <td>{voteCounts[result.candidateId] || 0}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Loading results...</p>
      )}
    </Container>
  );
};

export default ResultsPage;
