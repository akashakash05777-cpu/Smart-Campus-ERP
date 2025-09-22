import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Bell, AlertTriangle, Info, CheckCircle, Clock, Filter, Search, X } from 'lucide-react';
import { useDepartment } from '../contexts/DepartmentContext';
import { useAuth } from '../contexts/AuthContext';

const DepartmentNotifications = () => {
  const { user } = useAuth();
  const { departmentData, loading } = useDepartment();
  const [activeFilter, setActiveFilter] = useState('all'); // all, alerts, announcements, system
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mock notifications data - in real app, this would come from API
  const notifications = [
    {
      id: 1,
      type: 'alert',
      priority: 'high',
      title: 'Pending Attendance Marks',
      message: '15 students in CS-A class have missing attendance for January 14, 2024',
      timestamp: '2024-01-15T10:30:00Z',
      department: departmentData?.name || 'Computer Science',
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      type: 'announcement',
      priority: 'medium',
      title: 'Department Meeting Scheduled',
      message: 'Monthly department meeting scheduled for January 20, 2024 at 2:00 PM in Conference Room A',
      timestamp: '2024-01-15T09:15:00Z',
      department: departmentData?.name || 'Computer Science',
      read: false,
      actionRequired: false
    },
    {
      id: 3,
      type: 'system',
      priority: 'low',
      title: 'System Maintenance Notice',
      message: 'Scheduled system maintenance on January 18, 2024 from 11:00 PM to 2:00 AM. ERP system will be unavailable during this time.',
      timestamp: '2024-01-15T08:45:00Z',
      department: 'All Departments',
      read: true,
      actionRequired: false
    },
    {
      id: 4,
      type: 'alert',
      priority: 'high',
      title: 'Leave Request Deadline',
      message: '3 leave requests from department staff are pending approval. Deadline: January 16, 2024',
      timestamp: '2024-01-15T07:20:00Z',
      department: departmentData?.name || 'Computer Science',
      read: false,
      actionRequired: true
    },
    {
      id: 5,
      type: 'announcement',
      priority: 'medium',
      title: 'New Course Registration Open',
      message: 'Registration for Advanced Database Systems course is now open for final year students',
      timestamp: '2024-01-14T16:30:00Z',
      department: departmentData?.name || 'Computer Science',
      read: true,
      actionRequired: false
    },
    {
      id: 6,
      type: 'alert',
      priority: 'medium',
      title: 'Lab Equipment Maintenance',
      message: 'Computer Lab 2 requires maintenance. 5 systems are currently out of order.',
      timestamp: '2024-01-14T14:15:00Z',
      department: departmentData?.name || 'Computer Science',
      read: false,
      actionRequired: true
    }
  ];

  // Filter notifications based on active filter and search term
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = activeFilter === 'all' || notification.type === activeFilter;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getNotificationIcon = (type, priority) => {
    switch (type) {
      case 'alert':
        return priority === 'high' ? 
          <AlertTriangle className="h-5 w-5 text-red-600" /> :
          <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'announcement':
        return <Bell className="h-5 w-5 text-blue-600" />;
      case 'system':
        return <Info className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getNotificationStats = () => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const alerts = notifications.filter(n => n.type === 'alert').length;
    const actionRequired = notifications.filter(n => n.actionRequired && !n.read).length;
    
    return { total, unread, alerts, actionRequired };
  };

  const stats = getNotificationStats();

  const markAsRead = (notificationId) => {
    // In real app, this would make an API call
    console.log(`Marking notification ${notificationId} as read`);
  };

  const markAllAsRead = () => {
    // In real app, this would make an API call
    console.log('Marking all notifications as read');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications & Alerts</h1>
          <p className="text-gray-600">{departmentData?.name || 'Computer Science'} Department</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Mark All as Read
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-orange-600">{stats.unread}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
                <p className="text-2xl font-bold text-red-600">{stats.alerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Action Required</p>
                <p className="text-2xl font-bold text-purple-600">{stats.actionRequired}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All', icon: Bell },
                { key: 'alert', label: 'Alerts', icon: AlertTriangle },
                { key: 'announcement', label: 'Announcements', icon: Info },
                { key: 'system', label: 'System', icon: CheckCircle }
              ].map(filter => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeFilter === filter.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
            
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Notifications ({filteredNotifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 p-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    getPriorityColor(notification.priority)
                  } ${!notification.read ? 'font-medium' : ''}`}
                  onClick={() => setSelectedNotification(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type, notification.priority)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                          {notification.actionRequired && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              Action Required
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatTimestamp(notification.timestamp)}</span>
                          <span>•</span>
                          <span>{notification.department}</span>
                          <span>•</span>
                          <span className="capitalize">{notification.type}</span>
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getNotificationIcon(selectedNotification.type, selectedNotification.priority)}
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedNotification.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="capitalize font-medium">{selectedNotification.type}</span>
                  <span>•</span>
                  <span className="capitalize">{selectedNotification.priority} Priority</span>
                  <span>•</span>
                  <span>{formatTimestamp(selectedNotification.timestamp)}</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{selectedNotification.message}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-600">
                    Department: {selectedNotification.department}
                  </span>
                  <div className="flex gap-2">
                    {!selectedNotification.read && (
                      <button
                        onClick={() => {
                          markAsRead(selectedNotification.id);
                          setSelectedNotification(null);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedNotification(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentNotifications;