import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GraduationCap, BookOpen, Calendar, Bell, User, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();


  const studentStats = [
    {
      title: 'Current Semester',
      value: '6th Semester',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Credits',
      value: '142/180',
      icon: BookOpen,
      color: 'bg-green-500'
    },
    {
      title: 'CGPA',
      value: '8.5',
      icon: GraduationCap,
      color: 'bg-purple-500'
    },
    {
      title: 'Attendance',
      value: '85%',
      icon: User,
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    { title: 'Assignment Submitted', subject: 'Data Structures', time: '2 hours ago' },
    { title: 'Exam Scheduled', subject: 'Database Management', time: '1 day ago' },
    { title: 'Grade Updated', subject: 'Web Development', time: '3 days ago' },
    { title: 'Library Book Due', subject: 'Algorithm Design', time: '5 days ago' }
  ];

  const upcomingEvents = [
    { title: 'Mid-term Exam', subject: 'Operating Systems', date: '2024-01-25' },
    { title: 'Project Submission', subject: 'Software Engineering', date: '2024-01-28' },
    { title: 'Lab Test', subject: 'Computer Networks', date: '2024-02-02' }
  ];



  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-green-100">
          {user?.course} - {user?.year} | Roll No: {user?.rollNumber}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Your latest academic activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.subject}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>
              Important dates and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.subject}</p>
                    <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used student services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">View Grades</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">Attendance</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">Assignments</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
              <User className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-900">Profile</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;