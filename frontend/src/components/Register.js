import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const RegisterContainer = styled.div`
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

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Added email state
  const [nationalId, setNationalId] = useState('');
  const handleRegister = async (e) => {
    e.preventDefault();
    // Log the input data before sending
  console.log({
    username,
    password,
    email,
    national_id: nationalId
  });
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        email,
        national_id: nationalId,
      });
      localStorage.setItem('token', data.token); // Store JWT token
      alert('Registration successful!');
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      alert(error.response.data.message || 'Registration failed. Please check the input.');
    }
  };

  return (
    <RegisterContainer>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <Input
          type="email"
          placeholder="Email"
          value={email} // Email input field
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="text"
          placeholder="National ID"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
        />
        <Button type="submit">Register</Button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </RegisterContainer>
  );
}

export default Register;
