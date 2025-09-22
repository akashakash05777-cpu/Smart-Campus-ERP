import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Filter,
  Search,
  Download,
  Eye,
  BookOpen,
  TrendingUp
} from 'lucide-react';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');


  // Mock assignment data
  const mockAssignments = [
    {
      id: 1,
      title: 'Data Structures Implementation',
      subject: 'Computer Science',
      description: 'Implement various data structures including linked lists, stacks, and queues',
      dueDate: '2024-02-15',
      submittedDate: '2024-02-14',
      status: 'submitted',
      grade: 'A',
      maxMarks: 100,
      obtainedMarks: 92,
      submissionFile: 'data_structures.zip',
      feedback: 'Excellent implementation with proper documentation.',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Marketing Strategy Analysis',
      subject: 'Business Studies',
      description: 'Analyze current market trends and develop a comprehensive marketing strategy',
      dueDate: '2024-02-20',
      submittedDate: null,
      status: 'pending',
      grade: null,
      maxMarks: 50,
      obtainedMarks: null,
      submissionFile: null,
      feedback: null,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Calculus Problem Set 5',
      subject: 'Mathematics',
      description: 'Solve integration and differentiation problems from chapter 5',
      dueDate: '2024-02-18',
      submittedDate: null,
      status: 'overdue',
      grade: null,
      maxMarks: 75,
      obtainedMarks: null,
      submissionFile: null,
      feedback: null,
      priority: 'high'
    },
    {
      id: 4,
      title: 'Physics Lab Report',
      subject: 'Physics',
      description: 'Write a detailed report on the pendulum experiment conducted in lab',
      dueDate: '2024-02-25',
      submittedDate: '2024-02-23',
      status: 'graded',
      grade: 'B+',
      maxMarks: 40,
      obtainedMarks: 35,
      submissionFile: 'physics_lab_report.pdf',
      feedback: 'Good analysis but could improve on error calculations.',
      priority: 'medium'
    },
    {
      id: 5,
      title: 'English Literature Essay',
      subject: 'English',
      description: 'Write an analytical essay on Shakespeare\'s Hamlet',
      dueDate: '2024-03-01',
      submittedDate: null,
      status: 'pending',
      grade: null,
      maxMarks: 60,
      obtainedMarks: null,
      submissionFile: null,
      feedback: null,
      priority: 'low'
    },
    {
      id: 6,
      title: 'Database Design Project',
      subject: 'Computer Science',
      description: 'Design and implement a complete database system for a library management system',
      dueDate: '2024-02-28',
      submittedDate: null,
      status: 'in_progress',
      grade: null,
      maxMarks: 120,
      obtainedMarks: null,
      submissionFile: null,
      feedback: null,
      priority: 'high'
    }
  ];

  useEffect(() => {
    setAssignments(mockAssignments);
    setFilteredAssignments(mockAssignments);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter assignments based on search and filters
  useEffect(() => {
    let filtered = assignments.filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
      const matchesSubject = subjectFilter === 'all' || assignment.subject === subjectFilter;
      
      return matchesSearch && matchesStatus && matchesSubject;
    });
    
    setFilteredAssignments(filtered);
  }, [searchTerm, statusFilter, subjectFilter, assignments]);

  // Get status badge variant and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'submitted':
        return { variant: 'default', icon: CheckCircle, color: 'text-blue-600' };
      case 'graded':
        return { variant: 'default', icon: CheckCircle, color: 'text-green-600' };
      case 'pending':
        return { variant: 'secondary', icon: Clock, color: 'text-yellow-600' };
      case 'overdue':
        return { variant: 'destructive', icon: XCircle, color: 'text-red-600' };
      case 'in_progress':
        return { variant: 'outline', icon: AlertCircle, color: 'text-orange-600' };
      default:
        return { variant: 'secondary', icon: Clock, color: 'text-gray-600' };
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  // Calculate days until due
  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle file upload
  const handleFileUpload = (assignmentId, file) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, submissionFile: file.name, status: 'submitted', submittedDate: new Date().toISOString().split('T')[0] }
        : assignment
    ));
  };

  // Calculate statistics
  const stats = {
    total: assignments.length,
    submitted: assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length,
    pending: assignments.filter(a => a.status === 'pending' || a.status === 'in_progress').length,
    overdue: assignments.filter(a => a.status === 'overdue').length,
    averageGrade: assignments.filter(a => a.obtainedMarks).reduce((acc, a) => acc + (a.obtainedMarks / a.maxMarks * 100), 0) / assignments.filter(a => a.obtainedMarks).length || 0
  };

  // Get unique subjects
  const subjects = [...new Set(assignments.map(a => a.subject))];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-600 mt-1">Track and manage your academic assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-green-600">{stats.submitted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Grade</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageGrade.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full md:w-48">
                <BookOpen className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <div className="grid gap-4">
        {filteredAssignments.map((assignment) => {
          const statusInfo = getStatusInfo(assignment.status);
          const StatusIcon = statusInfo.icon;
          const daysUntilDue = getDaysUntilDue(assignment.dueDate);
          
          return (
            <Card key={assignment.id} className={`border-l-4 ${getPriorityColor(assignment.priority)} hover:shadow-md transition-shadow`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {assignment.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {assignment.grade && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {assignment.grade} ({assignment.obtainedMarks}/{assignment.maxMarks})
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {assignment.subject}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      {daysUntilDue >= 0 ? (
                        <span className={`flex items-center gap-1 ${
                          daysUntilDue <= 2 ? 'text-red-600' : daysUntilDue <= 7 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          <Clock className="h-4 w-4" />
                          {daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days left`}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <XCircle className="h-4 w-4" />
                          {Math.abs(daysUntilDue)} days overdue
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {assignment.status === 'pending' || assignment.status === 'in_progress' ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          className="hidden"
                          id={`file-${assignment.id}`}
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              handleFileUpload(assignment.id, e.target.files[0]);
                            }
                          }}
                        />
                        <Button 
                          size="sm" 
                          onClick={() => document.getElementById(`file-${assignment.id}`).click()}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Submit
                        </Button>
                      </div>
                    ) : assignment.submissionFile ? (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-700 mb-3">{assignment.description}</p>
                
                {assignment.submissionFile && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FileText className="h-4 w-4" />
                    <span>Submitted: {assignment.submissionFile}</span>
                    {assignment.submittedDate && (
                      <span className="text-gray-500">on {new Date(assignment.submittedDate).toLocaleDateString()}</span>
                    )}
                  </div>
                )}
                
                {assignment.feedback && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm font-medium text-blue-800 mb-1">Instructor Feedback:</p>
                    <p className="text-sm text-blue-700">{assignment.feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentAssignments;