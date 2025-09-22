import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Trash2, MapPin, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { routeStatuses } from '../mock';

const RouteForm = ({ route, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    routeName: '',
    routeCode: '',
    startPoint: '',
    endPoint: '',
    totalDistance: '',
    estimatedTime: '',
    status: 'Active',
    vehicleType: '',
    maxCapacity: '',
    operatingDays: [],
    startTime: '',
    endTime: '',
    notes: ''
  });

  const [stops, setStops] = useState([]);
  const [newStop, setNewStop] = useState({
    name: '',
    address: '',
    time: '',
    coordinates: { lat: '', lng: '' },
    landmark: ''
  });

  const [errors, setErrors] = useState({});

  const weekDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const vehicleTypes = [
    'Bus', 'Mini Bus', 'Van', 'Car', 'Tempo'
  ];

  useEffect(() => {
    if (route) {
      setFormData({
        routeName: route.routeName || '',
        routeCode: route.routeCode || '',
        startPoint: route.startPoint || '',
        endPoint: route.endPoint || '',
        totalDistance: route.totalDistance || '',
        estimatedTime: route.estimatedTime || '',
        status: route.status || 'Active',
        vehicleType: route.vehicleType || '',
        maxCapacity: route.maxCapacity || '',
        operatingDays: route.operatingDays || [],
        startTime: route.startTime || '',
        endTime: route.endTime || '',
        notes: route.notes || ''
      });
      setStops(route.stops || []);
    }
  }, [route]);

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

  const handleNewStopChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewStop(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setNewStop(prev => ({ ...prev, [field]: value }));
    }
  };

  const addStop = () => {
    if (newStop.name.trim() && newStop.time.trim()) {
      const stopWithId = {
        ...newStop,
        id: `stop_${Date.now()}`,
        order: stops.length + 1
      };
      setStops([...stops, stopWithId]);
      setNewStop({
        name: '',
        address: '',
        time: '',
        coordinates: { lat: '', lng: '' },
        landmark: ''
      });
    }
  };

  const removeStop = (stopId) => {
    setStops(stops.filter(stop => stop.id !== stopId));
  };

  const moveStop = (stopId, direction) => {
    const currentIndex = stops.findIndex(stop => stop.id === stopId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= stops.length) return;

    const newStops = [...stops];
    [newStops[currentIndex], newStops[newIndex]] = [newStops[newIndex], newStops[currentIndex]];
    
    // Update order numbers
    newStops.forEach((stop, index) => {
      stop.order = index + 1;
    });
    
    setStops(newStops);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.routeName.trim()) {
      newErrors.routeName = 'Route name is required';
    }

    if (!formData.routeCode.trim()) {
      newErrors.routeCode = 'Route code is required';
    }

    if (!formData.startPoint.trim()) {
      newErrors.startPoint = 'Start point is required';
    }

    if (!formData.endPoint.trim()) {
      newErrors.endPoint = 'End point is required';
    }

    if (!formData.totalDistance || formData.totalDistance <= 0) {
      newErrors.totalDistance = 'Valid total distance is required';
    }

    if (!formData.estimatedTime || formData.estimatedTime <= 0) {
      newErrors.estimatedTime = 'Valid estimated time is required';
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required';
    }

    if (!formData.maxCapacity || formData.maxCapacity <= 0) {
      newErrors.maxCapacity = 'Valid maximum capacity is required';
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

    if (stops.length < 2) {
      newErrors.stops = 'At least 2 stops are required for a route';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const routeData = {
        ...formData,
        stops: stops,
        studentsAssigned: route?.studentsAssigned || 0,
        staffAssigned: route?.staffAssigned || 0
      };
      onSubmit(routeData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Route Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Route Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="routeName">Route Name *</Label>
              <Input
                id="routeName"
                value={formData.routeName}
                onChange={(e) => handleInputChange('routeName', e.target.value)}
                placeholder="e.g., Main Campus to City Center"
                className={errors.routeName ? 'border-red-500' : ''}
              />
              {errors.routeName && (
                <p className="text-red-500 text-sm mt-1">{errors.routeName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="routeCode">Route Code *</Label>
              <Input
                id="routeCode"
                value={formData.routeCode}
                onChange={(e) => handleInputChange('routeCode', e.target.value.toUpperCase())}
                placeholder="e.g., RT001"
                className={errors.routeCode ? 'border-red-500' : ''}
              />
              {errors.routeCode && (
                <p className="text-red-500 text-sm mt-1">{errors.routeCode}</p>
              )}
            </div>

            <div>
              <Label htmlFor="startPoint">Start Point *</Label>
              <Input
                id="startPoint"
                value={formData.startPoint}
                onChange={(e) => handleInputChange('startPoint', e.target.value)}
                placeholder="Starting location"
                className={errors.startPoint ? 'border-red-500' : ''}
              />
              {errors.startPoint && (
                <p className="text-red-500 text-sm mt-1">{errors.startPoint}</p>
              )}
            </div>

            <div>
              <Label htmlFor="endPoint">End Point *</Label>
              <Input
                id="endPoint"
                value={formData.endPoint}
                onChange={(e) => handleInputChange('endPoint', e.target.value)}
                placeholder="Ending location"
                className={errors.endPoint ? 'border-red-500' : ''}
              />
              {errors.endPoint && (
                <p className="text-red-500 text-sm mt-1">{errors.endPoint}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalDistance">Total Distance (km) *</Label>
                <Input
                  id="totalDistance"
                  type="number"
                  step="0.1"
                  value={formData.totalDistance}
                  onChange={(e) => handleInputChange('totalDistance', parseFloat(e.target.value))}
                  placeholder="Distance in km"
                  min="0"
                  className={errors.totalDistance ? 'border-red-500' : ''}
                />
                {errors.totalDistance && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalDistance}</p>
                )}
              </div>

              <div>
                <Label htmlFor="estimatedTime">Estimated Time (min) *</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value))}
                  placeholder="Time in minutes"
                  min="0"
                  className={errors.estimatedTime ? 'border-red-500' : ''}
                />
                {errors.estimatedTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.estimatedTime}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {routeStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle & Capacity Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle & Capacity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                <SelectTrigger className={errors.vehicleType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleType && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>
              )}
            </div>

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
          </CardContent>
        </Card>
      </div>

      {/* Route Stops Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Route Stops Management</CardTitle>
          <p className="text-sm text-gray-600">Add stops in the order they will be visited</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Stop */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-base">Add New Stop</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="stopName">Stop Name</Label>
                  <Input
                    id="stopName"
                    value={newStop.name}
                    onChange={(e) => handleNewStopChange('name', e.target.value)}
                    placeholder="Stop name"
                  />
                </div>
                <div>
                  <Label htmlFor="stopTime">Arrival Time</Label>
                  <Input
                    id="stopTime"
                    type="time"
                    value={newStop.time}
                    onChange={(e) => handleNewStopChange('time', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stopLandmark">Landmark</Label>
                  <Input
                    id="stopLandmark"
                    value={newStop.landmark}
                    onChange={(e) => handleNewStopChange('landmark', e.target.value)}
                    placeholder="Nearby landmark"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addStop}
                    disabled={!newStop.name.trim() || !newStop.time.trim()}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stop
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="stopAddress">Address</Label>
                <Textarea
                  id="stopAddress"
                  value={newStop.address}
                  onChange={(e) => handleNewStopChange('address', e.target.value)}
                  placeholder="Complete address of the stop"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Stops List */}
          {stops.length > 0 && (
            <div>
              <h4 className="font-medium mb-4">Current Stops ({stops.length})</h4>
              <div className="space-y-3">
                {stops.map((stop, index) => (
                  <Card key={stop.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <Badge variant="outline" className="min-w-[60px] justify-center">
                          #{index + 1}
                        </Badge>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{stop.name}</span>
                            {stop.landmark && (
                              <span className="text-sm text-gray-500">({stop.landmark})</span>
                            )}
                          </div>
                          {stop.address && (
                            <p className="text-sm text-gray-600 mt-1">{stop.address}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{stop.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => moveStop(stop.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => moveStop(stop.id, 'down')}
                          disabled={index === stops.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => removeStop(stop.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {errors.stops && (
            <p className="text-red-500 text-sm">{errors.stops}</p>
          )}
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes about the route..."
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
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          {route ? 'Update Route' : 'Create Route'}
        </Button>
      </div>
    </form>
  );
};

export default RouteForm;