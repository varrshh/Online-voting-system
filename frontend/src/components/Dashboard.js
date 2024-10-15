// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import styled from 'styled-components';
// // import { useNavigate } from 'react-router-dom';
// // Styled components
// const DashboardContainer = styled.div`
//   margin: 50px auto;
//   max-width: 1200px;
//   padding: 20px;
//   text-align: center;
// `;

// const VoteButton = styled.button`
//   padding: 20px;
//   margin: 20px auto;
//   background-color: #1a1a2e;
//   color: white;
//   font-size: 24px;
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;

//   &:hover {
//     background-color: #16213e;
//   }
// `;

// const Header = styled.h2`
//   font-size: 28px;
//   margin-bottom: 10px;
//   margin-top:-25px;
//   text-align:left;3
// `;


// const FlashcardContainer = styled.div`
//   display: flex;
//   justify-content: space-around;
//   margin-top: 40px;
// `;

// const Flashcard = styled.div`
//   width: 310px;
//   padding: 20px;
//   background-color: #f8f9fa;
//   border-radius: 8px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   text-align: center;
// `;

// const Button = styled.button`
//   width: 10%;
//   padding: 10px;
//   background-color: #1a1a2e;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;

//   &:hover {
//     background-color: #16213e;
//   }
// `;

// function Dashboard() {
//   const [totalVoters, setTotalVoters] = useState(0);
//   const [votesCast, setVotesCast] = useState(0);
//   const [resultsTime, setResultsTime] = useState('');
//   const [username, setUsername] = useState('');

//   useEffect(() => {
//     // Fetch the voting statistics from the backend
//     async function fetchVotingData() {
//       try {
//         const { data } = await axios.get('http://localhost:5000/api/votes/stats');
//         setTotalVoters(data.totalVoters);
//         setVotesCast(data.votesCast);
//         setResultsTime(data.resultsTime); // You need to ensure this endpoint returns the results time
//       } catch (error) {
//         console.error('Error fetching voting data:', error);
//       }
//     }

//     // Fetch the username from localStorage or an API
//     const storedUsername = localStorage.getItem('username'); // Replace with API call if needed
//     if (storedUsername) {
//       setUsername(storedUsername);
//     } else {
//       // If no username is found, fetch it from the API or use a default value
//       setUsername('Guest');
//     }

//     fetchVotingData();
//   }, []);

//   const percentageVotes = totalVoters > 0 ? (votesCast / totalVoters) * 100 : 0;
//   const handleLogout = () => {
//     // const navigate = useNavigate();
//     // Clear the token or any session data
//     localStorage.removeItem('token');  // If you are using token-based auth
//     localStorage.removeItem('username'); 
//     // Redirect to login page
//     window.location.href = '/register';
//   };
//   return (
//     <DashboardContainer>
//       <Header>Hi, {username}</Header> 
//       <VoteButton onClick={() => window.location.href = '/vote'}>Let's Vote</VoteButton>

//       <FlashcardContainer>
//         <Flashcard>
//           <h3>Total Voters</h3>
//           <p>{totalVoters}</p>
//         </Flashcard>

//         <Flashcard>
//           <h3>Votes Cast</h3>
//           <p>{votesCast}</p>
//         </Flashcard>

//         <Flashcard>
//           <h3>Percentage of Votes</h3>
//           <p>{percentageVotes.toFixed(2)}%</p>
//         </Flashcard>

//         <Flashcard>
//           <h3>Results Declaration</h3>
//           <p>{resultsTime}</p>
//         </Flashcard>
//       </FlashcardContainer>

//       <FlashcardContainer>
//         <Flashcard>
//           <h3>Rules & Regulations</h3>
//           <ul>
//             <li>Rule 1: Do not disclose your vote.</li>
//             <li>Rule 2: Ensure you are eligible to vote.</li>
//             <li>Rule 3: Vote once only.</li>
//             {/* Add more rules as necessary */}
//           </ul>
//         </Flashcard>
//       </FlashcardContainer>
// <br></br><br></br>
//       <Button onClick={handleLogout}>Logout</Button>
//     </DashboardContainer>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import styled from 'styled-components';
import moment from 'moment';
import TrendyResultMessage from './TrendyResultMessage'; 

const DashboardContainer = styled.div`
  margin: 50px auto;
  max-width: 1200px;
  padding: 20px;
`;

const VoteButton = styled.button`
  padding: 15px;
  margin: 20px auto;
  margin-left:530px;
  background-color: #1a1a2e;
  color: white;
  font-size: 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #16213e;
  }
`;



const FlashcardContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
`;

const Flashcard = styled.div`
  width: 310px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  
`;

const ResultsButton = styled.button`
  padding: 15px;
  margin: 20px auto;
  margin-left: 530px;
  background-color: #28a745;
  color: white;
  font-size: 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;



function Dashboard() {
  const [totalVoters, setTotalVoters] = useState(0);
  const [votesCast, setVotesCast] = useState(0);
  const [resultsTime, setResultsTime] = useState('');
  const [username, setUsername] = useState('');
  const [activeElection, setActiveElection] = useState(null);

  useEffect(() => {
    // Fetch the voting statistics from the backend
    async function fetchVotingData() {
      try {
        const { data } = await axios.get('http://localhost:5000/api/votes/stats');
        setTotalVoters(data.totalVoters);
        setVotesCast(data.votesCast);
        setResultsTime(data.activeElection.result_date); // You need to ensure this endpoint returns the results time4
        setActiveElection(data.activeElection);
      } catch (error) {
        console.error('Error fetching voting data:', error);
      }
    }

    // Fetch the username from localStorage or an API
    const storedUsername = localStorage.getItem('username'); // Replace with API call if needed
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // If no username is found, fetch it from the API or use a default value
      setUsername('Guest');
    }

    fetchVotingData();
  }, []);

  const percentageVotes = totalVoters > 0 ? (votesCast / totalVoters) * 100 : 0;
  const handleLogout = () => {
    // const navigate = useNavigate();
    // Clear the token or any session data
    localStorage.removeItem('token');  // If you are using token-based auth
    localStorage.removeItem('username'); 
    // Redirect to login page
    window.location.href = '/register';
  };

  

const getTimeLeft = () => {
  if (!activeElection) return 'No active election';
  const endDate = moment(activeElection.end_date);
  const now = moment();
  const timeLeft = endDate.diff(now);
  const days = moment.duration(timeLeft).days();
  const hours = moment.duration(timeLeft).hours();
  const minutes = moment.duration(timeLeft).minutes();
  const seconds = moment.duration(timeLeft).seconds();
  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};

const isResultTime = () => {
  if (!resultsTime || !moment(resultsTime).isValid()) return false; // Ensure valid resultsTime
  const currentTime = moment(); // Get current time
  const resultDateTime = moment(resultsTime); // Parse result date into moment
  return currentTime.isSameOrAfter(resultDateTime); // Check if current time is after or equal to result time
};


  return (
    <DashboardContainer>
      <Header username={username} handleLogout={handleLogout} />
      <VoteButton onClick={() => window.location.href = '/vote'}>Let's Vote</VoteButton>

      <FlashcardContainer>
        <Flashcard>
          <h3>Total Voters</h3>
          <p>{totalVoters}</p>
        </Flashcard>

        <Flashcard>
          <h3>Votes Cast</h3>
          <p>{votesCast}</p>
        </Flashcard>

        <Flashcard>
          <h3>Percentage of Votes</h3>
          <p>{percentageVotes.toFixed(2)}%</p>
        </Flashcard>

        <Flashcard>
        <p>{getTimeLeft()}</p>
        

        </Flashcard>
      </FlashcardContainer>
      {isResultTime() ? (
  <ResultsButton onClick={() => window.location.href = '/results'}>View Results</ResultsButton>
) : (
  <TrendyResultMessage resultsTime={resultsTime} /> // Show trendy message
)}

<FlashcardContainer> 
   
  <Flashcard>
    <h3 style={{ textAlign: "center" }}>Rules & Regulations</h3>
    <ul style={{ textAlign: "left" }}>
      <li>Rule 1: Vote once only.</li>
      <li>Rule 2: Do not disclose your vote.</li>
      <li>Rule 3: Ensure you are eligible to vote.</li>
      {/* Add more rules as necessary */}
    </ul>
  </Flashcard>
</FlashcardContainer>

<br></br><br></br>
    </DashboardContainer>
  );
}

export default Dashboard;
