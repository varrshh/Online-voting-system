import React from 'react';
import styled from 'styled-components';

const HomePageContainer = styled.div`
  margin: 50px auto;
  max-width: 1200px;
  padding: 20px;
  text-align: center;
  background-image: linear-gradient(to bottom, #1a1a2e, #16213e);
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: bold;
`;

const Subheader = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: normal;
`;

const ButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
`;

const RegisterButton = styled.button`
  padding: 20px;
  margin: 20px auto;
  background-color: #4CAF50;
  color: white;
  font-size: 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #3e8e41;
  }
`;

const AdminLoginButton = styled.button`
  padding: 20px;
  margin: 20px auto;
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

function HomePage() {
  return (
    <HomePageContainer>
      <Header>Welcome to Online Voting System</Header>
      <Subheader>Secure, Transparent, and Efficient Voting</Subheader>
      <p>
        Our online voting system is designed to provide a secure, transparent, and efficient way to conduct elections. With our system, voters can cast their votes from anywhere, at any time, using their mobile devices or computers.
      </p>
      <p>
        Our system uses advanced security measures to ensure the integrity of the voting process. We use end-to-end encryption to protect the votes and ensure that they are counted accurately.
      </p>
      <ButtonContainer>
        <RegisterButton onClick={() => window.location.href = '/register'}>Register to Vote</RegisterButton>
        <RegisterButton onClick={() => window.location.href = '/login'}> Login to dashboard </RegisterButton>
        <AdminLoginButton onClick={() => window.location.href = '/admin/login'}>Admin Login</AdminLoginButton>
      </ButtonContainer>
    </HomePageContainer>
  );
}

export default HomePage;