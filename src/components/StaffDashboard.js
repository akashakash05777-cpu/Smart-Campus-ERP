import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Users,
  ClipboardCheck,
  FileText,
  Bell,
  Calendar,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  UserCheck,
  UserX,
  MessageSquare,
  Settings,
  Camera,
  Lock,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Home,
  Car,
  BookOpenCheck,
  BookOpen as MarksIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const StaffDashboard = () => {
  const { user } = useAuth();
  const { sharedData } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalStudentsInDepartment: 0,
    pendingAttendanceMarks: 0,
    pendingLeaveRequests: 0,
    departmentNotifications: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [leaveFilter, setLeaveFilter] = useState('pending');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [marksFilter, setMarksFilter] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    position: user?.position || ''
  });

  // Mock data for students in department
  const mockStudents = [
    { 
      id: 1, 
      rollNumber: 'CS2021001', 
      name: 'Ahmed Ali', 
      class: 'CS-4A', 
      program: 'Computer Science', 
      phone: '+92-300-1234567',
      email: 'ahmed.ali@college.edu.pk',
      address: '123 Main Street, Lahore',
      guardian: 'Muhammad Ali',
      guardianPhone: '+92-300-1111111',
      hostel: {
        building: 'Block A',
        room: 'A-201',
        roommate: 'Hassan Sheikh'
      },
      transport: {
        route: 'Route 5 - Gulberg',
        busNumber: 'BUS-05',
        stop: 'Gulberg Main'
      },
      libraryHistory: [
        { title: 'Data Structures and Algorithms', issueDate: '2024-01-15', status: 'returned' },
        { title: 'Computer Networks', issueDate: '2024-01-20', status: 'issued' },
        { title: 'Database Systems', issueDate: '2024-01-10', status: 'overdue' }
      ]
    },
    { 
      id: 2, 
      rollNumber: 'CS2021002', 
      name: 'Fatima Khan', 
      class: 'CS-4A', 
      program: 'Computer Science', 
      phone: '+92-301-2345678',
      email: 'fatima.khan@college.edu.pk',
      address: '456 Garden Town, Lahore',
      guardian: 'Tariq Khan',
      guardianPhone: '+92-301-2222222',
      hostel: {
        building: 'Block B',
        room: 'B-105',
        roommate: 'Ayesha Malik'
      },
      transport: {
        route: 'Route 3 - Model Town',
        busNumber: 'BUS-03',
        stop: 'Model Town Center'
      },
      libraryHistory: [
        { title: 'Software Engineering', issueDate: '2024-01-18', status: 'returned' },
        { title: 'Web Development', issueDate: '2024-01-22', status: 'issued' }
      ]
    },
    { 
      id: 3, 
      rollNumber: 'CS2021003', 
      name: 'Hassan Sheikh', 
      class: 'CS-4B', 
      program: 'Computer Science', 
      phone: '+92-302-3456789',
      email: 'hassan.sheikh@college.edu.pk',
      address: '789 DHA Phase 5, Lahore',
      guardian: 'Abdul Sheikh',
      guardianPhone: '+92-302-3333333',
      hostel: {
        building: 'Block A',
        room: 'A-201',
        roommate: 'Ahmed Ali'
      },
      transport: {
        route: 'Route 7 - DHA',
        busNumber: 'BUS-07',
        stop: 'DHA Phase 5'
      },
      libraryHistory: [
        { title: 'Machine Learning', issueDate: '2024-01-12', status: 'returned' },
        { title: 'Artificial Intelligence', issueDate: '2024-01-25', status: 'issued' }
      ]
    },
    { 
      id: 4, 
      rollNumber: 'CS2021004', 
      name: 'Ayesha Malik', 
      class: 'CS-4B', 
      program: 'Computer Science', 
      phone: '+92-303-4567890',
      email: 'ayesha.malik@college.edu.pk',
      address: '321 Johar Town, Lahore',
      guardian: 'Rashid Malik',
      guardianPhone: '+92-303-4444444',
      hostel: {
        building: 'Block B',
        room: 'B-105',
        roommate: 'Fatima Khan'
      },
      transport: {
        route: 'Route 4 - Johar Town',
        busNumber: 'BUS-04',
        stop: 'Johar Town Market'
      },
      libraryHistory: [
        { title: 'Mobile App Development', issueDate: '2024-01-14', status: 'returned' },
        { title: 'UI/UX Design', issueDate: '2024-01-21', status: 'issued' }
      ]
    },
    { 
      id: 5, 
      rollNumber: 'CS2021005', 
      name: 'Omar Farooq', 
      class: 'CS-4A', 
      program: 'Computer Science', 
      phone: '+92-304-5678901',
      email: 'omar.farooq@college.edu.pk',
      address: '654 Cantt, Lahore',
      guardian: 'Farooq Ahmed',
      guardianPhone: '+92-304-5555555',
      hostel: null,
      transport: null,
      libraryHistory: [
        { title: 'Operating Systems', issueDate: '2024-01-16', status: 'returned' },
        { title: 'Computer Graphics', issueDate: '2024-01-23', status: 'issued' },
        { title: 'Compiler Design', issueDate: '2024-01-08', status: 'overdue' }
      ]
    },
  ];

  // Mock data for comprehensive features
  const mockAttendanceHistory = [
    { id: 1, date: '2024-01-15', class: 'CS-301', subject: 'Computer Networks', present: 42, absent: 3, total: 45, status: 'completed', remarks: 'Regular class' },
    { id: 2, date: '2024-01-14', class: 'CS-302', subject: 'Database Systems', present: 35, absent: 3, total: 38, status: 'completed', remarks: 'Lab session' },
    { id: 3, date: '2024-01-13', class: 'CS-303', subject: 'Software Engineering', present: 40, absent: 2, total: 42, status: 'pending', remarks: 'Pending marks' }
  ];

  const mockLeaveRequests = [
    { id: 1, studentName: 'John Doe', rollNo: 'CS2021001', type: 'Medical', fromDate: '2024-01-16', toDate: '2024-01-18', reason: 'Fever and flu symptoms', status: 'pending', submittedOn: '2024-01-15' },
    { id: 2, studentName: 'Jane Smith', rollNo: 'CS2021002', type: 'Personal', fromDate: '2024-01-20', toDate: '2024-01-22', reason: 'Family function', status: 'pending', submittedOn: '2024-01-14' },
    { id: 3, studentName: 'Mike Johnson', rollNo: 'CS2021003', type: 'Academic', fromDate: '2024-01-12', toDate: '2024-01-12', reason: 'Conference attendance', status: 'approved', submittedOn: '2024-01-10', remarks: 'Approved for academic development' }
  ];

  const mockNotifications = [
    { id: 1, title: 'Department Meeting Scheduled', message: 'Monthly department meeting on Jan 20, 2024 at 2:00 PM', type: 'meeting', isRead: false, createdAt: '2024-01-15T10:00:00Z' },
    { id: 2, title: 'System Maintenance Alert', message: 'ERP system will be down for maintenance on Jan 18, 2024 from 12:00 AM to 4:00 AM', type: 'maintenance', isRead: false, createdAt: '2024-01-14T15:30:00Z' },
    { id: 3, title: 'New Student Admission', message: '5 new students admitted to Computer Science department', type: 'admission', isRead: true, createdAt: '2024-01-13T09:15:00Z' }
  ];

  // Mock marks data for students
  const mockMarks = [
    {
      id: 1,
      studentId: 1,
      rollNumber: 'CS2021001',
      studentName: 'Ahmed Ali',
      class: 'CS-4A',
      subjects: [
        { name: 'Data Structures', midterm: 85, final: 88, assignment: 92, total: 88.3, grade: 'A' },
        { name: 'Computer Networks', midterm: 78, final: 82, assignment: 85, total: 81.7, grade: 'B+' },
        { name: 'Database Systems', midterm: 90, final: 87, assignment: 94, total: 90.3, grade: 'A+' },
        { name: 'Software Engineering', midterm: 82, final: 85, assignment: 88, total: 85.0, grade: 'A' }
      ],
      cgpa: 3.65,
      semester: 'Fall 2024'
    },
    {
      id: 2,
      studentId: 2,
      rollNumber: 'CS2021002',
      studentName: 'Fatima Khan',
      class: 'CS-4A',
      subjects: [
        { name: 'Data Structures', midterm: 92, final: 90, assignment: 95, total: 92.3, grade: 'A+' },
        { name: 'Computer Networks', midterm: 88, final: 85, assignment: 90, total: 87.7, grade: 'A' },
        { name: 'Database Systems', midterm: 85, final: 88, assignment: 87, total: 86.7, grade: 'A' },
        { name: 'Software Engineering', midterm: 90, final: 92, assignment: 94, total: 92.0, grade: 'A+' }
      ],
      cgpa: 3.85,
      semester: 'Fall 2024'
    },
    {
      id: 3,
      studentId: 3,
      rollNumber: 'CS2021003',
      studentName: 'Hassan Sheikh',
      class: 'CS-4B',
      subjects: [
        { name: 'Data Structures', midterm: 75, final: 78, assignment: 80, total: 77.7, grade: 'B+' },
        { name: 'Computer Networks', midterm: 70, final: 72, assignment: 75, total: 72.3, grade: 'B' },
        { name: 'Database Systems', midterm: 80, final: 82, assignment: 85, total: 82.3, grade: 'B+' },
        { name: 'Software Engineering', midterm: 77, final: 80, assignment: 82, total: 79.7, grade: 'B+' }
      ],
      cgpa: 3.15,
      semester: 'Fall 2024'
    }
  ];

  // Calculate department-specific metrics
  useEffect(() => {
    if (sharedData && user) {
      const userDepartment = user.department;
      
      // Filter students by department
      const departmentStudents = sharedData.students?.filter(
        student => student.department === userDepartment
      ) || [];
      
      // Calculate pending attendance (mock data for now)
      const pendingAttendance = mockAttendanceHistory.filter(record => record.status === 'pending').length;
      
      // Calculate pending leave requests (mock data for now)
      const pendingLeaves = mockLeaveRequests.filter(request => request.status === 'pending').length;
      
      // Calculate notifications (mock data for now)
      const unreadNotifications = mockNotifications.filter(notif => !notif.isRead).length;
      
      setDashboardMetrics({
        totalStudentsInDepartment: departmentStudents.length,
        pendingAttendanceMarks: pendingAttendance,
        pendingLeaveRequests: pendingLeaves,
        departmentNotifications: unreadNotifications
      });
      
      setNotifications(mockNotifications);
    }
  }, [sharedData, user]);

  // Helper functions
  const handleMarkAttendance = (classData) => {
    console.log('Marking attendance for:', classData);
    // Implementation for marking attendance
  };

  const handleLeaveAction = (requestId, action, remarks = '') => {
    console.log(`${action} leave request ${requestId}:`, remarks);
    // Implementation for approving/rejecting leave
  };

  const handleExportData = (type, format, period = null) => {
    // Mock export functionality with enhanced reporting
    const timestamp = new Date().toISOString().split('T')[0];
    const periodSuffix = period ? `_${period}` : '';
    const filename = `${type}${periodSuffix}_${format}_${timestamp}`;
    
    let exportData = [];
    let reportTitle = '';
    
    // Generate different data based on type and period
    if (type === 'attendance') {
      reportTitle = `Attendance Report${period ? ` - ${period.charAt(0).toUpperCase() + period.slice(1)}` : ''}`;
      
      if (period === 'daily') {
        exportData = [
          ['Date', 'Class', 'Total Students', 'Present', 'Absent', 'Late', 'Percentage'],
          [new Date().toLocaleDateString(), 'CS-4A', '28', '24', '3', '1', '85.7%'],
          [new Date().toLocaleDateString(), 'CS-4B', '30', '27', '2', '1', '90.0%'],
          [new Date().toLocaleDateString(), 'CS-3A', '25', '22', '2', '1', '88.0%']
        ];
      } else if (period === 'weekly') {
        exportData = [
          ['Week', 'Class', 'Total Classes', 'Avg Attendance', 'Trend'],
          ['Week 1', 'CS-4A', '5', '87.2%', '+2.1%'],
          ['Week 1', 'CS-4B', '5', '91.5%', '+1.8%'],
          ['Week 1', 'CS-3A', '5', '89.3%', '+0.5%']
        ];
      } else if (period === 'monthly') {
        exportData = [
          ['Month', 'Class', 'Total Classes', 'Avg Attendance', 'Best Day', 'Worst Day'],
          ['January 2024', 'CS-4A', '20', '88.5%', 'Monday', 'Friday'],
          ['January 2024', 'CS-4B', '20', '92.1%', 'Tuesday', 'Friday'],
          ['January 2024', 'CS-3A', '20', '90.2%', 'Wednesday', 'Friday']
        ];
      } else {
        exportData = filteredAttendance.map(record => [
          record.date,
          record.studentName,
          record.class,
          record.subject,
          record.status,
          record.remarks || ''
        ]);
      }
    } else if (type === 'students') {
      reportTitle = 'Student Information Report';
      exportData = [
        ['Roll Number', 'Name', 'Class', 'Program', 'Phone', 'Email', 'Guardian', 'Guardian Phone'],
        ...filteredStudents.map(student => [
          student.rollNumber,
          student.name,
          student.class,
          student.program,
          student.phone,
          student.email,
          student.guardian,
          student.guardianPhone
        ])
      ];
    } else if (type === 'leaves') {
      reportTitle = 'Leave Requests Report';
      exportData = [
        ['Student Name', 'Roll No', 'Type', 'From Date', 'To Date', 'Status', 'Reason', 'Remarks'],
        ...filteredLeaveRequests.map(request => [
          request.studentName,
          request.rollNo,
          request.type,
          request.fromDate,
          request.toDate,
          request.status,
          request.reason,
          request.remarks || ''
        ])
      ];
    } else if (type === 'marks') {
      reportTitle = 'Student Marks Report';
      exportData = [
        ['Roll No', 'Student Name', 'Class', 'Subject', 'Midterm', 'Final', 'Assignment', 'Total', 'Grade', 'CGPA', 'Semester']
      ];
      
      // Flatten marks data for export
      mockMarks.forEach(student => {
        student.subjects.forEach(subject => {
          exportData.push([
            student.rollNumber,
            student.studentName,
            student.class,
            subject.name,
            subject.midterm,
            subject.final,
            subject.assignment,
            subject.total,
            subject.grade,
            student.cgpa,
            student.semester
          ]);
        });
      });
    }
    
    // In a real application, this would generate and download the actual file
    if (format === 'csv') {
      const csvContent = exportData.map(row => row.join(',')).join('\n');
      console.log('CSV Content:', csvContent);
      alert(`Exporting ${reportTitle} as CSV...\nFilename: ${filename}.csv\n\nData preview:\n${csvContent.split('\n').slice(0, 3).join('\n')}`);
    } else if (format === 'pdf') {
      alert(`Exporting ${reportTitle} as PDF...\nFilename: ${filename}.pdf\n\nReport will include:\n- ${exportData.length - 1} records\n- Charts and graphs\n- Summary statistics`);
    }
    
    // Simulate file download
    console.log(`Downloading ${filename}.${format}`);
  };

  const handleNotificationRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.program.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredAttendance = mockAttendanceHistory.filter(record => {
    const matchesFilter = attendanceFilter === 'all' || record.status === attendanceFilter;
    const matchesDate = !selectedDate || record.date === selectedDate;
    return matchesFilter && matchesDate;
  });

  const filteredLeaveRequests = mockLeaveRequests.filter(request => {
    const matchesFilter = leaveFilter === 'all' || request.status === leaveFilter;
    const matchesSearch = request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const staffMetrics = [
    {
      title: 'Total Students in Department',
      value: dashboardMetrics.totalStudentsInDepartment.toString(),
      subtitle: `${user?.department || 'Department'} students`,
      icon: Users,
      color: 'text-white',
      bgColor: 'bg-blue-500',
      changeColor: 'text-blue-600'
    },
    {
      title: 'Pending Attendance Marks',
      value: dashboardMetrics.pendingAttendanceMarks.toString(),
      subtitle: 'Classes to mark',
      icon: ClipboardCheck,
      color: 'text-white',
      bgColor: 'bg-orange-500',
      changeColor: 'text-orange-600'
    },
    {
      title: 'Pending Leave Requests',
      value: dashboardMetrics.pendingLeaveRequests.toString(),
      subtitle: 'Awaiting approval',
      icon: FileText,
      color: 'text-white',
      bgColor: 'bg-red-500',
      changeColor: 'text-red-600'
    },
    {
      title: 'Department Notifications',
      value: dashboardMetrics.departmentNotifications.toString(),
      subtitle: 'Unread announcements',
      icon: Bell,
      color: 'text-white',
      bgColor: 'bg-purple-500',
      changeColor: 'text-purple-600'
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'attendance', name: 'Attendance', icon: ClipboardCheck },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'marks', name: 'Marks & Grades', icon: MarksIcon },
    { id: 'leaves', name: 'Leave Requests', icon: FileText },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'profile', name: 'Profile', icon: Settings }
  ];

  const quickActions = [
    { name: 'Mark Attendance', icon: ClipboardCheck, color: 'bg-blue-600 hover:bg-blue-700', action: () => setActiveTab('attendance') },
    { name: 'View Marks & Grades', icon: MarksIcon, color: 'bg-indigo-600 hover:bg-indigo-700', action: () => setActiveTab('marks') },
    { name: 'View Leave Requests', icon: FileText, color: 'bg-orange-600 hover:bg-orange-700', action: () => setActiveTab('leaves') },
    { name: 'View Students', icon: Users, color: 'bg-green-600 hover:bg-green-700', action: () => setActiveTab('students') }
  ];

  const recentActivities = [
    {
      type: 'attendance',
      title: 'Attendance marked for CS-301',
      time: '2 hours ago',
      status: 'completed',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'leave',
      title: 'Leave request from John Doe',
      time: '4 hours ago',
      status: 'pending',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      type: 'notification',
      title: 'Department meeting scheduled',
      time: '1 day ago',
      status: 'info',
      icon: Bell,
      color: 'text-blue-600'
    },
    {
      type: 'attendance',
      title: 'Missing attendance for CS-302',
      time: '2 days ago',
      status: 'warning',
      icon: AlertCircle,
      color: 'text-red-600'
    }
  ];

  const upcomingClasses = [
    {
      subject: 'Computer Networks',
      code: 'CS-301',
      time: '10:00 AM - 11:00 AM',
      room: 'Lab 1',
      students: 45
    },
    {
      subject: 'Database Systems',
      code: 'CS-302',
      time: '2:00 PM - 3:00 PM',
      room: 'Room 201',
      students: 38
    },
    {
      subject: 'Software Engineering',
      code: 'CS-303',
      time: '4:00 PM - 5:00 PM',
      room: 'Room 105',
      students: 42
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Staff Member'}!
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.department} Department • {user?.position || 'Staff'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Here's your department overview for today.
            </p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <div>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
            <div className="text-xs">Last updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Staff Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {staffMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-600">{metric.title}</div>
                      <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                        <Icon className={`h-5 w-5 ${metric.color}`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                      <div className="text-xs text-gray-500">{metric.subtitle}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      className={`${action.color} text-white w-full h-12 flex items-center justify-start space-x-3 transition-all duration-200 hover:scale-105`}
                      onClick={action.action}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{action.name}</span>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

             {/* Recent Activities */}
             <Card>
               <CardHeader>
                 <CardTitle>Recent Activities</CardTitle>
                 <p className="text-sm text-gray-600">Your latest actions and updates</p>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {recentActivities.map((activity, index) => {
                     const Icon = activity.icon;
                     return (
                       <div key={index} className="flex items-start space-x-3">
                         <div className={`p-1 rounded-full ${activity.color}`}>
                           <Icon className="h-4 w-4" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="text-sm font-medium text-gray-900">
                             {activity.title}
                           </div>
                           <div className="text-xs text-gray-500">{activity.time}</div>
                         </div>
                         <Badge 
                           variant="outline" 
                           className={`text-xs ${
                             activity.status === 'completed' ? 'text-green-600 border-green-200' :
                             activity.status === 'pending' ? 'text-orange-600 border-orange-200' :
                             activity.status === 'warning' ? 'text-red-600 border-red-200' :
                             'text-blue-600 border-blue-200'
                           }`}
                         >
                           {activity.status}
                         </Badge>
                       </div>
                     );
                   })}
                 </div>
               </CardContent>
             </Card>

             {/* Upcoming Classes */}
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center">
                   <Calendar className="h-5 w-5 mr-2" />
                   Today's Classes
                 </CardTitle>
                 <p className="text-sm text-gray-600">Your scheduled classes</p>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {upcomingClasses.map((classItem, index) => (
                     <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                       <div className="flex items-center justify-between">
                         <div>
                           <div className="font-medium text-sm">{classItem.subject}</div>
                           <div className="text-xs text-gray-600">{classItem.code}</div>
                         </div>
                         <Badge variant="outline" className="text-blue-600 border-blue-200">
                           {classItem.students} students
                         </Badge>
                       </div>
                       <div className="text-xs text-gray-500 mt-1">
                         <div className="flex items-center space-x-2">
                           <Clock className="h-3 w-3" />
                           <span>{classItem.time}</span>
                           <span>•</span>
                           <span>{classItem.room}</span>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
           </div>
         </>
       )}

       {/* Attendance Management Tab */}
       {activeTab === 'attendance' && (
         <div className="space-y-6">
           {/* Attendance Form */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center">
                 <ClipboardCheck className="h-5 w-5 mr-2" />
                 Mark Attendance
               </CardTitle>
               <p className="text-sm text-gray-600">Mark attendance for department students and staff</p>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                   <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                     <option value="">Choose a class...</option>
                     {upcomingClasses.map((cls, index) => (
                       <option key={index} value={cls.code}>{cls.code} - {cls.subject}</option>
                     ))}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                   <input 
                     type="date" 
                     value={selectedDate}
                     onChange={(e) => setSelectedDate(e.target.value)}
                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                 </div>
                 <div className="flex items-end">
                   <Button className="w-full bg-blue-600 hover:bg-blue-700">
                     <ClipboardCheck className="h-4 w-4 mr-2" />
                     Mark Attendance
                   </Button>
                 </div>
               </div>
             </CardContent>
           </Card>

           {/* Attendance History */}
           <Card>
             <CardHeader>
               <div className="flex items-center justify-between">
                 <div>
                   <CardTitle className="flex items-center">
                     <Clock className="h-5 w-5 mr-2" />
                     Attendance History
                   </CardTitle>
                   <p className="text-sm text-gray-600">View and manage attendance records</p>
                 </div>
                 <div className="flex items-center space-x-2">
                   <select 
                     value={attendanceFilter}
                     onChange={(e) => setAttendanceFilter(e.target.value)}
                     className="p-2 border border-gray-300 rounded-md text-sm"
                   >
                     <option value="all">All Records</option>
                     <option value="completed">Completed</option>
                     <option value="pending">Pending</option>
                   </select>
                   <Button variant="outline" size="sm" onClick={() => handleExportData('attendance', 'csv')}>
                     <Download className="h-4 w-4 mr-1" />
                     Export CSV
                   </Button>
                   <Button variant="outline" size="sm" onClick={() => handleExportData('attendance', 'pdf')}>
                     <Download className="h-4 w-4 mr-1" />
                     Export PDF
                   </Button>
                 </div>
               </div>
             </CardHeader>
             <CardContent>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="border-b">
                       <th className="text-left p-2">Date</th>
                       <th className="text-left p-2">Class</th>
                       <th className="text-left p-2">Subject</th>
                       <th className="text-left p-2">Present</th>
                       <th className="text-left p-2">Absent</th>
                       <th className="text-left p-2">Total</th>
                       <th className="text-left p-2">Status</th>
                       <th className="text-left p-2">Remarks</th>
                       <th className="text-left p-2">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {filteredAttendance.map((record) => (
                       <tr key={record.id} className="border-b hover:bg-gray-50">
                         <td className="p-2">{record.date}</td>
                         <td className="p-2 font-medium">{record.class}</td>
                         <td className="p-2">{record.subject}</td>
                         <td className="p-2 text-green-600">{record.present}</td>
                         <td className="p-2 text-red-600">{record.absent}</td>
                         <td className="p-2">{record.total}</td>
                         <td className="p-2">
                           <Badge 
                             variant="outline" 
                             className={record.status === 'completed' ? 'text-green-600 border-green-200' : 'text-orange-600 border-orange-200'}
                           >
                             {record.status}
                           </Badge>
                         </td>
                         <td className="p-2 text-gray-600">{record.remarks}</td>
                         <td className="p-2">
                           <div className="flex items-center space-x-1">
                             <Button variant="ghost" size="sm">
                               <Eye className="h-3 w-3" />
                             </Button>
                             <Button variant="ghost" size="sm">
                               <Edit className="h-3 w-3" />
                             </Button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </CardContent>
           </Card>
         </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Student Information Access
                </CardTitle>
                <p className="text-sm text-gray-600">Searchable and filterable student list for your department</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search by name, roll number, or program..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => handleExportData('students', 'csv')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Students List */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4">Roll No.</th>
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Class</th>
                        <th className="text-left p-4">Program</th>
                        <th className="text-left p-4">Contact</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{student.rollNumber}</td>
                          <td className="p-4">{student.name}</td>
                          <td className="p-4">{student.class}</td>
                          <td className="p-4">{student.program}</td>
                          <td className="p-4">{student.phone}</td>
                          <td className="p-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowStudentProfile(true);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Profile
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Reports Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Attendance Reports
                </CardTitle>
                <p className="text-sm text-gray-600">Generate daily, weekly, and monthly attendance reports</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => handleExportData('attendance', 'csv', 'daily')}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">Daily Report</h3>
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Today's attendance summary for all classes</p>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        handleExportData('attendance', 'csv', 'daily');
                      }}>
                        <Download className="h-3 w-3 mr-1" />
                        CSV
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        handleExportData('attendance', 'pdf', 'daily');
                      }}>
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => handleExportData('attendance', 'csv', 'weekly')}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">Weekly Report</h3>
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">This week's attendance analysis and trends</p>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        handleExportData('attendance', 'csv', 'weekly');
                      }}>
                        <Download className="h-3 w-3 mr-1" />
                        CSV
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        handleExportData('attendance', 'pdf', 'weekly');
                      }}>
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => handleExportData('attendance', 'csv', 'monthly')}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">Monthly Report</h3>
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Complete monthly attendance statistics</p>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        handleExportData('attendance', 'csv', 'monthly');
                      }}>
                        <Download className="h-3 w-3 mr-1" />
                        CSV
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        handleExportData('attendance', 'pdf', 'monthly');
                      }}>
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">87%</div>
                    <div className="text-sm text-gray-600">Today's Average</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-gray-600">This Week</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">89%</div>
                    <div className="text-sm text-gray-600">This Month</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">156</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leave Requests Tab */}
        {activeTab === 'leaves' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Leave Requests Management
                    </CardTitle>
                    <p className="text-sm text-gray-600">Manage leave requests from department students and staff</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select 
                      value={leaveFilter}
                      onChange={(e) => setLeaveFilter(e.target.value)}
                      className="p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Requests</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLeaveRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{request.studentName}</h3>
                            <Badge variant="outline" className="text-xs">{request.rollNo}</Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                request.status === 'approved' ? 'text-green-600 border-green-200' :
                                request.status === 'rejected' ? 'text-red-600 border-red-200' :
                                'text-orange-600 border-orange-200'
                              }`}
                            >
                              {request.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div><span className="font-medium">Type:</span> {request.type}</div>
                            <div><span className="font-medium">Duration:</span> {request.fromDate} to {request.toDate}</div>
                            <div><span className="font-medium">Submitted:</span> {request.submittedOn}</div>
                          </div>
                          <div className="text-sm text-gray-700 mb-3">
                            <span className="font-medium">Reason:</span> {request.reason}
                          </div>
                          {request.remarks && (
                            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              <span className="font-medium">Remarks:</span> {request.remarks}
                            </div>
                          )}
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex items-center space-x-2 ml-4">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleLeaveAction(request.id, 'approve')}
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleLeaveAction(request.id, 'reject')}
                            >
                              <UserX className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Marks & Grades Tab */}
        {activeTab === 'marks' && (
          <div className="space-y-6">
            {/* Marks Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MarksIcon className="h-5 w-5 mr-2" />
                  Student Marks & Grades Management
                </CardTitle>
                <p className="text-sm text-gray-600">View and manage student marks, grades, and academic performance</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search by student name or roll number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <select 
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Classes</option>
                    <option value="CS-4A">CS-4A</option>
                    <option value="CS-4B">CS-4B</option>
                  </select>
                  <select 
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Subjects</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="Database Systems">Database Systems</option>
                    <option value="Software Engineering">Software Engineering</option>
                  </select>
                  <Button variant="outline" onClick={() => handleExportData('marks', 'csv')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Student Marks List */}
            <div className="space-y-4">
              {mockMarks
                .filter(student => {
                  const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesClass = selectedClass === 'all' || student.class === selectedClass;
                  return matchesSearch && matchesClass;
                })
                .map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{student.studentName}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span><strong>Roll No:</strong> {student.rollNumber}</span>
                          <span><strong>Class:</strong> {student.class}</span>
                          <span><strong>CGPA:</strong> <span className="font-semibold text-blue-600">{student.cgpa}</span></span>
                          <span><strong>Semester:</strong> {student.semester}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {student.subjects.length} Subjects
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3 font-medium">Subject</th>
                            <th className="text-center p-3 font-medium">Midterm</th>
                            <th className="text-center p-3 font-medium">Final</th>
                            <th className="text-center p-3 font-medium">Assignment</th>
                            <th className="text-center p-3 font-medium">Total</th>
                            <th className="text-center p-3 font-medium">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {student.subjects
                            .filter(subject => selectedSubject === 'all' || subject.name === selectedSubject)
                            .map((subject, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-3 font-medium">{subject.name}</td>
                              <td className="p-3 text-center">{subject.midterm}</td>
                              <td className="p-3 text-center">{subject.final}</td>
                              <td className="p-3 text-center">{subject.assignment}</td>
                              <td className="p-3 text-center font-semibold">{subject.total}</td>
                              <td className="p-3 text-center">
                                <Badge 
                                  variant="outline"
                                  className={`${
                                    subject.grade === 'A+' ? 'text-green-700 border-green-200 bg-green-50' :
                                    subject.grade === 'A' ? 'text-green-600 border-green-200 bg-green-50' :
                                    subject.grade === 'B+' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                                    subject.grade === 'B' ? 'text-blue-500 border-blue-200 bg-blue-50' :
                                    'text-orange-600 border-orange-200 bg-orange-50'
                                  }`}
                                >
                                  {subject.grade}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit Marks
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Department Notifications
                </CardTitle>
                <p className="text-sm text-gray-600">View announcements, maintenance updates, and system alerts</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        notification.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'
                      }`}
                      onClick={() => handleNotificationRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className={`font-medium ${
                              notification.isRead ? 'text-gray-900' : 'text-blue-900'
                            }`}>
                              {notification.title}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                notification.type === 'meeting' ? 'text-purple-600 border-purple-200' :
                                notification.type === 'maintenance' ? 'text-orange-600 border-orange-200' :
                                'text-green-600 border-green-200'
                              }`}
                            >
                              {notification.type}
                            </Badge>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Profile Settings
                </CardTitle>
                <p className="text-sm text-gray-600">Edit personal information and account settings</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <GraduationCap className="h-4 w-4 inline mr-1" />
                        Department
                      </label>
                      <input
                        type="text"
                        value={profileData.department}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Position
                      </label>
                      <input
                        type="text"
                        value={profileData.position}
                        onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Lock className="h-4 w-4 inline mr-1" />
                        Change Password
                      </label>
                      <Button variant="outline" className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Student Profile Modal */}
        {showStudentProfile && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowStudentProfile(false)}
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Personal Information */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-center mb-4">
                          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl font-bold text-blue-600">
                              {selectedStudent.name.charAt(0)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                          <p className="text-gray-600">{selectedStudent.rollNumber}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Class:</span> {selectedStudent.class}</div>
                          <div><span className="font-medium">Program:</span> {selectedStudent.program}</div>
                          <div><span className="font-medium">Phone:</span> {selectedStudent.phone}</div>
                          <div><span className="font-medium">Email:</span> {selectedStudent.email}</div>
                          <div><span className="font-medium">Address:</span> {selectedStudent.address}</div>
                          <div><span className="font-medium">Guardian:</span> {selectedStudent.guardian}</div>
                          <div><span className="font-medium">Guardian Phone:</span> {selectedStudent.guardianPhone}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Detailed Information */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Attendance Records */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BookOpenCheck className="h-5 w-5 mr-2" />
                          Attendance Records (Last 30 Days)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">85%</div>
                            <div className="text-sm text-gray-600">Overall</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">23</div>
                            <div className="text-sm text-gray-600">Present</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">4</div>
                            <div className="text-sm text-gray-600">Absent</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">1</div>
                            <div className="text-sm text-gray-600">Late</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Recent: Present (Today), Present (Yesterday), Absent (2 days ago)
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Hostel & Transport */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-base">
                            <Home className="h-4 w-4 mr-2" />
                            Hostel Allocation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <div><span className="font-medium">Building:</span> {selectedStudent.hostel?.building || 'Not Allocated'}</div>
                          <div><span className="font-medium">Room:</span> {selectedStudent.hostel?.room || 'N/A'}</div>
                          <div><span className="font-medium">Roommate:</span> {selectedStudent.hostel?.roommate || 'Single'}</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-base">
                            <Car className="h-4 w-4 mr-2" />
                            Transport Allocation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <div><span className="font-medium">Route:</span> {selectedStudent.transport?.route || 'Not Allocated'}</div>
                          <div><span className="font-medium">Bus No:</span> {selectedStudent.transport?.busNumber || 'N/A'}</div>
                          <div><span className="font-medium">Stop:</span> {selectedStudent.transport?.stop || 'N/A'}</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Library History */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BookOpenCheck className="h-5 w-5 mr-2" />
                          Library History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedStudent.libraryHistory?.map((book, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium text-sm">{book.title}</div>
                                <div className="text-xs text-gray-600">Issued: {book.issueDate}</div>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  book.status === 'returned' ? 'text-green-600 border-green-200' :
                                  book.status === 'overdue' ? 'text-red-600 border-red-200' :
                                  'text-blue-600 border-blue-200'
                                }`}
                              >
                                {book.status}
                              </Badge>
                            </div>
                          )) || (
                            <div className="text-sm text-gray-600 text-center py-4">
                              No library history available
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

export default StaffDashboard;