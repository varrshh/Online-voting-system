import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import VotingPage from './components/VotingPage';
import ResultsPage from './components/ResultsPage';
import ConfirmationPage from './components/Confirmation';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import ViewResultsPage from './components/ViewResultsPage';
import CreateElection from './components/CreateElection';
import ManageElectionsPage from './components/ManageElectionPage';
import AdminDashboardContainer from './components/AdminDash';

// // Function to protect routes
// function PrivateRoute({ children }) {
//   const token = localStorage.getItem('token');
//   return token ? children : <Navigate to="/login" />;
// }

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage/>} />
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Protect the voting page */}
        <Route path="/vote" element={<VotingPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/results" element={<ResultsPage/>} /> 
        <Route path="/admin/login" element={<AdminLoginPage/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/create" element={<CreateElection/>} />
        <Route path="/admin/manage" element={<ManageElectionsPage/>} />
        <Route path="/admin/results" element={<ViewResultsPage/>} />
        <Route path="/admin/dash" element={<AdminDashboardContainer/>}/>

      </Routes>
    </Router>
  );
}

export default App;
