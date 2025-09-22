import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Users,
  CreditCard,
  Building2,
  GraduationCap,
  Bell,
  AlertTriangle,
  TrendingUp,
  UserPlus,
  Plus,
  FileText,
  Phone,
  MapPin,
  Eye,
  Settings,
  Database
} from 'lucide-react';
import { mockMetrics, mockChartData, mockRecentAdmissions, mockFeeTransactions, mockHostelRooms } from '../mock';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import AdminDepartmentManager from './AdminDepartmentManager';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const Dashboard = () => {
  const { user, sharedData } = useAuth();
  const { broadcastDataChange, DATA_EVENTS } = useData();
  const [showDepartmentManager, setShowDepartmentManager] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalStudents: 50,
    feesCollected: 135000,
    hostelOccupancy: 60,
    pendingNotifications: 10,
    outstandingDues: 1900000
  });

  // Real-time data synchronization
  useEffect(() => {
    // Update metrics from shared data
    if (sharedData && sharedData.students) {
      setDashboardMetrics(prev => ({
        ...prev,
        totalStudents: sharedData.students.length
      }));
    }
    if (sharedData && sharedData.staff) {
      // Update staff-related metrics
    }
  }, [sharedData]);

  // Listen for real-time updates
  useEffect(() => {
    const handleStudentUpdate = (event) => {
      setDashboardMetrics(prev => ({
        ...prev,
        totalStudents: prev.totalStudents + (event.detail.action === 'added' ? 1 : event.detail.action === 'deleted' ? -1 : 0)
      }));
      // Broadcast the change to other components
      broadcastDataChange('dashboard_metrics_updated', { metrics: dashboardMetrics });
    };

    const handleNotificationUpdate = (event) => {
      setDashboardMetrics(prev => ({
        ...prev,
        pendingNotifications: prev.pendingNotifications + 1
      }));
    };

    // Listen for various data events
    window.addEventListener(DATA_EVENTS.STUDENT_ADDED, handleStudentUpdate);
    window.addEventListener(DATA_EVENTS.STUDENT_DELETED, handleStudentUpdate);
    window.addEventListener(DATA_EVENTS.STAFF_ADDED, handleStudentUpdate);
    window.addEventListener(DATA_EVENTS.NOTIFICATION_ADDED, handleNotificationUpdate);

    return () => {
      window.removeEventListener(DATA_EVENTS.STUDENT_ADDED, handleStudentUpdate);
      window.removeEventListener(DATA_EVENTS.STUDENT_DELETED, handleStudentUpdate);
      window.removeEventListener(DATA_EVENTS.STAFF_ADDED, handleStudentUpdate);
      window.removeEventListener(DATA_EVENTS.NOTIFICATION_ADDED, handleNotificationUpdate);
    };
  }, [dashboardMetrics, broadcastDataChange, DATA_EVENTS]);

  // Show department manager if admin user clicks on it
  if (showDepartmentManager && user?.role === 'Admin') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
            <p className="text-gray-600">Manage students and staff across departments</p>
          </div>
          <Button 
            onClick={() => setShowDepartmentManager(false)}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>
        <AdminDepartmentManager />
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Students',
      value: dashboardMetrics.totalStudents.toString(),
      change: '+12%',
      subtitle: 'Active enrollments',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      changeColor: 'text-green-500'
    },
    {
      title: 'Fees Collected Today',
      value: `₹${dashboardMetrics.feesCollected.toLocaleString()}`,
      change: '+8%',
      subtitle: 'Daily collection',
      icon: CreditCard,
      color: 'text-white',
      bgColor: 'bg-green-500',
      changeColor: 'text-green-500'
    },
    {
      title: 'Hostel Occupancy',
      value: `${dashboardMetrics.hostelOccupancy}%`,
      change: '-3%',
      subtitle: 'Room utilization',
      icon: Building2,
      color: 'text-white',
      bgColor: 'bg-orange-500',
      changeColor: 'text-red-500'
    },
    {
      title: 'Exams This Month',
      value: '40',
      change: '+25%',
      subtitle: 'Conducted exams',
      icon: GraduationCap,
      color: 'text-white',
      bgColor: 'bg-purple-500',
      changeColor: 'text-green-500'
    },
    {
      title: 'Pending Notifications',
      value: dashboardMetrics.pendingNotifications.toString(),
      change: '',
      subtitle: 'Unread alerts',
      icon: Bell,
      color: 'text-white',
      bgColor: 'bg-red-500',
      changeColor: ''
    },
    {
      title: 'Outstanding Dues',
      value: `₹${dashboardMetrics.outstandingDues.toLocaleString()}`,
      change: '+15%',
      subtitle: 'Pending payments',
      icon: AlertTriangle,
      color: 'text-gray-700',
      bgColor: 'bg-gray-200',
      changeColor: 'text-red-500'
    }
  ];

  const quickActions = [
    { name: 'Add Student', icon: UserPlus, color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'Collect Fee', icon: CreditCard, color: 'bg-green-600 hover:bg-green-700' },
    { name: 'Allocate Room', icon: Building2, color: 'bg-red-600 hover:bg-red-700' },
    { name: 'Add Exam Record', icon: GraduationCap, color: 'bg-purple-600 hover:bg-purple-700' },
    ...(user?.role === 'Admin' ? [{ name: 'Manage Departments', icon: Database, color: 'bg-indigo-600 hover:bg-indigo-700', action: () => setShowDepartmentManager(true) }] : [])
  ];

  // Chart Data - Yearly Trend
  const chartData = [
    { year: '2019', value: 8500000 },
    { year: '2020', value: 7200000 },
    { year: '2021', value: 9100000 },
    { year: '2022', value: 10500000 },
    { year: '2023', value: 12300000 },
    { year: '2024', value: 14800000 }
  ];

  const examData = [
    { month: 'Jan', passRate: 92, failRate: 8 },
    { month: 'Feb', passRate: 89, failRate: 11 },
    { month: 'Mar', passRate: 84, failRate: 16 },
    { month: 'Apr', passRate: 94, failRate: 6 },
    { month: 'May', passRate: 86, failRate: 14 },
    { month: 'Jun', passRate: 88, failRate: 12 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  const BarChart = React.memo(({ data, title }) => {
    const labels = React.useMemo(() => data.map(d => d.year), [data]);
    const values = React.useMemo(() => data.map(d => d.value), [data]);

    const chartDataCfg = React.useMemo(() => ({
      labels,
      datasets: [
        {
          label: 'Annual Collection (₹)',
          data: values,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)'
          ],
          borderWidth: 2,
          borderRadius: {
            topLeft: 12,
            topRight: 12,
            bottomLeft: 4,
            bottomRight: 4
          },
          borderSkipped: false,
          barPercentage: 0.8,
          categoryPercentage: 0.7,
          hoverBackgroundColor: [
            'rgba(59, 130, 246, 0.9)',
            'rgba(16, 185, 129, 0.9)',
            'rgba(245, 158, 11, 0.9)',
            'rgba(239, 68, 68, 0.9)',
            'rgba(139, 92, 246, 0.9)',
            'rgba(236, 72, 153, 0.9)'
          ],
          hoverBorderWidth: 3
        }
      ]
    }), [labels, values]);

    const options = React.useMemo(() => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: { 
          display: true,
          position: 'top',
          labels: {
            color: '#374151',
            font: {
              size: 12,
              weight: '500'
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'rectRounded'
          }
        },
        title: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#f9fafb',
          bodyColor: '#f9fafb',
          borderColor: 'rgba(75, 85, 99, 0.2)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            title: (ctx) => `Year ${ctx[0].label}`,
            label: (ctx) => {
              const value = ctx.parsed.y;
              const formatted = value >= 10000000 ? 
                `₹${(value / 10000000).toFixed(1)}Cr` : 
                value >= 100000 ? 
                `₹${(value / 100000).toFixed(1)}L` : 
                `₹${value.toLocaleString()}`;
              return `Annual Collection: ${formatted}`;
            },
            afterLabel: (ctx) => {
              const currentValue = ctx.parsed.y;
              const prevIndex = ctx.dataIndex - 1;
              if (prevIndex >= 0) {
                const prevValue = values[prevIndex];
                const growth = ((currentValue - prevValue) / prevValue * 100).toFixed(1);
                return growth > 0 ? `Growth: +${growth}%` : `Growth: ${growth}%`;
              }
              return null;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { 
            display: false 
          },
          ticks: { 
            color: '#6b7280',
            font: {
              size: 12,
              weight: '500'
            },
            padding: 8
          },
          border: {
            display: false
          }
        },
        y: {
          grid: { 
            color: 'rgba(156, 163, 175, 0.2)',
            drawBorder: false
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 11
            },
            padding: 12,
            callback: (value) => {
              const v = Number(value);
              if (v >= 10000000) return `₹${(v / 10000000).toFixed(0)}Cr`;
              if (v >= 100000) return `₹${(v / 100000).toFixed(0)}L`;
              if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
              return `₹${v}`;
            }
          },
          border: {
            display: false
          }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    }), [values]);

    return (
      <Card className="col-span-2 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl font-bold">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                {title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2 ml-12">Annual fee collection performance showing growth trends over the years</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ₹{(values[values.length - 1] / 10000000).toFixed(1)}Cr
              </div>
              <div className="text-xs text-gray-500">Current Year</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-80 p-4 bg-white rounded-lg shadow-inner">
            <Bar data={chartDataCfg} options={options} />
          </div>
        </CardContent>
      </Card>
    );
  });

  const PieChart = ({ title }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600">Room status distribution</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64">
          <div className="relative w-48 h-48">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="32"
                strokeDasharray={`${(120/200) * 502.4} 502.4`}
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="32"
                strokeDasharray={`${(80/200) * 502.4} 502.4`}
                strokeDashoffset={`-${(120/200) * 502.4}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">120</div>
                <div className="text-sm text-gray-600">occupied</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2" />
            <span className="text-sm">occupied: 120</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2" />
            <span className="text-sm">available: 80</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const LineChart = ({ data, title }) => (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600">Pass vs Fail rate over recent exam cycles</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
          <svg className="w-full h-full">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={`${100 - y}%`}
                x2="100%"
                y2={`${100 - y}%`}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Pass rate line */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.passRate}`).join(' ')}
            />
            
            {/* Fail rate line */}
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.failRate}`).join(' ')}
            />
            
            {/* Data points */}
            {data.map((d, i) => (
              <g key={i}>
                <circle
                  cx={`${(i / (data.length - 1)) * 100}%`}
                  cy={`${100 - d.passRate}%`}
                  r="4"
                  fill="#10b981"
                />
                <circle
                  cx={`${(i / (data.length - 1)) * 100}%`}
                  cy={`${100 - d.failRate}%`}
                  r="4"
                  fill="#ef4444"
                />
              </g>
            ))}
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
            {data.map((d) => (
              <span key={d.month}>{d.month}</span>
            ))}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-600">
            {[100, 75, 50, 25, 0].map((y) => (
              <span key={y}>{y}</span>
            ))}
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2" />
            <span className="text-sm">Fail Rate (%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2" />
            <span className="text-sm">Pass Rate (%)</span>
          </div>
          <div className="ml-auto bg-gray-50 p-2 rounded text-sm">
            <div className="text-red-600">Fail Rate (%): 14</div>
            <div className="text-green-600">Pass Rate (%): 86</div>
            <div className="text-gray-600">May</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin User!</h1>
            <p className="text-gray-600 mt-1">Here's what's happening at your college today.</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <div>Sunday, September 7, 2025</div>
            <div className="text-xs">Last updated: 12:05:51</div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-600">{metric.title}</div>
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  {metric.change && (
                    <div className={`text-sm font-medium ${metric.changeColor}`}>
                      {metric.change}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">{metric.subtitle}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BarChart data={chartData} title="Yearly Fee Collection Trend" />
        <PieChart title="Hostel Occupancy" />
      </div>

      <div className="grid grid-cols-1">
        <LineChart data={examData} title="Exam Performance Trend" />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  className={`${action.color} text-white w-full h-12 flex items-center justify-start space-x-3 transition-all duration-200 hover:scale-105`}
                  onClick={action.action || (() => {
                    console.log(`Quick action: ${action.name}`);
                  })}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{action.name}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Admissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Admissions</CardTitle>
              <Button variant="ghost" size="sm" className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Button>
            </div>
            <p className="text-sm text-gray-600">Latest student enrollments</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Student 25', course: 'MBA', date: '07/09/2025', status: 'pending' },
                { name: 'Student 24', course: 'Civil Engineering', date: '07/09/2025', status: 'pending' },
                { name: 'Student 23', course: 'Electrical Engineering', date: '07/09/2025', status: 'pending' },
                { name: 'Student 22', course: 'Mechanical Engineering', date: '07/09/2025', status: 'pending' },
                { name: 'Student 21', course: 'Computer Science', date: '07/09/2025', status: 'pending' }
              ].map((student, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{student.name}</div>
                    <div className="text-xs text-gray-600">{student.course}</div>
                    <div className="text-xs text-gray-500">{student.date}</div>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    {student.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Payments</CardTitle>
              <Button variant="ghost" size="sm" className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Button>
            </div>
            <p className="text-sm text-gray-600">Latest fee collections</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Student 15', amount: '₹8,000', method: 'Card', date: '07/09/2025' },
                { name: 'Student 14', amount: '₹7,500', method: 'Bank Transfer', date: '07/09/2025' },
                { name: 'Student 13', amount: '₹7,000', method: 'Upi', date: '07/09/2025' },
                { name: 'Student 12', amount: '₹6,500', method: 'Cash', date: '07/09/2025' },
                { name: 'Student 11', amount: '₹6,000', method: 'Card', date: '07/09/2025' }
              ].map((payment, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{payment.name}</div>
                    <div className="text-sm font-semibold">{payment.amount}</div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{payment.method}</span>
                    <span>{payment.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hostel Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Hostel Overview</CardTitle>
              <Button variant="ghost" size="sm" className="flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                Manage
              </Button>
            </div>
            <p className="text-sm text-gray-600">Room occupancy status</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'A001', 'A002', 'A003', 'A004', 'A005', 'A006', 'A001', 'A007'
              ].map((room, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Room {room}</div>
                    <div className="text-xs text-gray-600">Block A</div>
                  </div>
                  <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                    occupied
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;