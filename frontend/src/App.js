import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import VotingPage from './components/VotingPage';
import ResultsPage from './components/ResultsPage';
import Header from './components/Header';

// Function to protect routes
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protect the voting page */}
        <Route path="/vote" element={<PrivateRoute><VotingPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
