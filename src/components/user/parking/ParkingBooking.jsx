import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import './ParkingBooking.css';

const ParkingBooking = () => {
    const navigate = useNavigate();
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [userBooking, setUserBooking] = useState(null);
    const [bookedSlot, setBookedSlot] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showParkingLayout, setShowParkingLayout] = useState(false);
    const [showUserCard, setShowUserCard] = useState(false);

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
        return `PB${timestamp}${random}`;
    };

    // Updated generateParkingSlots function
    const generateParkingSlots = (building, floor) => {
        return Array.from({ length: 100 }, (_, index) => {
            const buildingCode = building ? building.slice(-1) : 'X'; // Get last character of building name (A, B, C)
            const floorCode = floor ? floor.replace(/\D/g, '') : '0'; // Extract floor number
            const slotNumber = (index + 1).toString().padStart(2, '0');
            return {
                parkingId: `${buildingCode}${floorCode}-${index + 1}`,
                parkingNumber: `${buildingCode}${floorCode}-${slotNumber}`, // e.g., A1-01, B2-05
                parkingType: index < 30 ? '2-Wheeler' : '4-Wheeler',
                parkingAvailable: Math.random() > 0.5,
                building: building,
                floor: floor
            };
        });
    };

    // Add state for parking slots
    const [mockParkingSlots, setMockParkingSlots] = useState(generateParkingSlots(selectedBuilding, selectedFloor || 'G'));

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

        // Generate new slots with building and floor information
        const filteredSlots = generateParkingSlots(selectedBuilding, selectedFloor).map(slot => ({
            ...slot,
            parkingAvailable: Math.random() > 0.3
        }));

        setMockParkingSlots(filteredSlots);
        setShowParkingLayout(true);
    };

    const handleSlotClick = (slot) => {
        if (bookedSlot) {
            setModalMessage('You have already booked a parking slot');
            setShowModal(true);
            return;
        }

        if (!slot.parkingAvailable) {
            setModalMessage('This parking slot is unavailable');
            setShowModal(true);
            return;
        }

        setSelectedSlot(slot);
        setShowConfirmModal(true);
    };

    const handleConfirmBooking = () => {
        const bookingId = generateBookingId();
        const bookingData = {
            bookingId: bookingId,
            parkingNumber: selectedSlot.parkingNumber,
            building: selectedBuilding,
            floor: selectedFloor,
            date: bookingDate,
            startTime: startTime,
            endTime: endTime,
            status: "Active",
            type: "Parking",
            timestamp: new Date().getTime()
        };

        // Get existing bookings or initialize empty array
        const existingBookings = JSON.parse(localStorage.getItem('bookings')) || [];
        
        // Add new booking
        existingBookings.push(bookingData);
        
        // Save back to localStorage
        localStorage.setItem('bookings', JSON.stringify(existingBookings));

        setUserBooking(bookingData);
        setShowConfirmModal(false);
        setSelectedSlot(null);
        setShowParkingLayout(false);
    };

    const handleProfileClick = () => {
        setShowUserCard(true);
    };

    const getSlotClassName = (slot) => {
        if (bookedSlot && slot.parkingId === bookedSlot.parkingId) {
            return 'parking-slot booked';
        }
        return `parking-slot ${slot.parkingAvailable ? 'available' : 'occupied'}`;
    };

    // Helper function to chunk array into groups of 5
    const chunkArray = (arr, size) => {
        const chunkedArr = [];
        for (let i = 0; i < arr.length; i += size) {
            chunkedArr.push(arr.slice(i, i + size));
        }
        return chunkedArr;
    };

    return (
        <div className="app-container">
            <Navbar onProfileClick={handleProfileClick} />

            {/* Add User Details Card */}
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
                <div className="parking-container">
                    <h1>Parking Booking System</h1>
                    
                    {userBooking ? (
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
                                        <strong>Parking Number</strong>
                                        <span>{userBooking.parkingNumber}</span>
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
                            {!userBooking && (
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

                                    <button 
                                        className="apply-button"
                                        onClick={handleApplyFilters}
                                    >
                                        Apply
                                    </button>
                                </div>
                            )}

                            {/* Show parking layout only when filters are applied and no booking exists */}
                            {showParkingLayout && !userBooking && (
                                <>
                                    <div className="parking-layout">
                                        {/* 2-Wheeler Section */}
                                        <div className="section-header">2-Wheeler Parking</div>
                                        <div className="parking-section">
                                            {chunkArray(
                                                mockParkingSlots.filter(slot => slot.parkingType === '2-Wheeler'),
                                                5
                                            ).map((row, rowIndex) => (
                                                <div key={rowIndex} className="parking-row">
                                                    {row.map((slot) => (
                                                        <div
                                                            key={slot.parkingId}
                                                            className={getSlotClassName(slot)}
                                                            onClick={() => handleSlotClick(slot)}
                                                        >
                                                            <div className="slot-info">
                                                                <span>{slot.parkingNumber}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Driving Lane */}
                                        <div className="driving-lane">
                                            <div className="arrow-right"></div>
                                        </div>

                                        {/* 4-Wheeler Section */}
                                        <div className="section-header">4-Wheeler Parking</div>
                                        <div className="parking-section">
                                            {chunkArray(
                                                mockParkingSlots.filter(slot => slot.parkingType === '4-Wheeler'),
                                                5
                                            ).map((row, rowIndex) => (
                                                <div key={rowIndex} className="parking-row">
                                                    {row.map((slot) => (
                                                        <div
                                                            key={slot.parkingId}
                                                            className={getSlotClassName(slot)}
                                                            onClick={() => handleSlotClick(slot)}
                                                        >
                                                            <div className="slot-info">
                                                                <span>{slot.parkingNumber}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Legend - Only show with parking layout */}
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

                            {/* Updated Confirmation Modal */}
                            {showConfirmModal && (
                                <div className="modal-overlay">
                                    <div className="modal">
                                        <div className="modal-content">
                                            <h3>Confirm Booking</h3>
                                            <div className="booking-confirmation-details">
                                                <p>
                                                    <strong>Slot Number</strong>
                                                    <span>{selectedSlot.parkingNumber}</span>
                                                </p>
                                                <p>
                                                    <strong>Type</strong>
                                                    <span>{selectedSlot.parkingType}</span>
                                                </p>
                                                <p>
                                                    <strong>Date</strong>
                                                    <span>{bookingDate}</span>
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

export default ParkingBooking;