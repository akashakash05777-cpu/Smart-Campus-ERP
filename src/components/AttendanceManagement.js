import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import { 
  UserCheck, 
  QrCode, 
  Edit, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  BarChart3,
  TrendingUp,
  Bell
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { 
  mockAttendanceRecords, 
  mockAttendanceStats, 
  mockAttendanceAlerts,
  mockStudents,
  attendanceStatuses,
  attendanceMethods,
  courses
} from '../mock';

const AttendanceManagement = () => {
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendanceRecords);
  const [filteredRecords, setFilteredRecords] = useState(mockAttendanceRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [attendanceMethod, setAttendanceMethod] = useState('Manual');
  const [reportType, setReportType] = useState('daily');
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Filter records based on search and filters
  useEffect(() => {
    let filtered = attendanceRecords;

    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(record => record.date === selectedDate);
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(record => record.class.includes(selectedClass));
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }

    setFilteredRecords(filtered);
  }, [attendanceRecords, searchTerm, selectedDate, selectedClass, selectedStatus]);

  const handleMarkAttendance = (studentId, status, method = 'Manual') => {
    const student = mockStudents.find(s => s.id === parseInt(studentId));
    if (!student) return;

    const newRecord = {
      id: Date.now(),
      studentName: student.name,
      rollNo: student.rollNo,
      class: student.course + ' - Sem 1',
      date: selectedDate,
      status: status,
      markedAt: status !== 'Absent' ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : null,
      method: status !== 'Absent' ? method : null
    };

    // Check if attendance already exists for this student and date
    const existingIndex = attendanceRecords.findIndex(
      record => record.rollNo === student.rollNo && record.date === selectedDate
    );

    if (existingIndex >= 0) {
      // Update existing record
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingIndex] = newRecord;
      setAttendanceRecords(updatedRecords);
      toast({
        title: "Attendance Updated",
        description: `${student.name}'s attendance has been updated to ${status}.`,
      });
    } else {
      // Add new record
      setAttendanceRecords([newRecord, ...attendanceRecords]);
      toast({
        title: "Attendance Marked",
        description: `${student.name} marked as ${status} via ${method}.`,
      });
    }

    setIsMarkingAttendance(false);
    setSelectedStudent('');
  };

  const handleQRScan = () => {
    // Simulate QR code scan
    const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
    handleMarkAttendance(randomStudent.id.toString(), 'Present', 'QR Code');
    setShowQRScanner(false);
    toast({
      title: "QR Code Scanned",
      description: `${randomStudent.name} marked present via QR scan.`,
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Present': 'bg-green-100 text-green-800 border-green-200',
      'Absent': 'bg-red-100 text-red-800 border-red-200',
      'Late': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return variants[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const generateReport = () => {
    const reportData = {
      type: reportType,
      date: selectedDate,
      totalRecords: filteredRecords.length,
      present: filteredRecords.filter(r => r.status === 'Present').length,
      absent: filteredRecords.filter(r => r.status === 'Absent').length,
      late: filteredRecords.filter(r => r.status === 'Late').length
    };

    toast({
      title: "Report Generated",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} attendance report has been generated.`,
    });

    // In a real app, this would trigger a download
    console.log('Report Data:', reportData);
  };

  const AttendanceStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{mockAttendanceStats.totalStudents}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-green-600">{mockAttendanceStats.presentToday}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-red-600">{mockAttendanceStats.absentToday}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-blue-600">{mockAttendanceStats.attendanceRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AttendanceAlerts = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Attendance Alerts
        </CardTitle>
        <CardDescription>Students requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAttendanceAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">{alert.studentName}</p>
                  <p className="text-sm text-gray-600">{alert.rollNo}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-red-600">{alert.message}</p>
                <Badge variant="outline" className="text-red-600 border-red-200">
                  {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track and manage student attendance efficiently</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowQRScanner(true)} className="flex items-center">
            <QrCode className="h-4 w-4 mr-2" />
            QR Scan
          </Button>
          <Dialog open={isMarkingAttendance} onOpenChange={setIsMarkingAttendance}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mark Attendance</DialogTitle>
                <DialogDescription>
                  Select a student and mark their attendance status
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="student">Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.name} - {student.rollNo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="method">Method</Label>
                  <Select value={attendanceMethod} onValueChange={setAttendanceMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {attendanceMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleMarkAttendance(selectedStudent, 'Present', attendanceMethod)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={!selectedStudent}
                  >
                    Present
                  </Button>
                  <Button 
                    onClick={() => handleMarkAttendance(selectedStudent, 'Late', attendanceMethod)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                    disabled={!selectedStudent}
                  >
                    Late
                  </Button>
                  <Button 
                    onClick={() => handleMarkAttendance(selectedStudent, 'Absent', attendanceMethod)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={!selectedStudent}
                  >
                    Absent
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* QR Scanner Dialog */}
      <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code Scanner</DialogTitle>
            <DialogDescription>
              Position the QR code within the scanner area
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">QR Scanner Placeholder</p>
                <p className="text-sm text-gray-400">Camera would be active here</p>
              </div>
            </div>
            <Button onClick={handleQRScan} className="w-full">
              Simulate QR Scan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Statistics */}
      <AttendanceStats />

      {/* Alerts */}
      <AttendanceAlerts />

      {/* Main Content */}
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search Student</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Name or Roll Number"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {attendanceStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendance Records</CardTitle>
                <div className="text-sm text-gray-600">
                  Showing {filteredRecords.length} records
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Marked At</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.studentName}</TableCell>
                        <TableCell>{record.rollNo}</TableCell>
                        <TableCell>{record.class}</TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.markedAt || '-'}</TableCell>
                        <TableCell>{record.method || '-'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {/* Report Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Generate Reports
              </CardTitle>
              <CardDescription>
                Generate detailed attendance reports with analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Report</SelectItem>
                      <SelectItem value="weekly">Weekly Report</SelectItem>
                      <SelectItem value="monthly">Monthly Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reportDate">Date Range</Label>
                  <Input
                    id="reportDate"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={generateReport} className="w-full flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>

              {/* Analytics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{mockAttendanceStats.attendanceRate}%</p>
                      <p className="text-sm text-gray-600">Overall Attendance</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{mockAttendanceStats.weeklyAttendanceRate}%</p>
                      <p className="text-sm text-gray-600">Weekly Average</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{mockAttendanceStats.monthlyAttendanceRate}%</p>
                      <p className="text-sm text-gray-600">Monthly Average</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceManagement;