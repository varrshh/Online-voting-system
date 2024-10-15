// import React, { useState } from 'react';
// import axios from 'axios';

// // Simple encryption function (replace with actual encryption algorithm)
// const encryptVote = (candidate) => {
//     return btoa(candidate);  // Base64 encryption for simplicity
// };

// function VotingPage() {
//     const [encrypted_vote, setCandidate] = useState('');
//     const [image, setImage] = useState(null);
//     const [message, setMessage] = useState('');

//     const handleVoteSubmit = async (e) => {
//         e.preventDefault();

//         if (!encrypted_vote || !image) {
//             setMessage('Please select a candidate and upload an image.');
//             return;
//         }

//         // Automatically encrypt the selected candidate
//         const encryptedVote = encryptVote(encrypted_vote);

//         const formData = new FormData();
        
//         formData.append('encrypted_vote', encryptedVote);  // Encrypted vote (candidate)
//         formData.append('image', image);  // Image file for steganography

//         try {
//             const response = await axios.post('http://localhost:5000/api/votes/vote', formData,{
//               headers: {
//                 'Content-Type': 'multipart/form-data',  // Ensure multipart is used
//             },
//             });
//             setMessage(response.data);
//         } catch (error) {
//             setMessage(error.response ? error.response.data : 'Error submitting vote.');
//         }
//     };

//     return (
//         <div>
//             <h2>Vote Now</h2>
//             <form onSubmit={handleVoteSubmit}>
//                 <div>
//                     <label>Select Candidate:</label>
//                     <select 
//                         value={encrypted_vote} 
//                         onChange={(e) => setCandidate(e.target.value)} 
//                         required
//                     >
//                         <option value="">-- Select a Candidate --</option>
//                         <option value="Candidate1">Candidate 1</option>
//                         <option value="Candidate2">Candidate 2</option>
//                         <option value="Candidate3">Candidate 3</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label>Upload Steganography Image:</label>
//                     <input 
//                       type="file" 
//                       accept="image/*" 
//                       onChange={(e) => setImage(e.target.files[0])}  // Handle file selection
//                       required 
//                     />

//                 </div>
//                 <button type="submit">Submit Vote</button>
//             </form>
//             {message && <p>{message}</p>}
//         </div>
//     );
// }

// export default VotingPage;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const VotingPage = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [selectedCandidate, setSelectedCandidate] = useState('');
//   const [voteImage, setVoteImage] = useState(null);

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       const response = await axios.get('http://localhost:5000/api/votes/candidates');
//       setCandidates(response.data);
//     };
//     fetchCandidates();
//   }, []);

//   const handleSubmitVote = async (e) => {
//     e.preventDefault();
  
//     const formData = new FormData();
//     formData.append('stegoImage', voteImage);
//     formData.append('candidateId', selectedCandidate);
  
//     try {
//       const response = await axios.post('http://localhost:5000/api/votes/vote', formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token
//         }
//       });
//       alert(response.data.message);
//     } catch (error) {
//       if (error.response.status === 403) {
//         alert('Invalid token or unauthorized access');
//       } else {
//         console.error('Error submitting vote', error);
//         alert('Error submitting vote');
//       }
//     }
//   };

//   return (
//     <div>
//       <h1>Vote for a Candidate</h1>
//       <form onSubmit={handleSubmitVote}>
//         <select onChange={(e) => setSelectedCandidate(e.target.value)} value={selectedCandidate}>
//           <option value="">Select a candidate</option>
//           {candidates.map((candidate) => (
//             <option key={candidate.id} value={candidate.id}>
//               {candidate.cname} - {candidate.party}
//             </option>
//           ))}
//         </select>
//         <br />
//         <input type="file" name="stegoImage" onChange={(e) => setVoteImage(e.target.files[0])} />
//         <br />
//         <button type="submit">Submit Vote</button>
//       </form>
//     </div>
//   );
// };

// export default VotingPage;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import styled from 'styled-components';

// const VoteContainer = styled.div`
//   margin: 100px auto;
//   max-width: 400px;
//   background-color: #f8f9fa;
//   padding: 30px;
//   border-radius: 8px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
// `;

// const Input = styled.input`
//   display: block;
//   width: 100%;
//   padding: 10px;
//   margin: 10px 0;
//   border-radius: 4px;
//   border: 1px solid #ddd;
// `;


// const Button = styled.button`
//   width: 100%;
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

// const Select = styled.select`
//   display: block;
//   width: 100%;
//   padding: 10px;
//   margin: 10px 0;
//   border-radius: 4px;
//   border: 1px solid #ddd;
// `;


// const VotingPage = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [selectedCandidate, setSelectedCandidate] = useState('');
//   const [voteImage, setVoteImage] = useState(null);
//   const [voterId, setVoterId] = useState(''); // Store voter ID (this can come from the login info)

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       const response = await axios.get('http://localhost:5000/api/votes/candidates');
//       setCandidates(response.data);
//     };
//     fetchCandidates();

//     // Assuming voter ID is stored in localStorage or can be retrieved from auth token
//     const storedVoterId = localStorage.getItem('voterId'); // Example
//     setVoterId(storedVoterId);
//   }, []);

//   const handleSubmitVote = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('stegoImage', voteImage);
//     formData.append('candidateId', selectedCandidate);
//     formData.append('voterId', voterId); // Send voterId to the backend

//     try {
//       const response = await axios.post('http://localhost:5000/api/votes/vote', formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token
//         },
//       });
//       alert(response.data.message);
//     } catch (error) {
//       if (error.response && error.response.status === 403) {
//         alert('Invalid token or unauthorized access');
//       } else {
//         console.error('Error submitting vote', error);
//         alert('Error submitting vote');
//       }
//     }
//   };

//   return (
//     <VoteContainer>
//     <div>
//       <h1>Vote for a Candidate</h1>
//       <form onSubmit={handleSubmitVote}>
//         <Select onChange={(e) => setSelectedCandidate(e.target.value)} value={selectedCandidate}>
//           <option value="">Select a candidate</option>
//           {candidates.map((candidate) => (
//             <option key={candidate.id} value={candidate.id}>
//               {candidate.cname} - {candidate.party}
//             </option>
//           ))}
//         </Select>
//         <br />
//         <Input type="file" name="stegoImage" onChange={(e) => setVoteImage(e.target.files[0])} />
//         <br />
//         <Button type="submit">Submit Vote</Button>
//       </form>
//     </div>
//     </VoteContainer>
//   );
// };

// export default VotingPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from './Header';

const VoteContainer = styled.div`
  margin: 100px auto;
  max-width: 400px;
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

const Select = styled.select`
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
`;


const VotingPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [voteImage, setVoteImage] = useState(null);
  const [voterId, setVoterId] = useState(''); // Store voter ID (this can come from the login info)
  const [username, setUsername] = useState('');
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      const response = await axios.get('http://localhost:5000/api/votes/candidates');
      setCandidates(response.data);
    };
    fetchCandidates();

    const fetchElections = async () => {
      const response = await axios.get('http://localhost:5000/api/votes/elections');
      setElections(response.data);
    };
    fetchElections();

    // Assuming voter ID is stored in localStorage or can be retrieved from auth token
    const storedVoterId = localStorage.getItem('voterId'); // Example
    setVoterId(storedVoterId);

    // Fetch the username from localStorage or an API
    const storedUsername = localStorage.getItem('username'); // Replace with API call if needed
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // If no username is found, fetch it from the API or use a default value
      setUsername('Guest');
    }
  }, []);
  

  const handleSubmitVote = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('stegoImage', voteImage);
    formData.append('candidateId', selectedCandidate);
    formData.append('voterId', voterId); // Send voterId to the backend
    formData.append('electionId', selectedElection);

    try {
      const response = await axios.post('http://localhost:5000/api/votes/vote', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token
        },
      });
      alert(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert('Invalid token or unauthorized access');
      } else {
        console.error('Error submitting vote', error);
        alert('Error submitting vote');
      }
    }
  };

  const handleLogout = () => {
    // Clear the token or any session data
    localStorage.removeItem('token');  // If you are using token-based auth
    localStorage.removeItem('username'); 
    localStorage.removeItem('voterId'); 
    // Redirect to login page
    window.location.href = '/register';
  };

  return (
    <VoteContainer>
      <Header username={username} handleLogout={handleLogout} />
      <div>
        <h1>Vote for a Candidate</h1>
        <form onSubmit={handleSubmitVote}>
        <Select onChange={(e) => setSelectedElection(e.target.value)} value={selectedElection}>
            <option value="">Select an election</option>
            {elections.map((election) => (
              <option key={election.id} value={election.id}>
                {election.id}
              </option>
            ))}
          </Select>
          <br />
          <Select onChange={(e) => setSelectedCandidate(e.target.value)} value={selectedCandidate}>
            <option value="">Select a candidate</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.cname} - {candidate.party}
              </option>
            ))}
          </Select>
          <br />
          <Input type="file" name="stegoImage" onChange={(e) => setVoteImage(e.target.files[0])} />
          <br />
          <Button type="submit">Submit Vote</Button>
        </form>
      </div>
    </VoteContainer>
  );
};

export default VotingPage;
