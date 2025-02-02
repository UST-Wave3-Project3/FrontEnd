const MessageBox = ({ message, type, onConfirm, onCancel }) => {
    return (
        <div className="message-overlay">
            <div className="message-box">
                <div className={`message-content ${type}`}>
                    <h3>{type === 'error' ? 'Error' : 'Confirm Booking'}</h3>
                    <p className="message-text">{message}</p>
                    <div className="message-buttons">
                        {type === 'confirm' ? (
                            <>
                                <button onClick={onConfirm} className="confirm-btn">Book Slot</button>
                                <button onClick={onCancel} className="cancel-btn">Cancel</button>
                            </>
                        ) : (
                            <button onClick={onCancel} className="ok-btn">OK</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBox; 