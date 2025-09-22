import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Palette,
  Bell,
  Key,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  MessageSquare,
  Clock,
  AlertTriangle,
  Info,
  Trash2
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Settings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@college.edu',
    phone: '+91 9876543210',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    systemAlerts: true,
    departmentUpdates: true,
    studentActivities: false,
    maintenanceNotices: true,
    emergencyAlerts: true,
    weeklyReports: false,
    emailNotifications: true,
    pushNotifications: true,
    desktopNotifications: false
  });

  // Notification Pool State
  const [notificationPool, setNotificationPool] = useState([
    {
      id: 1,
      type: 'alert',
      priority: 'high',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance on January 20, 2024 from 2:00 AM to 4:00 AM',
      timestamp: '2024-01-15T10:30:00Z',
      read: false
    },
    {
      id: 2,
      type: 'info',
      priority: 'medium',
      title: 'New Feature Available',
      message: 'Enhanced reporting features are now available in the dashboard',
      timestamp: '2024-01-15T09:15:00Z',
      read: false
    },
    {
      id: 3,
      type: 'announcement',
      priority: 'low',
      title: 'Policy Update',
      message: 'Updated privacy policy and terms of service are now in effect',
      timestamp: '2024-01-14T16:45:00Z',
      read: true
    }
  ]);

  // Removed preferences state as language and region settings are no longer needed

  const { toast } = useToast();

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Removed handlePreferenceChange as preferences are no longer needed

  const saveProfile = () => {
    if (!profileData.fullName || !profileData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Profile Updated!",
      description: "Your profile information has been saved successfully.",
    });
  };

  const changePassword = () => {
    if (!profileData.currentPassword || !profileData.newPassword || !profileData.confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill all password fields.",
        variant: "destructive"
      });
      return;
    }

    if (profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive"
      });
      return;
    }

    if (profileData.newPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Password Changed!",
      description: "Your password has been updated successfully.",
    });

    // Clear password fields
    setProfileData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Notification Settings Updated!",
      description: "Your notification preferences have been saved.",
    });
  };

  // Removed savePreferences as preferences are no longer needed

  // Notification Pool Functions
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'announcement':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-600 bg-red-50';
    if (priority === 'medium') return 'text-yellow-600 bg-yellow-50';
    switch (type) {
      case 'alert':
        return 'text-red-600 bg-red-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      case 'announcement':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const markNotificationAsRead = (id) => {
    setNotificationPool(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotificationPool(prev => prev.filter(notification => notification.id !== id));
    toast({
      title: "Notification Deleted",
      description: "Notification has been removed from your pool.",
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
      description: twoFactorEnabled 
        ? "Two-factor authentication has been disabled." 
        : "Two-factor authentication has been enabled for enhanced security.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => handleProfileChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={saveProfile} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={profileData.currentPassword}
                        onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={profileData.newPassword}
                          onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={profileData.confirmPassword}
                          onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={changePassword} variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={toggleTwoFactor}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Notification Categories</h4>
                <div className="space-y-4">
                  {[
                    { key: 'systemAlerts', label: 'System Alerts & Updates' },
                    { key: 'departmentUpdates', label: 'Department Communications' },
                    { key: 'studentActivities', label: 'Student Activity Notifications' },
                    { key: 'maintenanceNotices', label: 'Maintenance & Service Notices' },
                    { key: 'emergencyAlerts', label: 'Emergency Alerts' },
                    { key: 'weeklyReports', label: 'Weekly Summary Reports' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <Label className="text-sm font-normal">{item.label}</Label>
                      <Switch
                        checked={notifications[item.key]}
                        onCheckedChange={(value) => handleNotificationChange(item.key, value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Delivery Methods</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-normal">Email Notifications</Label>
                      <p className="text-xs text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(value) => handleNotificationChange('emailNotifications', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-normal">Push Notifications</Label>
                      <p className="text-xs text-gray-500">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(value) => handleNotificationChange('pushNotifications', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-normal">Desktop Notifications</Label>
                      <p className="text-xs text-gray-500">System desktop notifications</p>
                    </div>
                    <Switch
                      checked={notifications.desktopNotifications}
                      onCheckedChange={(value) => handleNotificationChange('desktopNotifications', value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={saveNotificationSettings} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notifications
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Pool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Notification Pool
              </CardTitle>
              <p className="text-sm text-gray-500">Recent notifications and alerts</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notificationPool.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications in your pool</p>
                  </div>
                ) : (
                  notificationPool.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all hover:shadow-sm ${
                        notification.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-2 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className={`text-sm font-medium ${
                                notification.read ? 'text-gray-700' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  New
                                </span>
                              )}
                            </div>
                            <p className={`text-sm mt-1 ${
                              notification.read ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-2 text-xs text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimestamp(notification.timestamp)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notificationPool.length > 0 && (
                <div className="flex justify-between items-center pt-4 mt-4 border-t">
                  <p className="text-sm text-gray-500">
                    {notificationPool.filter(n => !n.read).length} unread notifications
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNotificationPool(prev => prev.map(n => ({ ...n, read: true })));
                      toast({
                        title: "All notifications marked as read",
                        description: "Your notification pool has been updated.",
                      });
                    }}
                    disabled={notificationPool.every(n => n.read)}
                  >
                    Mark All Read
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Theme Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Dark Mode</Label>
                  <p className="text-xs text-gray-500">Toggle dark/light theme</p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language & Region section removed */}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Account Type:</span>
                <span className="font-medium">Administrator</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Login:</span>
                <span className="font-medium">Today, 2:30 PM</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Security Status:</span>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">Secure</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;