import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StudentAttendance = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSubject] = useState('all');

  // Mock attendance data
  const mockAttendanceData = {
    subjects: [
      {
        code: 'CS301',
        name: 'Database Management Systems',
        totalClasses: 45,
        attendedClasses: 42,
        percentage: 93.33,
        status: 'excellent',
        instructor: 'Dr. Smith'
      },
      {
        code: 'CS302',
        name: 'Computer Networks',
        totalClasses: 40,
        attendedClasses: 35,
        percentage: 87.50,
        status: 'good',
        instructor: 'Prof. Johnson'
      },
      {
        code: 'CS303',
        name: 'Operating Systems',
        totalClasses: 42,
        attendedClasses: 30,
        percentage: 71.43,
        status: 'warning',
        instructor: 'Dr. Williams'
      },
      {
        code: 'MA301',
        name: 'Discrete Mathematics',
        totalClasses: 38,
        attendedClasses: 36,
        percentage: 94.74,
        status: 'excellent',
        instructor: 'Prof. Davis'
      },
      {
        code: 'CS304',
        name: 'System Programming Lab',
        totalClasses: 30,
        attendedClasses: 28,
        percentage: 93.33,
        status: 'excellent',
        instructor: 'Dr. Brown'
      }
    ],
    dailyAttendance: [
      // January 2025 data
      { date: '2025-01-02', subject: 'CS301', status: 'present', time: '09:00 AM' },
      { date: '2025-01-02', subject: 'CS302', status: 'present', time: '11:00 AM' },
      { date: '2025-01-03', subject: 'CS303', status: 'absent', time: '10:00 AM' },
      { date: '2025-01-03', subject: 'MA301', status: 'present', time: '02:00 PM' },
      { date: '2025-01-06', subject: 'CS304', status: 'present', time: '03:00 PM' },
      { date: '2025-01-07', subject: 'CS301', status: 'present', time: '09:00 AM' },
      { date: '2025-01-07', subject: 'CS302', status: 'late', time: '11:00 AM' },
      { date: '2025-01-08', subject: 'CS303', status: 'present', time: '10:00 AM' },
      { date: '2025-01-08', subject: 'MA301', status: 'present', time: '02:00 PM' },
      { date: '2025-01-09', subject: 'CS304', status: 'present', time: '03:00 PM' },
      { date: '2025-01-10', subject: 'CS301', status: 'present', time: '09:00 AM' },
      { date: '2025-01-10', subject: 'CS302', status: 'present', time: '11:00 AM' },
      { date: '2025-01-13', subject: 'CS303', status: 'absent', time: '10:00 AM' },
      { date: '2025-01-13', subject: 'MA301', status: 'present', time: '02:00 PM' },
      { date: '2025-01-14', subject: 'CS304', status: 'present', time: '03:00 PM' },
      { date: '2025-01-15', subject: 'CS301', status: 'present', time: '09:00 AM' },
      { date: '2025-01-15', subject: 'CS302', status: 'present', time: '11:00 AM' },
      { date: '2025-01-16', subject: 'CS303', status: 'present', time: '10:00 AM' },
      { date: '2025-01-16', subject: 'MA301', status: 'present', time: '02:00 PM' },
      { date: '2025-01-17', subject: 'CS304', status: 'present', time: '03:00 PM' }
    ]
  };

  // Calculate overall attendance
  const calculateOverallAttendance = () => {
    const totalClasses = mockAttendanceData.subjects.reduce((sum, subject) => sum + subject.totalClasses, 0);
    const totalAttended = mockAttendanceData.subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0);
    return totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(2) : 0;
  };

  // Get attendance status color
  const getStatusColor = (status) => {
    const colors = {
      'excellent': 'bg-green-100 text-green-800',
      'good': 'bg-blue-100 text-blue-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get daily attendance status color
  const getDailyStatusColor = (status) => {
    const colors = {
      'present': 'bg-green-500',
      'absent': 'bg-red-500',
      'late': 'bg-yellow-500',
      'excused': 'bg-blue-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  // Get attendance icon
  const getAttendanceIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  // Filter attendance by month and subject
  const getFilteredAttendance = () => {
    return mockAttendanceData.dailyAttendance.filter(record => {
      const recordDate = new Date(record.date);
      const monthMatch = recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
      const subjectMatch = selectedSubject === 'all' || record.subject === selectedSubject;
      return monthMatch && subjectMatch;
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayAttendance = mockAttendanceData.dailyAttendance.filter(record => record.date === dateStr);
      
      days.push({
        date: new Date(currentDate),
        dateStr,
        isCurrentMonth: currentDate.getMonth() === selectedMonth,
        attendance: dayAttendance
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const overallAttendance = calculateOverallAttendance();
  const filteredAttendance = getFilteredAttendance();
  const calendarDays = generateCalendarDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Attendance Tracker</h1>
            <p className="text-blue-100">
              {user?.name} - {user?.course} | Roll No: {user?.rollNumber}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{overallAttendance}%</div>
            <div className="text-blue-100">Overall Attendance</div>
          </div>
        </div>
      </div>

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
                <p className="text-2xl font-bold text-gray-900">{overallAttendance}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Classes Attended</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockAttendanceData.subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockAttendanceData.subjects.reduce((sum, subject) => sum + subject.totalClasses, 0)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subjects at Risk</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockAttendanceData.subjects.filter(subject => subject.percentage < 75).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Attendance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subject-wise Attendance</CardTitle>
              <CardDescription>Track your attendance across all subjects</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAttendanceData.subjects.map((subject, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{subject.name}</h3>
                      <Badge className={getStatusColor(subject.status)}>
                        {subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {subject.code} • Instructor: {subject.instructor}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Classes Attended: {subject.attendedClasses}/{subject.totalClasses}</span>
                      <span>•</span>
                      <span>Percentage: {subject.percentage}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{subject.percentage}%</div>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          subject.percentage >= 90 ? 'bg-green-500' :
                          subject.percentage >= 75 ? 'bg-blue-500' :
                          subject.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(subject.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar and Daily Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attendance Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear(selectedYear - 1);
                    } else {
                      setSelectedMonth(selectedMonth - 1);
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[120px] text-center">
                  {monthNames[selectedMonth]} {selectedYear}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (selectedMonth === 11) {
                      setSelectedMonth(0);
                      setSelectedYear(selectedYear + 1);
                    } else {
                      setSelectedMonth(selectedMonth + 1);
                    }
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`p-2 text-center text-sm border rounded ${
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <div className="font-medium">{day.date.getDate()}</div>
                  <div className="flex justify-center gap-1 mt-1">
                    {day.attendance.slice(0, 3).map((record, i) => (
                      <div 
                        key={i}
                        className={`w-2 h-2 rounded-full ${getDailyStatusColor(record.status)}`}
                        title={`${record.subject}: ${record.status}`}
                      ></div>
                    ))}
                    {day.attendance.length > 3 && (
                      <div className="text-xs text-gray-500">+{day.attendance.length - 3}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Late</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Attendance List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your latest attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAttendance.slice(0, 15).map((record, index) => {
                const subject = mockAttendanceData.subjects.find(s => s.code === record.subject);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getAttendanceIcon(record.status)}
                      <div>
                        <div className="font-medium">{subject?.name || record.subject}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(record.date).toLocaleDateString()} • {record.time}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      className={`${getDailyStatusColor(record.status)} text-white`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Requirements</CardTitle>
          <CardDescription>Important information about attendance policies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">75%</div>
              <div className="text-sm text-gray-600">Minimum Required</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">Good Standing</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Excellent</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Important Notice</div>
                <div className="text-sm text-yellow-700 mt-1">
                  Students with less than 75% attendance may not be eligible to appear for examinations. 
                  Contact your academic advisor if you're at risk.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendance;