import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import './Dashboard.css';

const Dashboard = () => {
    const [showUserCard, setShowUserCard] = useState(false);
    const [activeTab, setActiveTab] = useState('parking');
    const [bookings, setBookings] = useState({
        parking: [],
        workspace: [],
        venue: [],
        history: []
    });

    useEffect(() => {
        // Load bookings from localStorage
        const loadBookings = () => {
            const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
            
            // Sort bookings by timestamp (newest first)
            storedBookings.sort((a, b) => b.timestamp - a.timestamp);

            // Check if any bookings are past their end date/time
            const now = new Date();
            const updatedBookings = storedBookings.map(booking => {
                const bookingEndDate = new Date(`${booking.date} ${booking.endTime}`);
                if (bookingEndDate < now && booking.status === 'Active') {
                    return { ...booking, status: 'Completed' };
                }
                return booking;
            });

            // Save updated bookings back to localStorage
            localStorage.setItem('bookings', JSON.stringify(updatedBookings));

            // Separate bookings by type and status
            const categorizedBookings = {
                parking: updatedBookings.filter(booking => 
                    booking.type === 'Parking' && booking.status === 'Active'
                ),
                workspace: updatedBookings.filter(booking => 
                    booking.type === 'Workspace' && booking.status === 'Active'
                ),
                venue: updatedBookings.filter(booking => 
                    booking.type === 'Venue' && booking.status === 'Active'
                ),
                history: updatedBookings.filter(booking => 
                    booking.status === 'Completed' || booking.status === 'Cancelled'
                )
            };

            setBookings(categorizedBookings);
        };

        // Load bookings initially
        loadBookings();

        // Set up interval to check for completed bookings every minute
        const interval = setInterval(loadBookings, 60000);

        // Add event listener for storage changes
        window.addEventListener('storage', loadBookings);

        // Cleanup
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', loadBookings);
        };
    }, []);

    const handleProfileClick = () => {
        setShowUserCard(true);
    };

    const renderBookingTable = (bookings, type) => {
        if (bookings.length === 0) {
            return <p className="no-bookings">No {type} bookings found.</p>;
        }

        return (
            <div className="booking-table-container">
                <table className="booking-table">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>{type === 'venue' ? 'Venue Name' : `${type.charAt(0).toUpperCase() + type.slice(1)} Number`}</th>
                            <th>Building</th>
                            <th>Floor</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.bookingId}>
                                <td>{booking.bookingId}</td>
                                <td>{booking.parkingNumber || booking.workspaceNumber || booking.venueName}</td>
                                <td>{booking.building}</td>
                                <td>{booking.floor}</td>
                                <td>{booking.date}</td>
                                <td>{`${booking.startTime} - ${booking.endTime}`}</td>
                                <td>
                                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td>
                                    {booking.status === 'Active' && (
                                        <button
                                            className="cancel-button"
                                            onClick={() => handleCancelBooking(booking.bookingId)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderHistoryTable = () => {
        if (bookings.history.length === 0) {
            return <p className="no-bookings">No booking history found.</p>;
        }

        return (
            <div className="booking-table-container">
                <table className="booking-table">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Building</th>
                            <th>Floor</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.history.map((booking) => (
                            <tr key={booking.bookingId}>
                                <td>{booking.bookingId}</td>
                                <td>{booking.type}</td>
                                <td>{booking.parkingNumber || booking.workspaceNumber || booking.venueName}</td>
                                <td>{booking.building}</td>
                                <td>{booking.floor}</td>
                                <td>{booking.date}</td>
                                <td>{`${booking.startTime} - ${booking.endTime}`}</td>
                                <td>
                                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const handleCancelBooking = (bookingId) => {
        const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const updatedBookings = storedBookings.map(booking => {
            if (booking.bookingId === bookingId) {
                return { ...booking, status: 'Cancelled' };
            }
            return booking;
        });

        localStorage.setItem('bookings', JSON.stringify(updatedBookings));

        // Reload bookings
        const categorizedBookings = {
            parking: updatedBookings.filter(booking => 
                booking.type === 'Parking' && booking.status === 'Active'
            ),
            workspace: updatedBookings.filter(booking => 
                booking.type === 'Workspace' && booking.status === 'Active'
            ),
            venue: updatedBookings.filter(booking => 
                booking.type === 'Venue' && booking.status === 'Active'
            ),
            history: updatedBookings.filter(booking => 
                booking.status === 'Completed' || booking.status === 'Cancelled'
            )
        };

        setBookings(categorizedBookings);
    };

    return (
        <div className="app-container">
            <Navbar onProfileClick={handleProfileClick} />
            <div className="main-content">
                <div className="dashboard-container">
                    <h1>Dashboard</h1>
                    
                    <div className="booking-tabs">
                        <button 
                            className={`tab-button ${activeTab === 'parking' ? 'active' : ''}`}
                            onClick={() => setActiveTab('parking')}
                        >
                            Parking Bookings
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'workspace' ? 'active' : ''}`}
                            onClick={() => setActiveTab('workspace')}
                        >
                            Workspace Bookings
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'venue' ? 'active' : ''}`}
                            onClick={() => setActiveTab('venue')}
                        >
                            Venue Bookings
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            Booking History
                        </button>
                    </div>

                    <div className="booking-content">
                        {activeTab === 'parking' && renderBookingTable(bookings.parking, 'parking')}
                        {activeTab === 'workspace' && renderBookingTable(bookings.workspace, 'workspace')}
                        {activeTab === 'venue' && renderBookingTable(bookings.venue, 'venue')}
                        {activeTab === 'history' && renderHistoryTable()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 