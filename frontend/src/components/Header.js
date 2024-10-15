import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
`;

const Greetings = styled.h2`
  font-size: 24px;
  margin: 0;
`;

const LogoutButton = styled.button`
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

function Header({ username, handleLogout }) {
  return (
    <HeaderContainer>
      <Greetings>Hi, {username}</Greetings>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </HeaderContainer>
  );
}

export default Header;