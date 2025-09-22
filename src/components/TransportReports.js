import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  Car,
  Route,
  DollarSign,
  Calendar,
  Clock,
  Fuel,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { mockVehicles, mockRoutes, mockTransportAllocations, mockTransportAttendance, mockMaintenanceRecords } from '../mock';

const TransportReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState({});

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    generateReportData();
  }, [selectedPeriod, dateRange]);

  const generateReportData = () => {
    // Generate mock data for different time periods
    const data = {
      overview: generateOverviewData(),
      utilization: generateUtilizationData(),
      maintenance: generateMaintenanceData(),
      financial: generateFinancialData(),
      attendance: generateAttendanceData(),
      performance: generatePerformanceData()
    };
    setReportData(data);
  };

  const generateOverviewData = () => {
    return {
      totalVehicles: mockVehicles.length,
      activeRoutes: mockRoutes.filter(r => r.status === 'Active').length,
      totalStudents: mockTransportAllocations.reduce((sum, a) => sum + a.currentOccupancy, 0),
      totalDrivers: mockVehicles.filter(v => v.driverId).length,
      utilizationRate: 78.5,
      onTimePerformance: 92.3,
      maintenanceCost: mockMaintenanceRecords.reduce((sum, r) => sum + (r.cost || 0), 0),
      fuelCost: 125000,
      monthlyTrend: [
        { month: 'Jan', vehicles: 45, students: 1200, cost: 180000 },
        { month: 'Feb', vehicles: 47, students: 1250, cost: 185000 },
        { month: 'Mar', vehicles: 48, students: 1280, cost: 190000 },
        { month: 'Apr', vehicles: 50, students: 1320, cost: 195000 },
        { month: 'May', vehicles: 52, students: 1350, cost: 200000 },
        { month: 'Jun', vehicles: 54, students: 1380, cost: 205000 }
      ]
    };
  };

  const generateUtilizationData = () => {
    return {
      vehicleUtilization: mockVehicles.map(vehicle => ({
        vehicleNumber: vehicle.vehicleNumber,
        utilization: Math.floor(Math.random() * 40) + 60,
        capacity: vehicle.capacity,
        averageOccupancy: Math.floor(Math.random() * vehicle.capacity * 0.8) + Math.floor(vehicle.capacity * 0.2)
      })),
      routeUtilization: mockRoutes.map(route => ({
        routeName: route.routeName,
        utilization: Math.floor(Math.random() * 30) + 70,
        studentsAssigned: route.studentsAssigned || Math.floor(Math.random() * 50) + 20,
        maxCapacity: route.maxCapacity || 60
      })),
      dailyUtilization: [
        { day: 'Mon', utilization: 85, students: 1320 },
        { day: 'Tue', utilization: 88, students: 1350 },
        { day: 'Wed', utilization: 82, students: 1280 },
        { day: 'Thu', utilization: 90, students: 1400 },
        { day: 'Fri', utilization: 87, students: 1360 },
        { day: 'Sat', utilization: 45, students: 680 }
      ]
    };
  };

  const generateMaintenanceData = () => {
    const maintenanceByType = {};
    const maintenanceByMonth = {};
    
    mockMaintenanceRecords.forEach(record => {
      // By type
      maintenanceByType[record.maintenanceType] = (maintenanceByType[record.maintenanceType] || 0) + 1;
      
      // By month
      const month = new Date(record.scheduledDate).toLocaleString('default', { month: 'short' });
      maintenanceByMonth[month] = (maintenanceByMonth[month] || 0) + (record.cost || 0);
    });

    return {
      totalMaintenanceRecords: mockMaintenanceRecords.length,
      completedMaintenance: mockMaintenanceRecords.filter(r => r.status === 'Completed').length,
      pendingMaintenance: mockMaintenanceRecords.filter(r => r.status === 'Scheduled').length,
      overdueMaintenance: mockMaintenanceRecords.filter(r => {
        return r.status === 'Scheduled' && new Date(r.scheduledDate) < new Date();
      }).length,
      maintenanceByType: Object.entries(maintenanceByType).map(([type, count]) => ({ type, count })),
      maintenanceCostTrend: Object.entries(maintenanceByMonth).map(([month, cost]) => ({ month, cost })),
      averageMaintenanceCost: mockMaintenanceRecords.reduce((sum, r) => sum + (r.cost || 0), 0) / mockMaintenanceRecords.length
    };
  };

  const generateFinancialData = () => {
    return {
      totalRevenue: 2500000,
      totalExpenses: 1800000,
      netProfit: 700000,
      fuelCosts: 650000,
      maintenanceCosts: 320000,
      driverSalaries: 480000,
      insurance: 150000,
      monthlyFinancials: [
        { month: 'Jan', revenue: 400000, expenses: 280000, profit: 120000 },
        { month: 'Feb', revenue: 420000, expenses: 290000, profit: 130000 },
        { month: 'Mar', revenue: 410000, expenses: 295000, profit: 115000 },
        { month: 'Apr', revenue: 430000, expenses: 300000, profit: 130000 },
        { month: 'May', revenue: 440000, expenses: 310000, profit: 130000 },
        { month: 'Jun', revenue: 450000, expenses: 325000, profit: 125000 }
      ],
      expenseBreakdown: [
        { category: 'Fuel', amount: 650000, percentage: 36 },
        { category: 'Salaries', amount: 480000, percentage: 27 },
        { category: 'Maintenance', amount: 320000, percentage: 18 },
        { category: 'Insurance', amount: 150000, percentage: 8 },
        { category: 'Others', amount: 200000, percentage: 11 }
      ]
    };
  };

  const generateAttendanceData = () => {
    return {
      averageAttendance: 87.5,
      totalStudentsTransported: 1380,
      regularUsers: 1200,
      occasionalUsers: 180,
      attendanceByRoute: mockRoutes.map(route => ({
        routeName: route.routeName,
        attendance: Math.floor(Math.random() * 20) + 80,
        studentsAssigned: route.studentsAssigned || Math.floor(Math.random() * 50) + 20
      })),
      weeklyAttendance: [
        { week: 'Week 1', attendance: 89 },
        { week: 'Week 2', attendance: 87 },
        { week: 'Week 3', attendance: 91 },
        { week: 'Week 4', attendance: 85 }
      ],
      peakHours: [
        { hour: '7:00 AM', students: 450 },
        { hour: '8:00 AM', students: 680 },
        { hour: '9:00 AM', students: 250 },
        { hour: '3:00 PM', students: 320 },
        { hour: '4:00 PM', students: 580 },
        { hour: '5:00 PM', students: 420 }
      ]
    };
  };

  const generatePerformanceData = () => {
    return {
      onTimePerformance: 92.3,
      averageDelay: 3.2,
      customerSatisfaction: 4.2,
      fuelEfficiency: 12.5,
      vehiclePerformance: mockVehicles.map(vehicle => ({
        vehicleNumber: vehicle.vehicleNumber,
        onTimeRate: Math.floor(Math.random() * 20) + 80,
        fuelEfficiency: Math.floor(Math.random() * 5) + 10,
        maintenanceScore: Math.floor(Math.random() * 20) + 80
      })),
      routePerformance: mockRoutes.map(route => ({
        routeName: route.routeName,
        onTimeRate: Math.floor(Math.random() * 15) + 85,
        averageDelay: Math.floor(Math.random() * 5) + 1,
        studentSatisfaction: (Math.random() * 1 + 4).toFixed(1)
      }))
    };
  };

  const exportReport = (format) => {
    // Mock export functionality
    const reportName = `transport_report_${selectedReport}_${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Exporting ${reportName}`);
    // In a real application, this would generate and download the actual file
  };

  const renderOverviewReport = () => {
    const data = reportData.overview || {};
    
    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{data.totalVehicles}</p>
                  <p className="text-sm text-gray-600">Total Vehicles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Route className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{data.activeRoutes}</p>
                  <p className="text-sm text-gray-600">Active Routes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{data.totalStudents}</p>
                  <p className="text-sm text-gray-600">Students Transported</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{data.utilizationRate}%</p>
                  <p className="text-sm text-gray-600">Utilization Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="vehicles" fill="#8884d8" name="Vehicles" />
                <Line yAxisId="right" type="monotone" dataKey="students" stroke="#82ca9d" name="Students" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">On-Time Performance</span>
                <span className="font-medium">{data.onTimePerformance}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Utilization Rate</span>
                <span className="font-medium">{data.utilizationRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Drivers</span>
                <span className="font-medium">{data.totalDrivers}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Maintenance Cost</span>
                <span className="font-medium">₹{data.maintenanceCost?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fuel Cost</span>
                <span className="font-medium">₹{data.fuelCost?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Operating Cost</span>
                <span className="font-medium">₹{((data.maintenanceCost || 0) + (data.fuelCost || 0)).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderUtilizationReport = () => {
    const data = reportData.utilization || {};
    
    return (
      <div className="space-y-6">
        {/* Daily Utilization Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Utilization Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.dailyUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="utilization" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.vehicleUtilization?.slice(0, 10).map((vehicle, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{vehicle.vehicleNumber}</p>
                    <p className="text-sm text-gray-600">{vehicle.averageOccupancy}/{vehicle.capacity} avg occupancy</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{vehicle.utilization}%</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${vehicle.utilization}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMaintenanceReport = () => {
    const data = reportData.maintenance || {};
    
    return (
      <div className="space-y-6">
        {/* Maintenance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{data.totalMaintenanceRecords}</p>
                  <p className="text-sm text-gray-600">Total Records</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{data.completedMaintenance}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{data.pendingMaintenance}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{data.overdueMaintenance}</p>
                  <p className="text-sm text-gray-600">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.maintenanceByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.maintenanceByType?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFinancialReport = () => {
    const data = reportData.financial || {};
    
    return (
      <div className="space-y-6">
        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">₹{data.totalRevenue?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">₹{data.totalExpenses?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">₹{data.netProfit?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Net Profit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Financial Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Financial Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyFinancials}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                <Bar dataKey="expenses" fill="#8884d8" name="Expenses" />
                <Bar dataKey="profit" fill="#ffc658" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {data.expenseBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Transport Reports & Analytics</CardTitle>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => exportReport('pdf')} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={() => exportReport('xlsx')} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        {selectedPeriod === 'custom' && (
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Report Tabs */}
      <Tabs value={selectedReport} onValueChange={setSelectedReport}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="utilization" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Utilization</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Maintenance</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Financial</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverviewReport()}
        </TabsContent>

        <TabsContent value="utilization">
          {renderUtilizationReport()}
        </TabsContent>

        <TabsContent value="maintenance">
          {renderMaintenanceReport()}
        </TabsContent>

        <TabsContent value="financial">
          {renderFinancialReport()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportReports;