import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the login request to the backend
      const { data } = await axios.post('/api/auth/login', { username, password });

      // Store the JWT token in localStorage
      localStorage.setItem('token', data.token);

      // Navigate to the voting page after successful login
      navigate('/vote');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: Invalid username or password');
    }
  };

  return (
    <LoginContainer>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
    </LoginContainer>
  );
}

export default Login;
