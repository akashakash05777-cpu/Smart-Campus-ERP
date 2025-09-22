import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useToast } from '../hooks/use-toast';
import {
  Users, UserPlus, Search, Filter, Calendar, Clock, Award, Bell,
  Edit, Trash2, Eye, Download, Upload, CheckCircle, XCircle,
  Star, TrendingUp, FileText, AlertCircle, User, Phone, Mail,
  MapPin, GraduationCap, Briefcase, CalendarDays, UserCheck,
  Send, MessageSquare, Save, Plus, Info, AlertTriangle
} from 'lucide-react';
import {
  mockStaffProfiles, mockStaffRoles, mockStaffSchedule, mockStaffAttendance,
  mockStaffLeaves, mockStaffLeaveBalance, mockStaffPerformance, mockStaffNotifications,
  staffDepartments, staffDesignations, leaveTypes, documentTypes, staffStatuses,
  attendanceStatuses_staff, leaveStatuses
} from '../mock';

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState('profiles');
  const [staffProfiles, setStaffProfiles] = useState(mockStaffProfiles);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const { toast } = useToast();

  // Memoized filtered staff to prevent unnecessary re-calculations
  const filteredStaff = useMemo(() => {
    let filtered = staffProfiles;

    if (searchTerm) {
      filtered = filtered.filter(staff => 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(staff => staff.department === selectedDepartment);
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(staff => staff.designation === selectedRole);
    }

    return filtered;
  }, [searchTerm, selectedDepartment, selectedRole, staffProfiles]);

  const handleAddStaff = useCallback((staffData) => {
    const newStaff = {
      id: Date.now().toString(),
      employeeId: `EMP${Date.now()}`,
      ...staffData,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setStaffProfiles(prev => [...prev, newStaff]);
    setIsAddingStaff(false);
    toast({
      title: "Staff Added",
      description: "New staff member has been added successfully.",
    });
  }, [toast]);

  const handleUpdateStaff = useCallback((updatedStaff) => {
    setStaffProfiles(prev => prev.map(staff => 
      staff.id === updatedStaff.id ? updatedStaff : staff
    ));
    setSelectedStaff(null);
    toast({
      title: "Staff Updated",
      description: "Staff information has been updated successfully.",
    });
  }, [toast]);

  const handleDeleteStaff = useCallback((staffId) => {
    setStaffProfiles(prev => prev.filter(staff => staff.id !== staffId));
    toast({
      title: "Staff Removed",
      description: "Staff member has been removed successfully.",
    });
  }, [toast]);

  // Memoized table row component to prevent unnecessary re-renders
  const StaffTableRow = React.memo(({ staff }) => (
    <TableRow key={staff.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">{staff.name}</p>
            <p className="text-sm text-gray-500">{staff.employeeId}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>{staff.department}</TableCell>
      <TableCell>{staff.designation}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <p className="text-sm">{staff.email}</p>
          <p className="text-sm text-gray-500">{staff.phone}</p>
        </div>
      </TableCell>
      <TableCell>{staff.joinDate}</TableCell>
      <TableCell>
        <Badge variant={staff.status === 'Active' ? 'default' : 'secondary'}>
          {staff.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedStaff(staff)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedStaff(staff)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteStaff(staff.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ));

  // Memoized stats to prevent unnecessary recalculations
  const stats = useMemo(() => ({
    totalStaff: staffProfiles.length,
    activeStaff: staffProfiles.filter(s => s.status === 'Active').length,
    departments: staffDepartments.length,
    onLeave: mockStaffLeaves.filter(l => l.status === 'Approved').length
  }), [staffProfiles]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage employee and faculty records, roles, and performance</p>
        </div>
        <Button onClick={() => setIsAddingStaff(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStaff}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeStaff}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-purple-600">{stats.departments}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-orange-600">{stats.onLeave}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profiles">Staff Profiles</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leaves">Leave Management</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Profiles
              </CardTitle>
              <CardDescription>Manage staff member profiles and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, email, or employee ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {staffDepartments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {staffDesignations.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Staff Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((staff) => (
                      <StaffTableRow key={staff.id} staff={staff} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Staff Attendance
              </CardTitle>
              <CardDescription>Track and manage staff attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Attendance Management</h3>
                <p className="text-gray-500 mb-4">Staff attendance tracking will be implemented here</p>
                <Button>Configure Attendance</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Leave Management
              </CardTitle>
              <CardDescription>Manage staff leave requests and balances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Leave Management</h3>
                <p className="text-gray-500 mb-4">Staff leave management system will be implemented here</p>
                <Button>Manage Leaves</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Management
              </CardTitle>
              <CardDescription>Track and evaluate staff performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Tracking</h3>
                <p className="text-gray-500 mb-4">Staff performance evaluation system will be implemented here</p>
                <Button>View Performance</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Staff Schedule
              </CardTitle>
              <CardDescription>Manage staff work schedules and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule Management</h3>
                <p className="text-gray-500 mb-4">Staff scheduling system will be implemented here</p>
                <Button>Manage Schedules</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Staff Reports
              </CardTitle>
              <CardDescription>Generate and view staff-related reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Staff Reports</h3>
                <p className="text-gray-500 mb-4">Staff reporting system will be implemented here</p>
                <Button>Generate Reports</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Staff Dialog */}
      <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Enter the details for the new staff member
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {staffDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {staffDesignations.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" type="number" placeholder="Enter salary" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddingStaff(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleAddStaff({})}>
              Add Staff
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Staff Details Dialog */}
      <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Staff Details</DialogTitle>
            <DialogDescription>
              View and edit staff member information
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStaff.name}</h3>
                  <p className="text-gray-500">{selectedStaff.employeeId}</p>
                  <Badge variant={selectedStaff.status === 'Active' ? 'default' : 'secondary'}>
                    {selectedStaff.status}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Department</Label>
                  <p>{selectedStaff.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Designation</Label>
                  <p>{selectedStaff.designation}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p>{selectedStaff.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p>{selectedStaff.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Join Date</Label>
                  <p>{selectedStaff.joinDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Salary</Label>
                  <p>₹{selectedStaff.salary?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedStaff(null)}>
              Close
            </Button>
            <Button onClick={() => handleUpdateStaff(selectedStaff)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;