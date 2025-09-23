import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Building2, 
  GraduationCap, 
  Bell, 
  Settings, 
  Menu,
  School,
  X,
  Search,
  RefreshCw,
  User,
  CheckCircle,
  BookOpen,
  Truck,
  UserCheck,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { mockNotifications } from '../mock';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Define navigation based on user role
  const getNavigation = () => {
    const userRole = user?.role || 'Student';
    
    // Student navigation
    if (userRole === 'Student') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Grades', href: '/grades', icon: GraduationCap },
        { name: 'Attendance', href: '/attendance', icon: CheckCircle },
        { name: 'Assignments', href: '/assignments', icon: BookOpen },
        { name: 'Library', href: '/library', icon: BookOpen },
        { name: 'Profile', href: '/settings', icon: Settings }
      ];
    }
    
    // Staff navigation
    if (userRole === 'Staff') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Attendance', href: '/attendance', icon: CheckCircle },
        { name: 'Students', href: '/students', icon: Users },
        { name: 'Leave Requests', href: '/leave-requests', icon: Bell },
        { name: 'Profile', href: '/settings', icon: Settings }
      ];
    }
    
    // Full navigation for other roles
    const allNavigation = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Administrator', 'IT Admin'] },
      { name: 'Admissions', href: '/admissions', icon: Users, roles: ['Administrator', 'IT Admin'] },
      { name: 'Fee Collection', href: '/fees', icon: CreditCard, roles: ['Administrator', 'IT Admin'] },
      { name: 'Hostel Management', href: '/hostel', icon: Building2, roles: ['Administrator', 'IT Admin'] },
      { name: 'Exam Records', href: '/exams', icon: GraduationCap, roles: ['Administrator', 'IT Admin'] },
      { name: 'Attendance', href: '/attendance', icon: CheckCircle, roles: ['Administrator', 'IT Admin'] },
      { name: 'Library', href: '/library', icon: BookOpen, roles: ['Administrator', 'IT Admin'] },
      { name: 'Transport', href: '/transport', icon: Truck, roles: ['Administrator', 'IT Admin'] },
      { name: 'Staff Management', href: '/staff', icon: UserCheck, roles: ['Administrator', 'IT Admin'] },
      { name: 'Settings', href: '/settings', icon: Settings, roles: ['Administrator', 'IT Admin'] },
    ];
    
    return allNavigation.filter(item => 
      item.roles.includes(userRole)
    );
  };

  const navigation = getNavigation();

  const isActive = (href) => {
    const currentPath = location.pathname;
    return currentPath === href || 
           (href === '/dashboard' && currentPath === '/') ||
           (href === '/dashboard' && currentPath === '/dashboard');
  };

  const NotificationDropdown = () => null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-4">
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 bg-white">
                  <div className="flex items-center h-16 px-6 bg-gray-50 border-b border-gray-200">
                    <School className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">SmartCampus</span>
                  </div>
                  <nav className="px-4 py-6">
                    <div className="text-xs font-semibold text-gray-500 mb-4">Management Portal</div>
                    <ul className="space-y-2">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                isActive(item.href)
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                            >
                              <Icon className="h-5 w-5 mr-3" />
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="flex items-center">
              <School className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SmartCampus</span>
              <span className="ml-2 text-sm text-gray-500 hidden sm:block">Management Portal</span>
            </div>
            
            <Button variant="ghost" size="sm" className="hidden lg:flex">
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search students, records..." 
                className="bg-transparent border-none outline-none text-sm flex-1"
              />
            </div>
            
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            {/* Notification Bell */}
            {/* Notifications removed */}
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-100">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {getUserInitials(user?.name || 'User')}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">{user?.name || 'User'}</div>
                    <div className="text-xs text-gray-500">{user?.role || 'User'}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.id || 'N/A'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16">
          <div className="flex flex-col flex-grow bg-white min-h-screen border-r border-gray-200">
            <div className="flex items-center h-16 px-6 bg-gray-50 border-b border-gray-200">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div className="ml-3 text-gray-900">
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-gray-600">Admin</div>
              </div>
            </div>
            <nav className="flex-1 px-4 py-6">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive(item.href)
                            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 min-h-screen overflow-auto">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;