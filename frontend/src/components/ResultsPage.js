import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components for layout
const ResultsContainer = styled.div`
  margin: 100px auto;
  max-width: 600px;
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ResultItem = styled.div`
  margin: 10px 0;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ddd;
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

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/votes/results');
        setResults(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <ResultsContainer>
      <h2>Election Results</h2>
      {loading ? (
        <Loader />
      ) : (
        results.map((result, index) => (
          <ResultItem key={index}>
            <p>Candidate: {result.candidate}</p>
            <p>Votes: {result.count}</p>
          </ResultItem>
        ))
      )}
    </ResultsContainer>
  );
}

export default ResultsPage;
