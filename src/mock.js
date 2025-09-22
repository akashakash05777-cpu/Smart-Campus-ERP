// Mock data for College ERP Portal

export const mockMetrics = {
  totalStudents: 2847,
  feesCollectedToday: 145000,
  hostelOccupancyRate: 78,
  examsThisMonth: 12,
  pendingNotifications: 8,
  outstandingFees: 325000
};

export const mockChartData = {
  monthlyFeeCollection: [
    { month: 'Jan', amount: 850000 },
    { month: 'Feb', amount: 920000 },
    { month: 'Mar', amount: 780000 },
    { month: 'Apr', amount: 1200000 },
    { month: 'May', amount: 950000 },
    { month: 'Jun', amount: 1100000 },
    { month: 'Jul', amount: 1350000 },
    { month: 'Aug', amount: 1180000 },
    { month: 'Sep', amount: 1050000 },
    { month: 'Oct', amount: 980000 },
    { month: 'Nov', amount: 890000 },
    { month: 'Dec', amount: 1250000 }
  ],
  
  hostelOccupancy: [
    { block: 'Block A', occupied: 85, available: 15, maintenance: 5 },
    { block: 'Block B', occupied: 92, available: 8, maintenance: 3 },
    { block: 'Block C', occupied: 78, available: 18, maintenance: 4 },
    { block: 'Block D', occupied: 65, available: 28, maintenance: 7 }
  ],
  
  examResults: [
    { month: 'Jan', passRate: 85, failRate: 15 },
    { month: 'Feb', passRate: 88, failRate: 12 },
    { month: 'Mar', passRate: 82, failRate: 18 },
    { month: 'Apr', passRate: 91, failRate: 9 },
    { month: 'May', passRate: 87, failRate: 13 },
    { month: 'Jun', passRate: 89, failRate: 11 }
  ]
};

export const mockRecentAdmissions = [
  { id: 1, name: 'Arjun Sharma', course: 'B.Tech CSE', admissionDate: '2024-01-15', contact: '+91 9876543210' },
  { id: 2, name: 'Priya Patel', course: 'B.Com', admissionDate: '2024-01-14', contact: '+91 9876543211' },
  { id: 3, name: 'Rohit Kumar', course: 'BBA', admissionDate: '2024-01-13', contact: '+91 9876543212' },
  { id: 4, name: 'Sneha Singh', course: 'B.Sc Physics', admissionDate: '2024-01-12', contact: '+91 9876543213' },
  { id: 5, name: 'Vikram Joshi', course: 'B.Tech ECE', admissionDate: '2024-01-11', contact: '+91 9876543214' }
];

export const mockFeeTransactions = [
  { id: 1, studentName: 'Arjun Sharma', amount: 25000, date: '2024-01-15', mode: 'UPI' },
  { id: 2, studentName: 'Priya Patel', amount: 18000, date: '2024-01-14', mode: 'Bank Transfer' },
  { id: 3, studentName: 'Rohit Kumar', amount: 22000, date: '2024-01-13', mode: 'Card' },
  { id: 4, studentName: 'Sneha Singh', amount: 20000, date: '2024-01-12', mode: 'Cash' },
  { id: 5, studentName: 'Vikram Joshi', amount: 28000, date: '2024-01-11', mode: 'UPI' }
];

export const mockHostelRooms = [
  { roomNo: 'A101', status: 'occupied', studentName: 'Arjun Sharma', block: 'A' },
  { roomNo: 'A102', status: 'available', studentName: null, block: 'A' },
  { roomNo: 'A103', status: 'maintenance', studentName: null, block: 'A' },
  { roomNo: 'A104', status: 'occupied', studentName: 'Rohit Kumar', block: 'A' },
  { roomNo: 'B201', status: 'occupied', studentName: 'Priya Patel', block: 'B' },
  { roomNo: 'B202', status: 'available', studentName: null, block: 'B' },
  { roomNo: 'B203', status: 'reserved', studentName: 'Pending Allocation', block: 'B' }
];

export const mockStudents = [
  { id: 1, name: 'Arjun Sharma', rollNo: 'CS2024001', course: 'B.Tech CSE', feeStatus: 'Paid', dueAmount: 0 },
  { id: 2, name: 'Priya Patel', rollNo: 'CM2024002', course: 'B.Com', feeStatus: 'Partial', dueAmount: 5000 },
  { id: 3, name: 'Rohit Kumar', rollNo: 'BA2024003', course: 'BBA', feeStatus: 'Pending', dueAmount: 25000 },
  { id: 4, name: 'Sneha Singh', rollNo: 'PH2024004', course: 'B.Sc Physics', feeStatus: 'Paid', dueAmount: 0 },
  { id: 5, name: 'Vikram Joshi', rollNo: 'EC2024005', course: 'B.Tech ECE', feeStatus: 'Partial', dueAmount: 8000 }
];

export const mockExamRecords = [
  { id: 1, studentName: 'Arjun Sharma', course: 'B.Tech CSE', examName: 'Semester 1', rollNo: 'CS2024001', marks: 85, rank: 12, result: 'Pass' },
  { id: 2, studentName: 'Priya Patel', course: 'B.Com', examName: 'Semester 1', rollNo: 'CM2024002', marks: 78, rank: 45, result: 'Pass' },
  { id: 3, studentName: 'Rohit Kumar', course: 'BBA', examName: 'Semester 1', rollNo: 'BA2024003', marks: 42, rank: 156, result: 'Fail' },
  { id: 4, studentName: 'Sneha Singh', course: 'B.Sc Physics', examName: 'Semester 1', rollNo: 'PH2024004', marks: 92, rank: 3, result: 'Pass' },
  { id: 5, studentName: 'Vikram Joshi', course: 'B.Tech ECE', examName: 'Semester 1', rollNo: 'EC2024005', marks: 67, rank: 89, result: 'Pass' }
];

export const mockNotifications = [
  { id: 1, title: 'New Admission Alert', message: 'Arjun Sharma has submitted admission form', type: 'admission', read: false, timestamp: '2024-01-15T10:30:00Z' },
  { id: 2, title: 'Fee Payment Received', message: 'Priya Patel paid ₹18,000 via UPI', type: 'fee', read: false, timestamp: '2024-01-14T14:20:00Z' },
  { id: 3, title: 'Hostel Room Allocated', message: 'Room A104 allocated to Rohit Kumar', type: 'hostel', read: true, timestamp: '2024-01-13T09:15:00Z' },
  { id: 4, title: 'Exam Results Published', message: 'Semester 1 results are now available', type: 'exam', read: false, timestamp: '2024-01-12T16:45:00Z' },
  { id: 5, title: 'Maintenance Request', message: 'Room A103 requires maintenance', type: 'hostel', read: true, timestamp: '2024-01-11T11:30:00Z' },
  { id: 6, title: 'Attendance Alert', message: 'Rohit Kumar has been absent for 2 consecutive days', type: 'attendance', read: false, timestamp: '2024-01-15T08:30:00Z' },
  { id: 7, title: 'Low Attendance Warning', message: 'Rajesh Gupta attendance rate dropped below 75%', type: 'attendance', read: false, timestamp: '2024-01-14T16:00:00Z' },
  { id: 8, title: 'Attendance Marked', message: 'Daily attendance has been successfully recorded for B.Tech CSE - Sem 1', type: 'attendance', read: true, timestamp: '2024-01-14T09:30:00Z' },
  { id: 9, title: 'Late Arrival Pattern', message: 'Sneha Singh has been arriving late for 4 consecutive days', type: 'attendance', read: false, timestamp: '2024-01-13T10:15:00Z' }
];

export const paymentModes = ['UPI', 'Bank Transfer', 'Card', 'Cash'];
export const courses = ['B.Tech CSE', 'B.Tech ECE', 'B.Com', 'BBA', 'B.Sc Physics', 'B.Sc Chemistry', 'BA English', 'BA History'];
export const hostelBlocks = ['Block A', 'Block B', 'Block C', 'Block D'];
export const roomStatuses = ['available', 'occupied', 'maintenance', 'reserved'];

// Mock attendance data
export const mockAttendanceRecords = [
  { id: 1, studentName: 'Arjun Sharma', rollNo: 'CS2024001', class: 'B.Tech CSE - Sem 1', date: '2024-01-15', status: 'Present', markedAt: '09:15 AM', method: 'QR Code' },
  { id: 2, studentName: 'Priya Patel', rollNo: 'CM2024002', class: 'B.Com - Sem 1', date: '2024-01-15', status: 'Present', markedAt: '09:10 AM', method: 'Login' },
  { id: 3, studentName: 'Rohit Kumar', rollNo: 'BA2024003', class: 'BBA - Sem 1', date: '2024-01-15', status: 'Absent', markedAt: null, method: null },
  { id: 4, studentName: 'Sneha Singh', rollNo: 'PH2024004', class: 'B.Sc Physics - Sem 1', date: '2024-01-15', status: 'Late', markedAt: '09:45 AM', method: 'Manual' },
  { id: 5, studentName: 'Vikram Joshi', rollNo: 'EC2024005', class: 'B.Tech ECE - Sem 1', date: '2024-01-15', status: 'Present', markedAt: '09:05 AM', method: 'QR Code' },
  { id: 6, studentName: 'Anita Verma', rollNo: 'CH2024006', class: 'B.Sc Chemistry - Sem 1', date: '2024-01-15', status: 'Present', markedAt: '09:20 AM', method: 'Login' },
  { id: 7, studentName: 'Rajesh Gupta', rollNo: 'EN2024007', class: 'BA English - Sem 1', date: '2024-01-15', status: 'Absent', markedAt: null, method: null },
  // Previous day records
  { id: 8, studentName: 'Arjun Sharma', rollNo: 'CS2024001', class: 'B.Tech CSE - Sem 1', date: '2024-01-14', status: 'Present', markedAt: '09:10 AM', method: 'Login' },
  { id: 9, studentName: 'Priya Patel', rollNo: 'CM2024002', class: 'B.Com - Sem 1', date: '2024-01-14', status: 'Late', markedAt: '09:35 AM', method: 'Manual' },
  { id: 10, studentName: 'Rohit Kumar', rollNo: 'BA2024003', class: 'BBA - Sem 1', date: '2024-01-14', status: 'Present', markedAt: '09:15 AM', method: 'QR Code' }
];

export const mockAttendanceStats = {
  totalStudents: 150,
  presentToday: 142,
  absentToday: 5,
  lateToday: 3,
  attendanceRate: 94.7,
  weeklyAttendanceRate: 92.3,
  monthlyAttendanceRate: 89.8
};

export const mockAttendanceAlerts = [
  { id: 1, studentName: 'Rohit Kumar', rollNo: 'BA2024003', type: 'absent', consecutiveDays: 2, message: 'Absent for 2 consecutive days' },
  { id: 2, studentName: 'Rajesh Gupta', rollNo: 'EN2024007', type: 'absent', consecutiveDays: 3, message: 'Absent for 3 consecutive days' },
  { id: 3, studentName: 'Sneha Singh', rollNo: 'PH2024004', type: 'late', consecutiveDays: 4, message: 'Late arrival for 4 consecutive days' }
];

export const attendanceStatuses = ['Present', 'Absent', 'Late'];
export const attendanceMethods = ['Login', 'QR Code', 'Manual'];

// Mock Staff Management data
export const mockStaffProfiles = [
  {
    id: 1,
    staffId: 'FAC001',
    name: 'Dr. Rajesh Kumar',
    department: 'Computer Science',
    designation: 'Professor',
    email: 'rajesh.kumar@college.edu',
    phone: '+91 9876543210',
    joiningDate: '2018-07-15',
    qualifications: 'Ph.D. Computer Science, M.Tech CSE',
    address: '123 Faculty Colony, Delhi',
    emergencyContact: '+91 9876543211',
    bloodGroup: 'B+',
    salary: 85000,
    status: 'Active',
    profileImage: null,
    documents: [
      { type: 'Certificate', name: 'PhD_Certificate.pdf', uploadDate: '2018-07-10' },
      { type: 'ID Proof', name: 'Aadhar_Card.pdf', uploadDate: '2018-07-10' }
    ]
  },
  {
    id: 2,
    staffId: 'FAC002',
    name: 'Prof. Priya Sharma',
    department: 'Mathematics',
    designation: 'Associate Professor',
    email: 'priya.sharma@college.edu',
    phone: '+91 9876543212',
    joiningDate: '2019-08-20',
    qualifications: 'M.Sc Mathematics, B.Ed',
    address: '456 Teacher Residency, Mumbai',
    emergencyContact: '+91 9876543213',
    bloodGroup: 'A+',
    salary: 65000,
    status: 'Active',
    profileImage: null,
    documents: [
      { type: 'Certificate', name: 'MSc_Certificate.pdf', uploadDate: '2019-08-15' },
      { type: 'Contract', name: 'Employment_Contract.pdf', uploadDate: '2019-08-15' }
    ]
  },
  {
    id: 3,
    staffId: 'ADM001',
    name: 'Mr. Vikram Singh',
    department: 'Administration',
    designation: 'Administrative Officer',
    email: 'vikram.singh@college.edu',
    phone: '+91 9876543214',
    joiningDate: '2020-01-10',
    qualifications: 'MBA, B.Com',
    address: '789 Admin Block, Bangalore',
    emergencyContact: '+91 9876543215',
    bloodGroup: 'O+',
    salary: 45000,
    status: 'Active',
    profileImage: null,
    documents: [
      { type: 'Certificate', name: 'MBA_Certificate.pdf', uploadDate: '2020-01-05' },
      { type: 'ID Proof', name: 'PAN_Card.pdf', uploadDate: '2020-01-05' }
    ]
  },
  {
    id: 4,
    staffId: 'FAC003',
    name: 'Dr. Anita Verma',
    department: 'Physics',
    designation: 'Assistant Professor',
    email: 'anita.verma@college.edu',
    phone: '+91 9876543216',
    joiningDate: '2021-03-15',
    qualifications: 'Ph.D. Physics, M.Sc Physics',
    address: '321 Science Block, Chennai',
    emergencyContact: '+91 9876543217',
    bloodGroup: 'AB+',
    salary: 55000,
    status: 'Active',
    profileImage: null,
    documents: [
      { type: 'Certificate', name: 'PhD_Physics.pdf', uploadDate: '2021-03-10' },
      { type: 'Contract', name: 'Faculty_Contract.pdf', uploadDate: '2021-03-10' }
    ]
  },
  {
    id: 5,
    staffId: 'FAC004',
    name: 'Mr. Rohit Gupta',
    department: 'Commerce',
    designation: 'Lecturer',
    email: 'rohit.gupta@college.edu',
    phone: '+91 9876543218',
    joiningDate: '2022-06-01',
    qualifications: 'M.Com, B.Com',
    address: '654 Commerce Wing, Pune',
    emergencyContact: '+91 9876543219',
    bloodGroup: 'B-',
    salary: 40000,
    status: 'On Leave',
    profileImage: null,
    documents: [
      { type: 'Certificate', name: 'MCom_Certificate.pdf', uploadDate: '2022-05-25' },
      { type: 'ID Proof', name: 'Driving_License.pdf', uploadDate: '2022-05-25' }
    ]
  }
];

export const mockStaffRoles = [
  {
    id: 1,
    staffId: 'FAC001',
    staffName: 'Dr. Rajesh Kumar',
    subjects: ['Data Structures', 'Algorithms', 'Database Management'],
    classes: ['B.Tech CSE - Sem 3', 'B.Tech CSE - Sem 5'],
    duties: ['HOD Computer Science', 'Exam Coordinator'],
    workload: 18, // hours per week
    maxWorkload: 20
  },
  {
    id: 2,
    staffId: 'FAC002',
    staffName: 'Prof. Priya Sharma',
    subjects: ['Calculus', 'Linear Algebra', 'Statistics'],
    classes: ['B.Tech - Sem 1', 'B.Com - Sem 2'],
    duties: ['Mathematics Department Coordinator'],
    workload: 16,
    maxWorkload: 18
  },
  {
    id: 3,
    staffId: 'ADM001',
    staffName: 'Mr. Vikram Singh',
    subjects: [],
    classes: [],
    duties: ['Student Records Management', 'Fee Collection Oversight', 'Admission Coordination'],
    workload: 40, // hours per week for admin
    maxWorkload: 40
  },
  {
    id: 4,
    staffId: 'FAC003',
    staffName: 'Dr. Anita Verma',
    subjects: ['Mechanics', 'Thermodynamics', 'Quantum Physics'],
    classes: ['B.Sc Physics - Sem 2', 'B.Sc Physics - Sem 4'],
    duties: ['Lab Coordinator'],
    workload: 15,
    maxWorkload: 18
  },
  {
    id: 5,
    staffId: 'FAC004',
    staffName: 'Mr. Rohit Gupta',
    subjects: ['Accounting', 'Business Studies', 'Economics'],
    classes: ['B.Com - Sem 1', 'BBA - Sem 2'],
    duties: ['Commerce Department Assistant'],
    workload: 12,
    maxWorkload: 16
  }
];

export const mockStaffSchedule = [
  {
    id: 1,
    staffId: 'FAC001',
    staffName: 'Dr. Rajesh Kumar',
    schedule: {
      Monday: [{ time: '09:00-10:00', subject: 'Data Structures', class: 'B.Tech CSE - Sem 3' }, { time: '14:00-15:00', subject: 'Algorithms', class: 'B.Tech CSE - Sem 5' }],
      Tuesday: [{ time: '10:00-11:00', subject: 'Database Management', class: 'B.Tech CSE - Sem 3' }],
      Wednesday: [{ time: '09:00-10:00', subject: 'Data Structures', class: 'B.Tech CSE - Sem 3' }, { time: '15:00-16:00', subject: 'HOD Meeting', class: 'Administration' }],
      Thursday: [{ time: '11:00-12:00', subject: 'Algorithms', class: 'B.Tech CSE - Sem 5' }],
      Friday: [{ time: '14:00-15:00', subject: 'Database Management', class: 'B.Tech CSE - Sem 3' }],
      Saturday: [{ time: '09:00-10:00', subject: 'Exam Coordination', class: 'Administration' }]
    }
  },
  {
    id: 2,
    staffId: 'FAC002',
    staffName: 'Prof. Priya Sharma',
    schedule: {
      Monday: [{ time: '10:00-11:00', subject: 'Calculus', class: 'B.Tech - Sem 1' }],
      Tuesday: [{ time: '09:00-10:00', subject: 'Linear Algebra', class: 'B.Com - Sem 2' }, { time: '15:00-16:00', subject: 'Statistics', class: 'B.Tech - Sem 1' }],
      Wednesday: [{ time: '11:00-12:00', subject: 'Calculus', class: 'B.Tech - Sem 1' }],
      Thursday: [{ time: '10:00-11:00', subject: 'Linear Algebra', class: 'B.Com - Sem 2' }],
      Friday: [{ time: '09:00-10:00', subject: 'Statistics', class: 'B.Tech - Sem 1' }],
      Saturday: []
    }
  }
];

export const mockStaffAttendance = [
  {
    id: 1,
    staffId: 'FAC001',
    staffName: 'Dr. Rajesh Kumar',
    date: '2024-01-15',
    checkIn: '08:45 AM',
    checkOut: '05:30 PM',
    status: 'Present',
    workingHours: 8.75,
    overtime: 0.75
  },
  {
    id: 2,
    staffId: 'FAC002',
    staffName: 'Prof. Priya Sharma',
    date: '2024-01-15',
    checkIn: '09:00 AM',
    checkOut: '05:00 PM',
    status: 'Present',
    workingHours: 8,
    overtime: 0
  },
  {
    id: 3,
    staffId: 'ADM001',
    staffName: 'Mr. Vikram Singh',
    date: '2024-01-15',
    checkIn: '09:15 AM',
    checkOut: '06:00 PM',
    status: 'Late',
    workingHours: 8.75,
    overtime: 0.75
  },
  {
    id: 4,
    staffId: 'FAC003',
    staffName: 'Dr. Anita Verma',
    date: '2024-01-15',
    checkIn: '08:50 AM',
    checkOut: '04:45 PM',
    status: 'Present',
    workingHours: 7.92,
    overtime: 0
  },
  {
    id: 5,
    staffId: 'FAC004',
    staffName: 'Mr. Rohit Gupta',
    date: '2024-01-15',
    checkIn: null,
    checkOut: null,
    status: 'On Leave',
    workingHours: 0,
    overtime: 0
  }
];

export const mockStaffLeaves = [
  {
    id: 1,
    staffId: 'FAC004',
    staffName: 'Mr. Rohit Gupta',
    leaveType: 'Sick Leave',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    days: 3,
    reason: 'Medical treatment',
    status: 'Approved',
    appliedDate: '2024-01-12',
    approvedBy: 'Dr. Rajesh Kumar',
    approvedDate: '2024-01-13'
  },
  {
    id: 2,
    staffId: 'FAC002',
    staffName: 'Prof. Priya Sharma',
    leaveType: 'Casual Leave',
    startDate: '2024-01-20',
    endDate: '2024-01-20',
    days: 1,
    reason: 'Personal work',
    status: 'Pending',
    appliedDate: '2024-01-15',
    approvedBy: null,
    approvedDate: null
  },
  {
    id: 3,
    staffId: 'FAC003',
    staffName: 'Dr. Anita Verma',
    leaveType: 'Annual Leave',
    startDate: '2024-02-01',
    endDate: '2024-02-05',
    days: 5,
    reason: 'Family vacation',
    status: 'Approved',
    appliedDate: '2024-01-10',
    approvedBy: 'Dr. Rajesh Kumar',
    approvedDate: '2024-01-12'
  }
];

export const mockStaffLeaveBalance = [
  {
    staffId: 'FAC001',
    staffName: 'Dr. Rajesh Kumar',
    casualLeave: { total: 12, used: 2, remaining: 10 },
    sickLeave: { total: 12, used: 0, remaining: 12 },
    annualLeave: { total: 21, used: 5, remaining: 16 },
    maternityLeave: { total: 0, used: 0, remaining: 0 }
  },
  {
    staffId: 'FAC002',
    staffName: 'Prof. Priya Sharma',
    casualLeave: { total: 12, used: 3, remaining: 9 },
    sickLeave: { total: 12, used: 1, remaining: 11 },
    annualLeave: { total: 18, used: 8, remaining: 10 },
    maternityLeave: { total: 180, used: 0, remaining: 180 }
  },
  {
    staffId: 'ADM001',
    staffName: 'Mr. Vikram Singh',
    casualLeave: { total: 12, used: 4, remaining: 8 },
    sickLeave: { total: 12, used: 2, remaining: 10 },
    annualLeave: { total: 15, used: 6, remaining: 9 },
    maternityLeave: { total: 0, used: 0, remaining: 0 }
  },
  {
    staffId: 'FAC003',
    staffName: 'Dr. Anita Verma',
    casualLeave: { total: 12, used: 1, remaining: 11 },
    sickLeave: { total: 12, used: 0, remaining: 12 },
    annualLeave: { total: 18, used: 5, remaining: 13 },
    maternityLeave: { total: 180, used: 0, remaining: 180 }
  },
  {
    staffId: 'FAC004',
    staffName: 'Mr. Rohit Gupta',
    casualLeave: { total: 12, used: 5, remaining: 7 },
    sickLeave: { total: 12, used: 3, remaining: 9 },
    annualLeave: { total: 15, used: 3, remaining: 12 },
    maternityLeave: { total: 0, used: 0, remaining: 0 }
  }
];

export const mockStaffPerformance = [
  {
    id: 1,
    staffId: 'FAC001',
    staffName: 'Dr. Rajesh Kumar',
    evaluationPeriod: '2023-24',
    overallRating: 4.8,
    teachingRating: 4.9,
    researchRating: 4.7,
    adminRating: 4.8,
    studentFeedback: 4.6,
    achievements: ['Best Faculty Award 2023', 'Published 3 research papers'],
    goals: ['Complete AI certification', 'Mentor 5 PhD students'],
    comments: 'Excellent performance in all areas. Strong leadership as HOD.',
    evaluatedBy: 'Principal',
    evaluationDate: '2024-01-10'
  },
  {
    id: 2,
    staffId: 'FAC002',
    staffName: 'Prof. Priya Sharma',
    evaluationPeriod: '2023-24',
    overallRating: 4.5,
    teachingRating: 4.7,
    researchRating: 4.2,
    adminRating: 4.4,
    studentFeedback: 4.8,
    achievements: ['Student Choice Award', 'Organized Mathematics Olympiad'],
    goals: ['Pursue PhD', 'Develop online course materials'],
    comments: 'Strong teaching skills with excellent student rapport.',
    evaluatedBy: 'Dr. Rajesh Kumar',
    evaluationDate: '2024-01-08'
  },
  {
    id: 3,
    staffId: 'ADM001',
    staffName: 'Mr. Vikram Singh',
    evaluationPeriod: '2023-24',
    overallRating: 4.3,
    teachingRating: 0, // Not applicable
    researchRating: 0, // Not applicable
    adminRating: 4.6,
    studentFeedback: 4.0,
    achievements: ['Streamlined admission process', 'Reduced processing time by 30%'],
    goals: ['Implement digital document management', 'Complete MBA'],
    comments: 'Efficient administrative work with good process improvements.',
    evaluatedBy: 'Principal',
    evaluationDate: '2024-01-05'
  }
];

export const mockStaffNotifications = [
  {
    id: 1,
    staffId: 'FAC002',
    staffName: 'Prof. Priya Sharma',
    type: 'birthday',
    title: 'Birthday Reminder',
    message: 'Prof. Priya Sharma\'s birthday is tomorrow (Jan 16)',
    date: '2024-01-15',
    read: false
  },
  {
    id: 2,
    staffId: 'FAC004',
    staffName: 'Mr. Rohit Gupta',
    type: 'leave_approval',
    title: 'Leave Approved',
    message: 'Your sick leave application for Jan 15-17 has been approved',
    date: '2024-01-13',
    read: true
  },
  {
    id: 3,
    staffId: 'FAC003',
    staffName: 'Dr. Anita Verma',
    type: 'document_renewal',
    title: 'Document Renewal Reminder',
    message: 'Your contract expires in 30 days. Please renew.',
    date: '2024-01-14',
    read: false
  },
  {
    id: 4,
    staffId: 'ADM001',
    staffName: 'Mr. Vikram Singh',
    type: 'task_reminder',
    title: 'Pending Task',
    message: 'Fee collection report submission deadline is approaching',
    date: '2024-01-15',
    read: false
  }
];

export const staffDepartments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Commerce', 'Administration', 'Library', 'Sports'];
export const staffDesignations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Administrative Officer', 'Librarian', 'Lab Assistant'];
export const leaveTypes = ['Casual Leave', 'Sick Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Emergency Leave'];
export const documentTypes = ['Certificate', 'ID Proof', 'Contract', 'Medical Certificate', 'Address Proof'];
export const staffStatuses = ['Active', 'On Leave', 'Suspended', 'Resigned'];
export const attendanceStatuses_staff = ['Present', 'Absent', 'Late', 'On Leave', 'Half Day'];
export const leaveStatuses = ['Pending', 'Approved', 'Rejected', 'Cancelled'];

// Transport Management Mock Data
export const mockVehicles = [
  {
    id: 'VH001',
    vehicleNumber: 'TN-09-AB-1234',
    type: 'Bus',
    capacity: 45,
    model: 'Tata LP 909',
    year: 2020,
    routeAssigned: 'RT001',
    driverId: 'DR001',
    status: 'Active',
    fuelType: 'Diesel',
    mileage: 12.5,
    lastService: '2024-01-10',
    nextService: '2024-04-10',
    insuranceExpiry: '2024-12-15',
    fitnessExpiry: '2024-11-20',
    pollutionExpiry: '2024-06-30',
    currentLocation: { lat: 13.0827, lng: 80.2707 },
    isTracking: true
  },
  {
    id: 'VH002',
    vehicleNumber: 'TN-09-CD-5678',
    type: 'Mini Bus',
    capacity: 25,
    model: 'Force Traveller',
    year: 2021,
    routeAssigned: 'RT002',
    driverId: 'DR002',
    status: 'Active',
    fuelType: 'Diesel',
    mileage: 14.2,
    lastService: '2024-01-05',
    nextService: '2024-04-05',
    insuranceExpiry: '2024-10-25',
    fitnessExpiry: '2024-09-15',
    pollutionExpiry: '2024-07-20',
    currentLocation: { lat: 13.0067, lng: 80.2206 },
    isTracking: true
  },
  {
    id: 'VH003',
    vehicleNumber: 'TN-09-EF-9012',
    type: 'Van',
    capacity: 12,
    model: 'Mahindra Bolero',
    year: 2019,
    routeAssigned: 'RT003',
    driverId: 'DR003',
    status: 'Maintenance',
    fuelType: 'Diesel',
    mileage: 16.8,
    lastService: '2024-01-15',
    nextService: '2024-04-15',
    insuranceExpiry: '2024-08-30',
    fitnessExpiry: '2024-07-10',
    pollutionExpiry: '2024-05-15',
    currentLocation: { lat: 13.0358, lng: 80.1564 },
    isTracking: false
  },
  {
    id: 'VH004',
    vehicleNumber: 'TN-09-GH-3456',
    type: 'Bus',
    capacity: 50,
    model: 'Ashok Leyland',
    year: 2022,
    routeAssigned: 'RT004',
    driverId: 'DR004',
    status: 'Active',
    fuelType: 'CNG',
    mileage: 8.5,
    lastService: '2024-01-08',
    nextService: '2024-04-08',
    insuranceExpiry: '2025-03-20',
    fitnessExpiry: '2025-02-28',
    pollutionExpiry: '2024-08-10',
    currentLocation: { lat: 13.1185, lng: 80.2335 },
    isTracking: true
  }
];

export const mockDrivers = [
  {
    id: 'DR001',
    name: 'Rajesh Kumar',
    employeeId: 'EMP001',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@college.edu',
    licenseNumber: 'TN-0320110012345',
    licenseExpiry: '2025-06-15',
    experience: 8,
    joinDate: '2020-03-15',
    vehicleAssigned: 'VH001',
    status: 'Active',
    address: '123 Anna Nagar, Chennai',
    emergencyContact: '+91 9876543211',
    bloodGroup: 'B+',
    rating: 4.5,
    totalTrips: 1250,
    dutySchedule: {
      monday: { start: '06:00', end: '18:00' },
      tuesday: { start: '06:00', end: '18:00' },
      wednesday: { start: '06:00', end: '18:00' },
      thursday: { start: '06:00', end: '18:00' },
      friday: { start: '06:00', end: '18:00' },
      saturday: { start: '06:00', end: '14:00' },
      sunday: 'Off'
    }
  },
  {
    id: 'DR002',
    name: 'Suresh Singh',
    employeeId: 'EMP002',
    phone: '+91 9876543220',
    email: 'suresh.singh@college.edu',
    licenseNumber: 'TN-0320110012346',
    licenseExpiry: '2024-12-20',
    experience: 12,
    joinDate: '2018-07-10',
    vehicleAssigned: 'VH002',
    status: 'Active',
    address: '456 T. Nagar, Chennai',
    emergencyContact: '+91 9876543221',
    bloodGroup: 'A+',
    rating: 4.8,
    totalTrips: 2100,
    dutySchedule: {
      monday: { start: '06:30', end: '18:30' },
      tuesday: { start: '06:30', end: '18:30' },
      wednesday: { start: '06:30', end: '18:30' },
      thursday: { start: '06:30', end: '18:30' },
      friday: { start: '06:30', end: '18:30' },
      saturday: { start: '06:30', end: '14:30' },
      sunday: 'Off'
    }
  },
  {
    id: 'DR003',
    name: 'Amit Sharma',
    employeeId: 'EMP003',
    phone: '+91 9876543230',
    email: 'amit.sharma@college.edu',
    licenseNumber: 'TN-0320110012347',
    licenseExpiry: '2025-03-10',
    experience: 6,
    joinDate: '2021-01-20',
    vehicleAssigned: 'VH003',
    status: 'On Leave',
    address: '789 Adyar, Chennai',
    emergencyContact: '+91 9876543231',
    bloodGroup: 'O+',
    rating: 4.2,
    totalTrips: 850,
    dutySchedule: {
      monday: { start: '07:00', end: '19:00' },
      tuesday: { start: '07:00', end: '19:00' },
      wednesday: { start: '07:00', end: '19:00' },
      thursday: { start: '07:00', end: '19:00' },
      friday: { start: '07:00', end: '19:00' },
      saturday: { start: '07:00', end: '15:00' },
      sunday: 'Off'
    }
  },
  {
    id: 'DR004',
    name: 'Vikram Yadav',
    employeeId: 'EMP004',
    phone: '+91 9876543240',
    email: 'vikram.yadav@college.edu',
    licenseNumber: 'TN-0320110012348',
    licenseExpiry: '2024-09-25',
    experience: 15,
    joinDate: '2016-05-12',
    vehicleAssigned: 'VH004',
    status: 'Active',
    address: '321 Velachery, Chennai',
    emergencyContact: '+91 9876543241',
    bloodGroup: 'AB+',
    rating: 4.9,
    totalTrips: 3200,
    dutySchedule: {
      monday: { start: '05:30', end: '17:30' },
      tuesday: { start: '05:30', end: '17:30' },
      wednesday: { start: '05:30', end: '17:30' },
      thursday: { start: '05:30', end: '17:30' },
      friday: { start: '05:30', end: '17:30' },
      saturday: { start: '05:30', end: '13:30' },
      sunday: 'Off'
    }
  }
];

export const mockRoutes = [
  {
    id: 'RT001',
    routeName: 'Central Chennai Route',
    routeCode: 'CCR-01',
    vehicleId: 'VH001',
    driverId: 'DR001',
    totalDistance: 24.8,
    estimatedTime: 85,
    status: 'Active',
    stops: [
      { id: 'ST001', name: 'T. Nagar', address: 'T. Nagar Bus Stand, Chennai', time: '07:00', coordinates: { lat: 13.0418, lng: 80.2341 } },
      { id: 'ST002', name: 'Anna Nagar', address: 'Anna Nagar Tower, Chennai', time: '07:15', coordinates: { lat: 13.0850, lng: 80.2101 } },
      { id: 'ST003', name: 'Vadapalani', address: 'Vadapalani Metro Station, Chennai', time: '07:30', coordinates: { lat: 13.0501, lng: 80.2060 } },
      { id: 'ST004', name: 'College Campus', address: 'Main Gate, College', time: '08:00', coordinates: { lat: 13.0827, lng: 80.2707 } }
    ],
    studentsAssigned: 35,
    staffAssigned: 8,
    morningPickup: '07:00',
    eveningDrop: '17:00'
  },
  {
    id: 'RT002',
    routeName: 'South Chennai Route',
    routeCode: 'SCR-02',
    vehicleId: 'VH002',
    driverId: 'DR002',
    totalDistance: 19.5,
    estimatedTime: 80,
    status: 'Active',
    stops: [
      { id: 'ST005', name: 'Adyar', address: 'Adyar Signal, Chennai', time: '07:15', coordinates: { lat: 13.0067, lng: 80.2206 } },
      { id: 'ST006', name: 'Velachery', address: 'Velachery MRTS Station, Chennai', time: '07:30', coordinates: { lat: 12.9815, lng: 80.2209 } },
      { id: 'ST007', name: 'Tambaram', address: 'Tambaram Railway Station, Chennai', time: '07:45', coordinates: { lat: 12.9249, lng: 80.1000 } },
      { id: 'ST008', name: 'College Campus', address: 'South Gate, College', time: '08:15', coordinates: { lat: 13.0827, lng: 80.2707 } }
    ],
    studentsAssigned: 22,
    staffAssigned: 5,
    morningPickup: '07:15',
    eveningDrop: '17:15'
  },
  {
    id: 'RT003',
    routeName: 'West Chennai Route',
    routeCode: 'WCR-03',
    vehicleId: 'VH003',
    driverId: 'DR003',
    totalDistance: 26.2,
    estimatedTime: 90,
    status: 'Inactive',
    stops: [
      { id: 'ST009', name: 'Porur', address: 'Porur Junction, Chennai', time: '07:00', coordinates: { lat: 13.0358, lng: 80.1564 } },
      { id: 'ST010', name: 'Koyambedu', address: 'Koyambedu Bus Terminal, Chennai', time: '07:20', coordinates: { lat: 13.0732, lng: 80.1951 } },
      { id: 'ST011', name: 'Aminjikarai', address: 'Aminjikarai Metro Station, Chennai', time: '07:35', coordinates: { lat: 13.0732, lng: 80.2206 } },
      { id: 'ST012', name: 'College Campus', address: 'West Gate, College', time: '08:05', coordinates: { lat: 13.0827, lng: 80.2707 } }
    ],
    studentsAssigned: 18,
    staffAssigned: 3,
    morningPickup: '07:00',
    eveningDrop: '17:00'
  },
  {
    id: 'RT004',
    routeName: 'North Chennai Route',
    routeCode: 'NCR-04',
    vehicleId: 'VH004',
    driverId: 'DR004',
    totalDistance: 32.1,
    estimatedTime: 100,
    status: 'Active',
    stops: [
      { id: 'ST013', name: 'Perambur', address: 'Perambur Railway Station, Chennai', time: '06:45', coordinates: { lat: 13.1185, lng: 80.2335 } },
      { id: 'ST014', name: 'Kilpauk', address: 'Kilpauk Medical College, Chennai', time: '07:00', coordinates: { lat: 13.0732, lng: 80.2444 } },
      { id: 'ST015', name: 'Egmore', address: 'Egmore Railway Station, Chennai', time: '07:15', coordinates: { lat: 13.0732, lng: 80.2609 } },
      { id: 'ST016', name: 'Purasawalkam', address: 'Purasawalkam High Road, Chennai', time: '07:30', coordinates: { lat: 13.0850, lng: 80.2528 } },
      { id: 'ST017', name: 'College Campus', address: 'North Gate, College', time: '08:00', coordinates: { lat: 13.0827, lng: 80.2707 } }
    ],
    studentsAssigned: 42,
    staffAssigned: 12,
    morningPickup: '06:45',
    eveningDrop: '16:45'
  }
];

export const mockTransportAllocations = [
  {
    id: 'TA001',
    studentId: 'STU001',
    studentName: 'Arjun Sharma',
    course: 'B.Tech CSE',
    routeId: 'RT001',
    stopId: 'ST001',
    vehicleId: 'VH001',
    allocationDate: '2024-01-15',
    status: 'Active',
    feesPaid: true,
    emergencyContact: '+91 9876543210'
  },
  {
    id: 'TA002',
    studentId: 'STU002',
    studentName: 'Priya Patel',
    course: 'B.Com',
    routeId: 'RT002',
    stopId: 'ST005',
    vehicleId: 'VH002',
    allocationDate: '2024-01-14',
    status: 'Active',
    feesPaid: true,
    emergencyContact: '+91 9876543211'
  },
  {
    id: 'TA003',
    studentId: 'STU003',
    studentName: 'Rohit Kumar',
    course: 'BBA',
    routeId: 'RT001',
    stopId: 'ST002',
    vehicleId: 'VH001',
    allocationDate: '2024-01-13',
    status: 'Active',
    feesPaid: false,
    emergencyContact: '+91 9876543212'
  },
  {
    id: 'TA004',
    studentId: 'STU004',
    studentName: 'Sneha Singh',
    course: 'B.Sc Physics',
    routeId: 'RT004',
    stopId: 'ST013',
    vehicleId: 'VH004',
    allocationDate: '2024-01-12',
    status: 'Active',
    feesPaid: true,
    emergencyContact: '+91 9876543213'
  }
];

export const mockTransportAttendance = [
  {
    id: 'TTA001',
    date: '2024-01-15',
    routeId: 'RT001',
    vehicleId: 'VH001',
    driverId: 'DR001',
    morningTrip: {
      startTime: '07:00',
      endTime: '08:05',
      studentsBoarded: 32,
      studentsExpected: 35,
      staffBoarded: 7,
      staffExpected: 8,
      status: 'Completed'
    },
    eveningTrip: {
      startTime: '17:00',
      endTime: '18:10',
      studentsBoarded: 34,
      studentsExpected: 35,
      staffBoarded: 8,
      staffExpected: 8,
      status: 'Completed'
    }
  },
  {
    id: 'TTA002',
    date: '2024-01-15',
    routeId: 'RT002',
    vehicleId: 'VH002',
    driverId: 'DR002',
    morningTrip: {
      startTime: '07:15',
      endTime: '08:20',
      studentsBoarded: 20,
      studentsExpected: 22,
      staffBoarded: 5,
      staffExpected: 5,
      status: 'Completed'
    },
    eveningTrip: {
      startTime: '17:15',
      endTime: '18:25',
      studentsBoarded: 22,
      studentsExpected: 22,
      staffBoarded: 5,
      staffExpected: 5,
      status: 'Completed'
    }
  }
];

export const mockMaintenanceRecords = [
  {
    id: 'MR001',
    vehicleId: 'VH001',
    vehicleNumber: 'DL-01-AB-1234',
    maintenanceType: 'Routine Service',
    description: 'Oil change, filter replacement, brake check',
    date: '2024-01-10',
    cost: 8500,
    serviceCenter: 'Authorized Service Center',
    nextServiceDue: '2024-04-10',
    status: 'Completed',
    mechanicName: 'Ravi Kumar',
    partsReplaced: ['Engine Oil', 'Oil Filter', 'Air Filter']
  },
  {
    id: 'MR002',
    vehicleId: 'VH002',
    vehicleNumber: 'DL-01-CD-5678',
    maintenanceType: 'Repair',
    description: 'AC compressor replacement',
    date: '2024-01-05',
    cost: 15000,
    serviceCenter: 'Local Garage',
    nextServiceDue: '2024-04-05',
    status: 'Completed',
    mechanicName: 'Sunil Sharma',
    partsReplaced: ['AC Compressor', 'Refrigerant']
  },
  {
    id: 'MR003',
    vehicleId: 'VH003',
    vehicleNumber: 'DL-01-EF-9012',
    maintenanceType: 'Major Repair',
    description: 'Engine overhaul and transmission repair',
    date: '2024-01-15',
    cost: 45000,
    serviceCenter: 'Authorized Service Center',
    nextServiceDue: '2024-04-15',
    status: 'In Progress',
    mechanicName: 'Deepak Singh',
    partsReplaced: ['Piston Rings', 'Gaskets', 'Transmission Fluid']
  }
];

export const mockTransportNotifications = [
  {
    id: 'TN001',
    type: 'delay',
    title: 'Route Delay Alert',
    message: 'Central Delhi Route (CDR-01) is running 15 minutes late due to traffic',
    routeId: 'RT001',
    vehicleId: 'VH001',
    timestamp: '2024-01-15T07:15:00Z',
    priority: 'medium',
    status: 'active',
    affectedUsers: 43
  },
  {
    id: 'TN002',
    type: 'breakdown',
    title: 'Vehicle Breakdown',
    message: 'Vehicle DL-01-EF-9012 has broken down. Alternative arrangements made.',
    routeId: 'RT003',
    vehicleId: 'VH003',
    timestamp: '2024-01-15T06:30:00Z',
    priority: 'high',
    status: 'resolved',
    affectedUsers: 21
  },
  {
    id: 'TN003',
    type: 'maintenance',
    title: 'Scheduled Maintenance',
    message: 'Vehicle DL-01-AB-1234 scheduled for maintenance on 2024-04-10',
    routeId: 'RT001',
    vehicleId: 'VH001',
    timestamp: '2024-01-14T10:00:00Z',
    priority: 'low',
    status: 'scheduled',
    affectedUsers: 43
  }
];

export const mockDriverPayments = [
  {
    id: 'DP001',
    driverId: 'DR001',
    driverName: 'Rajesh Kumar',
    month: 'January 2024',
    baseSalary: 25000,
    overtimeHours: 15,
    overtimeRate: 150,
    overtimeAmount: 2250,
    bonuses: [
      { type: 'Performance Bonus', amount: 2000 },
      { type: 'Punctuality Bonus', amount: 1000 }
    ],
    deductions: [
      { type: 'PF', amount: 1500 },
      { type: 'ESI', amount: 375 },
      { type: 'Late Fine', amount: 200 }
    ],
    totalEarnings: 30250,
    totalDeductions: 2075,
    netSalary: 28175,
    paymentDate: '2024-01-31',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    bankAccount: 'XXXX-XXXX-1234',
    remarks: 'Excellent performance this month'
  },
  {
    id: 'DP002',
    driverId: 'DR002',
    driverName: 'Suresh Singh',
    month: 'January 2024',
    baseSalary: 23000,
    overtimeHours: 8,
    overtimeRate: 140,
    overtimeAmount: 1120,
    bonuses: [
      { type: 'Safety Bonus', amount: 1500 }
    ],
    deductions: [
      { type: 'PF', amount: 1380 },
      { type: 'ESI', amount: 345 }
    ],
    totalEarnings: 25620,
    totalDeductions: 1725,
    netSalary: 23895,
    paymentDate: '2024-01-31',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    bankAccount: 'XXXX-XXXX-5678',
    remarks: 'Good safety record'
  },
  {
    id: 'DP003',
    driverId: 'DR003',
    driverName: 'Amit Sharma',
    month: 'January 2024',
    baseSalary: 22000,
    overtimeHours: 0,
    overtimeRate: 130,
    overtimeAmount: 0,
    bonuses: [],
    deductions: [
      { type: 'PF', amount: 1320 },
      { type: 'ESI', amount: 330 },
      { type: 'Fuel Shortage Fine', amount: 500 }
    ],
    totalEarnings: 22000,
    totalDeductions: 2150,
    netSalary: 19850,
    paymentDate: '2024-01-31',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    bankAccount: 'XXXX-XXXX-9012',
    remarks: 'Fuel shortage incident reported'
  },
  {
    id: 'DP004',
    driverId: 'DR004',
    driverName: 'Vikram Joshi',
    month: 'January 2024',
    baseSalary: 26000,
    overtimeHours: 20,
    overtimeRate: 160,
    overtimeAmount: 3200,
    bonuses: [
      { type: 'Performance Bonus', amount: 2500 },
      { type: 'Long Route Bonus', amount: 1000 }
    ],
    deductions: [
      { type: 'PF', amount: 1560 },
      { type: 'ESI', amount: 390 }
    ],
    totalEarnings: 32700,
    totalDeductions: 1950,
    netSalary: 30750,
    paymentDate: '2024-01-31',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    bankAccount: 'XXXX-XXXX-3456',
    remarks: 'Outstanding performance on long routes'
  },
  {
    id: 'DP005',
    driverId: 'DR005',
    driverName: 'Manoj Verma',
    month: 'January 2024',
    baseSalary: 24000,
    overtimeHours: 12,
    overtimeRate: 145,
    overtimeAmount: 1740,
    bonuses: [
      { type: 'Attendance Bonus', amount: 1200 }
    ],
    deductions: [
      { type: 'PF', amount: 1440 },
      { type: 'ESI', amount: 360 }
    ],
    totalEarnings: 26940,
    totalDeductions: 1800,
    netSalary: 25140,
    paymentDate: null,
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
    bankAccount: 'XXXX-XXXX-7890',
    remarks: 'Payment processing'
  }
];

export const mockPaymentHistory = [
  {
    id: 'PH001',
    driverId: 'DR001',
    driverName: 'Rajesh Kumar',
    month: 'December 2023',
    netSalary: 27500,
    paymentDate: '2023-12-31',
    status: 'Paid'
  },
  {
    id: 'PH002',
    driverId: 'DR001',
    driverName: 'Rajesh Kumar',
    month: 'November 2023',
    netSalary: 26800,
    paymentDate: '2023-11-30',
    status: 'Paid'
  },
  {
    id: 'PH003',
    driverId: 'DR002',
    driverName: 'Suresh Singh',
    month: 'December 2023',
    netSalary: 23200,
    paymentDate: '2023-12-31',
    status: 'Paid'
  },
  {
    id: 'PH004',
    driverId: 'DR003',
    driverName: 'Amit Sharma',
    month: 'December 2023',
    netSalary: 21500,
    paymentDate: '2023-12-31',
    status: 'Paid'
  },
  {
    id: 'PH005',
    driverId: 'DR004',
    driverName: 'Vikram Joshi',
    month: 'December 2023',
    netSalary: 29800,
    paymentDate: '2023-12-31',
    status: 'Paid'
  }
];

export const paymentStatuses = ['Paid', 'Pending', 'Processing', 'Failed'];
export const paymentMethods = ['Bank Transfer', 'Cash', 'Cheque', 'UPI'];
export const bonusTypes = ['Performance Bonus', 'Punctuality Bonus', 'Safety Bonus', 'Attendance Bonus', 'Long Route Bonus', 'Festival Bonus'];
export const deductionTypes = ['PF', 'ESI', 'Late Fine', 'Fuel Shortage Fine', 'Damage Fine', 'Advance Deduction', 'Loan EMI'];

export const vehicleTypes = ['Bus', 'Mini Bus', 'Van', 'Car'];
export const vehicleStatuses = ['Active', 'Maintenance', 'Inactive', 'Retired'];
export const routeStatuses = ['Active', 'Inactive', 'Under Maintenance'];
export const driverStatuses = ['Active', 'On Leave', 'Suspended', 'Resigned'];
export const maintenanceTypes = ['Routine Service', 'Repair', 'Major Repair', 'Inspection'];
export const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric'];
export const notificationTypes = ['delay', 'breakdown', 'maintenance', 'route_change', 'emergency'];
export const allocationStatuses = ['Active', 'Inactive', 'Suspended', 'Transferred'];