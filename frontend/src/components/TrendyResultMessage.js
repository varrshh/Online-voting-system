import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

// Styled Container for the message
const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const MessageCard = styled.div`
  background: linear-gradient(135deg, #f39c12, #e74c3c);
  padding: 20px;
  padding-bottom: 185px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  color: white;
  font-family: 'Poppins', sans-serif;
  max-width: 600px;
  margin: 0 auto;
  animation: fadeIn 1s ease-in-out;
  height: 0px;
  margin-top: 39px;


  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const TimeText = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #fff;

  span {
    font-size: 22px;
    color: #ffeb3b; // Highlight the time in a trendy yellow
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  font-style: italic;
  color: #ecf0f1;
  margin-top: 10px;
`;

// Component to display the trendy result message
const TrendyResultMessage = ({ resultsTime }) => {
  return (
    
      <MessageCard>
        <h1>Hold Tight!</h1>
        <TimeText>
          Results will be available after <span>{moment(resultsTime).format('MMMM Do YYYY, h:mm:ss a')}</span>
        </TimeText>
        <Subtitle>Thank you for your patience. Please check back after the result time.</Subtitle>
      </MessageCard>
    
  );
};

export default TrendyResultMessage;
