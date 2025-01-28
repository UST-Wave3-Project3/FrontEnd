import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [userInfo, setUserInfo] = useState({
    userId: '',
    role: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if not authenticated
    }

    // Simulate fetching user details (replace with an actual API call)
    const fetchUserData = async () => {
      // Replace with your API call
      const userId = 'admin123'; // Example user ID
      const role = 'Admin'; // Example role
      setUserInfo({ userId, role });
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Admin Dashboard</h1>
      <p>
        Hello <strong>{userInfo.userId}</strong>! Your role is <strong>{userInfo.role}</strong>.
      </p>
    </div>
  );
};

export default AdminDashboard;
