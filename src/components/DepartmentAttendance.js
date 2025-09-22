import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Clock, Users, CheckCircle, XCircle, Calendar, Download, Plus } from 'lucide-react';
import { useDepartment } from '../contexts/DepartmentContext';
import { useAuth } from '../contexts/AuthContext';

const DepartmentAttendance = () => {
  const { user } = useAuth();
  const { departmentData, loading, markAttendance } = useDepartment();
  const [activeTab, setActiveTab] = useState('mark'); // mark, history, reports
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [attendanceData, setAttendanceData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const students = departmentData.students || [];
  const classes = [...new Set(students.map(s => s.class))];

  // Filter students based on selected class
  const filteredStudents = selectedClass === 'all' 
    ? students 
    : students.filter(s => s.class === selectedClass);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = async () => {
    setIsSubmitting(true);
    try {
      const presentStudents = Object.entries(attendanceData)
        .filter(([_, status]) => status === 'present')
        .map(([studentId, _]) => parseInt(studentId));
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      markAttendance(presentStudents, selectedDate, 'present');
      setAttendanceData({});
      alert('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Error marking attendance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAttendanceStats = () => {
    const totalStudents = filteredStudents.length;
    const presentCount = Object.values(attendanceData).filter(status => status === 'present').length;
    const absentCount = Object.values(attendanceData).filter(status => status === 'absent').length;
    const unmarked = totalStudents - presentCount - absentCount;
    
    return { totalStudents, presentCount, absentCount, unmarked };
  };

  const stats = getAttendanceStats();

  // Mock attendance history data
  const attendanceHistory = [
    { date: '2024-01-15', class: 'CS-A', present: 28, absent: 2, total: 30 },
    { date: '2024-01-14', class: 'CS-B', present: 25, absent: 3, total: 28 },
    { date: '2024-01-13', class: 'CS-A', present: 29, absent: 1, total: 30 },
    { date: '2024-01-12', class: 'CS-B', present: 27, absent: 1, total: 28 }
  ];

  const renderMarkAttendance = () => (
    <div className="space-y-6">
      {/* Date and Class Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setAttendanceData({})}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.presentCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absentCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unmarked</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.unmarked}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mark Attendance ({filteredStudents.length} students)
            </CardTitle>
            {Object.keys(attendanceData).length > 0 && (
              <button
                onClick={handleSubmitAttendance}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStudents.map((student) => {
              const status = attendanceData[student.id];
              return (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.class} • {student.program}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'present')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        status === 'present'
                          ? 'bg-green-600 text-white'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'absent')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        status === 'absent'
                          ? 'bg-red-600 text-white'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAttendanceHistory = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceHistory.map((record, index) => {
              const attendanceRate = ((record.present / record.total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{record.class}</h3>
                    <p className="text-sm text-gray-600">{record.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{record.present}/{record.total}</p>
                    <p className={`text-sm ${
                      parseFloat(attendanceRate) >= 90 ? 'text-green-600' :
                      parseFloat(attendanceRate) >= 75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {attendanceRate}% attendance
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Attendance Reports
            </CardTitle>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Quick Reports</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  Daily Attendance Report
                </button>
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  Weekly Attendance Summary
                </button>
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  Monthly Attendance Report
                </button>
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  Low Attendance Alert
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Department Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-900">Average Attendance</span>
                  <span className="font-semibold text-blue-900">87.5%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-900">Students Above 90%</span>
                  <span className="font-semibold text-green-900">156</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-900">Students 75-90%</span>
                  <span className="font-semibold text-yellow-900">67</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-900">Students Below 75%</span>
                  <span className="font-semibold text-red-900">22</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">{departmentData.name} Department</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            {[
              { key: 'mark', label: 'Mark Attendance', icon: Plus },
              { key: 'history', label: 'History', icon: Calendar },
              { key: 'reports', label: 'Reports', icon: Download }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'mark' && renderMarkAttendance()}
      {activeTab === 'history' && renderAttendanceHistory()}
      {activeTab === 'reports' && renderReports()}
    </div>
  );
};

export default DepartmentAttendance;