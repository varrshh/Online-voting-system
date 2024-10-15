import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import "chart.js/auto";
import styled from "styled-components";

// Styled components
const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
  text-align: center;
  color: #333;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ChartContainer = styled.div`
  margin: 20px 0;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #4CAF50;
    color: white;
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  max-width: 600px;  // Set max width for charts
  margin: auto;       // Center charts
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 5px;
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [voteCounts, setVoteCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/votes/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Admin token
          },
        });
        setStats(response.data);
      } catch (error) {
        setError("Failed to load voting statistics");
      }
    };

    const fetchResults = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/votes/tallyVotes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Admin token
          },
        });
        setResults(response.data.results);
        setVoteCounts(response.data.voteCounts);
      } catch (error) {
        setError("Failed to load results");
      }
    };

    const fetchData = async () => {
      await fetchStats();
      await fetchResults();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const { totalVoters, votesCast } = stats;

  // Data for Bar Chart
  const barChartData = {
    labels: results.map((result) => `${result.candidateId} - ${result.candidateName}`),
    datasets: [
      {
        label: "Votes",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: results.map((result) => result.votes),
      },
    ],
  };

  // Data for Pie Chart
  const pieChartData = {
    labels: results.map((result) => `${result.candidateId} - ${result.candidateName}`),
    datasets: [
      {
        data: results.map((result) => result.votes),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF5733", "#33FF57"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF5733", "#33FF57"],
      },
    ],
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Header>Admin Dashboard</Header>

      <StatsContainer>
      <div>
        <h3>Total Votes Cast: {votesCast}</h3>
        <h3>Total Voters: {totalVoters}</h3>
        <h3>Percentage Voted: {((votesCast / totalVoters) * 100).toFixed(2)}%</h3>
      </div>
      </StatsContainer>

      <ChartContainer>
        <h3>Votes per Candidate</h3>
        <ChartWrapper>
          <Bar data={barChartData}  options={{ 
    responsive: true, 
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 45,
        },
      },
      y: {
        ticks: {
          stepSize: 1,  // Set the y-axis step size to 1
          callback: (value) => Number.isInteger(value) ? value : '', 
        },
        beginAtZero: true, // Ensure the y-axis starts at 0
        max: Math.ceil(votesCast * 1.1), // Set the maximum y-axis value slightly above total votes
      },
    },
  }}  />
        </ChartWrapper>
      </ChartContainer>

      <ChartContainer>
        <h3>Live Voting Results (Percentage)</h3>
        <ChartWrapper>
          <Pie data={pieChartData} options={{ maintainAspectRatio: false, responsive: true }} />
        </ChartWrapper>
      </ChartContainer>
      <StyledTable>
      <div>
        <h3>Election Results</h3>
        {results.length > 0 ? (
          <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'center' }}>
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
          </table>
        ) : (
          <p>No results available</p>
        )}
      </div>
      </StyledTable>
      <Button onClick={logout}>Logout</Button>
    </Container>
  );
};

export default AdminDashboard;



