import React from 'react';
import './UserProfile.css';

const UserProfile = () => {
    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar"></div>
                    <h2>User Profile</h2>
                </div>
                
                <div className="profile-info">
                    <div className="info-group">
                        <label>Username</label>
                        <div>John Doe</div>
                    </div>
                    
                    <div className="info-group">
                        <label>Role</label>
                        <div>USER</div>
                    </div>
                    
                    <div className="info-group">
                        <label>Email</label>
                        <div>john.doe@example.com</div>
                    </div>
                    
                    <div className="info-group">
                        <label>Phone Number</label>
                        <div>+1 234 567 8900</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile; 