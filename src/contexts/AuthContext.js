import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Unified user credentials for admin and student users only
const unifiedCredentials = {
  // Admin users
  admin: [
    { id: 'ADMIN001', password: 'admin123', name: 'Dr. Sarah Johnson', role: 'Administrator', department: null, email: 'admin@college.edu' },
    { id: 'admin@college.edu', password: 'admin123', name: 'System Administrator', role: 'IT Admin', department: null, email: 'admin@college.edu' }
  ],
  // Staff users
  staff: [
    { id: 'STAFF001', password: 'staff123', name: 'Prof. Mark Anderson', role: 'Staff', department: 'Computer Science', position: 'Professor', email: 'mark.anderson@college.edu', specialization: 'Database Systems' },
    { id: 'STAFF002', password: 'staff123', name: 'Dr. Robert Chen', role: 'Staff', department: 'Mathematics', position: 'Department Head', email: 'robert.chen@college.edu', specialization: 'Applied Mathematics' },
    { id: 'STAFF003', password: 'staff123', name: 'Dr. Lisa Garcia', role: 'Staff', department: 'Physics', position: 'Associate Professor', email: 'lisa.garcia@college.edu', specialization: 'Quantum Physics' },
    { id: 'STAFF004', password: 'staff123', name: 'Prof. David Wilson', role: 'Staff', department: 'Chemistry', position: 'Professor', email: 'david.wilson@college.edu', specialization: 'Organic Chemistry' },
    { id: 'staff@college.edu', password: 'staff123', name: 'Test Staff', role: 'Staff', department: 'Computer Science', position: 'Lecturer', email: 'staff@college.edu', specialization: 'Software Engineering' }
  ],
  // Student users
  students: [
    { id: 'STU001', password: 'student123', name: 'John Smith', role: 'Student', course: 'Computer Science', year: '3rd Year', rollNumber: 'CS2021001', email: 'john.smith@college.edu' },
    { id: 'STU002', password: 'student123', name: 'Emma Johnson', role: 'Student', course: 'Mathematics', year: '2nd Year', rollNumber: 'MT2022002', email: 'emma.johnson@college.edu' },
    { id: 'STU003', password: 'student123', name: 'Michael Brown', role: 'Student', course: 'Physics', year: '4th Year', rollNumber: 'PH2020003', email: 'michael.brown@college.edu' },
    { id: 'STU004', password: 'student123', name: 'Sarah Davis', role: 'Student', course: 'Chemistry', year: '1st Year', rollNumber: 'CH2023004', email: 'sarah.davis@college.edu' },
    { id: 'student@college.edu', password: 'student123', name: 'Test Student', role: 'Student', course: 'Computer Science', year: '2nd Year', rollNumber: 'CS2022999', email: 'student@college.edu' }
  ]
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sharedData, setSharedData] = useState({});
  const [dataListeners, setDataListeners] = useState([]);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Check for unified user session
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          // Load shared data for this user
          const savedSharedData = localStorage.getItem(`sharedData_${userData.id}`);
          if (savedSharedData) {
            setSharedData(JSON.parse(savedSharedData));
          }
          return;
        }
        
        // Legacy support - check old storage keys and migrate
        const savedStudentUser = localStorage.getItem('studentUser');
        
        if (savedStudentUser) {
          const userData = JSON.parse(savedStudentUser);
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.removeItem('studentUser');
          return;
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('studentUser');
        localStorage.removeItem('currentUser');
        // Clean up any legacy staff user data
        localStorage.removeItem('staffUser');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Real-time data synchronization (defined first)
  const addDataListener = useCallback((callback) => {
    const listenerId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setDataListeners(prev => [...prev, { id: listenerId, callback }]);
    return listenerId;
  }, []);

  const removeDataListener = useCallback((listenerId) => {
    setDataListeners(prev => prev.filter(listener => listener.id !== listenerId));
  }, []);

  const notifyDataListeners = useCallback((event, data) => {
    setDataListeners(currentListeners => {
      currentListeners.forEach(listener => {
        try {
          listener.callback(event, data);
        } catch (error) {
          console.error('Error in data listener:', error);
        }
      });
      return currentListeners; // Return the same array to avoid state update
    });
  }, []);

  const login = useCallback((userData) => {
    const enhancedUserData = {
      ...userData,
      loginTime: new Date().toISOString(),
      sessionId: Date.now().toString()
    };
    
    setUser(enhancedUserData);
    localStorage.setItem('currentUser', JSON.stringify(enhancedUserData));
    
    // Initialize shared data for this user if not exists
    const existingSharedData = localStorage.getItem(`sharedData_${enhancedUserData.id}`);
    if (!existingSharedData) {
      const initialSharedData = {
        notifications: [],
        preferences: {},
        lastActivity: new Date().toISOString()
      };
      setSharedData(initialSharedData);
      localStorage.setItem(`sharedData_${enhancedUserData.id}`, JSON.stringify(initialSharedData));
    }
    
    // Notify all listeners about login
    notifyDataListeners('user_login', enhancedUserData);
  }, [notifyDataListeners]);

  // Unified authentication method
  const authenticateUser = useCallback(async (credentials) => {
    try {
      const { username, password } = credentials;
      
      // Search across admin, staff, and student user types
      const allUsers = [
        ...unifiedCredentials.admin,
        ...unifiedCredentials.staff,
        ...unifiedCredentials.students
      ];
      
      const user = allUsers.find(u => 
        (u.id.toLowerCase() === username.toLowerCase() || 
         u.email?.toLowerCase() === username.toLowerCase()) && 
        u.password === password
      );
      
      if (user) {
        // Call login to set user state
        login(user);
        return { success: true, user };
      } else {
        return { success: false, message: 'Invalid credentials. Please check your username and password.' };
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, message: 'Authentication failed. Please try again.' };
    }
  }, [login]);

  const logout = useCallback(() => {
    if (user) {
      // Save final shared data state
      const finalSharedData = {
        ...sharedData,
        lastActivity: new Date().toISOString()
      };
      localStorage.setItem(`sharedData_${user.id}`, JSON.stringify(finalSharedData));
      
      // Notify listeners about logout
      notifyDataListeners('user_logout', user);
    }
    
    setUser(null);
    setSharedData({});
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginType'); // Clear login type to prevent flickering
    localStorage.removeItem('staffUser'); // Legacy cleanup
    localStorage.removeItem('studentUser'); // Legacy cleanup
  }, [user, sharedData, notifyDataListeners]);

  // Shared data management functions
  const updateSharedData = useCallback((key, value) => {
    const newSharedData = {
      ...sharedData,
      [key]: value,
      lastActivity: new Date().toISOString()
    };
    
    setSharedData(newSharedData);
    
    if (user) {
      localStorage.setItem(`sharedData_${user.id}`, JSON.stringify(newSharedData));
      // Notify all listeners about data change
      notifyDataListeners('data_update', { key, value, userId: user.id });
    }
  }, [sharedData, user, notifyDataListeners]);

  const getSharedData = useCallback((key) => {
    return key ? sharedData[key] : sharedData;
  }, [sharedData]);



  const updateUser = useCallback((updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('currentUser', JSON.stringify(newUserData));
    
    // Notify listeners about user update
    notifyDataListeners('user_update', newUserData);
  }, [user, notifyDataListeners]);

  // Role checking functions (enhanced)
  const isAdmin = useCallback(() => {
    return user && ['Administrator', 'IT Admin'].includes(user.role);
  }, [user]);

  const isStaff = useCallback(() => {
    return user && user.role === 'Staff';
  }, [user]);

  const isStudent = useCallback(() => {
    return user && user.role === 'Student';
  }, [user]);

  // Cross-platform data access
  const switchUserRole = useCallback(async (newRole) => {
    if (!user || !isAdmin()) {
      throw new Error('Unauthorized: Only administrators can switch roles');
    }
    
    const updatedUser = { ...user, role: newRole };
    updateUser(updatedUser);
    return updatedUser;
  }, [user, isAdmin, updateUser]);

  // Get all users (admin only)
  const getAllUsers = useCallback(() => {
    if (!isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    return {
      admin: unifiedCredentials.admin,
      students: unifiedCredentials.students
    };
  }, [isAdmin]);

  const isAuthenticated = useCallback(() => {
    return user !== null;
  }, [user]);

  const hasRole = useCallback((requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  }, [user]);

  const hasAnyRole = useCallback((roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const value = {
    // User state
    user,
    isLoading,
    sharedData,
    
    // Authentication methods
    authenticateUser,
    login,
    logout,
    updateUser,
    
    // Role checking methods
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isStudent,
    isStaff,
    isAdmin,
    
    // Shared data management
    updateSharedData,
    getSharedData,
    
    // Real-time synchronization
    addDataListener,
    removeDataListener,
    
    // Admin functions
    switchUserRole,
    getAllUsers,
    
    // Unified credentials (for login components)
    unifiedCredentials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;