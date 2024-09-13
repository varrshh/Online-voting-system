import React from 'react';
import styled from 'styled-components';

const ResultsContainer = styled.div`
  margin: 100px auto;
  max-width: 600px;
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

function ResultsPage() {
  return (
    <ResultsContainer>
      <h2>Voting Results</h2>
      <p>Results will be displayed here securely.</p>
    </ResultsContainer>
  );
}

export default ResultsPage;
