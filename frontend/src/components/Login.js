import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import OtpVerification from './OtpVerification';

const LoginContainer = styled.div`
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

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', data.token); // Store JWT token
      setOtpSent(true);
      setUserId(data.userId); // Store the user ID for OTP verification
     

    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid username or password. Try again.');
    }
  };

  // Show OTP form after login success
  if (otpSent) {
    return <OtpVerification userId={userId} />;  // Show OTP verification component
  }


  return  (
     
     
    <LoginContainer>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </form>
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </LoginContainer>
  );
}

export default Login;
