import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ElectionCreationPage from './CreateElection';
import AdminDashboard from './AdminDashboard';

function AdminDashboardContainer() {
  const [election, setElection] = useState({});

  useEffect(() => {
    async function getActiveElection() {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/active');
        setElection(response.data);
      } catch (error) {
        console.error('Error getting active election:', error);
      }
    }
    getActiveElection();
  }, []);

  if (!election) {
    return <ElectionCreationPage />;
  }

  return <AdminDashboard />;
}

export default AdminDashboardContainer;