import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Wrench,
  Car,
  FileText,
  DollarSign,
  User,
  Phone,
  MapPin,
  Bell
} from 'lucide-react';
import { mockVehicles, mockMaintenanceRecords } from '../mock';

const MaintenanceSystem = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState(mockMaintenanceRecords);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState([]);

  const maintenanceTypes = [
    'Routine Service',
    'Oil Change',
    'Tire Replacement',
    'Brake Service',
    'Engine Repair',
    'Transmission Service',
    'AC Service',
    'Battery Replacement',
    'Body Work',
    'Electrical Repair',
    'Emergency Repair',
    'Annual Inspection'
  ];

  const maintenanceStatuses = [
    'Scheduled',
    'In Progress',
    'Completed',
    'Cancelled',
    'Overdue'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    generateMaintenanceAlerts();
  }, [maintenanceRecords]);

  const generateMaintenanceAlerts = () => {
    const today = new Date();
    const upcomingAlerts = [];
    const overdueAlerts = [];

    maintenanceRecords.forEach(record => {
      const scheduledDate = new Date(record.scheduledDate);
      const daysDiff = Math.ceil((scheduledDate - today) / (1000 * 60 * 60 * 24));

      if (record.status === 'Scheduled') {
        if (daysDiff < 0) {
          overdueAlerts.push({
            id: record.id,
            type: 'overdue',
            message: `${record.maintenanceType} for ${record.vehicleNumber} is ${Math.abs(daysDiff)} days overdue`,
            priority: 'critical',
            vehicleId: record.vehicleId
          });
        } else if (daysDiff <= 7) {
          upcomingAlerts.push({
            id: record.id,
            type: 'upcoming',
            message: `${record.maintenanceType} for ${record.vehicleNumber} due in ${daysDiff} days`,
            priority: daysDiff <= 3 ? 'high' : 'medium',
            vehicleId: record.vehicleId
          });
        }
      }
    });

    // Check vehicle mileage for service alerts
    mockVehicles.forEach(vehicle => {
      if (vehicle.mileage && vehicle.lastServiceMileage) {
        const mileageSinceService = vehicle.mileage - vehicle.lastServiceMileage;
        if (mileageSinceService > 10000) {
          upcomingAlerts.push({
            id: `mileage_${vehicle.id}`,
            type: 'mileage',
            message: `${vehicle.vehicleNumber} needs service - ${mileageSinceService} km since last service`,
            priority: mileageSinceService > 15000 ? 'high' : 'medium',
            vehicleId: vehicle.id
          });
        }
      }
    });

    setAlerts([...overdueAlerts, ...upcomingAlerts]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Completed': return 'bg-green-500';
      case 'Cancelled': return 'bg-gray-500';
      case 'Overdue': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = record.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.maintenanceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.serviceProvider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesType = filterType === 'all' || record.maintenanceType === filterType;
    const matchesVehicle = filterVehicle === 'all' || record.vehicleId === filterVehicle;
    
    return matchesSearch && matchesStatus && matchesType && matchesVehicle;
  });

  const handleAddMaintenance = (maintenanceData) => {
    const newRecord = {
      id: `maintenance_${Date.now()}`,
      ...maintenanceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMaintenanceRecords([...maintenanceRecords, newRecord]);
    setIsAddDialogOpen(false);
  };

  const handleEditMaintenance = (maintenanceData) => {
    setMaintenanceRecords(maintenanceRecords.map(record => 
      record.id === selectedRecord.id 
        ? { ...record, ...maintenanceData, updatedAt: new Date().toISOString() }
        : record
    ));
    setIsEditDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleDeleteMaintenance = (recordId) => {
    setMaintenanceRecords(maintenanceRecords.filter(record => record.id !== recordId));
  };

  const getUpcomingMaintenance = () => {
    const today = new Date();
    return maintenanceRecords
      .filter(record => record.status === 'Scheduled' && new Date(record.scheduledDate) >= today)
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
      .slice(0, 5);
  };

  const getMaintenanceStats = () => {
    const total = maintenanceRecords.length;
    const scheduled = maintenanceRecords.filter(r => r.status === 'Scheduled').length;
    const inProgress = maintenanceRecords.filter(r => r.status === 'In Progress').length;
    const completed = maintenanceRecords.filter(r => r.status === 'Completed').length;
    const overdue = maintenanceRecords.filter(r => {
      return r.status === 'Scheduled' && new Date(r.scheduledDate) < new Date();
    }).length;
    const totalCost = maintenanceRecords
      .filter(r => r.status === 'Completed')
      .reduce((sum, r) => sum + (r.cost || 0), 0);

    return { total, scheduled, inProgress, completed, overdue, totalCost };
  };

  const stats = getMaintenanceStats();

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <span>Maintenance Alerts ({alerts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.slice(0, 4).map(alert => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                    alert.priority === 'critical' ? 'text-red-500' : 
                    alert.priority === 'high' ? 'text-orange-500' : 'text-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <Badge className={`mt-1 ${getPriorityColor(alert.priority)}`}>
                      {alert.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {alerts.length > 4 && (
              <p className="text-sm text-orange-700 mt-3">
                +{alerts.length - 4} more alerts. Check the maintenance schedule for details.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
                <p className="text-sm text-gray-600">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.overdue}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">₹{stats.totalCost.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUpcomingMaintenance().map(record => {
                const daysUntil = Math.ceil((new Date(record.scheduledDate) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{record.vehicleNumber}</p>
                      <p className="text-xs text-gray-600">{record.maintenanceType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{daysUntil} days</p>
                      <p className="text-xs text-gray-600">{new Date(record.scheduledDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
              {getUpcomingMaintenance().length === 0 && (
                <p className="text-sm text-gray-600 text-center py-4">No upcoming maintenance scheduled</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule New Maintenance</DialogTitle>
                </DialogHeader>
                <MaintenanceForm
                  onSubmit={handleAddMaintenance}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Send Reminders
            </Button>
          </CardContent>
        </Card>

        {/* Maintenance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Month Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed Services</span>
                <span className="font-medium">{stats.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Spent</span>
                <span className="font-medium">₹{stats.totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Cost per Service</span>
                <span className="font-medium">
                  ₹{stats.completed > 0 ? Math.round(stats.totalCost / stats.completed).toLocaleString() : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Vehicles Serviced</span>
                <span className="font-medium">
                  {new Set(maintenanceRecords.filter(r => r.status === 'Completed').map(r => r.vehicleId)).size}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Maintenance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterVehicle} onValueChange={setFilterVehicle}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                {mockVehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicleNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {maintenanceTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {maintenanceStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>

          {/* Maintenance Records Table */}
          <div className="space-y-4">
            {filteredRecords.map(record => (
              <Card key={record.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(record.status)}`}></div>
                    <div>
                      <h4 className="font-medium">{record.vehicleNumber} - {record.maintenanceType}</h4>
                      <p className="text-sm text-gray-600">{record.serviceProvider}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getPriorityColor(record.priority)}>
                      {record.priority}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(record.scheduledDate).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-600">
                        {record.cost ? `₹${record.cost.toLocaleString()}` : 'Cost TBD'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setSelectedRecord(record);
                        setIsEditDialogOpen(true);
                      }}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteMaintenance(record.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                {record.description && (
                  <p className="text-sm text-gray-600 mt-2 ml-7">{record.description}</p>
                )}
              </Card>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance records found</h3>
              <p className="text-gray-600">Try adjusting your filters or add a new maintenance record.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Maintenance Record</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <MaintenanceForm
              maintenance={selectedRecord}
              onSubmit={handleEditMaintenance}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedRecord(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Maintenance Form Component
const MaintenanceForm = ({ maintenance, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    vehicleNumber: '',
    maintenanceType: '',
    scheduledDate: '',
    completedDate: '',
    status: 'Scheduled',
    priority: 'Medium',
    serviceProvider: '',
    cost: '',
    mileage: '',
    description: '',
    notes: '',
    contactPerson: '',
    contactPhone: '',
    location: ''
  });

  const [errors, setErrors] = useState({});

  const maintenanceTypes = [
    'Routine Service', 'Oil Change', 'Tire Replacement', 'Brake Service',
    'Engine Repair', 'Transmission Service', 'AC Service', 'Battery Replacement',
    'Body Work', 'Electrical Repair', 'Emergency Repair', 'Annual Inspection'
  ];

  const maintenanceStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    if (maintenance) {
      setFormData({
        vehicleId: maintenance.vehicleId || '',
        vehicleNumber: maintenance.vehicleNumber || '',
        maintenanceType: maintenance.maintenanceType || '',
        scheduledDate: maintenance.scheduledDate || '',
        completedDate: maintenance.completedDate || '',
        status: maintenance.status || 'Scheduled',
        priority: maintenance.priority || 'Medium',
        serviceProvider: maintenance.serviceProvider || '',
        cost: maintenance.cost || '',
        mileage: maintenance.mileage || '',
        description: maintenance.description || '',
        notes: maintenance.notes || '',
        contactPerson: maintenance.contactPerson || '',
        contactPhone: maintenance.contactPhone || '',
        location: maintenance.location || ''
      });
    }
  }, [maintenance]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleId) newErrors.vehicleId = 'Vehicle is required';
    if (!formData.maintenanceType) newErrors.maintenanceType = 'Maintenance type is required';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';
    if (!formData.serviceProvider) newErrors.serviceProvider = 'Service provider is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicleId">Vehicle *</Label>
          <Select value={formData.vehicleId} onValueChange={(value) => {
            const vehicle = mockVehicles.find(v => v.id === value);
            handleInputChange('vehicleId', value);
            handleInputChange('vehicleNumber', vehicle?.vehicleNumber || '');
          }}>
            <SelectTrigger className={errors.vehicleId ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              {mockVehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.vehicleNumber} - {vehicle.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vehicleId && <p className="text-red-500 text-sm mt-1">{errors.vehicleId}</p>}
        </div>

        <div>
          <Label htmlFor="maintenanceType">Maintenance Type *</Label>
          <Select value={formData.maintenanceType} onValueChange={(value) => handleInputChange('maintenanceType', value)}>
            <SelectTrigger className={errors.maintenanceType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {maintenanceTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.maintenanceType && <p className="text-red-500 text-sm mt-1">{errors.maintenanceType}</p>}
        </div>

        <div>
          <Label htmlFor="scheduledDate">Scheduled Date *</Label>
          <Input
            id="scheduledDate"
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
            className={errors.scheduledDate ? 'border-red-500' : ''}
          />
          {errors.scheduledDate && <p className="text-red-500 text-sm mt-1">{errors.scheduledDate}</p>}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {maintenanceStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map(priority => (
                <SelectItem key={priority} value={priority}>{priority}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="serviceProvider">Service Provider *</Label>
          <Input
            id="serviceProvider"
            value={formData.serviceProvider}
            onChange={(e) => handleInputChange('serviceProvider', e.target.value)}
            placeholder="Service provider name"
            className={errors.serviceProvider ? 'border-red-500' : ''}
          />
          {errors.serviceProvider && <p className="text-red-500 text-sm mt-1">{errors.serviceProvider}</p>}
        </div>

        <div>
          <Label htmlFor="cost">Cost (₹)</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => handleInputChange('cost', parseFloat(e.target.value))}
            placeholder="Maintenance cost"
          />
        </div>

        <div>
          <Label htmlFor="mileage">Current Mileage (km)</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage}
            onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
            placeholder="Vehicle mileage"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the maintenance work..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {maintenance ? 'Update Record' : 'Create Record'}
        </Button>
      </div>
    </form>
  );
};

export default MaintenanceSystem;