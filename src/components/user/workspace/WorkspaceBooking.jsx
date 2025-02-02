import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../common/Navbar";
import "./WorkspaceBooking.css";

const BASE_URL = 'http://localhost:8080/api/workspace-bookings';

const WorkspaceBooking = () => {
    const navigate = useNavigate();
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [userBooking, setUserBooking] = useState(null);
    const [bookedWorkspace, setBookedWorkspace] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showWorkspaceLayout, setShowWorkspaceLayout] = useState(false);
    const [showUserCard, setShowUserCard] = useState(false);
    const [activeBooking, setActiveBooking] = useState(null);
    const [hasWhiteboard, setHasWhiteboard] = useState('');
    const [hasMonitor, setHasMonitor] = useState('');

    // Get today's date and max date (7 days from today)
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const maxDateString = maxDate.toISOString().split('T')[0];

    // Mock data for dropdowns
    const buildings = ['Building A', 'Building B', 'Building C'];
    const floors = ['Ground Floor', 'Floor 1', 'Floor 2', 'Floor 3'];

    // Function to generate booking ID
    const generateBookingId = () => {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `WB${timestamp}${random}`;
    };

    // Generate workspace slots based on building, floor, and amenities
    const generateWorkspaceSlots = (building, floor) => {
        return Array.from({ length: 20 }, (_, index) => {
            const buildingCode = building ? building.slice(-1) : 'X';
            const floorCode = floor ? floor.replace(/\D/g, '') : '0';
            const slotNumber = (index + 1).toString().padStart(2, '0');
            return {
                workspaceId: index + 1,
                workspaceNumber: `${buildingCode}${floorCode}-WS${slotNumber}`,
                workspaceAvailable: Math.random() > 0.5,
                building: building,
                floor: floor,
                hasWhiteboard: Math.random() > 0.5,
                hasMonitor: Math.random() > 0.5
            };
        });
    };

    const [mockWorkspaceSlots, setMockWorkspaceSlots] = useState(generateWorkspaceSlots(selectedBuilding, selectedFloor));

    useEffect(() => {
        // Check for active booking on component mount
        const checkActiveBooking = () => {
            const allBookings = JSON.parse(localStorage.getItem('bookings')) || [];
            const currentTime = new Date();
            
            // Find active workspace booking
            const activeWorkspace = allBookings.find(booking => {
                if (booking.type !== 'Workspace' || booking.status !== 'Active') return false;
                
                const bookingEndTime = new Date(`${booking.date} ${booking.endTime}`);
                return bookingEndTime > currentTime;
            });

            setActiveBooking(activeWorkspace || null);
        };

        checkActiveBooking();
        // Check every minute for booking status
        const interval = setInterval(checkActiveBooking, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleApplyFilters = () => {
        if (!bookingDate || !selectedBuilding || !selectedFloor || !startTime || !endTime || !hasWhiteboard || !hasMonitor) {
            setModalMessage('Please select all filters before applying');
            setShowModal(true);
            return;
        }

        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        if (start >= end) {
            setModalMessage('End time must be after start time');
            setShowModal(true);
            return;
        }

        // Generate initial workspace slots
        const filteredSlots = generateWorkspaceSlots(selectedBuilding, selectedFloor)
            .filter(slot => {
                // Filter based on whiteboard preference
                if (hasWhiteboard === 'yes' && !slot.hasWhiteboard) return false;
                if (hasWhiteboard === 'no' && slot.hasWhiteboard) return false;
                
                // Filter based on monitor preference
                if (hasMonitor === 'yes' && !slot.hasMonitor) return false;
                if (hasMonitor === 'no' && slot.hasMonitor) return false;
                
                return true;
            });

        setMockWorkspaceSlots(filteredSlots);
        setShowWorkspaceLayout(true);
    };

    const handleSlotClick = (slot) => {
        if (bookedWorkspace) {
            setModalMessage('You have already booked a workspace');
            setShowModal(true);
            return;
        }

        if (!slot.workspaceAvailable) {
            setModalMessage('This workspace is unavailable');
            setShowModal(true);
            return;
        }

        setSelectedSlot(slot);
        setShowConfirmModal(true);
    };

    const handleConfirmBooking = () => {
        const bookingId = `WS-${Math.random().toString(36).substr(2, 9)}`;
        const bookingData = {
            bookingId: bookingId,
            workspaceNumber: selectedSlot.workspaceNumber,
            building: selectedBuilding,
            floor: selectedFloor,
            date: bookingDate,
            startTime: startTime,
            endTime: endTime,
            status: "Active",
            type: "Workspace",
            hasWhiteboard: selectedSlot.hasWhiteboard,
            hasMonitor: selectedSlot.hasMonitor,
            timestamp: new Date().getTime()
        };

        // Get existing bookings or initialize empty array
        const existingBookings = JSON.parse(localStorage.getItem('bookings')) || [];
        
        // Add new booking
        existingBookings.push(bookingData);
        
        // Save back to localStorage
        localStorage.setItem('bookings', JSON.stringify(existingBookings));

        setUserBooking(bookingData);
        setActiveBooking(bookingData);
        setShowConfirmModal(false);
        setSelectedSlot(null);
        setShowWorkspaceLayout(false);
    };

    const handleProfileClick = () => {
        setShowUserCard(true);
    };

    const getSlotClassName = (slot) => {
        if (bookedWorkspace && slot.workspaceId === bookedWorkspace.workspaceId) {
            return 'workspace-slot booked';
        }
        return `workspace-slot ${slot.workspaceAvailable ? 'available' : 'occupied'}`;
    };

    // Helper function to chunk array into groups of 5
    const chunkArray = (arr, size) => {
        const chunkedArr = [];
        for (let i = 0; i < arr.length; i += size) {
            chunkedArr.push(arr.slice(i, i + size));
        }
        return chunkedArr;
    };

    const renderActiveBooking = () => {
        return (
            <div className="active-booking-container">
                <h2>Your Active Workspace Booking</h2>
                <div className="booking-details">
                    <div className="booking-info">
                        <p>
                            <strong>Booking ID</strong>
                            <span>{activeBooking.bookingId}</span>
                        </p>
                        <p>
                            <strong>Workspace Number</strong>
                            <span>{activeBooking.workspaceNumber}</span>
                        </p>
                        <p>
                            <strong>Building</strong>
                            <span>{activeBooking.building}</span>
                        </p>
                        <p>
                            <strong>Floor</strong>
                            <span>{activeBooking.floor}</span>
                        </p>
                        <p>
                            <strong>Date</strong>
                            <span>{activeBooking.date}</span>
                        </p>
                        <p>
                            <strong>Time</strong>
                            <span>{activeBooking.startTime} - {activeBooking.endTime}</span>
                        </p>
                        <p>
                            <strong>Amenities</strong>
                            <span>
                                {activeBooking.hasWhiteboard && '📋 Whiteboard '}
                                {activeBooking.hasMonitor && '🖥️ Monitor'}
                            </span>
                        </p>
                        <p>
                            <strong>Status</strong>
                            <span className={`status-badge ${activeBooking.status.toLowerCase()}`}>
                                {activeBooking.status}
                            </span>
                        </p>
                    </div>
                    <div className="booking-actions">
                        <button 
                            className="view-dashboard-btn"
                            onClick={() => navigate('/dashboard')}
                        >
                            View Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const getFilteredWorkspaces = () => {
        let filteredSpaces = mockWorkspaceSlots;

        // Filter by building
        if (selectedBuilding) {
            filteredSpaces = filteredSpaces.filter(
                workspace => workspace.building === selectedBuilding
            );
        }

        // Filter by floor
        if (selectedFloor) {
            filteredSpaces = filteredSpaces.filter(
                workspace => workspace.floor === selectedFloor
            );
        }

        // Filter by whiteboard
        if (hasWhiteboard === 'yes') {
            filteredSpaces = filteredSpaces.filter(
                workspace => workspace.hasWhiteboard
            );
        } else if (hasWhiteboard === 'no') {
            filteredSpaces = filteredSpaces.filter(
                workspace => !workspace.hasWhiteboard
            );
        }

        // Filter by monitor
        if (hasMonitor === 'yes') {
            filteredSpaces = filteredSpaces.filter(
                workspace => workspace.hasMonitor
            );
        } else if (hasMonitor === 'no') {
            filteredSpaces = filteredSpaces.filter(
                workspace => !workspace.hasMonitor
            );
        }

        // Filter out already booked workspaces for the selected date and time
        if (bookingDate && startTime && endTime) {
            const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            const selectedStartTime = new Date(`${bookingDate} ${startTime}`).getTime();
            const selectedEndTime = new Date(`${bookingDate} ${endTime}`).getTime();

            filteredSpaces = filteredSpaces.filter(workspace => {
                const existingBooking = bookings.find(booking => {
                    if (booking.type !== 'Workspace' || booking.status !== 'Active') return false;
                    if (booking.workspaceNumber !== workspace.workspaceNumber) return false;
                    
                    const bookingStartTime = new Date(`${booking.date} ${booking.startTime}`).getTime();
                    const bookingEndTime = new Date(`${booking.date} ${booking.endTime}`).getTime();

                    return !(selectedEndTime <= bookingStartTime || selectedStartTime >= bookingEndTime);
                });

                return !existingBooking;
            });
        }

        return filteredSpaces;
    };

    const renderWorkspaceLayout = () => {
        const filteredWorkspaces = getFilteredWorkspaces();

        if (filteredWorkspaces.length === 0) {
            return (
                <div className="no-workspaces">
                    <p>No workspaces available matching your criteria.</p>
                </div>
            );
        }

        return (
            <div className="workspace-grid">
                {filteredWorkspaces.map((workspace) => (
                    <div
                        key={workspace.workspaceNumber}
                        className={`workspace-slot ${selectedSlot?.workspaceNumber === workspace.workspaceNumber ? 'selected' : ''}`}
                        onClick={() => handleSlotClick(workspace)}
                    >
                        <div className="workspace-content">
                            <div className="workspace-number">{workspace.workspaceNumber}</div>
                            <div className="workspace-amenities">
                                {workspace.hasWhiteboard && <span title="Whiteboard">📋</span>}
                                {workspace.hasMonitor && <span title="Monitor">🖥️</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="app-container">
            <Navbar onProfileClick={handleProfileClick} />

            {/* User Details Card */}
            {showUserCard && (
                <>
                    <div className="user-details-backdrop" onClick={() => setShowUserCard(false)} />
                    <div className="user-details-card">
                        <div className="avatar"></div>
                        <label>Username</label>
                        <div className="user-name">John Doe</div>
                        
                        <label>Email</label>
                        <div className="user-email">john.doe@example.com</div>
                        
                        <label>Role</label>
                        <div className="user-role">USER</div>
                        
                        <label>Phone</label>
                        <div className="user-phone">+1 234 567 8900</div>
                    </div>
                </>
            )}

            {/* Main content */}
            <div className="main-content">
                <div className="workspace-container">
                    <h1>Workspace Booking System</h1>
                    
                    {activeBooking ? (
                        renderActiveBooking()
                    ) : userBooking ? (
                        <div className="booking-success">
                            <div className="success-icon">✓</div>
                            <h2>Booking Confirmed!</h2>
                            <div className="booking-details">
                                <h3>Your Booking Summary</h3>
                                <div className="booking-info">
                                    <p>
                                        <strong>Booking ID</strong>
                                        <span>{userBooking.bookingId}</span>
                                    </p>
                                    <p>
                                        <strong>Workspace Number</strong>
                                        <span>{userBooking.workspaceNumber}</span>
                                    </p>
                                    <p>
                                        <strong>Building</strong>
                                        <span>{userBooking.building}</span>
                                    </p>
                                    <p>
                                        <strong>Floor</strong>
                                        <span>{userBooking.floor}</span>
                                    </p>
                                    <p>
                                        <strong>Date</strong>
                                        <span>{userBooking.date}</span>
                                    </p>
                                    <p>
                                        <strong>Time</strong>
                                        <span>{userBooking.startTime} - {userBooking.endTime}</span>
                                    </p>
                                    <p>
                                        <strong>Amenities</strong>
                                        <span>
                                            {userBooking.hasWhiteboard && '📋 Whiteboard '}
                                            {userBooking.hasMonitor && '🖥️ Monitor'}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Status</strong>
                                        <span className={`status-badge ${userBooking.status.toLowerCase()}`}>
                                            {userBooking.status}
                                        </span>
                                    </p>
                                </div>
                                <div className="booking-actions">
                                    <button 
                                        className="view-dashboard-btn"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        View Dashboard
                                    </button>
                                    <button 
                                        className="new-booking-btn"
                                        onClick={() => {
                                            setUserBooking(null);
                                            setSelectedBuilding('');
                                            setSelectedFloor('');
                                            setBookingDate('');
                                            setStartTime('');
                                            setEndTime('');
                                            setHasWhiteboard('');
                                            setHasMonitor('');
                                        }}
                                    >
                                        New Booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Show filters only when there's no booking */}
                            <div className="filters-section">
                                <div className="filter-item">
                                    <label>Booking Date:</label>
                                    <input 
                                        type="date"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        min={today}
                                        max={maxDateString}
                                        required
                                    />
                                </div>

                                <div className="filter-item">
                                    <label>Building:</label>
                                    <select 
                                        value={selectedBuilding} 
                                        onChange={(e) => setSelectedBuilding(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Building</option>
                                        {buildings.map(building => (
                                            <option key={building} value={building}>{building}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-item">
                                    <label>Floor:</label>
                                    <select 
                                        value={selectedFloor} 
                                        onChange={(e) => setSelectedFloor(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Floor</option>
                                        {floors.map(floor => (
                                            <option key={floor} value={floor}>{floor}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-item">
                                    <label>Start Time:</label>
                                    <input 
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        min="09:00"
                                        max="18:00"
                                        required
                                    />
                                </div>

                                <div className="filter-item">
                                    <label>End Time:</label>
                                    <input 
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        min="09:00"
                                        max="18:00"
                                        required
                                    />
                                </div>

                                <div className="filter-item">
                                    <label>Whiteboard:</label>
                                    <select 
                                        value={hasWhiteboard} 
                                        onChange={(e) => setHasWhiteboard(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>

                                <div className="filter-item">
                                    <label>Monitor:</label>
                                    <select 
                                        value={hasMonitor} 
                                        onChange={(e) => setHasMonitor(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>

                                <button 
                                    className="apply-button"
                                    onClick={handleApplyFilters}
                                >
                                    Apply
                                </button>
                            </div>

                            {/* Show workspace layout when filters are applied and no booking exists */}
                            {showWorkspaceLayout && !userBooking && (
                                <>
                                    <div className="workspace-layout">
                                        <div className="section-header">Available Workspaces</div>
                                        <div className="workspace-section">
                                            {renderWorkspaceLayout()}
                                        </div>
                                    </div>

                                    {/* Legend */}
                                    <div className="legend">
                                        <div className="legend-item">
                                            <div className="legend-color available"></div>
                                            <span>Available</span>
                                        </div>
                                        <div className="legend-item">
                                            <div className="legend-color occupied"></div>
                                            <span>Occupied</span>
                                        </div>
                                        <div className="legend-item">
                                            <div className="legend-color booked"></div>
                                            <span>Your Booking</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Message Modal */}
                            {showModal && (
                                <div className="modal-overlay">
                                    <div className="modal">
                                        <div className="modal-content">
                                            <p>{modalMessage}</p>
                                            <button onClick={() => setShowModal(false)}>OK</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Confirmation Modal */}
                            {showConfirmModal && (
                                <div className="modal-overlay">
                                    <div className="modal">
                                        <div className="modal-content">
                                            <h3>Confirm Booking</h3>
                                            <div className="booking-confirmation-details">
                                                <p>
                                                    <strong>Workspace Number</strong>
                                                    <span>{selectedSlot.workspaceNumber}</span>
                                                </p>
                                                <p>
                                                    <strong>Building</strong>
                                                    <span>{selectedBuilding}</span>
                                                </p>
                                                <p>
                                                    <strong>Floor</strong>
                                                    <span>{selectedFloor}</span>
                                                </p>
                                                <p>
                                                    <strong>Date</strong>
                                                    <span>{bookingDate}</span>
                                                </p>
                                                <p>
                                                    <strong>Time</strong>
                                                    <span>{startTime} - {endTime}</span>
                                                </p>
                                            </div>
                                            <div className="modal-actions">
                                                <button 
                                                    className="confirm-button"
                                                    onClick={handleConfirmBooking}
                                                >
                                                    Confirm
                                                </button>
                                                <button 
                                                    className="cancel-button"
                                                    onClick={() => {
                                                        setShowConfirmModal(false);
                                                        setSelectedSlot(null);
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkspaceBooking;