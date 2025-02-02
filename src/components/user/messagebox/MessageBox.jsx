import React, { useState, useEffect } from 'react';
import './MessageBox.css';

const MessageBox = () => {
    const [messages, setMessages] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);

    useEffect(() => {
        // Listen for new bookings and show notifications
        const handleStorageChange = () => {
            const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            const latestBooking = bookings[bookings.length - 1];
            
            if (latestBooking && !messages.find(m => m.id === latestBooking.bookingId)) {
                const newMessage = {
                    id: latestBooking.bookingId,
                    type: 'success',
                    title: 'Booking Confirmed',
                    content: `Your ${latestBooking.type} booking has been confirmed.`,
                    timestamp: new Date().getTime()
                };
                
                setMessages(prev => [...prev, newMessage]);
                showNotification(newMessage);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [messages]);

    const showNotification = (message) => {
        setCurrentMessage(message);
        setShowMessage(true);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            setShowMessage(false);
            setCurrentMessage(null);
        }, 5000);
    };

    return (
        <div className={`message-box ${showMessage ? 'show' : ''}`}>
            {currentMessage && (
                <div className={`message ${currentMessage.type}`}>
                    <div className="message-header">
                        <h4>{currentMessage.title}</h4>
                        <button 
                            className="close-button"
                            onClick={() => setShowMessage(false)}
                        >
                            ×
                        </button>
                    </div>
                    <div className="message-content">
                        {currentMessage.content}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageBox; 