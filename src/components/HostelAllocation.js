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
  Building2,
  Search,
  Filter,
  Plus,
  User,
  Wrench,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { mockHostelRooms, mockStudents, hostelBlocks } from '../mock';
import { useToast } from '../hooks/use-toast';

const HostelAllocation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAllocationDialog, setShowAllocationDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const { toast } = useToast();

  // Generate more rooms for better visualization
  const generateRooms = () => {
    const rooms = [];
    const blocks = ['A', 'B', 'C', 'D'];
    const statuses = ['available', 'occupied', 'maintenance', 'reserved'];
    
    blocks.forEach(block => {
      for (let floor = 1; floor <= 3; floor++) {
        for (let room = 1; room <= 10; room++) {
          const roomNo = `${block}${floor}${room.toString().padStart(2, '0')}`;
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const studentName = status === 'occupied' ? 
            mockStudents[Math.floor(Math.random() * mockStudents.length)].name : 
            null;
          
          rooms.push({
            roomNo,
            status,
            studentName,
            block
          });
        }
      }
    });
    
    return rooms.slice(0, 60); // Limit to 60 rooms for better performance
  };

  const [rooms] = useState(generateRooms());

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.studentName && room.studentName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBlock = blockFilter === 'all' || room.block === blockFilter;
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    
    return matchesSearch && matchesBlock && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500 hover:bg-green-600';
      case 'occupied': return 'bg-red-500 hover:bg-red-600';
      case 'maintenance': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'reserved': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'occupied': return <User className="h-4 w-4" />;
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'reserved': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'reserved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRoomClick = (room) => {
    if (room.status === 'available') {
      setSelectedRoom(room);
      setShowAllocationDialog(true);
    }
  };

  const handleAllocation = () => {
    if (!selectedStudent) {
      toast({
        title: "No Student Selected",
        description: "Please select a student for room allocation.",
        variant: "destructive"
      });
      return;
    }

    // Mock allocation
    toast({
      title: "Room Allocated Successfully!",
      description: `Room ${selectedRoom.roomNo} has been allocated to ${selectedStudent}`,
    });

    setShowAllocationDialog(false);
    setSelectedRoom(null);
    setSelectedStudent('');
  };

  const availableStudents = mockStudents.filter(student => 
    !rooms.some(room => room.studentName === student.name)
  );

  const getRoomStats = () => {
    const stats = {
      total: rooms.length,
      available: rooms.filter(r => r.status === 'available').length,
      occupied: rooms.filter(r => r.status === 'occupied').length,
      maintenance: rooms.filter(r => r.status === 'maintenance').length,
      reserved: rooms.filter(r => r.status === 'reserved').length
    };
    stats.occupancyRate = Math.round((stats.occupied / stats.total) * 100);
    return stats;
  };

  const stats = getRoomStats();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hostel Allocation</h1>
          <p className="text-gray-600 mt-2">Manage hostel room allocations and occupancy</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
              </div>
              <User className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy</p>
                <p className="text-2xl font-bold text-blue-600">{stats.occupancyRate}%</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                %
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by room number or student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={blockFilter} onValueChange={setBlockFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                {['A', 'B', 'C', 'D'].map(block => (
                  <SelectItem key={block} value={block}>Block {block}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Room Display */}
      {viewMode === 'grid' ? (
        <Card>
          <CardHeader>
            <CardTitle>Room Layout</CardTitle>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span>Maintenance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span>Reserved</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {filteredRooms.map((room) => (
                <Button
                  key={room.roomNo}
                  variant="outline"
                  className={`h-20 flex flex-col items-center justify-center p-2 transition-all duration-200 ${getStatusColor(room.status)} text-white border-0 ${
                    room.status === 'available' ? 'hover:scale-105 cursor-pointer' : 'cursor-default'
                  }`}
                  onClick={() => handleRoomClick(room)}
                  disabled={room.status !== 'available'}
                >
                  <div className="flex items-center space-x-1 mb-1">
                    {getStatusIcon(room.status)}
                    <span className="text-xs font-bold">{room.roomNo}</span>
                  </div>
                  {room.studentName && (
                    <span className="text-xs text-center leading-tight">
                      {room.studentName.split(' ')[0]}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Number</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.roomNo}>
                      <TableCell className="font-medium">{room.roomNo}</TableCell>
                      <TableCell>Block {room.block}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadgeColor(room.status)} flex items-center w-fit`}>
                          {getStatusIcon(room.status)}
                          <span className="ml-1 capitalize">{room.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{room.studentName || '-'}</TableCell>
                      <TableCell>
                        {room.status === 'available' && (
                          <Button
                            size="sm"
                            onClick={() => handleRoomClick(room)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Allocate
                          </Button>
                        )}
                        {room.status === 'occupied' && (
                          <Button size="sm" variant="outline">
                            <XCircle className="h-3 w-3 mr-1" />
                            Vacate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Allocation Dialog */}
      <Dialog open={showAllocationDialog} onOpenChange={setShowAllocationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Allocate Room {selectedRoom?.roomNo}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">Room Details</h4>
              <p className="text-sm text-gray-600">Room Number: {selectedRoom?.roomNo}</p>
              <p className="text-sm text-gray-600">Block: {selectedRoom?.block}</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Available</Badge>
            </div>
            
            <div>
              <Label>Select Student *</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent>
                  {availableStudents.map(student => (
                    <SelectItem key={student.id} value={student.name}>
                      {student.name} ({student.rollNo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowAllocationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAllocation} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Allocate Room
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostelAllocation;