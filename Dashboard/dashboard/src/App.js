import { useState, useRef, useEffect } from 'react';
import {
  Home,
  Settings,
  User,
  Users,
  FileText,
  BarChart2,
  ChevronDown,
  ChevronRight,
  Menu,
  Bell,
  Search,
  LogOut
} from 'lucide-react';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    reports: false,
    users: false,
  });
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMenu = (menu) => {
    setExpandedMenus({
      ...expandedMenus,
      [menu]: !expandedMenus[menu],
    });
  };
  
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (profileDropdownOpen) setProfileDropdownOpen(false);
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-800 text-white transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!collapsed && (
            <div className="font-bold text-xl">Dashboard</div>
          )}
          <button onClick={toggleSidebar} className={`p-1 rounded hover:bg-gray-700 ${collapsed ? 'mx-auto' : ''}`}>
            <Menu size={20} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul>
            {/* Dashboard Item */}
            <li>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors">
                <Home size={20} />
                {!collapsed && <span className="ml-3">Dashboard</span>}
              </a>
            </li>

            {/* Reports Item with submenu */}
            <li>
              <button
                onClick={() => toggleMenu('reports')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <BarChart2 size={20} />
                  {!collapsed && <span className="ml-3">Reports</span>}
                </div>
                {!collapsed && (
                  <span>
                    {expandedMenus.reports ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </button>
              {!collapsed && expandedMenus.reports && (
                <ul className="pl-10 bg-gray-900">
                  <li>
                    <a href="#" className="block py-2 px-4 hover:bg-gray-700 transition-colors">
                      Sales Report
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-2 px-4 hover:bg-gray-700 transition-colors">
                      Analytics
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-2 px-4 hover:bg-gray-700 transition-colors">
                      Performance
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Users Item with submenu */}
            <li>
              <button
                onClick={() => toggleMenu('users')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <Users size={20} />
                  {!collapsed && <span className="ml-3">Users</span>}
                </div>
                {!collapsed && (
                  <span>
                    {expandedMenus.users ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </button>
              {!collapsed && expandedMenus.users && (
                <ul className="pl-10 bg-gray-900">
                  <li>
                    <a href="#" className="block py-2 px-4 hover:bg-gray-700 transition-colors">
                      User List
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-2 px-4 hover:bg-gray-700 transition-colors">
                      Add User
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-2 px-4 hover:bg-gray-700 transition-colors">
                      Permissions
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Documents Item */}
            <li>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors">
                <FileText size={20} />
                {!collapsed && <span className="ml-3">Documents</span>}
              </a>
            </li>

            {/* Settings Item */}
            <li>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors">
                <Settings size={20} />
                {!collapsed && <span className="ml-3">Settings</span>}
              </a>
            </li>
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <a href="#" className="flex items-center py-2 hover:bg-gray-700 rounded px-2 transition-colors">
            <LogOut size={20} />
            {!collapsed && <span className="ml-3">Logout</span>}
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center rounded-md bg-gray-100 px-3 py-2 w-64">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 bg-transparent outline-none border-none w-full"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative" ref={notificationsDropdownRef}>
                <button 
                  onClick={toggleNotifications}
                  className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                >
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                
                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">5 New</span>
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <a href="#" className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100">
                        <div className="flex">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3 flex-shrink-0">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">New user registration</p>
                            <p className="text-xs text-gray-500">John Doe just registered</p>
                            <p className="text-xs text-gray-400 mt-1">3 min ago</p>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100">
                        <div className="flex">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 flex-shrink-0">
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Sales report available</p>
                            <p className="text-xs text-gray-500">April 2025 report is ready to view</p>
                            <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100">
                        <div className="flex">
                          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 mr-3 flex-shrink-0">
                            <Bell size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">System alert</p>
                            <p className="text-xs text-gray-500">Server load reached 92%</p>
                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100">
                        <div className="flex">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3 flex-shrink-0">
                            <BarChart2 size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Analytics update</p>
                            <p className="text-xs text-gray-500">Your website traffic increased by 42%</p>
                            <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="block px-4 py-3 hover:bg-gray-100">
                        <div className="flex">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 mr-3 flex-shrink-0">
                            <Users size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Team update</p>
                            <p className="text-xs text-gray-500">Sarah Johnson joined Marketing team</p>
                            <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="block px-4 py-3 hover:bg-gray-100">
                        <div className="flex">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 mr-3 flex-shrink-0">
                            <Settings size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">System maintenance</p>
                            <p className="text-xs text-gray-500">System scheduled for maintenance on May 20</p>
                            <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100 text-center">
                      <a href="#" className="text-sm text-blue-500 hover:text-blue-700">View all notifications</a>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={profileDropdownRef}>
                <button 
                  onClick={toggleProfileDropdown}
                  className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 focus:outline-none"
                >
                  <User size={16} />
                </button>
                
                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Visit Profile
                    </a>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Account Settings
                    </a>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 border-t border-gray-100 hover:bg-gray-100"
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome to your dashboard</p>
          </div>

          {/* Dashboard Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-gray-500">3 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Report generated</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3">
                    <Settings size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Settings updated</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Performance</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Server Load</span>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '28%' }}></div>
              </div>
              <div className="flex items-center justify-between mt-4 mb-2">
                <span className="text-sm text-gray-600">Memory Usage</span>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex items-center justify-between mt-4 mb-2">
                <span className="text-sm text-gray-600">CPU Usage</span>
                <span className="text-sm font-medium">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Users</p>
                  <p className="text-2xl font-bold">2,874</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold">$12,345</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="text-2xl font-bold">1,543</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Products</p>
                  <p className="text-2xl font-bold">427</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#1234</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 12, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$120.00</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#1233</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jane Smith</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 11, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$75.50</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#1232</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Robert Johnson</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 10, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$259.99</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#1231</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Emily Williams</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 9, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$89.99</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Failed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  );
}