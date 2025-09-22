import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import {
  Bell,
  Plus,
  Filter,
  Search,
  Trash2,
  CheckCircle,
  User,
  CreditCard,
  Building2,
  GraduationCap,
  Send,
  Clock,
  Mail,
  UserCheck,
  Calendar,
  Users,
  MessageSquare,
  Target,
  Save,
  Eye
} from 'lucide-react';
import { mockNotifications } from '../mock';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import notificationPoolService from '../services/NotificationPoolService';

const Notifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: '',
    audience: '',
    departments: [],
    classes: [],
    scheduleType: 'immediate',
    scheduledDate: '',
    scheduledTime: '',
    priority: 'normal'
  });
  
  const [messagePool, setMessagePool] = useState([]);
  const [showPoolDialog, setShowPoolDialog] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const { user } = useAuth();
  
  // Load message pool from service on component mount
  useEffect(() => {
    const pool = notificationPoolService.getPool();
    setMessagePool(pool);
  }, []);
  
  // Mock data for departments and classes
  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Information Technology'
  ];
  
  const classes = {
    'Computer Science': ['CSE-1A', 'CSE-1B', 'CSE-2A', 'CSE-2B', 'CSE-3A', 'CSE-3B', 'CSE-4A', 'CSE-4B'],
    'Electronics': ['ECE-1A', 'ECE-1B', 'ECE-2A', 'ECE-2B', 'ECE-3A', 'ECE-3B', 'ECE-4A', 'ECE-4B'],
    'Mechanical': ['ME-1A', 'ME-1B', 'ME-2A', 'ME-2B', 'ME-3A', 'ME-3B', 'ME-4A', 'ME-4B'],
    'Civil': ['CE-1A', 'CE-1B', 'CE-2A', 'CE-2B', 'CE-3A', 'CE-3B', 'CE-4A', 'CE-4B'],
    'Electrical': ['EE-1A', 'EE-1B', 'EE-2A', 'EE-2B', 'EE-3A', 'EE-3B', 'EE-4A', 'EE-4B'],
    'Information Technology': ['IT-1A', 'IT-1B', 'IT-2A', 'IT-2B', 'IT-3A', 'IT-3B', 'IT-4A', 'IT-4B']
  };

  const { toast } = useToast();

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = (notification.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notification.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'read' && notification.read) ||
                         (statusFilter === 'unread' && !notification.read);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'admission': return <User className="h-4 w-4" />;
      case 'fee': return <CreditCard className="h-4 w-4" />;
      case 'hostel': return <Building2 className="h-4 w-4" />;
      case 'exam': return <GraduationCap className="h-4 w-4" />;
      case 'attendance': return <UserCheck className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'admission': return 'bg-blue-100 text-blue-800';
      case 'fee': return 'bg-green-100 text-green-800';
      case 'hostel': return 'bg-purple-100 text-purple-800';
      case 'exam': return 'bg-orange-100 text-orange-800';
      case 'attendance': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: '',
      audience: '',
      departments: [],
      classes: [],
      scheduleType: 'immediate',
      scheduledDate: '',
      scheduledTime: '',
      priority: 'normal'
    });
    setSelectedRecipients([]);
  };

  // Handle department selection
  const handleDepartmentChange = (department, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        departments: [...prev.departments, department]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        departments: prev.departments.filter(d => d !== department),
        classes: prev.classes.filter(c => !classes[department]?.includes(c))
      }));
    }
  };

  // Handle class selection
  const handleClassChange = (className, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        classes: [...prev.classes, className]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        classes: prev.classes.filter(c => c !== className)
      }));
    }
  };

  // Calculate estimated recipients
  const calculateRecipients = () => {
    let count = 0;
    if (formData.audience === 'students') {
      if (formData.departments.length > 0) {
        formData.departments.forEach(dept => {
          if (formData.classes.length > 0) {
            const deptClasses = formData.classes.filter(c => classes[dept]?.includes(c));
            count += deptClasses.length * 45; // Assuming 45 students per class
          } else {
            count += classes[dept]?.length * 45 || 0;
          }
        });
      } else {
        count = 2000; // Total students estimate
      }
    } else if (formData.audience === 'staff') {
      count = 150; // Total staff estimate
    } else if (formData.audience === 'admin') {
      count = 25; // Total admin estimate
    } else if (formData.audience === 'all') {
      count = 2175; // Total users estimate
    }
    return count;
  };

  // Save message to pool
  const saveToPool = async () => {
    if (!formData.title || !formData.message || !formData.type || !formData.audience) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const estimatedRecipients = calculateRecipients();
    const poolMessage = {
      ...formData,
      estimatedRecipients,
      createdAt: new Date().toISOString(),
      createdBy: user?.id || 'system'
    };

    const result = await notificationPoolService.saveToPool(
      poolMessage, 
      user,
      // Success callback
      (savedNotification) => {
        setMessagePool(prev => [savedNotification, ...prev]);
        toast({
          title: "Message Saved to Pool",
          description: "Message has been saved to the message pool."
        });
        // Don't reset form or close dialog to allow user to make additional edits or send
        // Only close if user explicitly requests it
        // resetForm();
        // setShowSendDialog(false);
        
        // Show the pool dialog to view the saved message
        setShowPoolDialog(true);
        setShowSendDialog(false);
      },
      // Error callback
      (error) => {
        toast({
          title: "Error Saving Message",
          description: error.message || "Failed to save message to pool.",
          variant: "destructive"
        });
      }
    );
    
    if (!result.success) {
      // If there are validation errors, show them
      if (result.validationErrors) {
        toast({
          title: "Validation Error",
          description: result.validationErrors.join("\n"),
          variant: "destructive"
        });
      }
    }
  };

  const handleSendNotification = () => {
    if (!formData.title || !formData.message || !formData.type || !formData.audience) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.scheduleType === 'scheduled' && (!formData.scheduledDate || !formData.scheduledTime)) {
      toast({
        title: "Missing Schedule Information",
        description: "Please provide scheduled date and time.",
        variant: "destructive"
      });
      return;
    }

    const recipientCount = calculateRecipients();
    const scheduledDateTime = formData.scheduleType === 'scheduled' 
      ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
      : new Date();

    const newNotification = {
      id: notifications.length + 1,
      title: formData.title,
      message: formData.message,
      type: formData.type,
      read: false,
      timestamp: scheduledDateTime.toISOString(),
      audience: formData.audience,
      departments: formData.departments,
      classes: formData.classes,
      recipientCount,
      priority: formData.priority,
      scheduled: formData.scheduleType === 'scheduled'
    };

    setNotifications(prev => [newNotification, ...prev]);

    const audienceText = formData.audience === 'students' && formData.departments.length > 0
      ? `${formData.departments.join(', ')} students${formData.classes.length > 0 ? ` (${formData.classes.join(', ')})` : ''}`
      : formData.audience;

    toast({
      title: formData.scheduleType === 'scheduled' ? "Notification Scheduled!" : "Notification Sent!",
      description: `Notification ${formData.scheduleType === 'scheduled' ? 'scheduled for' : 'sent to'} ${audienceText} (${recipientCount} recipients).`,
    });

    setShowSendDialog(false);
    resetForm();
  };

  // Send message from pool
  const sendFromPool = async (messageId) => {
    const result = await notificationPoolService.sendFromPool(
      messageId,
      user,
      // Success callback
      (sentNotification) => {
        const newNotification = {
          id: notifications.length + 1,
          title: sentNotification.title,
          message: sentNotification.message,
          type: sentNotification.type,
          read: false,
          timestamp: new Date().toISOString(),
          audience: sentNotification.audience,
          departments: sentNotification.departments,
          classes: sentNotification.classes,
          recipientCount: sentNotification.recipientCount || sentNotification.estimatedRecipients,
          priority: sentNotification.priority
        };

        setNotifications(prev => [newNotification, ...prev]);
        // Update the message pool from service
        setMessagePool(notificationPoolService.getPool());

        toast({
          title: "Message Sent from Pool!",
          description: `Message sent to ${newNotification.recipientCount} recipients.`,
        });
      },
      // Error callback
      (error) => {
        toast({
          title: "Error Sending Message",
          description: error.message || "Failed to send message from pool.",
          variant: "destructive"
        });
      }
    );
    
    if (!result.success && result.validationErrors) {
      toast({
        title: "Validation Error",
        description: result.validationErrors.join("\n"),
        variant: "destructive"
      });
    }
  };

  // Delete message from pool
  const deleteFromPool = async (messageId) => {
    const result = await notificationPoolService.deleteFromPool(
      messageId,
      user,
      // Success callback
      () => {
        // Update the message pool from service
        setMessagePool(notificationPoolService.getPool());
        toast({
          title: "Message Deleted",
          description: "Message has been removed from the pool.",
        });
      },
      // Error callback
      (error) => {
        toast({
          title: "Error Deleting Message",
          description: error.message || "Failed to delete message from pool.",
          variant: "destructive"
        });
      }
    );
    
    if (!result.success) {
      toast({
        title: "Error",
        description: result.error || "An unknown error occurred.",
        variant: "destructive"
      });
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "All Notifications Marked as Read",
      description: "All notifications have been marked as read.",
    });
  };

  const getStats = () => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const byType = {
      admission: notifications.filter(n => n.type === 'admission').length,
      fee: notifications.filter(n => n.type === 'fee').length,
      hostel: notifications.filter(n => n.type === 'hostel').length,
      exam: notifications.filter(n => n.type === 'exam').length,
      attendance: notifications.filter(n => n.type === 'attendance').length
    };
    
    return { total, unread, byType };
  };

  const stats = getStats();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">Manage system notifications and alerts</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button onClick={markAllAsRead} variant="outline" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button 
            onClick={() => setShowPoolDialog(true)}
            variant="outline"
            className="flex items-center"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Pool ({messagePool.length})
          </Button>
          <Button 
            onClick={() => setShowSendDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
              </div>
              <Mail className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admissions</p>
                <p className="text-2xl font-bold text-blue-600">{stats.byType.admission}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fees</p>
                <p className="text-2xl font-bold text-green-600">{stats.byType.fee}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hostel</p>
                <p className="text-2xl font-bold text-purple-600">{stats.byType.hostel}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Exams</p>
                <p className="text-2xl font-bold text-orange-600">{stats.byType.exam}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-teal-600">{stats.byType.attendance}</p>
              </div>
              <UserCheck className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="admission">Admission</SelectItem>
                <SelectItem value="fee">Fee</SelectItem>
                <SelectItem value="hostel">Hostel</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        <Badge className={getTypeColor(notification.type)} variant="outline">
                          {(notification.type || '').charAt(0).toUpperCase() + (notification.type || '').slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{notification.message}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(notification.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800 hover:border-red-300"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Send Notification Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Create New Notification
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Details</TabsTrigger>
              <TabsTrigger value="targeting">Targeting & Filters</TabsTrigger>
              <TabsTrigger value="scheduling">Scheduling & Options</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter notification title"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Enter notification message"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admission">Admission</SelectItem>
                      <SelectItem value="fee">Fee</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="targeting" className="space-y-4 mt-6">
              <div>
                <Label>Target Audience *</Label>
                <Select value={formData.audience} onValueChange={(value) => handleInputChange('audience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="all">All Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.audience === 'students' && (
                <>
                  <div>
                    <Label>Select Departments</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-md p-3">
                      {departments.map((dept) => (
                        <div key={dept} className="flex items-center space-x-2">
                          <Checkbox
                            id={dept}
                            checked={formData.departments.includes(dept)}
                            onCheckedChange={(checked) => handleDepartmentChange(dept, checked)}
                          />
                          <Label htmlFor={dept} className="text-sm">{dept}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {formData.departments.length > 0 && (
                    <div>
                      <Label>Select Classes (Optional)</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-md p-3">
                        {formData.departments.flatMap(dept => 
                          classes[dept]?.map(className => (
                            <div key={className} className="flex items-center space-x-2">
                              <Checkbox
                                id={className}
                                checked={formData.classes.includes(className)}
                                onCheckedChange={(checked) => handleClassChange(className, checked)}
                              />
                              <Label htmlFor={className} className="text-sm">{className}</Label>
                            </div>
                          )) || []
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Estimated Recipients</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-1">{calculateRecipients()}</p>
                {formData.audience === 'students' && formData.departments.length > 0 && (
                  <p className="text-sm text-blue-700 mt-1">
                    Departments: {formData.departments.join(', ')}
                    {formData.classes.length > 0 && (
                      <><br />Classes: {formData.classes.join(', ')}</>
                    )}
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="scheduling" className="space-y-4 mt-6">
              <div>
                <Label>Delivery Schedule</Label>
                <Select value={formData.scheduleType} onValueChange={(value) => handleInputChange('scheduleType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Send Immediately</SelectItem>
                    <SelectItem value="scheduled">Schedule for Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.scheduleType === 'scheduled' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduledDate">Date *</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduledTime">Time *</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {formData.scheduleType === 'scheduled' && formData.scheduledDate && formData.scheduledTime && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Scheduled Delivery</span>
                  </div>
                  <p className="text-green-700 mt-1">
                    {new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toLocaleString()}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-6 border-t">
            <div className="flex space-x-3">
              <Button variant="outline" onClick={saveToPool} className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save to Pool
              </Button>
              <Button variant="outline" onClick={() => setShowPoolDialog(true)} className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                View Pool
              </Button>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => {
                setShowSendDialog(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleSendNotification} className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                {formData.scheduleType === 'scheduled' ? 'Schedule' : 'Send'} Notification
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Pool Dialog */}
      <Dialog open={showPoolDialog} onOpenChange={setShowPoolDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Message Pool ({messagePool.length})
            </DialogTitle>
          </DialogHeader>
          
          {messagePool.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No messages in pool</p>
              <p className="text-sm text-gray-400 mt-1">Save messages from the notification form to access them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messagePool.map((message) => (
                <Card key={message.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{message.title}</h3>
                        <Badge variant={message.priority === 'urgent' ? 'destructive' : message.priority === 'high' ? 'default' : 'secondary'}>
                          {message.priority}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(message.type)}>
                          {message.type}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{message.message}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Audience:</span> {message.audience}
                          {message.audience === 'students' && message.departments && message.departments.length > 0 && (
                            <>
                              <br /><span className="font-medium">Departments:</span> {message.departments.join(', ')}
                              {message.classes && message.classes.length > 0 && (
                                <><br /><span className="font-medium">Classes:</span> {message.classes.join(', ')}</>
                              )}
                            </>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Recipients:</span> ~{message.estimatedRecipients || message.recipientCount || 0}
                          {message.scheduleType === 'scheduled' && message.scheduledDate && message.scheduledTime && (
                            <>
                              <br /><span className="font-medium">Scheduled:</span> {new Date(`${message.scheduledDate}T${message.scheduledTime}`).toLocaleString()}
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-2">
                        Created: {message.createdAt ? new Date(message.createdAt).toLocaleString() : 'Unknown'}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => sendFromPool(message.id)}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteFromPool(message.id)}
                        className="flex items-center text-red-600 hover:text-red-800 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPoolDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;