import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import styled from "styled-components";
import "chart.js/auto";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tallyResults, setTallyResults] = useState([]);
  const [loadingTally, setLoadingTally] = useState(false);
  const [errorTally, setErrorTally] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/votes/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Admin token
          },
        });
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load voting statistics");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const fetchTallyVotes = async () => {
    setLoadingTally(true);
    try {
      const response = await axios.get("http://localhost:5000/api/votes/tallyVotes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Admin token
        },
      });
      setTallyResults(response.data.results);
      setLoadingTally(false);
    } catch (error) {
      setErrorTally("Failed to load tally results");
      setLoadingTally(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const { totalVoters, votesCast, candidateVotes } = stats;

  // Data for Bar Chart
  const barChartData = {
    labels: candidateVotes.map((candidate) => `Candidate ${candidate.candidate_id}`),
    datasets: [
      {
        label: "Votes",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: candidateVotes.map((candidate) => candidate.vote_count),
      },
    ],
  };

  // Data for Pie Chart
  const pieChartData = {
    labels: candidateVotes.map((candidate) => `Candidate ${candidate.candidate_id}`),
    datasets: [
      {
        data: candidateVotes.map((candidate) => candidate.vote_count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF5733", "#33FF57"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF5733", "#33FF57"],
      },
    ],
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
          <Bar data={barChartData} options={{ maintainAspectRatio: false, responsive: true }} />
        </ChartWrapper>
      </ChartContainer>

      <ChartContainer>
        <h3>Live Voting Results (Percentage)</h3>
        <ChartWrapper>
          <Pie data={pieChartData} options={{ maintainAspectRatio: false, responsive: true }} />
        </ChartWrapper>
      </ChartContainer>

      <Button onClick={fetchTallyVotes}>
        {loadingTally ? "Loading Tally..." : "Fetch Tally Votes"}
      </Button>

      {errorTally && <div>{errorTally}</div>}

      {tallyResults.length > 0 && (
        <StyledTable>
          <thead>
            <tr>
              <th>Candidate ID</th>
              <th>Candidate Name</th>
              <th>Party</th>
              <th>Vote Count</th>
            </tr>
          </thead>
          <tbody>
            {tallyResults.map(result => (
              <tr key={result.candidateId}>
                <td>{result.candidateId}</td>
                <td>{result.candidateName}</td>
                <td>{result.party}</td>
                <td>{result.votes}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}
    </Container>
  );
};

export default AdminDashboard;
