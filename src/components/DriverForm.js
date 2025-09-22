import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { driverStatuses } from '../mock';

const DriverForm = ({ driver, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    phone: '',
    email: '',
    address: '',
    dateOfBirth: '',
    joiningDate: '',
    licenseNumber: '',
    licenseType: '',
    licenseExpiry: '',
    experience: '',
    status: 'Active',
    vehicleAssigned: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodGroup: '',
    medicalFitness: '',
    medicalExpiry: '',
    salary: '',
    bankAccount: '',
    ifscCode: '',
    panNumber: '',
    aadharNumber: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const licenseTypes = [
    'Light Motor Vehicle (LMV)',
    'Heavy Motor Vehicle (HMV)',
    'Transport Vehicle',
    'Commercial Vehicle',
    'PSV Badge'
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || '',
        employeeId: driver.employeeId || '',
        phone: driver.phone || '',
        email: driver.email || '',
        address: driver.address || '',
        dateOfBirth: driver.dateOfBirth || '',
        joiningDate: driver.joiningDate || '',
        licenseNumber: driver.licenseNumber || '',
        licenseType: driver.licenseType || '',
        licenseExpiry: driver.licenseExpiry || '',
        experience: driver.experience || '',
        status: driver.status || 'Active',
        vehicleAssigned: driver.vehicleAssigned || '',
        emergencyContact: driver.emergencyContact || '',
        emergencyPhone: driver.emergencyPhone || '',
        bloodGroup: driver.bloodGroup || '',
        medicalFitness: driver.medicalFitness || '',
        medicalExpiry: driver.medicalExpiry || '',
        salary: driver.salary || '',
        bankAccount: driver.bankAccount || '',
        ifscCode: driver.ifscCode || '',
        panNumber: driver.panNumber || '',
        aadharNumber: driver.aadharNumber || '',
        notes: driver.notes || ''
      });
    }
  }, [driver]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Driver name is required';
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }

    if (!formData.licenseType) {
      newErrors.licenseType = 'License type is required';
    }

    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = 'License expiry date is required';
    }

    if (!formData.experience || formData.experience < 0) {
      newErrors.experience = 'Valid experience is required';
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact name is required';
    }

    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'Emergency contact phone is required';
    } else if (!/^\d{10}$/.test(formData.emergencyPhone.replace(/\D/g, ''))) {
      newErrors.emergencyPhone = 'Please enter a valid 10-digit emergency phone number';
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
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                placeholder="e.g., EMP001"
                className={errors.employeeId ? 'border-red-500' : ''}
              />
              {errors.employeeId && (
                <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="10-digit phone number"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="driver@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Complete address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="joiningDate">Joining Date *</Label>
              <Input
                id="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                className={errors.joiningDate ? 'border-red-500' : ''}
              />
              {errors.joiningDate && (
                <p className="text-red-500 text-sm mt-1">{errors.joiningDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="experience">Experience (Years) *</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value))}
                placeholder="Years of driving experience"
                min="0"
                className={errors.experience ? 'border-red-500' : ''}
              />
              {errors.experience && (
                <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {driverStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vehicleAssigned">Vehicle Assigned</Label>
              <Input
                id="vehicleAssigned"
                value={formData.vehicleAssigned}
                onChange={(e) => handleInputChange('vehicleAssigned', e.target.value)}
                placeholder="Vehicle number (if assigned)"
              />
            </div>

            <div>
              <Label htmlFor="salary">Monthly Salary (₹)</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', parseFloat(e.target.value))}
                placeholder="Monthly salary amount"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="bankAccount">Bank Account Number</Label>
              <Input
                id="bankAccount"
                value={formData.bankAccount}
                onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                placeholder="Bank account number"
              />
            </div>

            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                placeholder="Bank IFSC code"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* License Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">License Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="licenseNumber">License Number *</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
              placeholder="Driving license number"
              className={errors.licenseNumber ? 'border-red-500' : ''}
            />
            {errors.licenseNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>
            )}
          </div>

          <div>
            <Label htmlFor="licenseType">License Type *</Label>
            <Select value={formData.licenseType} onValueChange={(value) => handleInputChange('licenseType', value)}>
              <SelectTrigger className={errors.licenseType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select license type" />
              </SelectTrigger>
              <SelectContent>
                {licenseTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.licenseType && (
              <p className="text-red-500 text-sm mt-1">{errors.licenseType}</p>
            )}
          </div>

          <div>
            <Label htmlFor="licenseExpiry">License Expiry *</Label>
            <Input
              id="licenseExpiry"
              type="date"
              value={formData.licenseExpiry}
              onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
              className={errors.licenseExpiry ? 'border-red-500' : ''}
            />
            {errors.licenseExpiry && (
              <p className="text-red-500 text-sm mt-1">{errors.licenseExpiry}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medical & Emergency Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical & Emergency Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              placeholder="Emergency contact person"
              className={errors.emergencyContact ? 'border-red-500' : ''}
            />
            {errors.emergencyContact && (
              <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>
            )}
          </div>

          <div>
            <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
            <Input
              id="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
              placeholder="Emergency contact phone"
              className={errors.emergencyPhone ? 'border-red-500' : ''}
            />
            {errors.emergencyPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="medicalFitness">Medical Fitness Certificate</Label>
            <Input
              id="medicalFitness"
              value={formData.medicalFitness}
              onChange={(e) => handleInputChange('medicalFitness', e.target.value)}
              placeholder="Medical certificate number"
            />
          </div>

          <div>
            <Label htmlFor="medicalExpiry">Medical Certificate Expiry</Label>
            <Input
              id="medicalExpiry"
              type="date"
              value={formData.medicalExpiry}
              onChange={(e) => handleInputChange('medicalExpiry', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Government IDs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Government IDs</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="panNumber">PAN Number</Label>
            <Input
              id="panNumber"
              value={formData.panNumber}
              onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
              placeholder="PAN number"
              maxLength={10}
            />
          </div>

          <div>
            <Label htmlFor="aadharNumber">Aadhar Number</Label>
            <Input
              id="aadharNumber"
              value={formData.aadharNumber}
              onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
              placeholder="Aadhar number"
              maxLength={12}
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
              placeholder="Any additional notes about the driver..."
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
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          {driver ? 'Update Driver' : 'Add Driver'}
        </Button>
      </div>
    </form>
  );
};

export default DriverForm;