import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import {
  UserPlus,
  User,
  GraduationCap,
  Upload,
  FileCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ChevronRight,
  ChevronLeft,
  CheckCircle
} from 'lucide-react';
import { courses } from '../mock';
import { useToast } from '../hooks/use-toast';

const Admissions = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Personal Information
    fullName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    nationality: 'Indian',
    religion: '',
    category: '',
    aadharNumber: '',
    phone: '',
    alternatePhone: '',
    email: '',
    currentAddress: '',
    permanentAddress: '',
    parentName: '',
    parentOccupation: '',
    parentContact: '',
    
    // Step 2 - Academic Background
    previousSchool: '',
    board: '',
    yearOfPassing: '',
    subjects: '',
    marks: '',
    entranceExam: '',
    entranceRollNo: '',
    entranceRank: '',
    entranceScore: '',
    
    // Step 3 - Documents
    documents: {
      photo: null,
      signature: null,
      aadharCard: null,
      birthCertificate: null,
      idProof: null,
      addressProof: null,
      tenthMarksheet: null,
      twelfthMarksheet: null,
      transferCertificate: null,
      migrationCertificate: null,
      casteCertificate: null,
      incomeCertificate: null,
      medicalCertificate: null
    }
  });

  const { toast } = useToast();

  const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Academic Background', icon: GraduationCap },
    { id: 3, name: 'Document Upload', icon: Upload },
    { id: 4, name: 'Review & Submit', icon: FileCheck }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentUpload = (docType, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Mock submission
    toast({
      title: "Application Submitted Successfully!",
      description: "Your admission application has been received. Application ID: ADM2024001",
    });
    
    // Reset form
    setFormData({
      fullName: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      nationality: 'Indian',
      religion: '',
      category: '',
      aadharNumber: '',
      phone: '',
      alternatePhone: '',
      email: '',
      currentAddress: '',
      permanentAddress: '',
      parentName: '',
      parentOccupation: '',
      parentContact: '',
      previousSchool: '',
      board: '',
      yearOfPassing: '',
      subjects: '',
      marks: '',
      entranceExam: '',
      entranceRollNo: '',
      entranceRank: '',
      entranceScore: '',
      documents: {}
    });
    setCurrentStep(1);
  };

  const DocumentUpload = ({ label, docType, required = false }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <input
          type="file"
          onChange={(e) => handleDocumentUpload(docType, e.target.files[0])}
          className="hidden"
          id={docType}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <label htmlFor={docType} className="cursor-pointer">
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 5MB)</p>
        </label>
        {formData.documents[docType] && (
          <div className="mt-2">
            <Badge variant="outline" className="text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              {formData.documents[docType].name}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div>
                <Label>Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Blood Group</Label>
                <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="obc">OBC</SelectItem>
                    <SelectItem value="sc">SC</SelectItem>
                    <SelectItem value="st">ST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                <Input
                  id="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                  placeholder="Enter 12-digit Aadhar number"
                  maxLength={12}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address Information</h3>
              <div>
                <Label htmlFor="currentAddress">Current Address *</Label>
                <Textarea
                  id="currentAddress"
                  value={formData.currentAddress}
                  onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                  placeholder="Enter current address"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="permanentAddress">Permanent Address *</Label>
                <Textarea
                  id="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                  placeholder="Enter permanent address"
                  rows={3}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Parent/Guardian Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => handleInputChange('parentName', e.target.value)}
                    placeholder="Enter parent name"
                  />
                </div>
                <div>
                  <Label htmlFor="parentOccupation">Occupation</Label>
                  <Input
                    id="parentOccupation"
                    value={formData.parentOccupation}
                    onChange={(e) => handleInputChange('parentOccupation', e.target.value)}
                    placeholder="Enter occupation"
                  />
                </div>
                <div>
                  <Label htmlFor="parentContact">Contact Number *</Label>
                  <Input
                    id="parentContact"
                    value={formData.parentContact}
                    onChange={(e) => handleInputChange('parentContact', e.target.value)}
                    placeholder="Enter contact number"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="previousSchool">Previous School/College *</Label>
                <Input
                  id="previousSchool"
                  value={formData.previousSchool}
                  onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                  placeholder="Enter previous institution name"
                />
              </div>
              <div>
                <Label htmlFor="board">Board/University *</Label>
                <Input
                  id="board"
                  value={formData.board}
                  onChange={(e) => handleInputChange('board', e.target.value)}
                  placeholder="Enter board or university name"
                />
              </div>
              <div>
                <Label htmlFor="yearOfPassing">Year of Passing *</Label>
                <Input
                  id="yearOfPassing"
                  type="number"
                  value={formData.yearOfPassing}
                  onChange={(e) => handleInputChange('yearOfPassing', e.target.value)}
                  placeholder="Enter year of passing"
                  min="2000"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <Label htmlFor="marks">Marks/Percentage *</Label>
                <Input
                  id="marks"
                  value={formData.marks}
                  onChange={(e) => handleInputChange('marks', e.target.value)}
                  placeholder="Enter marks or percentage"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="subjects">Subjects Taken *</Label>
              <Textarea
                id="subjects"
                value={formData.subjects}
                onChange={(e) => handleInputChange('subjects', e.target.value)}
                placeholder="Enter subjects taken (comma separated)"
                rows={3}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Entrance Exam Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entranceExam">Entrance Exam Name</Label>
                  <Input
                    id="entranceExam"
                    value={formData.entranceExam}
                    onChange={(e) => handleInputChange('entranceExam', e.target.value)}
                    placeholder="e.g., JEE Main, NEET"
                  />
                </div>
                <div>
                  <Label htmlFor="entranceRollNo">Roll Number</Label>
                  <Input
                    id="entranceRollNo"
                    value={formData.entranceRollNo}
                    onChange={(e) => handleInputChange('entranceRollNo', e.target.value)}
                    placeholder="Enter roll number"
                  />
                </div>
                <div>
                  <Label htmlFor="entranceRank">Rank</Label>
                  <Input
                    id="entranceRank"
                    type="number"
                    value={formData.entranceRank}
                    onChange={(e) => handleInputChange('entranceRank', e.target.value)}
                    placeholder="Enter rank"
                  />
                </div>
                <div>
                  <Label htmlFor="entranceScore">Score</Label>
                  <Input
                    id="entranceScore"
                    value={formData.entranceScore}
                    onChange={(e) => handleInputChange('entranceScore', e.target.value)}
                    placeholder="Enter score"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DocumentUpload label="Passport Photo" docType="photo" required />
              <DocumentUpload label="Signature" docType="signature" required />
              <DocumentUpload label="Aadhar Card Copy" docType="aadharCard" required />
              <DocumentUpload label="Birth Certificate" docType="birthCertificate" required />
              <DocumentUpload label="ID Proof" docType="idProof" required />
              <DocumentUpload label="Address Proof" docType="addressProof" required />
              <DocumentUpload label="10th Marksheet" docType="tenthMarksheet" required />
              <DocumentUpload label="12th Marksheet" docType="twelfthMarksheet" required />
              <DocumentUpload label="Transfer Certificate" docType="transferCertificate" />
              <DocumentUpload label="Migration Certificate" docType="migrationCertificate" />
              <DocumentUpload label="Caste Certificate" docType="casteCertificate" />
              <DocumentUpload label="Income Certificate" docType="incomeCertificate" />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Application Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {formData.fullName}</p>
                    <p><span className="font-medium">Date of Birth:</span> {formData.dateOfBirth}</p>
                    <p><span className="font-medium">Gender:</span> {formData.gender}</p>
                    <p><span className="font-medium">Category:</span> {formData.category}</p>
                    <p><span className="font-medium">Email:</span> {formData.email}</p>
                    <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Academic Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Previous School:</span> {formData.previousSchool}</p>
                    <p><span className="font-medium">Board:</span> {formData.board}</p>
                    <p><span className="font-medium">Year of Passing:</span> {formData.yearOfPassing}</p>
                    <p><span className="font-medium">Marks:</span> {formData.marks}</p>
                    {formData.entranceExam && (
                      <p><span className="font-medium">Entrance Exam:</span> {formData.entranceExam}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Documents Uploaded</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(formData.documents).map(([key, value]) => (
                    value && (
                      <Badge key={key} variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Badge>
                    )
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Please review all information carefully before submitting. 
                Once submitted, you will receive an application ID for future reference.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admissions</h1>
        <p className="text-gray-600 mt-2">Multi-step admission form for new student enrollment</p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Admission Application
            </CardTitle>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="mt-4" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    isActive 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : isCompleted 
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-5 w-5 text-gray-400 mx-4 hidden sm:block" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex items-center bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Application
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admissions;