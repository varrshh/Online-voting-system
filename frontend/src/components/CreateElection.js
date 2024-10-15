import React, { useState } from 'react';
import axios from 'axios';

function CreateElection() {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [resultDate, setResultDate] = useState('');
  const [resultTime, setResultTime] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/elections', {
        start_date: `${startDate} ${startTime}`,
        end_date: `${endDate} ${endTime}`,
        result_date: `${resultDate} ${resultTime}`,
      });
      console.log('Election created successfully:', response.data);
      // Redirect to dashboard
      window.location.href = '/admin/dashboard';
    } catch (error) {
      console.error('Error creating election:', error);
    }
  };

  return (
    <div>
      <h1>Create Election</h1>
      <form onSubmit={handleSubmit}>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
        <label>Start Time:</label>
        <input
          type="time"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
        />
        <br />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
        />
        <label>End Time:</label>
        <input
          type="time"
          value={endTime}
          onChange={(event) => setEndTime(event.target.value)}
        />
        <br />
        <label>Result Date:</label>
        <input
          type="date"
          value={resultDate}
          onChange={(event) => setResultDate(event.target.value)}
        />
        <label>Result Time:</label>
        <input
          type="time"
          value={resultTime}
          onChange={(event) => setResultTime(event.target.value)}
        />
        <br />
        <button type="submit">Create Election</button>
      </form>
    </div>
  );
}

export default CreateElection;