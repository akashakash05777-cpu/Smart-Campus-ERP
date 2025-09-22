import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { vehicleTypes, vehicleStatuses, fuelTypes } from '../mock';

const VehicleForm = ({ vehicle, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    type: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: '',
    fuelType: '',
    mileage: '',
    status: 'Active',
    routeAssigned: '',
    driverId: '',
    registrationNumber: '',
    insuranceExpiry: '',
    pucExpiry: '',
    fitnessExpiry: '',
    nextService: '',
    purchaseDate: '',
    purchasePrice: '',
    currentMileage: '',
    engineNumber: '',
    chassisNumber: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleNumber: vehicle.vehicleNumber || '',
        type: vehicle.type || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        capacity: vehicle.capacity || '',
        fuelType: vehicle.fuelType || '',
        mileage: vehicle.mileage || '',
        status: vehicle.status || 'Active',
        routeAssigned: vehicle.routeAssigned || '',
        driverId: vehicle.driverId || '',
        registrationNumber: vehicle.registrationNumber || '',
        insuranceExpiry: vehicle.insuranceExpiry || '',
        pucExpiry: vehicle.pucExpiry || '',
        fitnessExpiry: vehicle.fitnessExpiry || '',
        nextService: vehicle.nextService || '',
        purchaseDate: vehicle.purchaseDate || '',
        purchasePrice: vehicle.purchasePrice || '',
        currentMileage: vehicle.currentMileage || '',
        engineNumber: vehicle.engineNumber || '',
        chassisNumber: vehicle.chassisNumber || '',
        notes: vehicle.notes || ''
      });
    }
  }, [vehicle]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }

    if (!formData.type) {
      newErrors.type = 'Vehicle type is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'Valid capacity is required';
    }

    if (!formData.fuelType) {
      newErrors.fuelType = 'Fuel type is required';
    }

    if (!formData.mileage || formData.mileage <= 0) {
      newErrors.mileage = 'Valid mileage is required';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }

    if (!formData.insuranceExpiry) {
      newErrors.insuranceExpiry = 'Insurance expiry date is required';
    }

    if (!formData.pucExpiry) {
      newErrors.pucExpiry = 'PUC expiry date is required';
    }

    if (!formData.fitnessExpiry) {
      newErrors.fitnessExpiry = 'Fitness expiry date is required';
    }

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
              <Input
                id="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                placeholder="e.g., DL-01-AB-1234"
                className={errors.vehicleNumber ? 'border-red-500' : ''}
              />
              {errors.vehicleNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="type">Vehicle Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., Tata Starbus"
                className={errors.model ? 'border-red-500' : ''}
              />
              {errors.model && (
                <p className="text-red-500 text-sm mt-1">{errors.model}</p>
              )}
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                min="2000"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div>
              <Label htmlFor="capacity">Seating Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                placeholder="e.g., 45"
                min="1"
                className={errors.capacity ? 'border-red-500' : ''}
              />
              {errors.capacity && (
                <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fuelType">Fuel Type *</Label>
              <Select value={formData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
                <SelectTrigger className={errors.fuelType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map(fuel => (
                    <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fuelType && (
                <p className="text-red-500 text-sm mt-1">{errors.fuelType}</p>
              )}
            </div>

            <div>
              <Label htmlFor="mileage">Mileage (km/l) *</Label>
              <Input
                id="mileage"
                type="number"
                step="0.1"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', parseFloat(e.target.value))}
                placeholder="e.g., 8.5"
                min="0"
                className={errors.mileage ? 'border-red-500' : ''}
              />
              {errors.mileage && (
                <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Registration & Legal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Registration & Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="registrationNumber">Registration Number *</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                placeholder="e.g., DL1CAB1234"
                className={errors.registrationNumber ? 'border-red-500' : ''}
              />
              {errors.registrationNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.registrationNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="insuranceExpiry">Insurance Expiry *</Label>
              <Input
                id="insuranceExpiry"
                type="date"
                value={formData.insuranceExpiry}
                onChange={(e) => handleInputChange('insuranceExpiry', e.target.value)}
                className={errors.insuranceExpiry ? 'border-red-500' : ''}
              />
              {errors.insuranceExpiry && (
                <p className="text-red-500 text-sm mt-1">{errors.insuranceExpiry}</p>
              )}
            </div>

            <div>
              <Label htmlFor="pucExpiry">PUC Expiry *</Label>
              <Input
                id="pucExpiry"
                type="date"
                value={formData.pucExpiry}
                onChange={(e) => handleInputChange('pucExpiry', e.target.value)}
                className={errors.pucExpiry ? 'border-red-500' : ''}
              />
              {errors.pucExpiry && (
                <p className="text-red-500 text-sm mt-1">{errors.pucExpiry}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fitnessExpiry">Fitness Expiry *</Label>
              <Input
                id="fitnessExpiry"
                type="date"
                value={formData.fitnessExpiry}
                onChange={(e) => handleInputChange('fitnessExpiry', e.target.value)}
                className={errors.fitnessExpiry ? 'border-red-500' : ''}
              />
              {errors.fitnessExpiry && (
                <p className="text-red-500 text-sm mt-1">{errors.fitnessExpiry}</p>
              )}
            </div>

            <div>
              <Label htmlFor="nextService">Next Service Date</Label>
              <Input
                id="nextService"
                type="date"
                value={formData.nextService}
                onChange={(e) => handleInputChange('nextService', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value))}
                placeholder="e.g., 2500000"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="currentMileage">Current Mileage (km)</Label>
              <Input
                id="currentMileage"
                type="number"
                value={formData.currentMileage}
                onChange={(e) => handleInputChange('currentMileage', parseInt(e.target.value))}
                placeholder="e.g., 45000"
                min="0"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Technical Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="engineNumber">Engine Number</Label>
            <Input
              id="engineNumber"
              value={formData.engineNumber}
              onChange={(e) => handleInputChange('engineNumber', e.target.value)}
              placeholder="Engine number"
            />
          </div>

          <div>
            <Label htmlFor="chassisNumber">Chassis Number</Label>
            <Input
              id="chassisNumber"
              value={formData.chassisNumber}
              onChange={(e) => handleInputChange('chassisNumber', e.target.value)}
              placeholder="Chassis number"
            />
          </div>
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
              placeholder="Any additional notes about the vehicle..."
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
          {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;