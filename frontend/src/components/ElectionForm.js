// src/components/ElectionForm.js
import React, { useState } from 'react';
import axios from 'axios';
import styled from "styled-components";

const FormContainer = styled.div`
  margin: 20px 0;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
`;

const ElectionForm = ({ onCreateElection }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [resultDate, setResultDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const electionData = { startDate, endDate, resultDate };
    
    try {
      await axios.post('http://localhost:5000/api/elections/create', electionData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      onCreateElection(); // Refresh the state after creation
    } catch (error) {
      console.error("Error creating election:", error);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Start Date:</label>
          <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div>
          <label>End Date:</label>
          <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div>
          <label>Result Date:</label>
          <input type="datetime-local" value={resultDate} onChange={(e) => setResultDate(e.target.value)} required />
        </div>
        <Button type="submit">Create Election</Button>
      </form>
    </FormContainer>
  );
};

export default ElectionForm;
