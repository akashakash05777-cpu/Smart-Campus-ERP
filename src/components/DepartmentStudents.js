import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Search, Filter, Eye, Phone, Mail } from 'lucide-react';
import { useDepartment } from '../contexts/DepartmentContext';
import { useAuth } from '../contexts/AuthContext';

const DepartmentStudents = () => {
  const { user } = useAuth();
  const { departmentData, loading } = useDepartment();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterProgram, setFilterProgram] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  // Get unique values for filters
  const classes = [...new Set(students.map(s => s.class))];
  const years = [...new Set(students.map(s => s.year))];
  const programs = [...new Set(students.map(s => s.program))];

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    const matchesYear = filterYear === 'all' || student.year === filterYear;
    const matchesProgram = filterProgram === 'all' || student.program === filterProgram;
    
    return matchesSearch && matchesClass && matchesYear && matchesProgram;
  });

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'text-green-600 bg-green-50';
    if (attendance >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Students</h1>
          <p className="text-gray-600">{departmentData.name} Department • {filteredStudents.length} students</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Class Filter */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Program Filter */}
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Programs</option>
              {programs.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterClass('all');
                setFilterYear('all');
                setFilterProgram('all');
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Students List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.class} • {student.program}</p>
                      <p className="text-xs text-gray-500">Year: {student.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(student.attendance)}`}>
                      {student.attendance}% Attendance
                    </div>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Student Details</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-semibold text-xl">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900">{selectedStudent.name}</h4>
                <p className="text-gray-600">{selectedStudent.class}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Program:</span>
                  <p className="font-medium">{selectedStudent.program}</p>
                </div>
                <div>
                  <span className="text-gray-500">Year:</span>
                  <p className="font-medium">{selectedStudent.year}</p>
                </div>
                <div>
                  <span className="text-gray-500">Attendance:</span>
                  <p className={`font-medium ${getAttendanceColor(selectedStudent.attendance).split(' ')[0]}`}>
                    {selectedStudent.attendance}%
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Phone className="h-4 w-4" />
                  Contact
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Mail className="h-4 w-4" />
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentStudents;