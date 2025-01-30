// AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './AdminPage.css';

const AdminPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showUserCard, setShowUserCard] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const navigate = useNavigate();
    
    const email = localStorage.getItem('email');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    // Dashboard data
    const dashboardData = {
        employees: 1500,
        parkingSlots: 1000,
        workspaces: 1000,
        venues: 20,
        feedback: 100,
        parkingOccupied: 500,
        workspaceOccupied: 600,
        venueOccupied: 20,
        feedbackResolved: 30
    };

    const userDetails = {
        name: "Joy Smith",
        age: 32,
        phone: "+1 234 567 8900",
        id: "AD123456",
        role: roles[0]
    };

    // Theme handling
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Navigation handlers
    const handleLogout = () => {
        localStorage.clear();
        showNotificationMessage('Successfully logged out');
        navigate('/', { replace: true });
    };

    const handleNavigation = (path) => {
        navigate(`/admin/${path}`);
    };

    // Notification handler
    const showNotificationMessage = (message) => {
        setNotificationMessage(message);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    // Navigation items
    const navItems = [
        { icon: '👤', label: 'Dashboard', path: '' },
        { icon: '👥', label: 'Employees', path: 'employees' },
        { icon: '🚗', label: 'Parking', path: 'parking' },
        { icon: '🏢', label: 'Workspace', path: 'workspace' },
        { icon: '📍', label: 'Venue', path: 'venue' }
    ];

    // Chart data
    const chartData = [
        { name: 'Occupied', value: dashboardData.parkingOccupied },
        { name: 'Unoccupied', value: dashboardData.parkingSlots - dashboardData.parkingOccupied }
    ];

    const COLORS = ['#22c55e', '#e5e7eb'];

    return (
        <div className="dashboard-container">
            {/* Theme Toggle */}
            <button 
                className="theme-toggle"
                onClick={() => setIsDarkMode(!isDarkMode)}
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <button 
                    className="sidebar-toggle"
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? '◀' : '▶'}
                </button>

                {/* Profile Section */}
                <div className="profile-section">
                    <div 
                        className="profile-image"
                        onClick={() => setShowUserCard(!showUserCard)}
                    >
                        <img src="/api/placeholder/64/64" alt="User" />
                    </div>
                    {isSidebarOpen && (
                        <div className="profile-info">
                            <p className="profile-email">{email}</p>
                            <p className="profile-role">{roles[0]}</p>
                        </div>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="nav-menu">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigation(item.path)}
                            className={`nav-item ${window.location.pathname === `/admin/${item.path}` ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {isSidebarOpen && <span className="nav-label">{item.label}</span>}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                {/* Header */}
                <header className="dashboard-header">
                    <h1>
                        <span className="header-icon">📊</span>
                        Dashboard Overview
                    </h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </header>

                {/* Dashboard Content */}
                <main className="dashboard-main">
                    {/* Quick Stats Bar */}
                    <div className="quick-stats-bar">
                        <div className="quick-stat">
                            <h4>Employees</h4>
                            <p>{dashboardData.employees}</p>
                        </div>
                        <div className="quick-stat">
                            <h4>Parking Slots</h4>
                            <p>{dashboardData.parkingSlots}</p>
                        </div>
                        <div className="quick-stat">
                            <h4>Workspaces</h4>
                            <p>{dashboardData.workspaces}</p>
                        </div>
                        <div className="quick-stat">
                            <h4>Venues</h4>
                            <p>{dashboardData.venues}</p>
                        </div>
                        <div className="quick-stat">
                            <h4>Feedback</h4>
                            <p>{dashboardData.feedback}</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card hover-effect">
                            <h3>Total Employees</h3>
                            <p>{dashboardData.employees}</p>
                        </div>
                        <div className="stat-card hover-effect">
                            <h3>Parking Slots</h3>
                            <p>{dashboardData.parkingSlots}</p>
                        </div>
                        <div className="stat-card hover-effect">
                            <h3>Workspaces</h3>
                            <p>{dashboardData.workspaces}</p>
                        </div>
                        <div className="stat-card hover-effect">
                            <h3>Venues</h3>
                            <p>{dashboardData.venues}</p>
                        </div>
                        <div className="stat-card hover-effect">
                            <h3>Feedback</h3>
                            <p>{dashboardData.feedback}</p>
                        </div>
                    </div>

                    {/* Detailed Stats */}
                    <div className="detailed-stats">
                        <div className="detail-card hover-effect">
                            <div className="percentage">50%</div>
                            <p>Occupied parking: {dashboardData.parkingOccupied}</p>
                            <p>Unoccupied parking: {dashboardData.parkingSlots - dashboardData.parkingOccupied}</p>
                            <div className="progress-bar">
                                <div 
                                    className="progress-bar-fill" 
                                    style={{ width: '50%' }}
                                ></div>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={50}
                                            fill="#22c55e"
                                            dataKey="value"
                                            animationBegin={0}
                                            animationDuration={1500}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="detail-card hover-effect">
                            <div className="percentage">60%</div>
                            <p>Occupied Workspace: {dashboardData.workspaceOccupied}</p>
                            <p>Unoccupied Workspace: {dashboardData.workspaces - dashboardData.workspaceOccupied}</p>
                            <div className="progress-bar">
                                <div 
                                    className="progress-bar-fill" 
                                    style={{ width: '60%' }}
                                ></div>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Occupied', value: dashboardData.workspaceOccupied },
                                                { name: 'Unoccupied', value: dashboardData.workspaces - dashboardData.workspaceOccupied }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={50}
                                            fill="#22c55e"
                                            dataKey="value"
                                            animationBegin={200}
                                            animationDuration={1500}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="detail-card hover-effect">
                            <div className="percentage">75%</div>
                            <p>Occupied Venue: {dashboardData.venueOccupied}</p>
                            <p>Unoccupied Venue: {dashboardData.venues - dashboardData.venueOccupied}</p>
                            <div className="progress-bar">
                                <div 
                                    className="progress-bar-fill" 
                                    style={{ width: '75%' }}
                                ></div>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Occupied', value: dashboardData.venueOccupied },
                                                { name: 'Unoccupied', value: dashboardData.venues - dashboardData.venueOccupied }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={50}
                                            fill="#22c55e"
                                            dataKey="value"
                                            animationBegin={400}
                                            animationDuration={1500}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="detail-card hover-effect">
                            <div className="percentage">30%</div>
                            <p>Feedback Received: {dashboardData.feedback}</p>
                            <p>Feedback Resolved: {dashboardData.feedbackResolved}</p>
                            <div className="progress-bar">
                                <div 
                                    className="progress-bar-fill" 
                                    style={{ width: '30%' }}
                                ></div>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Resolved', value: dashboardData.feedbackResolved },
                                                { name: 'Pending', value: dashboardData.feedback - dashboardData.feedbackResolved }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={50}
                                            fill="#22c55e"
                                            dataKey="value"
                                            animationBegin={600}
                                            animationDuration={1500}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* User Details Modal */}
            {showUserCard && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>User Details</h2>
                            <button 
                                onClick={() => setShowUserCard(false)}
                                className="close-button"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Name:</strong> {userDetails.name}</p>
                            <p><strong>Age:</strong> {userDetails.age}</p>
                            <p><strong>Phone:</strong> {userDetails.phone}</p>
                            <p><strong>ID:</strong> {userDetails.id}</p>
                            <p><strong>Role:</strong> {userDetails.role}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification */}
            {showNotification && (
                <div className="notification">
                    {notificationMessage}
                </div>
            )}
        </div>
    );
};

export default AdminPage;