import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../common/Navbar";
import "./VenueBooking.css";

const VenueBooking = () => {
    const navigate = useNavigate();
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [capacity, setCapacity] = useState('');
    const [hasAc, setHasAc] = useState('');
    const [hasProjector, setHasProjector] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [userBooking, setUserBooking] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [showVenueLayout, setShowVenueLayout] = useState(false);
    const [showUserCard, setShowUserCard] = useState(false);
    const [activeBooking, setActiveBooking] = useState(null);

    // Get today's date and max date (7 days from today)
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const maxDateString = maxDate.toISOString().split('T')[0];

    useEffect(() => {
        // Check for active booking on component mount
        const checkActiveBooking = () => {
            const allBookings = JSON.parse(localStorage.getItem('bookings')) || [];
            const currentTime = new Date();
            
            // Find active venue booking
            const activeVenue = allBookings.find(booking => {
                if (booking.type !== 'Venue' || booking.status !== 'Active') return false;
                
                const bookingEndTime = new Date(`${booking.date} ${booking.endTime}`);
                return bookingEndTime > currentTime;
            });

            setActiveBooking(activeVenue || null);
        };

        checkActiveBooking();
        // Check every minute for booking status
        const interval = setInterval(checkActiveBooking, 60000);

        return () => clearInterval(interval);
    }, []);

    // Mock data for dropdowns
    const buildings = ['Building A', 'Building B', 'Building C'];
    const floors = ['Ground Floor', 'Floor 1', 'Floor 2', 'Floor 3'];
    const capacityOptions = ['10-20', '20-50', '50-100', '100+'];

    // Mock venues data
    const venues = [
        {
            venueId: 1,
            name: "Conference Room A",
            capacity: 50,
            description: "Large conference room with projector and sound system",
            amenities: ["Sound System", "Video Conferencing"],
            venueBuilding: "Building A",
            venueFloor: "Floor 1",
            hasAc: true,
            hasProjector: true
        },
        {
            venueId: 2,
            name: "Meeting Room B",
            capacity: 20,
            description: "Medium-sized meeting room with whiteboard",
            amenities: ["Whiteboard", "TV Screen"],
            venueBuilding: "Building B",
            venueFloor: "Floor 2",
            hasAc: true,
            hasProjector: false
        },
        {
            venueId: 3,
            name: "Auditorium",
            capacity: 200,
            description: "Large auditorium for presentations and events",
            amenities: ["Stage", "Sound System"],
            venueBuilding: "Building A",
            venueFloor: "Ground Floor",
            hasAc: true,
            hasProjector: true
        },
        {
            venueId: 4,
            name: "Training Room",
            capacity: 30,
            description: "Training room with individual workstations",
            amenities: ["Computers", "Whiteboard"],
            venueBuilding: "Building C",
            venueFloor: "Floor 1",
            hasAc: true,
            hasProjector: true
        }
    ];

    const handleApplyFilters = () => {
        if (!bookingDate || !selectedBuilding || !selectedFloor || !startTime || !endTime) {
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

        setShowVenueLayout(true);
    };

    const handleCardClick = (venue) => {
        setSelectedVenue(venue);
        setShowConfirmModal(true);
    };

    const handleConfirmBooking = () => {
        const bookingId = `VN-${Math.random().toString(36).substr(2, 9)}`;
        const bookingData = {
            bookingId: bookingId,
            venueName: selectedVenue.name,
            building: selectedBuilding,
            floor: selectedFloor,
            date: bookingDate,
            startTime: startTime,
            endTime: endTime,
            status: "Active",
            type: "Venue",
            capacity: selectedVenue.capacity,
            hasAc: selectedVenue.hasAc,
            hasProjector: selectedVenue.hasProjector,
            amenities: selectedVenue.amenities,
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
        setSelectedVenue(null);
        setShowVenueLayout(false);
    };

    const handleProfileClick = () => {
        setShowUserCard(true);
    };

    const renderActiveBooking = () => {
        return (
            <div className="active-booking-container">
                <h2>Your Active Venue Booking</h2>
                <div className="booking-details">
                    <div className="booking-info">
                        <p>
                            <strong>Booking ID</strong>
                            <span>{activeBooking.bookingId}</span>
                        </p>
                        <p>
                            <strong>Venue Name</strong>
                            <span>{activeBooking.venueName}</span>
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
                            <strong>Capacity</strong>
                            <span>{activeBooking.capacity} people</span>
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
                            <div className="amenities-list">
                                {activeBooking.hasAc && <span className="amenity-tag">AC</span>}
                                {activeBooking.hasProjector && <span className="amenity-tag">Projector</span>}
                                {activeBooking.amenities.map((amenity, index) => (
                                    <span key={index} className="amenity-tag">{amenity}</span>
                                ))}
                            </div>
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

    return (
        <div className="app-container">
            <Navbar onProfileClick={handleProfileClick} />
            <div className="main-content">
                <div className="venue-container">
                    <h1>Venue Booking System</h1>
                    
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
                                        <strong>Venue Name</strong>
                                        <span>{userBooking.venueName}</span>
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
                                        <strong>Capacity</strong>
                                        <span>{userBooking.capacity} people</span>
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
                                        <div className="amenities-list">
                                            {userBooking.hasAc && <span className="amenity-tag">AC</span>}
                                            {userBooking.hasProjector && <span className="amenity-tag">Projector</span>}
                                            {userBooking.amenities.map((amenity, index) => (
                                                <span key={index} className="amenity-tag">{amenity}</span>
                                            ))}
                                        </div>
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
                                            setCapacity('');
                                            setHasAc('');
                                            setHasProjector('');
                                        }}
                                    >
                                        New Booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="filters-section">
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
                                <label>Capacity:</label>
                                <select 
                                    value={capacity} 
                                    onChange={(e) => setCapacity(e.target.value)}
                                    required
                                >
                                    <option value="">Select Capacity</option>
                                    {capacityOptions.map(cap => (
                                        <option key={cap} value={cap}>{cap} people</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-item">
                                <label>Air Conditioning:</label>
                                <select 
                                    value={hasAc} 
                                    onChange={(e) => setHasAc(e.target.value)}
                                    required
                                >
                                    <option value="">Select Option</option>
                                    <option value="yes">Required</option>
                                    <option value="no">Not Required</option>
                                </select>
                            </div>

                            <div className="filter-item">
                                <label>Projector:</label>
                                <select 
                                    value={hasProjector} 
                                    onChange={(e) => setHasProjector(e.target.value)}
                                    required
                                >
                                    <option value="">Select Option</option>
                                    <option value="yes">Required</option>
                                    <option value="no">Not Required</option>
                                </select>
                            </div>

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

                            <button 
                                className="apply-button"
                                onClick={handleApplyFilters}
                            >
                                Apply
                            </button>
                        </div>
                    )}

                    {showVenueLayout && !userBooking && (
                        <div className="venue-layout">
                            <div className="venue-grid">
                                {venues.map((venue) => (
                                    <div
                                        key={venue.venueId}
                                        className="venue-card"
                                        onClick={() => handleCardClick(venue)}
                                    >
                                        <h3>{venue.name}</h3>
                                        <p className="venue-location">
                                            {venue.venueBuilding} - {venue.venueFloor}
                                        </p>
                                        <p className="capacity">Capacity: {venue.capacity} people</p>
                                        <p className="description">{venue.description}</p>
                                        <div className="amenities">
                                            {venue.hasAc && (
                                                <span className="amenity-tag">AC</span>
                                            )}
                                            {venue.hasProjector && (
                                                <span className="amenity-tag">Projector</span>
                                            )}
                                            {venue.amenities.map((amenity, index) => (
                                                <span key={index} className="amenity-tag">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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

                    {showConfirmModal && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <div className="modal-content">
                                    <h3>Confirm Booking</h3>
                                    <div className="booking-confirmation-details">
                                        <p>
                                            <strong>Venue</strong>
                                            <span>{selectedVenue.name}</span>
                                        </p>
                                        <p>
                                            <strong>Building</strong>
                                            <span>{selectedVenue.venueBuilding}</span>
                                        </p>
                                        <p>
                                            <strong>Floor</strong>
                                            <span>{selectedVenue.venueFloor}</span>
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
                                                setSelectedVenue(null);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VenueBooking; 