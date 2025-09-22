import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, Users, Car, Route, AlertTriangle } from 'lucide-react';
import { mockVehicles, mockDrivers, mockRoutes, allocationStatuses } from '../mock';

const AllocationForm = ({ allocation, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    routeId: '',
    startDate: '',
    endDate: '',
    operatingDays: [],
    startTime: '',
    endTime: '',
    status: 'Active',
    priority: 'Normal',
    maxCapacity: '',
    currentOccupancy: 0,
    notes: '',
    isTemporary: false,
    emergencyContact: '',
    fuelAllowance: '',
    maintenanceSchedule: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [conflictWarnings, setConflictWarnings] = useState([]);

  const weekDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const priorities = ['Low', 'Normal', 'High', 'Emergency'];

  useEffect(() => {
    if (allocation) {
      setFormData({
        vehicleId: allocation.vehicleId || '',
        driverId: allocation.driverId || '',
        routeId: allocation.routeId || '',
        startDate: allocation.startDate || '',
        endDate: allocation.endDate || '',
        operatingDays: allocation.operatingDays || [],
        startTime: allocation.startTime || '',
        endTime: allocation.endTime || '',
        status: allocation.status || 'Active',
        priority: allocation.priority || 'Normal',
        maxCapacity: allocation.maxCapacity || '',
        currentOccupancy: allocation.currentOccupancy || 0,
        notes: allocation.notes || '',
        isTemporary: allocation.isTemporary || false,
        emergencyContact: allocation.emergencyContact || '',
        fuelAllowance: allocation.fuelAllowance || '',
        maintenanceSchedule: allocation.maintenanceSchedule || ''
      });
    }
  }, [allocation]);

  useEffect(() => {
    if (formData.vehicleId) {
      const vehicle = mockVehicles.find(v => v.id === formData.vehicleId);
      setSelectedVehicle(vehicle);
      if (vehicle && !formData.maxCapacity) {
        setFormData(prev => ({ ...prev, maxCapacity: vehicle.capacity }));
      }
    }
  }, [formData.vehicleId]);

  useEffect(() => {
    if (formData.driverId) {
      const driver = mockDrivers.find(d => d.id === formData.driverId);
      setSelectedDriver(driver);
    }
  }, [formData.driverId]);

  useEffect(() => {
    if (formData.routeId) {
      const route = mockRoutes.find(r => r.id === formData.routeId);
      setSelectedRoute(route);
      if (route && !formData.startTime) {
        setFormData(prev => ({
          ...prev,
          startTime: route.startTime,
          endTime: route.endTime,
          operatingDays: route.operatingDays
        }));
      }
    }
  }, [formData.routeId]);

  useEffect(() => {
    checkConflicts();
  }, [formData.vehicleId, formData.driverId, formData.startDate, formData.endDate, formData.operatingDays]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOperatingDaysChange = (day) => {
    setFormData(prev => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(day)
        ? prev.operatingDays.filter(d => d !== day)
        : [...prev.operatingDays, day]
    }));
  };

  const checkConflicts = () => {
    const warnings = [];
    
    // Check vehicle conflicts
    if (formData.vehicleId && formData.startDate && formData.endDate) {
      // Simulate conflict checking logic
      const hasVehicleConflict = false; // This would check against existing allocations
      if (hasVehicleConflict) {
        warnings.push('Vehicle is already allocated during this period');
      }
    }

    // Check driver conflicts
    if (formData.driverId && formData.startDate && formData.endDate) {
      // Simulate conflict checking logic
      const hasDriverConflict = false; // This would check against existing allocations
      if (hasDriverConflict) {
        warnings.push('Driver is already assigned during this period');
      }
    }

    // Check route capacity
    if (selectedRoute && formData.maxCapacity) {
      if (parseInt(formData.maxCapacity) > selectedRoute.maxCapacity) {
        warnings.push('Allocated capacity exceeds route maximum capacity');
      }
    }

    setConflictWarnings(warnings);
  };

  const getAvailableVehicles = () => {
    return mockVehicles.filter(vehicle => 
      vehicle.status === 'Available' || vehicle.id === formData.vehicleId
    );
  };

  const getAvailableDrivers = () => {
    return mockDrivers.filter(driver => 
      driver.status === 'Available' || driver.id === formData.driverId
    );
  };

  const getAvailableRoutes = () => {
    return mockRoutes.filter(route => 
      route.status === 'Active' || route.id === formData.routeId
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Vehicle selection is required';
    }

    if (!formData.driverId) {
      newErrors.driverId = 'Driver selection is required';
    }

    if (!formData.routeId) {
      newErrors.routeId = 'Route selection is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.operatingDays.length === 0) {
      newErrors.operatingDays = 'At least one operating day must be selected';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (!formData.maxCapacity || formData.maxCapacity <= 0) {
      newErrors.maxCapacity = 'Valid maximum capacity is required';
    }

    if (formData.currentOccupancy > formData.maxCapacity) {
      newErrors.currentOccupancy = 'Current occupancy cannot exceed maximum capacity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const allocationData = {
        ...formData,
        vehicleNumber: selectedVehicle?.vehicleNumber,
        driverName: selectedDriver?.name,
        routeName: selectedRoute?.routeName,
        routeCode: selectedRoute?.routeCode
      };
      onSubmit(allocationData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Conflict Warnings */}
      {conflictWarnings.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800">Potential Conflicts</h4>
                <ul className="mt-2 text-sm text-orange-700">
                  {conflictWarnings.map((warning, index) => (
                    <li key={index} className="list-disc list-inside">{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resource Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vehicleId">Vehicle *</Label>
              <Select value={formData.vehicleId} onValueChange={(value) => handleInputChange('vehicleId', value)}>
                <SelectTrigger className={errors.vehicleId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableVehicles().map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4" />
                        <span>{vehicle.vehicleNumber} - {vehicle.type}</span>
                        <Badge variant={vehicle.status === 'Available' ? 'default' : 'secondary'} className="ml-2">
                          {vehicle.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleId && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleId}</p>
              )}
              {selectedVehicle && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm space-y-1">
                    <p><strong>Type:</strong> {selectedVehicle.type}</p>
                    <p><strong>Capacity:</strong> {selectedVehicle.capacity} passengers</p>
                    <p><strong>Fuel Type:</strong> {selectedVehicle.fuelType}</p>
                    <p><strong>Status:</strong> {selectedVehicle.status}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="driverId">Driver *</Label>
              <Select value={formData.driverId} onValueChange={(value) => handleInputChange('driverId', value)}>
                <SelectTrigger className={errors.driverId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDrivers().map(driver => (
                    <SelectItem key={driver.id} value={driver.id}>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{driver.name} - {driver.licenseNumber}</span>
                        <Badge variant={driver.status === 'Available' ? 'default' : 'secondary'} className="ml-2">
                          {driver.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.driverId && (
                <p className="text-red-500 text-sm mt-1">{errors.driverId}</p>
              )}
              {selectedDriver && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm space-y-1">
                    <p><strong>Experience:</strong> {selectedDriver.experience} years</p>
                    <p><strong>License:</strong> {selectedDriver.licenseNumber}</p>
                    <p><strong>Contact:</strong> {selectedDriver.phone}</p>
                    <p><strong>Status:</strong> {selectedDriver.status}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="routeId">Route *</Label>
              <Select value={formData.routeId} onValueChange={(value) => handleInputChange('routeId', value)}>
                <SelectTrigger className={errors.routeId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoutes().map(route => (
                    <SelectItem key={route.id} value={route.id}>
                      <div className="flex items-center space-x-2">
                        <Route className="h-4 w-4" />
                        <span>{route.routeCode} - {route.routeName}</span>
                        <Badge variant={route.status === 'Active' ? 'default' : 'secondary'} className="ml-2">
                          {route.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.routeId && (
                <p className="text-red-500 text-sm mt-1">{errors.routeId}</p>
              )}
              {selectedRoute && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm space-y-1">
                    <p><strong>Distance:</strong> {selectedRoute.totalDistance} km</p>
                    <p><strong>Duration:</strong> {selectedRoute.estimatedTime} min</p>
                    <p><strong>Stops:</strong> {selectedRoute.stops?.length || 0}</p>
                    <p><strong>Max Capacity:</strong> {selectedRoute.maxCapacity}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule & Timing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div>
              <Label>Operating Days *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {weekDays.map(day => (
                  <label key={day} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.operatingDays.includes(day)}
                      onChange={() => handleOperatingDaysChange(day)}
                      className="rounded"
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
              {errors.operatingDays && (
                <p className="text-red-500 text-sm mt-1">{errors.operatingDays}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className={errors.startTime ? 'border-red-500' : ''}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className={errors.endTime ? 'border-red-500' : ''}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {allocationStatuses.map(status => (
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
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isTemporary"
                checked={formData.isTemporary}
                onChange={(e) => handleInputChange('isTemporary', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="isTemporary">Temporary Allocation</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Capacity & Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Capacity & Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxCapacity">Maximum Capacity *</Label>
              <Input
                id="maxCapacity"
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => handleInputChange('maxCapacity', parseInt(e.target.value))}
                placeholder="Maximum passengers"
                min="1"
                className={errors.maxCapacity ? 'border-red-500' : ''}
              />
              {errors.maxCapacity && (
                <p className="text-red-500 text-sm mt-1">{errors.maxCapacity}</p>
              )}
            </div>

            <div>
              <Label htmlFor="currentOccupancy">Current Occupancy</Label>
              <Input
                id="currentOccupancy"
                type="number"
                value={formData.currentOccupancy}
                onChange={(e) => handleInputChange('currentOccupancy', parseInt(e.target.value))}
                placeholder="Current passengers"
                min="0"
                max={formData.maxCapacity}
                className={errors.currentOccupancy ? 'border-red-500' : ''}
              />
              {errors.currentOccupancy && (
                <p className="text-red-500 text-sm mt-1">{errors.currentOccupancy}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fuelAllowance">Fuel Allowance</Label>
              <Input
                id="fuelAllowance"
                type="number"
                step="0.01"
                value={formData.fuelAllowance}
                onChange={(e) => handleInputChange('fuelAllowance', parseFloat(e.target.value))}
                placeholder="Amount per day"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="Emergency contact number"
              />
            </div>

            <div>
              <Label htmlFor="maintenanceSchedule">Maintenance Schedule</Label>
              <Input
                id="maintenanceSchedule"
                value={formData.maintenanceSchedule}
                onChange={(e) => handleInputChange('maintenanceSchedule', e.target.value)}
                placeholder="Next maintenance date"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes about this allocation..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {allocation ? 'Update Allocation' : 'Create Allocation'}
        </Button>
      </div>
    </form>
  );
};

export default AllocationForm;