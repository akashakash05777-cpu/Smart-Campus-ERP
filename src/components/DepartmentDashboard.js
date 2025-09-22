import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Clock, FileText, Bell, TrendingUp, AlertTriangle, GraduationCap, BookOpen, Calendar, Award, Building2, Phone, Mail } from 'lucide-react';
import { useDepartment } from '../contexts/DepartmentContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const DepartmentDashboard = () => {
  const { user, sharedData } = useAuth();
  const { departmentData, loading } = useDepartment();
  const { broadcastDataChange, DATA_EVENTS } = useData();
  const navigate = useNavigate();
  const [departmentStats, setDepartmentStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    programs: [],
    notifications: []
  });

  // Real-time data synchronization
  useEffect(() => {
    if (departmentData) {
      setDepartmentStats({
        totalStudents: departmentData.totalStudents || 0,
        totalStaff: departmentData.totalStaff || 0,
        programs: departmentData.programs || [],
        notifications: departmentData.notifications || []
      });
    }
  }, [departmentData]);

  // Listen for real-time updates
  useEffect(() => {
    const handleDataUpdate = (event) => {
      if (event.detail?.department === user?.department) {
        setDepartmentStats(prev => ({
          ...prev,
          ...event.detail.data
        }));
        broadcastDataChange('department_data_updated', { department: user?.department, data: event.detail.data });
      }
    };

    window.addEventListener(DATA_EVENTS.STUDENT_ADDED, handleDataUpdate);
    window.addEventListener(DATA_EVENTS.STAFF_ADDED, handleDataUpdate);
    window.addEventListener(DATA_EVENTS.NOTIFICATION_ADDED, handleDataUpdate);

    return () => {
      window.removeEventListener(DATA_EVENTS.STUDENT_ADDED, handleDataUpdate);
      window.removeEventListener(DATA_EVENTS.STAFF_ADDED, handleDataUpdate);
      window.removeEventListener(DATA_EVENTS.NOTIFICATION_ADDED, handleDataUpdate);
    };
  }, [user?.department, broadcastDataChange, DATA_EVENTS]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!departmentData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600">No department data available</h2>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Students',
      value: departmentStats.totalStudents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Faculty Members',
      value: departmentStats.totalStaff,
      icon: GraduationCap,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      title: 'Programs Offered',
      value: departmentStats.programs.length,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Pending Tasks',
      value: (parseInt(departmentData.pendingAttendance) || 0) + (parseInt(departmentData.leaveRequests) || 0),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const recentStudents = departmentData.students?.slice(0, 5) || [];
  const urgentAlerts = departmentData.alerts?.filter(alert => alert.priority === 'high') || [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
            <p className="text-blue-100 mt-2 text-lg font-medium">{departmentData.name || 'Department'} Overview</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            <span className="text-blue-100 text-sm font-medium">Staff User</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 ${stat.borderColor} bg-white`}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">{stat.title}</p>
                    <p className="text-4xl font-bold text-gray-900 leading-none">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.bgColor} shadow-sm`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Department Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Department Overview */}
        <Card className="lg:col-span-2 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              Department Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{departmentData.name || 'Department'}</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {departmentData.description || `The ${departmentData.name || 'Department'} is committed to providing quality education and fostering innovation in the field. Our experienced faculty and modern facilities ensure students receive comprehensive knowledge and practical skills.`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Programs Offered</h4>
                  <div className="space-y-2">
                    {departmentData.programs?.map((program, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white p-2 rounded-md shadow-sm">
                        <Award className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{program}</span>
                      </div>
                    )) || (
                      <p className="text-sm text-gray-500 italic">No programs listed</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm">
                      <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{departmentData.contact?.phone || '+1 (555) 123-4567'}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm">
                      <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{departmentData.contact?.email || `${(departmentData.name || 'department').toLowerCase().replace(/\s+/g, '')}@college.edu`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <div className="p-2 bg-green-50 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {[
                { time: '09:00 AM', activity: 'Faculty Meeting', type: 'meeting' },
                { time: '11:00 AM', activity: 'Lecture - Advanced Topics', type: 'lecture' },
                { time: '02:00 PM', activity: 'Student Consultation', type: 'consultation' },
                { time: '04:00 PM', activity: 'Department Review', type: 'review' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                    item.type === 'meeting' ? 'bg-blue-500' :
                    item.type === 'lecture' ? 'bg-green-500' :
                    item.type === 'consultation' ? 'bg-orange-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900">{item.activity}</p>
                    <p className="text-sm text-gray-600 font-medium">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {[
                {
                  action: 'Attendance marked for CS-301',
                  time: '2 hours ago',
                  type: 'attendance',
                  icon: Clock
                },
                {
                  action: 'Leave request approved',
                  time: '4 hours ago',
                  type: 'leave',
                  icon: FileText
                },
                {
                  action: 'New student enrolled',
                  time: '1 day ago',
                  type: 'enrollment',
                  icon: Users
                },
                {
                  action: 'Department meeting scheduled',
                  time: '2 days ago',
                  type: 'meeting',
                  icon: Calendar
                }
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-full ${
                      activity.type === 'attendance' ? 'bg-blue-100' :
                      activity.type === 'leave' ? 'bg-green-100' :
                      activity.type === 'enrollment' ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        activity.type === 'attendance' ? 'text-blue-600' :
                        activity.type === 'leave' ? 'text-green-600' :
                        activity.type === 'enrollment' ? 'text-purple-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600 font-medium">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Department Statistics */}
        <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              Department Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              {/* Attendance Rate */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold text-gray-800">Overall Attendance</span>
                  <span className="text-lg font-bold text-green-600">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{width: '87%'}}></div>
                </div>
              </div>
              
              {/* Pass Rate */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold text-gray-800">Pass Rate</span>
                  <span className="text-lg font-bold text-blue-600">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{width: '92%'}}></div>
                </div>
              </div>
              
              {/* Student Satisfaction */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold text-gray-800">Student Satisfaction</span>
                  <span className="text-lg font-bold text-purple-600">4.2/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-500 h-3 rounded-full transition-all duration-500" style={{width: '84%'}}></div>
                </div>
              </div>
              
              {/* Recent Achievements */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="text-base font-semibold text-gray-800 mb-3">Recent Achievements</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Dr. Sarah Wilson - Outstanding Teaching Award</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Prof. David Brown - Research Publication Excellence</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Department - 95% Student Satisfaction Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/attendance')}
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors hover:shadow-md"
            >
              <Clock className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-blue-900">Mark Attendance</p>
                <p className="text-sm text-blue-600">Record student attendance</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/leave-requests')}
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors hover:shadow-md"
            >
              <FileText className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-green-900">Review Leave Requests</p>
                <p className="text-sm text-green-600">Approve or reject requests</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/students')}
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors hover:shadow-md"
            >
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-purple-900">View Students</p>
                <p className="text-sm text-purple-600">Manage student records</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentDashboard;