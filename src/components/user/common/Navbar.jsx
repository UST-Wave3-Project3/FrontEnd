import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onProfileClick }) => {
    const location = useLocation();

    return (
        <div className="navbar">
            <div className="user-profile" onClick={onProfileClick}>
                <div className="avatar"></div>
                <div className="user-details">
                    <div className="user-name">John Doe</div>
                    <div className="user-role">USER</div>
                    <div className="user-email">john.doe@example.com</div>
                </div>
            </div>
            <nav className="nav-links">
                <Link 
                    to="/dashboard" 
                    className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                    Dashboard
                </Link>
                <Link 
                    to="/parking" 
                    className={`nav-item ${location.pathname === '/parking' ? 'active' : ''}`}
                >
                    Parking
                </Link>
                <Link 
                    to="/workspace" 
                    className={`nav-item ${location.pathname === '/workspace' ? 'active' : ''}`}
                >
                    Workspace
                </Link>
                <Link 
                    to="/venue" 
                    className={`nav-item ${location.pathname === '/venue' ? 'active' : ''}`}
                >
                    Venue
                </Link>
            </nav>
        </div>
    );
};

export default Navbar; 