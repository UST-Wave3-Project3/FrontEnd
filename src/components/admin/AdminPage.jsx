import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem('email');

    const handleLogout = () => {
        // Clear all localStorage items
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('roles');
        // Or use localStorage.clear(); to clear everything
        
        // Redirect to login page
        navigate('/', { replace: true }); // Using replace to prevent going back to admin page
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                {/* Header with Logout Button */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <p className="text-xl text-gray-800">
                        Hello Admin!
                    </p>
                    <p className="text-gray-600">
                        Welcome, {email}
                    </p>
                    <p className="text-gray-600">
                        You have administrative access to the system.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;