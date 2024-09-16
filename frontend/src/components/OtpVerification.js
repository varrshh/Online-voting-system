// OTP Input Form (React)
import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
const OtpContainer = styled.div`
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
function OtpVerification({ userId }) {
  const [otp, setOtp] = useState('');

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/auth/verify-otp', { userId, otp });
      localStorage.setItem('token', data.token);  // Save the token after successful OTP verification
      alert('Login successful!');
      window.location.href = '/vote';  // Redirect to dashboard
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP');
    }
  };

  return (
    <OtpContainer>
    <form onSubmit={handleOtpSubmit}>
      <label>Enter OTP:</label>
      <Input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <Button type="submit">Verify OTP</Button>
    </form>
    </OtpContainer>
  );
}

export default OtpVerification;
