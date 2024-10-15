import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const AdminLoginPageContainer = styled.div`
  margin: 50px auto;
  max-width: 400px;
  padding: 20px;
  text-align: center;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  font-weight: bold;
`;

const Form = styled.form`
  margin-top: 40px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #1a1a2e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #16213e;
  }
`;

function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      window.location.href = '/admin/dash';
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <AdminLoginPageContainer>
      <Header>Admin Login</Header>
      <Form onSubmit={handleSubmit}>
        <Label>Username:</Label>
        <Input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Label>Password:</Label>
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit">Login</Button>
      </Form>
    </AdminLoginPageContainer>
  );
}

export default AdminLoginPage;