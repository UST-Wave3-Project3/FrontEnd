const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('userId') || 'ADMIN123'; // Replace with actual userId

    const handleLogout = () => {
        localStorage.clear();
        navigate('/', { replace: true });
    };

    const navigationItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Employees', icon: Users, path: '/admin/employees' },
        { name: 'Parking', icon: Car, path: '/admin/parking' },
        { name: 'Venue', icon: Building, path: '/admin/venue' },
        { name: 'Workstation', icon: Monitor, path: '/admin/workstation' }
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className={`${isOpen ? 'w-72' : 'w-20'} duration-300 bg-white min-h-screen shadow-lg relative`}>
                <button 
                    className="absolute -right-3 top-9 bg-white rounded-full p-1 shadow-md"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Profile Section */}
                <div className="p-4 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-4">
                        {/* Placeholder for user photo */}
                        <img 
                            src="/api/placeholder/80/80"
                            alt="User"
                            className="w-full h-full rounded-full"
                        />
                    </div>
                    {isOpen && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">{email}</p>
                            <p className="text-xs text-gray-500">Role: ADMIN</p>
                            <p className="text-xs text-gray-500">ID: {userId}</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="mt-8">
                    {navigationItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className="flex items-center w-full p-4 hover:bg-gray-100 transition-colors"
                        >
                            <item.icon size={20} className="text-gray-600" />
                            {isOpen && (
                                <span className="ml-4 text-gray-700">{item.name}</span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {/* Top Bar */}
                <div className="bg-white p-4 shadow-sm flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
