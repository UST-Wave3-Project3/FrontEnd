import React, { useState } from 'react';
import Navbar from '../common/Navbar';
import './Profile.css';

const Profile = () => {
    const [showUserCard, setShowUserCard] = useState(false);

    const handleProfileClick = () => {
        setShowUserCard(true);
    };

    return (
        <div className="app-container">
            <Navbar onProfileClick={handleProfileClick} />
            <div className="main-content">
                <div className="profile-container">
                    <h1>User Profile</h1>
                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="profile-avatar"></div>
                            <div className="profile-info">
                                <h2>John Doe</h2>
                                <p className="user-role">USER</p>
                                <p className="user-email">john.doe@example.com</p>
                            </div>
                        </div>
                        <div className="profile-details">
                            <div className="detail-item">
                                <strong>Employee ID:</strong>
                                <span>EMP123</span>
                            </div>
                            <div className="detail-item">
                                <strong>Department:</strong>
                                <span>Information Technology</span>
                            </div>
                            <div className="detail-item">
                                <strong>Location:</strong>
                                <span>Building A</span>
                            </div>
                            <div className="detail-item">
                                <strong>Contact:</strong>
                                <span>+1 234 567 8900</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 