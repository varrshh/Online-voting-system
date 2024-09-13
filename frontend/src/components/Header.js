import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #1a1a2e;
  padding: 20px;
  text-align: center;
  color: white;
  font-size: 24px;
`;

function Header() {
  return (
    <HeaderContainer>
      <h1>Secure Voting System</h1>
    </HeaderContainer>
  );
}

export default Header;
