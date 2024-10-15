import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ManageElectionsPageContainer = styled.div`
  margin: 50px auto;
  max-width: 1200px;
  padding: 20px;
`;

const Header = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  font-weight: bold;
`;

const ElectionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ElectionItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const ElectionName = styled.span`
  font-weight: bold;
`;

const ElectionDescription = styled.span`
  font-size: 14px;
  color: #666;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #1a1a2e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #16213e;
  }
`;

function ManageElectionsPage() {
  const [elections, setElections] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const fetchElections = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/elections', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setElections(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    fetchElections();
  }, [fetchElections, token]);

  return (
    <ManageElectionsPageContainer>
      <Header>Manage Elections</Header>
      <ElectionsList>
        {elections.map((election) => (
          <ElectionItem key={election.id}>
            <ElectionName>{election.name}</ElectionName>
            <ElectionDescription>{election.description}</ElectionDescription>
            <Button onClick={() => window.location.href = `/admin/elections/${election.id}`}>View</Button>
          </ElectionItem>
        ))}
      </ElectionsList>
    </ManageElectionsPageContainer>
  );
}

export default ManageElectionsPage;