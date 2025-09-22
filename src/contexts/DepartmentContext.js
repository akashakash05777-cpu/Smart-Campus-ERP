import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';

const DepartmentContext = createContext();

export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartment must be used within a DepartmentProvider');
  }
  return context;
};

// Mock department data
const mockDepartmentData = {
  'Computer Science': {
    id: 'cs',
    name: 'Computer Science',
    description: 'The Computer Science department is dedicated to advancing knowledge in computing, software engineering, and emerging technologies. We provide comprehensive education in programming, algorithms, data structures, artificial intelligence, and cybersecurity.',
    totalStudents: 245,
    totalStaff: 18,
    pendingAttendance: 12,
    leaveRequests: 8,
    notifications: 5,
    programs: [
      'B.Tech Computer Science',
      'M.Tech Computer Science',
      'PhD Computer Science',
      'Diploma in Software Engineering'
    ],
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'cs@college.edu'
    },
    students: [
      { id: 1, name: 'John Doe', class: 'CS-A', year: '2024', program: 'BSc CS', attendance: 85 },
      { id: 2, name: 'Jane Smith', class: 'CS-B', year: '2023', program: 'BSc CS', attendance: 92 },
      { id: 3, name: 'Mike Johnson', class: 'CS-A', year: '2024', program: 'MSc CS', attendance: 78 }
    ],
    staff: [
      { id: 1, name: 'Dr. Sarah Wilson', position: 'Professor', leaveStatus: 'Available' },
      { id: 2, name: 'Prof. David Brown', position: 'Associate Professor', leaveStatus: 'On Leave' }
    ],
    leaveApplications: [
      { id: 1, applicant: 'John Doe', type: 'Student', reason: 'Medical', days: 3, status: 'Pending', date: '2024-01-15' },
      { id: 2, applicant: 'Dr. Sarah Wilson', type: 'Staff', reason: 'Conference', days: 2, status: 'Pending', date: '2024-01-18' }
    ],
    alerts: [
      { id: 1, type: 'attendance', message: '12 students have pending attendance marks', priority: 'high' },
      { id: 2, type: 'leave', message: '8 leave requests awaiting approval', priority: 'medium' },
      { id: 3, type: 'maintenance', message: 'Lab equipment maintenance scheduled for tomorrow', priority: 'low' }
    ]
  },
  'Mathematics': {
    id: 'math',
    name: 'Mathematics',
    description: 'The Mathematics department focuses on pure and applied mathematics, statistics, and mathematical modeling. We emphasize analytical thinking and problem-solving skills essential for various fields.',
    totalStudents: 180,
    totalStaff: 15,
    programs: [
      'B.Sc Mathematics',
      'M.Sc Mathematics',
      'B.Sc Statistics',
      'PhD Mathematics'
    ],
    contact: {
      phone: '+1 (555) 234-5678',
      email: 'math@college.edu'
    },
    pendingAttendance: 8,
    leaveRequests: 5,
    notifications: 3,
    students: [
      { id: 4, name: 'Alice Brown', class: 'MATH-A', year: '2024', program: 'BSc Math', attendance: 88 },
      { id: 5, name: 'Bob Wilson', class: 'MATH-B', year: '2023', program: 'BSc Math', attendance: 95 }
    ],
    staff: [
      { id: 3, name: 'Dr. Emily Davis', position: 'Professor', leaveStatus: 'Available' }
    ],
    leaveApplications: [
      { id: 3, applicant: 'Alice Brown', type: 'Student', reason: 'Family Emergency', days: 5, status: 'Pending', date: '2024-01-16' }
    ],
    alerts: [
      { id: 4, type: 'attendance', message: '8 students have pending attendance marks', priority: 'high' },
      { id: 5, type: 'exam', message: 'Mid-term exam schedule finalization due', priority: 'medium' }
    ]
  }
};

export const DepartmentProvider = ({ children }) => {
  const { user } = useAuth();
  const { getDepartmentData, markAttendance: markAttendanceInData, updateLeaveRequest: updateLeaveRequestInData } = useData();
  const [departmentData, setDepartmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (user && user.department) {
          // First try to get data from DataContext using department key
          const departmentKey = user.department.toLowerCase().replace(/\s+/g, '-');
          const data = getDepartmentData(departmentKey);
          
          if (data) {
            // Transform data to include computed fields for backward compatibility
            const students = data.students || [];
            const leaveRequests = data.leaveRequests || [];
            
            const transformedData = {
              ...data,
              recentStudents: students.slice(0, 3).map(student => ({
                id: student.id,
                name: student.name,
                class: student.class,
                lastActivity: '2 hours ago' // Mock activity data
              })),
              urgentAlerts: [
                { id: 1, message: `Attendance pending for ${students.length} students`, priority: 'high' },
                { id: 2, message: `${leaveRequests.filter(r => r.status === 'Pending').length} leave requests awaiting approval`, priority: 'medium' }
              ]
            };
            setDepartmentData(transformedData);
          } else {
            // Fallback to mockDepartmentData using exact department name
            const mockData = mockDepartmentData[user.department];
            if (mockData) {
              setDepartmentData(mockData);
            } else {
              console.warn(`No department data found for: ${user.department}`);
              setDepartmentData(null);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching department data:', error);
        setDepartmentData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [user, getDepartmentData]);

  const updateAttendance = (studentId, attendanceData) => {
    // Mock function to update attendance
    console.log('Updating attendance for student:', studentId, attendanceData);
  };

  const approveLeaveRequest = (requestId) => {
    if (!departmentData || !user?.department) return;
    
    const departmentKey = user.department.toLowerCase().replace(/\s+/g, '-');
    
    const updateData = {
      status: 'Approved',
      approvedBy: user.name || 'Department Admin',
      approvedDate: new Date().toISOString().split('T')[0]
    };
    
    updateLeaveRequestInData(departmentKey, requestId, updateData);
    
    setDepartmentData(prev => ({
      ...prev,
      leaveApplications: prev.leaveApplications.map(req => 
        req.id === requestId ? { ...req, ...updateData } : req
      ),
      leaveRequests: prev.leaveRequests - 1
    }));
  };

  const rejectLeaveRequest = (requestId) => {
    if (!departmentData || !user?.department) return;
    
    const departmentKey = user.department.toLowerCase().replace(/\s+/g, '-');
    
    const updateData = {
      status: 'Rejected',
      rejectedBy: user.name || 'Department Admin',
      rejectedDate: new Date().toISOString().split('T')[0]
    };
    
    updateLeaveRequestInData(departmentKey, requestId, updateData);
    
    setDepartmentData(prev => ({
      ...prev,
      leaveApplications: prev.leaveApplications.map(req => 
        req.id === requestId ? { ...req, ...updateData } : req
      ),
      leaveRequests: prev.leaveRequests - 1
    }));
  };

  const markAttendance = (studentIds, date, status) => {
    if (!departmentData || !user?.department) return;
    
    const departmentKey = user.department.toLowerCase().replace(/\s+/g, '-');
    
    // Create attendance record
    const attendanceRecord = {
      date,
      class: 'All Classes', // You might want to specify this
      subject: 'General Attendance',
      presentStudents: status === 'present' ? studentIds : [],
      absentStudents: status === 'absent' ? studentIds : [],
      totalStudents: studentIds.length
    };
    
    markAttendanceInData(departmentKey, attendanceRecord);
    
    console.log('Marking attendance:', { studentIds, date, status });
    setDepartmentData(prev => ({
      ...prev,
      pendingAttendance: Math.max(0, prev.pendingAttendance - studentIds.length)
    }));
  };

  const value = {
    departmentData,
    loading,
    updateAttendance,
    approveLeaveRequest,
    rejectLeaveRequest,
    markAttendance
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};