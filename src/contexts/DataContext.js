import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

// Create the DataContext
const DataContext = createContext();

// Custom hook to use the DataContext
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Data synchronization events
const DATA_EVENTS = {
  STUDENT_ADDED: 'student_added',
  STUDENT_UPDATED: 'student_updated',
  STUDENT_DELETED: 'student_deleted',
  STAFF_ADDED: 'staff_added',
  STAFF_UPDATED: 'staff_updated',
  STAFF_DELETED: 'staff_deleted',
  LEAVE_ADDED: 'leave_added',
  LEAVE_UPDATED: 'leave_updated',
  ATTENDANCE_ADDED: 'attendance_added',
  ATTENDANCE_UPDATED: 'attendance_updated',
  NOTIFICATION_ADDED: 'notification_added',
  NOTIFICATION_READ: 'notification_read'
};

// Centralized data store with comprehensive department information
const initialData = {
  departments: {
    'computer-science': {
      id: 'computer-science',
      name: 'Computer Science',
      head: 'Dr. Sarah Johnson',
      totalStudents: 245,
      totalStaff: 12,
      location: 'Building A, Floor 3',
      established: '1995',
      programs: ['B.Tech CSE', 'M.Tech CSE', 'PhD CSE'],
      students: [
        {
          id: 1,
          name: 'John Smith',
          rollNumber: 'CS2021001',
          class: 'CS-A',
          year: '3rd Year',
          program: 'B.Tech CSE',
          email: 'john.smith@college.edu',
          phone: '+1234567890',
          attendance: 87.5,
          status: 'Active',
          enrollmentDate: '2021-08-15',
          address: '123 Main St, City'
        },
        {
          id: 2,
          name: 'Emily Davis',
          rollNumber: 'CS2021002',
          class: 'CS-A',
          year: '3rd Year',
          program: 'B.Tech CSE',
          email: 'emily.davis@college.edu',
          phone: '+1234567891',
          attendance: 92.3,
          status: 'Active',
          enrollmentDate: '2021-08-15',
          address: '456 Oak Ave, City'
        },
        {
          id: 3,
          name: 'Michael Brown',
          rollNumber: 'CS2022001',
          class: 'CS-B',
          year: '2nd Year',
          program: 'B.Tech CSE',
          email: 'michael.brown@college.edu',
          phone: '+1234567892',
          attendance: 78.9,
          status: 'Active',
          enrollmentDate: '2022-08-15',
          address: '789 Pine St, City'
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          rollNumber: 'CS2022002',
          class: 'CS-B',
          year: '2nd Year',
          program: 'B.Tech CSE',
          email: 'sarah.wilson@college.edu',
          phone: '+1234567893',
          attendance: 95.1,
          status: 'Active',
          enrollmentDate: '2022-08-15',
          address: '321 Elm St, City'
        },
        {
          id: 5,
          name: 'David Johnson',
          rollNumber: 'CS2023001',
          class: 'CS-C',
          year: '1st Year',
          program: 'B.Tech CSE',
          email: 'david.johnson@college.edu',
          phone: '+1234567894',
          attendance: 89.7,
          status: 'Active',
          enrollmentDate: '2023-08-15',
          address: '654 Maple Ave, City'
        }
      ],
      staff: [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          position: 'Department Head',
          email: 'sarah.johnson@college.edu',
          phone: '+1234567800',
          specialization: 'Artificial Intelligence',
          experience: '15 years',
          joinDate: '2010-01-15'
        },
        {
          id: 2,
          name: 'Prof. Mark Anderson',
          position: 'Professor',
          email: 'mark.anderson@college.edu',
          phone: '+1234567801',
          specialization: 'Database Systems',
          experience: '12 years',
          joinDate: '2012-08-20'
        }
      ],
      leaveRequests: [
        {
          id: 1,
          studentId: 1,
          studentName: 'John Smith',
          type: 'Medical Leave',
          startDate: '2024-01-20',
          endDate: '2024-01-25',
          reason: 'Medical treatment required',
          status: 'Pending',
          appliedDate: '2024-01-15',
          documents: ['medical_certificate.pdf']
        },
        {
          id: 2,
          studentId: 3,
          studentName: 'Michael Brown',
          type: 'Personal Leave',
          startDate: '2024-01-18',
          endDate: '2024-01-19',
          reason: 'Family emergency',
          status: 'Approved',
          appliedDate: '2024-01-12',
          approvedBy: 'Dr. Sarah Johnson',
          approvedDate: '2024-01-13'
        }
      ],
      attendanceRecords: [
        {
          date: '2024-01-15',
          class: 'CS-A',
          subject: 'Data Structures',
          presentStudents: [1, 2],
          absentStudents: [],
          totalStudents: 2
        },
        {
          date: '2024-01-14',
          class: 'CS-B',
          subject: 'Database Management',
          presentStudents: [3, 4],
          absentStudents: [],
          totalStudents: 2
        }
      ]
    },
    'mathematics': {
      id: 'mathematics',
      name: 'Mathematics',
      head: 'Dr. Robert Chen',
      totalStudents: 180,
      totalStaff: 8,
      location: 'Building B, Floor 2',
      established: '1990',
      programs: ['B.Sc Mathematics', 'M.Sc Mathematics', 'PhD Mathematics'],
      students: [
        {
          id: 6,
          name: 'Lisa Garcia',
          rollNumber: 'MATH2021001',
          class: 'MATH-A',
          year: '3rd Year',
          program: 'B.Sc Mathematics',
          email: 'lisa.garcia@college.edu',
          phone: '+1234567895',
          attendance: 91.2,
          status: 'Active',
          enrollmentDate: '2021-08-15',
          address: '987 Cedar St, City'
        }
      ],
      staff: [
        {
          id: 3,
          name: 'Dr. Robert Chen',
          position: 'Department Head',
          email: 'robert.chen@college.edu',
          phone: '+1234567802',
          specialization: 'Applied Mathematics',
          experience: '18 years',
          joinDate: '2008-03-10'
        }
      ],
      leaveRequests: [],
      attendanceRecords: []
    }
  },
  notifications: [
    {
      id: 1,
      type: 'alert',
      priority: 'high',
      title: 'Pending Attendance Marks',
      message: '15 students in CS-A class have missing attendance for January 14, 2024',
      timestamp: new Date().toISOString(),
      department: 'Computer Science',
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      type: 'announcement',
      priority: 'medium',
      title: 'Department Meeting Scheduled',
      message: 'Monthly department meeting scheduled for January 20, 2024 at 2:00 PM in Conference Room A',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      department: 'Computer Science',
      read: false,
      actionRequired: false
    }
  ]
};

// DataProvider component
export const DataProvider = ({ children }) => {
  // Always call useAuth hook, but handle when context is not available
  const authContext = useAuth();
  const { user, addDataListener, removeDataListener, updateSharedData } = authContext || {};
  const [data, setData] = useState(() => {
    // Load data from localStorage if available
    const savedData = localStorage.getItem('college-erp-data');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('college-erp-data', JSON.stringify(data));
  }, [data]);

  // Handle data synchronization events
  const handleDataSyncEvent = useCallback((event, eventData) => {
    switch (event) {
      case DATA_EVENTS.STUDENT_ADDED:
      case DATA_EVENTS.STUDENT_UPDATED:
      case DATA_EVENTS.STUDENT_DELETED:
      case DATA_EVENTS.STAFF_ADDED:
      case DATA_EVENTS.STAFF_UPDATED:
      case DATA_EVENTS.STAFF_DELETED:
      case DATA_EVENTS.ATTENDANCE_MARKED:
      case DATA_EVENTS.NOTIFICATION_ADDED:
        // Refresh data from localStorage to get latest changes
        const latestData = localStorage.getItem('college-erp-data');
        if (latestData) {
          setData(JSON.parse(latestData));
        }
        break;
      default:
        break;
    }
  }, []);

  // Set up real-time data synchronization
  useEffect(() => {
    if (user && addDataListener && removeDataListener) {
      const listenerId = addDataListener((event, eventData) => {
        // Handle real-time data updates from other sessions
        handleDataSyncEvent(event, eventData);
      });

      return () => {
        removeDataListener(listenerId);
      };
    }
  }, [user, addDataListener, removeDataListener]);

  // Broadcast data changes to all connected sessions
  const broadcastDataChange = useCallback((event, eventData) => {
    if (user && updateSharedData) {
      updateSharedData('lastDataEvent', {
        event,
        data: eventData,
        timestamp: new Date().toISOString(),
        userId: user.id
      });
    }
    
    // Also dispatch custom events for local listening
    window.dispatchEvent(new CustomEvent(event, {
      detail: eventData
    }));
  }, [user, updateSharedData]);

  // Department CRUD operations with real-time sync
  const addStudent = useCallback((departmentId, studentData) => {
    const newStudent = {
      ...studentData,
      id: Date.now(), // Simple ID generation
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    
    setData(prevData => {
      const newData = { ...prevData };
      const department = newData.departments[departmentId];
      if (department) {
        if (!department.students) {
          department.students = [];
        }
        department.students.push(newStudent);
        department.totalStudents = department.students.length;
      }
      return newData;
    });
    
    // Broadcast the change
    broadcastDataChange(DATA_EVENTS.STUDENT_ADDED, {
      departmentId,
      student: newStudent,
      userId: user?.id
    });
  }, [user, broadcastDataChange]);

  const updateStudent = useCallback((departmentId, studentId, updatedData) => {
    let updatedStudent = null;
    
    setData(prevData => {
      const newData = { ...prevData };
      const department = newData.departments[departmentId];
      if (department && department.students) {
        const studentIndex = department.students.findIndex(s => s.id === studentId);
        if (studentIndex !== -1) {
          department.students[studentIndex] = { ...department.students[studentIndex], ...updatedData };
          updatedStudent = department.students[studentIndex];
        }
      }
      return newData;
    });
    
    // Broadcast the change
    if (updatedStudent) {
      broadcastDataChange(DATA_EVENTS.STUDENT_UPDATED, {
        departmentId,
        student: updatedStudent,
        userId: user?.id
      });
    }
  }, [user, broadcastDataChange]);

  const deleteStudent = useCallback((departmentId, studentId) => {
    let deletedStudent = null;
    
    setData(prevData => {
      const newData = { ...prevData };
      const department = newData.departments[departmentId];
      if (department && department.students) {
        const studentToDelete = department.students.find(s => s.id === studentId);
        if (studentToDelete) {
          deletedStudent = studentToDelete;
        }
        department.students = department.students.filter(s => s.id !== studentId);
        department.totalStudents = department.students.length;
      }
      return newData;
    });
    
    // Broadcast the change
    if (deletedStudent) {
      broadcastDataChange(DATA_EVENTS.STUDENT_DELETED, {
        departmentId,
        student: deletedStudent,
        userId: user?.id
      });
    }
  }, [user, broadcastDataChange]);

  const addStaff = useCallback((departmentId, staffData) => {
    const newStaff = {
      ...staffData,
      id: Date.now(),
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    
    setData(prevData => {
      const newData = { ...prevData };
      const department = newData.departments[departmentId];
      if (department) {
        department.staff.push(newStaff);
        department.totalStaff = department.staff.length;
      }
      return newData;
    });
    
    // Broadcast the change
    broadcastDataChange(DATA_EVENTS.STAFF_ADDED, {
      departmentId,
      staff: newStaff,
      userId: user?.id
    });
  }, [user, broadcastDataChange]);

  const updateStaff = useCallback((departmentId, staffId, updatedData) => {
    let updatedStaff = null;
    
    setData(prevData => {
      const newData = { ...prevData };
      const department = newData.departments[departmentId];
      if (department) {
        const staffIndex = department.staff.findIndex(s => s.id === staffId);
        if (staffIndex !== -1) {
          department.staff[staffIndex] = { ...department.staff[staffIndex], ...updatedData };
          updatedStaff = department.staff[staffIndex];
        }
      }
      return newData;
    });
    
    // Broadcast the change
    if (updatedStaff) {
      broadcastDataChange(DATA_EVENTS.STAFF_UPDATED, {
        departmentId,
        staff: updatedStaff,
        userId: user?.id
      });
    }
  }, [user, broadcastDataChange]);

  const deleteStaff = useCallback((departmentId, staffId) => {
    let deletedStaff = null;
    
    setData(prevData => {
      const newData = { ...prevData };
      const department = newData.departments[departmentId];
      if (department) {
        const staffToDelete = department.staff.find(s => s.id === staffId);
        if (staffToDelete) {
          deletedStaff = staffToDelete;
        }
        department.staff = department.staff.filter(s => s.id !== staffId);
        department.totalStaff = department.staff.length;
      }
      return newData;
    });
    
    // Broadcast the change
    if (deletedStaff) {
      broadcastDataChange(DATA_EVENTS.STAFF_DELETED, {
        departmentId,
        staff: deletedStaff,
        userId: user?.id
      });
    }
  }, [user, broadcastDataChange]);

  // Leave request operations
  const addLeaveRequest = useCallback((departmentId, leaveData) => {
    const newLeaveRequest = {
      ...leaveData,
      id: Date.now(),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    
    setData(prevData => {
      const newData = { ...prevData };
      const department = newData.departments[departmentId];
      if (department) {
        department.leaveRequests.push(newLeaveRequest);
      }
      return newData;
    });
    
    // Broadcast the change
    broadcastDataChange(DATA_EVENTS.LEAVE_ADDED, {
      departmentId,
      leaveRequest: newLeaveRequest,
      userId: user?.id
    });
  }, [user, broadcastDataChange]);

  const updateLeaveRequest = useCallback((departmentId, leaveId, updatedData) => {
    let updatedLeaveRequest = null;
    
    setData(prevData => {
      const newData = { ...prevData };
      const department = newData.departments[departmentId];
      if (department) {
        const leaveIndex = department.leaveRequests.findIndex(l => l.id === leaveId);
        if (leaveIndex !== -1) {
          department.leaveRequests[leaveIndex] = { ...department.leaveRequests[leaveIndex], ...updatedData };
          updatedLeaveRequest = department.leaveRequests[leaveIndex];
        }
      }
      return newData;
    });
    
    // Broadcast the change
    if (updatedLeaveRequest) {
      broadcastDataChange(DATA_EVENTS.LEAVE_UPDATED, {
        departmentId,
        leaveRequest: updatedLeaveRequest,
        userId: user?.id
      });
    }
  }, [user, broadcastDataChange]);

  // Attendance operations
  const markAttendance = useCallback((departmentId, attendanceData) => {
    let isUpdate = false;
    
    setData(prevData => {
      const newData = { ...prevData };
      const department = newData.departments[departmentId];
      if (department) {
        const existingRecordIndex = department.attendanceRecords.findIndex(
          record => record.date === attendanceData.date && record.class === attendanceData.class
        );
        
        if (existingRecordIndex !== -1) {
          department.attendanceRecords[existingRecordIndex] = attendanceData;
          isUpdate = true;
        } else {
          department.attendanceRecords.push(attendanceData);
        }
      }
      return newData;
    });
    
    // Broadcast the change
    broadcastDataChange(isUpdate ? DATA_EVENTS.ATTENDANCE_UPDATED : DATA_EVENTS.ATTENDANCE_ADDED, {
      departmentId,
      attendanceData,
      userId: user?.id
    });
  }, [user, broadcastDataChange]);

  // Notification operations
  const addNotification = useCallback((notificationData) => {
    const newNotification = {
      ...notificationData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setData(prevData => {
      const newData = { ...prevData };
      newData.notifications.unshift(newNotification);
      return newData;
    });
    
    // Broadcast the change
    broadcastDataChange(DATA_EVENTS.NOTIFICATION_ADDED, {
      notification: newNotification,
      userId: user?.id
    });
  }, [user, broadcastDataChange]);

  const markNotificationAsRead = useCallback((notificationId) => {
    let updatedNotification = null;
    
    setData(prevData => {
      const newData = { ...prevData };
      const notificationIndex = newData.notifications.findIndex(n => n.id === notificationId);
      if (notificationIndex !== -1) {
        newData.notifications[notificationIndex].read = true;
        updatedNotification = newData.notifications[notificationIndex];
      }
      return newData;
    });
    
    // Broadcast the change
    if (updatedNotification) {
      broadcastDataChange(DATA_EVENTS.NOTIFICATION_READ, {
        notification: updatedNotification,
        userId: user?.id
      });
    }
  }, [user, broadcastDataChange]);

  // Get department data by ID
  const getDepartmentData = useCallback((departmentId) => {
    return data.departments[departmentId] || null;
  }, [data.departments]);

  // Get all departments
  const getAllDepartments = useCallback(() => {
    return Object.values(data.departments);
  }, [data.departments]);

  // Get notifications for a specific department
  const getDepartmentNotifications = useCallback((departmentName) => {
    return data.notifications.filter(n => n.department === departmentName || n.department === 'All Departments');
  }, [data.notifications]);

  const value = {
    data,
    // Department operations
    getDepartmentData,
    getAllDepartments,
    // Student operations
    addStudent,
    updateStudent,
    deleteStudent,
    // Staff operations
    addStaff,
    updateStaff,
    deleteStaff,
    // Leave request operations
    addLeaveRequest,
    updateLeaveRequest,
    // Attendance operations
    markAttendance,
    // Notification operations
    addNotification,
    markNotificationAsRead,
    getDepartmentNotifications,
    // Real-time synchronization
    DATA_EVENTS,
    broadcastDataChange,
    handleDataSyncEvent
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;