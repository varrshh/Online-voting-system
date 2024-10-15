import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ViewResultsPageContainer = styled.div`
  margin: 50px auto;
  max-width: 1200px;
  padding: 20px;
`;

const Header = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  font-weight: bold;
`;

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ResultItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const ResultName = styled.span`
  font-weight: bold;
`;

const ResultVotes = styled.span`
  font-size: 14px;
  color: #666;
`;



function ViewResultsPage() {
  const [results, setResults] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const fetchResults = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/results', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults, token]);

  return (
    <ViewResultsPageContainer>
      <Header>View Results</Header>
      <ResultsList>
        {results.map((result) => (
          <ResultItem key={result.id}>
            <ResultName>{result.name}</ResultName>
            <ResultVotes>{result.votes}</ResultVotes>
          </ResultItem>
        ))}
      </ResultsList>
    </ViewResultsPageContainer>
  );
}

export default ViewResultsPage;