import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  GraduationCap, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Download,
  Eye,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StudentGrades = () => {
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState('current');

  // Mock grade data
  const mockGradeData = {
    semesters: [
      {
        id: 'sem1',
        name: '1st Semester',
        year: '2023-24',
        gpa: 8.2,
        status: 'completed',
        subjects: [
          { code: 'CS101', name: 'Programming Fundamentals', credits: 4, grade: 'A', points: 9, marks: 85 },
          { code: 'MA101', name: 'Calculus I', credits: 3, grade: 'B+', points: 8, marks: 78 },
          { code: 'PH101', name: 'Physics I', credits: 3, grade: 'A-', points: 8.5, marks: 82 },
          { code: 'EN101', name: 'English Communication', credits: 2, grade: 'A', points: 9, marks: 88 },
          { code: 'CS102', name: 'Computer Lab', credits: 2, grade: 'A+', points: 10, marks: 95 }
        ]
      },
      {
        id: 'sem2',
        name: '2nd Semester', 
        year: '2023-24',
        gpa: 8.5,
        status: 'completed',
        subjects: [
          { code: 'CS201', name: 'Data Structures', credits: 4, grade: 'A', points: 9, marks: 87 },
          { code: 'MA201', name: 'Calculus II', credits: 3, grade: 'A-', points: 8.5, marks: 81 },
          { code: 'CS202', name: 'Object Oriented Programming', credits: 4, grade: 'A+', points: 10, marks: 92 },
          { code: 'ST201', name: 'Statistics', credits: 3, grade: 'B+', points: 8, marks: 76 },
          { code: 'CS203', name: 'Programming Lab II', credits: 2, grade: 'A+', points: 10, marks: 96 }
        ]
      },
      {
        id: 'sem3',
        name: '3rd Semester',
        year: '2024-25', 
        gpa: 8.8,
        status: 'current',
        subjects: [
          { code: 'CS301', name: 'Database Management Systems', credits: 4, grade: 'A+', points: 10, marks: 94 },
          { code: 'CS302', name: 'Computer Networks', credits: 4, grade: 'A', points: 9, marks: 86 },
          { code: 'CS303', name: 'Operating Systems', credits: 4, grade: 'A-', points: 8.5, marks: 83 },
          { code: 'MA301', name: 'Discrete Mathematics', credits: 3, grade: 'A', points: 9, marks: 89 },
          { code: 'CS304', name: 'System Programming Lab', credits: 2, grade: 'A+', points: 10, marks: 97 }
        ]
      },
      {
        id: 'sem4',
        name: '4th Semester',
        year: '2024-25',
        gpa: null,
        status: 'upcoming',
        subjects: [
          { code: 'CS401', name: 'Software Engineering', credits: 4, grade: '-', points: 0, marks: '-' },
          { code: 'CS402', name: 'Web Development', credits: 4, grade: '-', points: 0, marks: '-' },
          { code: 'CS403', name: 'Machine Learning', credits: 4, grade: '-', points: 0, marks: '-' },
          { code: 'CS404', name: 'Mobile App Development', credits: 3, grade: '-', points: 0, marks: '-' },
          { code: 'CS405', name: 'Project Work', credits: 2, grade: '-', points: 0, marks: '-' }
        ]
      }
    ]
  };

  // Calculate CGPA
  const calculateCGPA = () => {
    const completedSemesters = mockGradeData.semesters.filter(sem => sem.status === 'completed' || sem.status === 'current');
    if (completedSemesters.length === 0) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    completedSemesters.forEach(semester => {
      semester.subjects.forEach(subject => {
        if (subject.grade !== '-') {
          totalPoints += subject.points * subject.credits;
          totalCredits += subject.credits;
        }
      });
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  // Get grade color
  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-700', 
      'A-': 'bg-blue-100 text-blue-700',
      'B+': 'bg-yellow-100 text-yellow-700',
      'B': 'bg-orange-100 text-orange-700',
      'B-': 'bg-red-100 text-red-700',
      'C': 'bg-red-100 text-red-800',
      '-': 'bg-gray-100 text-gray-500'
    };
    return colors[grade] || 'bg-gray-100 text-gray-500';
  };

  // Get performance status
  const getPerformanceStatus = (gpa) => {
    if (gpa >= 9) return { status: 'Excellent', color: 'text-green-600', icon: Star };
    if (gpa >= 8) return { status: 'Very Good', color: 'text-blue-600', icon: TrendingUp };
    if (gpa >= 7) return { status: 'Good', color: 'text-yellow-600', icon: Award };
    if (gpa >= 6) return { status: 'Average', color: 'text-orange-600', icon: BookOpen };
    return { status: 'Below Average', color: 'text-red-600', icon: BookOpen };
  };

  const cgpa = calculateCGPA();
  const currentSemester = mockGradeData.semesters.find(sem => sem.status === 'current');
  const performance = getPerformanceStatus(parseFloat(cgpa));
  const PerformanceIcon = performance.icon;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Academic Performance</h1>
            <p className="text-purple-100">
              {user?.name} - {user?.course} | Roll No: {user?.rollNumber}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{cgpa}</div>
            <div className="text-purple-100">CGPA</div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CGPA</p>
                <p className="text-2xl font-bold text-gray-900">{cgpa}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current GPA</p>
                <p className="text-2xl font-bold text-gray-900">{currentSemester?.gpa || 'N/A'}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className={`text-lg font-bold ${performance.color}`}>{performance.status}</p>
              </div>
              <PerformanceIcon className={`h-8 w-8 ${performance.color}`} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Credits Earned</p>
                <p className="text-2xl font-bold text-gray-900">42/180</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Semester Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Semester-wise Grades</CardTitle>
              <CardDescription>View your academic performance by semester</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Transcript
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedSemester} onValueChange={setSelectedSemester} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {mockGradeData.semesters.map((semester) => (
                <TabsTrigger key={semester.id} value={semester.id} className="text-sm">
                  {semester.name}
                  {semester.status === 'current' && (
                    <Badge variant="secondary" className="ml-2 text-xs">Current</Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {mockGradeData.semesters.map((semester) => (
              <TabsContent key={semester.id} value={semester.id} className="mt-6">
                <div className="space-y-4">
                  {/* Semester Info */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-lg">{semester.name}</h3>
                      <p className="text-gray-600">Academic Year: {semester.year}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {semester.gpa || 'In Progress'}
                      </div>
                      <div className="text-sm text-gray-600">Semester GPA</div>
                    </div>
                  </div>
                  
                  {/* Subjects Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-3 font-semibold">Subject Code</th>
                          <th className="text-left p-3 font-semibold">Subject Name</th>
                          <th className="text-center p-3 font-semibold">Credits</th>
                          <th className="text-center p-3 font-semibold">Marks</th>
                          <th className="text-center p-3 font-semibold">Grade</th>
                          <th className="text-center p-3 font-semibold">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semester.subjects.map((subject, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-900">{subject.code}</td>
                            <td className="p-3 text-gray-700">{subject.name}</td>
                            <td className="p-3 text-center">{subject.credits}</td>
                            <td className="p-3 text-center">{subject.marks}</td>
                            <td className="p-3 text-center">
                              <Badge className={getGradeColor(subject.grade)}>
                                {subject.grade}
                              </Badge>
                            </td>
                            <td className="p-3 text-center font-medium">
                              {subject.points > 0 ? subject.points : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Grade Scale Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Grading Scale</CardTitle>
          <CardDescription>Understanding your grades and points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { grade: 'A+', points: '10', range: '90-100' },
              { grade: 'A', points: '9', range: '80-89' },
              { grade: 'A-', points: '8.5', range: '75-79' },
              { grade: 'B+', points: '8', range: '70-74' },
              { grade: 'B', points: '7', range: '60-69' },
              { grade: 'B-', points: '6', range: '55-59' },
              { grade: 'C', points: '5', range: '50-54' }
            ].map((item) => (
              <div key={item.grade} className="text-center p-3 bg-gray-50 rounded-lg">
                <Badge className={getGradeColor(item.grade)} variant="secondary">
                  {item.grade}
                </Badge>
                <div className="mt-2 text-sm">
                  <div className="font-semibold">{item.points} Points</div>
                  <div className="text-gray-600">{item.range}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentGrades;