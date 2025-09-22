import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  GraduationCap,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Award
} from 'lucide-react';
import { mockExamRecords, courses } from '../mock';
import { useToast } from '../hooks/use-toast';

const ExaminationRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    course: '',
    examName: '',
    rollNo: '',
    marks: '',
    rank: '',
    result: ''
  });

  const { toast } = useToast();

  const filteredRecords = mockExamRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.examName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === 'all' || record.course === courseFilter;
    const matchesResult = resultFilter === 'all' || record.result.toLowerCase() === resultFilter;
    
    return matchesSearch && matchesCourse && matchesResult;
  });

  const getResultColor = (result) => {
    return result.toLowerCase() === 'pass' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getResultIcon = (result) => {
    return result.toLowerCase() === 'pass' 
      ? <CheckCircle className="h-4 w-4" />
      : <XCircle className="h-4 w-4" />;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      course: '',
      examName: '',
      rollNo: '',
      marks: '',
      rank: '',
      result: ''
    });
    setEditingRecord(null);
  };

  const handleSubmit = () => {
    if (!formData.studentName || !formData.course || !formData.examName || !formData.rollNo) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const marks = parseInt(formData.marks);
    if (marks < 0 || marks > 100) {
      toast({
        title: "Invalid Marks",
        description: "Marks should be between 0 and 100.",
        variant: "destructive"
      });
      return;
    }

    // Auto-determine result based on marks
    const result = marks >= 40 ? 'Pass' : 'Fail';

    if (editingRecord) {
      toast({
        title: "Record Updated!",
        description: `Exam record for ${formData.studentName} has been updated.`,
      });
    } else {
      toast({
        title: "Record Added!",
        description: `Exam record for ${formData.studentName} has been added successfully.`,
      });
    }

    setShowAddDialog(false);
    resetForm();
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      studentName: record.studentName,
      course: record.course,
      examName: record.examName,
      rollNo: record.rollNo,
      marks: record.marks.toString(),
      rank: record.rank.toString(),
      result: record.result
    });
    setShowAddDialog(true);
  };

  const handleDelete = (record) => {
    toast({
      title: "Record Deleted",
      description: `Exam record for ${record.studentName} has been deleted.`,
    });
  };

  const exportRecords = () => {
    toast({
      title: "Records Exported",
      description: "Examination records have been exported to CSV.",
    });
  };

  const getStats = () => {
    const total = mockExamRecords.length;
    const passed = mockExamRecords.filter(r => r.result.toLowerCase() === 'pass').length;
    const failed = total - passed;
    const passPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;
    const averageMarks = total > 0 ? Math.round(mockExamRecords.reduce((sum, r) => sum + r.marks, 0) / total) : 0;
    
    return { total, passed, failed, passPercentage, averageMarks };
  };

  const stats = getStats();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Examination Records</h1>
          <p className="text-gray-600 mt-2">Manage student exam results and academic performance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button onClick={exportRecords} variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-blue-600">{stats.passPercentage}%</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Marks</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageMarks}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Examination Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by student name, roll number, or exam..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Filter by result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="pass">Pass</SelectItem>
                <SelectItem value="fail">Fail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Records Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.studentName}</TableCell>
                    <TableCell>{record.rollNo}</TableCell>
                    <TableCell>{record.course}</TableCell>
                    <TableCell>{record.examName}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{record.marks}/100</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">
                        #{record.rank}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getResultColor(record.result)} flex items-center w-fit`}>
                        {getResultIcon(record.result)}
                        <span className="ml-1">{record.result}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(record)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(record)}
                          className="text-red-600 hover:text-red-800 hover:border-red-300"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Record Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              {editingRecord ? 'Edit' : 'Add'} Examination Record
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <Label htmlFor="rollNo">Roll Number *</Label>
                <Input
                  id="rollNo"
                  value={formData.rollNo}
                  onChange={(e) => handleInputChange('rollNo', e.target.value)}
                  placeholder="Enter roll number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Course *</Label>
                <Select value={formData.course} onValueChange={(value) => handleInputChange('course', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="examName">Exam Name *</Label>
                <Input
                  id="examName"
                  value={formData.examName}
                  onChange={(e) => handleInputChange('examName', e.target.value)}
                  placeholder="e.g., Semester 1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marks">Marks (out of 100) *</Label>
                <Input
                  id="marks"
                  type="number"
                  value={formData.marks}
                  onChange={(e) => handleInputChange('marks', e.target.value)}
                  placeholder="Enter marks"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="rank">Rank</Label>
                <Input
                  id="rank"
                  type="number"
                  value={formData.rank}
                  onChange={(e) => handleInputChange('rank', e.target.value)}
                  placeholder="Enter rank"
                  min="1"
                />
              </div>
            </div>
            
            {formData.marks && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  Auto-calculated result: 
                  <Badge className={`ml-2 ${parseInt(formData.marks) >= 40 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {parseInt(formData.marks) >= 40 ? 'Pass' : 'Fail'}
                  </Badge>
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                {editingRecord ? 'Update' : 'Add'} Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExaminationRecords;