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
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
   AlertCircle,
   Download,
   Eye,
   X,
   MessageSquare
 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { 
  mockDriverPayments, 
  mockPaymentHistory, 
  mockDrivers,
  paymentStatuses,
  paymentMethods,
  bonusTypes,
  deductionTypes
} from '../mock';

const DriverPayment = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState(mockDriverPayments);
  const [paymentHistory, setPaymentHistory] = useState(mockPaymentHistory);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [activeView, setActiveView] = useState('current'); // current, history, summary
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterDriver, setFilterDriver] = useState('all');

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    driverId: '',
    driverName: '',
    month: '',
    baseSalary: '',
    overtimeHours: 0,
    overtimeRate: '',
    bonuses: [],
    deductions: [],
    paymentMethod: 'Bank Transfer',
    bankAccount: '',
    remarks: ''
  });

  const [newBonus, setNewBonus] = useState({ type: '', amount: '' });
  const [newDeduction, setNewDeduction] = useState({ type: '', amount: '' });

  // Calculate totals
  const calculateTotals = (payment) => {
    const overtimeAmount = payment.overtimeHours * payment.overtimeRate;
    const totalBonuses = payment.bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
    const totalDeductions = payment.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    const totalEarnings = payment.baseSalary + overtimeAmount + totalBonuses;
    const netSalary = totalEarnings - totalDeductions;
    
    return {
      overtimeAmount,
      totalBonuses,
      totalDeductions,
      totalEarnings,
      netSalary
    };
  };

  // Filter functions
  const getFilteredPayments = () => {
    return payments.filter(payment => {
      const matchesSearch = payment.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.driverId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
      const matchesMonth = filterMonth === 'all' || payment.month === filterMonth;
      const matchesDriver = filterDriver === 'all' || payment.driverId === filterDriver;
      
      return matchesSearch && matchesStatus && matchesMonth && matchesDriver;
    });
  };

  // Payment management functions
  const handleAddPayment = () => {
    const totals = calculateTotals(paymentForm);
    const newPayment = {
      ...paymentForm,
      id: 'DP' + String(payments.length + 1).padStart(3, '0'),
      ...totals,
      paymentDate: paymentForm.status === 'Paid' ? new Date().toISOString().split('T')[0] : null,
      status: 'Pending'
    };
    
    setPayments([...payments, newPayment]);
    setIsPaymentDialogOpen(false);
    resetPaymentForm();
    
    toast({
      title: "Payment Record Added",
      description: `Payment record for ${paymentForm.driverName} has been created.`
    });
  };

  const handleEditPayment = () => {
    const totals = calculateTotals(paymentForm);
    const updatedPayment = {
      ...paymentForm,
      id: editingPayment.id,
      ...totals
    };
    
    setPayments(payments.map(p => p.id === editingPayment.id ? updatedPayment : p));
    setEditingPayment(null);
    setIsPaymentDialogOpen(false);
    resetPaymentForm();
    
    toast({
      title: "Payment Updated",
      description: "Payment record has been updated successfully."
    });
  };

  const handleDeletePayment = (paymentId) => {
    setPayments(payments.filter(p => p.id !== paymentId));
    toast({
      title: "Payment Deleted",
      description: "Payment record has been removed."
    });
  };

  const handleProcessPayment = (paymentId) => {
    setPayments(payments.map(p => 
      p.id === paymentId 
        ? { ...p, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] }
        : p
    ));
    
    toast({
      title: "Payment Processed",
      description: "Payment has been marked as paid."
    });
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      driverId: '',
      driverName: '',
      month: '',
      baseSalary: '',
      overtimeHours: 0,
      overtimeRate: '',
      bonuses: [],
      deductions: [],
      paymentMethod: 'Bank Transfer',
      bankAccount: '',
      remarks: ''
    });
    setNewBonus({ type: '', amount: '' });
    setNewDeduction({ type: '', amount: '' });
  };

  const addBonus = () => {
    if (newBonus.type && newBonus.amount) {
      setPaymentForm({
        ...paymentForm,
        bonuses: [...paymentForm.bonuses, { type: newBonus.type, amount: parseFloat(newBonus.amount) }]
      });
      setNewBonus({ type: '', amount: '' });
    }
  };

  const addDeduction = () => {
    if (newDeduction.type && newDeduction.amount) {
      setPaymentForm({
        ...paymentForm,
        deductions: [...paymentForm.deductions, { type: newDeduction.type, amount: parseFloat(newDeduction.amount) }]
      });
      setNewDeduction({ type: '', amount: '' });
    }
  };

  const removeBonus = (index) => {
    setPaymentForm({
      ...paymentForm,
      bonuses: paymentForm.bonuses.filter((_, i) => i !== index)
    });
  };

  const removeDeduction = (index) => {
    setPaymentForm({
      ...paymentForm,
      deductions: paymentForm.deductions.filter((_, i) => i !== index)
    });
  };

  // Get payment summary statistics
  const getPaymentSummary = () => {
    const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.netSalary, 0);
    const totalPending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.netSalary, 0);
    const totalDrivers = new Set(payments.map(p => p.driverId)).size;
    const avgSalary = payments.length > 0 ? payments.reduce((sum, p) => sum + p.netSalary, 0) / payments.length : 0;
    
    return { totalPaid, totalPending, totalDrivers, avgSalary };
  };

  const summary = getPaymentSummary();

  const renderCurrentPayments = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Driver Payments</h2>
          <p className="text-gray-600">Manage driver salaries and payments</p>
        </div>
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPayment(null); resetPaymentForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPayment ? 'Edit Payment' : 'Add New Payment'}</DialogTitle>
            </DialogHeader>
            {renderPaymentForm()}
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">₹{summary.totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">₹{summary.totalPending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-blue-600">{summary.totalDrivers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Salary</p>
                <p className="text-2xl font-bold text-purple-600">₹{Math.round(summary.avgSalary).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {paymentStatuses.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterDriver} onValueChange={setFilterDriver}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Drivers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Drivers</SelectItem>
            {mockDrivers.map(driver => (
              <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment Records */}
      <div className="grid grid-cols-1 gap-6">
        {getFilteredPayments().map((payment) => (
          <Card key={payment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <div>
                    <CardTitle className="text-lg">{payment.driverName}</CardTitle>
                    <p className="text-sm text-gray-600">{payment.driverId} • {payment.month}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={payment.status === 'Paid' ? 'default' : 
                                payment.status === 'Pending' ? 'secondary' : 'destructive'}>
                    {payment.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPayment(payment);
                        setPaymentForm(payment);
                        setIsPaymentDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {payment.status === 'Pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProcessPayment(payment.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePayment(payment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Base Salary</p>
                  <p className="text-lg font-semibold">₹{payment.baseSalary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-lg font-semibold text-green-600">₹{payment.totalEarnings.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Deductions</p>
                  <p className="text-lg font-semibold text-red-600">₹{payment.totalDeductions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Salary</p>
                  <p className="text-xl font-bold text-blue-600">₹{payment.netSalary.toLocaleString()}</p>
                </div>
              </div>
              
              {payment.remarks && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{payment.remarks}</p>
                </div>
              )}
              
              {payment.paymentDate && (
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Paid on: {new Date(payment.paymentDate).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-8 p-1">
      {/* Basic Information Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-600" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="driverId" className="text-sm font-medium text-gray-700">Driver</Label>
            <Select 
              value={paymentForm.driverId} 
              onValueChange={(value) => {
                const driver = mockDrivers.find(d => d.id === value);
                setPaymentForm({
                  ...paymentForm,
                  driverId: value,
                  driverName: driver ? driver.name : ''
                });
              }}
            >
              <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                {mockDrivers.map(driver => (
                  <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="month" className="text-sm font-medium text-gray-700">Month</Label>
            <Input
              id="month"
              type="month"
              value={paymentForm.month}
              onChange={(e) => setPaymentForm({ ...paymentForm, month: e.target.value })}
              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Salary & Overtime Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-green-600" />
          Salary & Overtime
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="baseSalary" className="text-sm font-medium text-gray-700">Base Salary (₹)</Label>
            <Input
              id="baseSalary"
              type="number"
              value={paymentForm.baseSalary}
              onChange={(e) => setPaymentForm({ ...paymentForm, baseSalary: parseFloat(e.target.value) || 0 })}
              className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
              placeholder="25000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="overtimeHours" className="text-sm font-medium text-gray-700">Overtime Hours</Label>
            <Input
              id="overtimeHours"
              type="number"
              value={paymentForm.overtimeHours}
              onChange={(e) => setPaymentForm({ ...paymentForm, overtimeHours: parseFloat(e.target.value) || 0 })}
              className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="overtimeRate" className="text-sm font-medium text-gray-700">Overtime Rate (₹/hour)</Label>
            <Input
              id="overtimeRate"
              type="number"
              value={paymentForm.overtimeRate}
              onChange={(e) => setPaymentForm({ ...paymentForm, overtimeRate: parseFloat(e.target.value) || 0 })}
              className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
              placeholder="150"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">Payment Method</Label>
            <Select value={paymentForm.paymentMethod} onValueChange={(value) => setPaymentForm({ ...paymentForm, paymentMethod: value })}>
              <SelectTrigger className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Bonuses Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
          Bonuses
        </h3>
        <div className="space-y-3">
          {paymentForm.bonuses.map((bonus, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="font-medium text-gray-700">{bonus.type}</span>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  +₹{bonus.amount.toLocaleString()}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeBonus(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex space-x-3 p-4 bg-white rounded-lg border-2 border-dashed border-emerald-200">
            <Select value={newBonus.type} onValueChange={(value) => setNewBonus({ ...newBonus, type: value })}>
              <SelectTrigger className="flex-1 h-11 border-emerald-200 focus:border-emerald-500">
                <SelectValue placeholder="Select bonus type" />
              </SelectTrigger>
              <SelectContent>
                {bonusTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Amount"
              value={newBonus.amount}
              onChange={(e) => setNewBonus({ ...newBonus, amount: e.target.value })}
              className="w-32 h-11 border-emerald-200 focus:border-emerald-500"
            />
            <Button 
              onClick={addBonus} 
              disabled={!newBonus.type || !newBonus.amount}
              className="h-11 bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Deductions Section */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-xl border border-red-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
          Deductions
        </h3>
        <div className="space-y-3">
          {paymentForm.deductions.map((deduction, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium text-gray-700">{deduction.type}</span>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  -₹{deduction.amount.toLocaleString()}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeDeduction(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex space-x-3 p-4 bg-white rounded-lg border-2 border-dashed border-red-200">
            <Select value={newDeduction.type} onValueChange={(value) => setNewDeduction({ ...newDeduction, type: value })}>
              <SelectTrigger className="flex-1 h-11 border-red-200 focus:border-red-500">
                <SelectValue placeholder="Select deduction type" />
              </SelectTrigger>
              <SelectContent>
                {deductionTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Amount"
              value={newDeduction.amount}
              onChange={(e) => setNewDeduction({ ...newDeduction, amount: e.target.value })}
              className="w-32 h-11 border-red-200 focus:border-red-500"
            />
            <Button 
              onClick={addDeduction} 
              disabled={!newDeduction.type || !newDeduction.amount}
              className="h-11 bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bank Account Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
          Bank Account
        </h3>
        <div className="relative">
          <Input
            value={paymentForm.bankAccount}
            onChange={(e) => setPaymentForm({ ...paymentForm, bankAccount: e.target.value })}
            placeholder="XXXX-XXXX-1234"
            className="h-12 pl-12 border-blue-200 focus:border-blue-500 bg-white"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <CreditCard className="h-5 w-5 text-blue-400" />
          </div>
        </div>
      </div>
      
      {/* Remarks Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-purple-600" />
          Remarks
        </h3>
        <Textarea
          value={paymentForm.remarks}
          onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
          placeholder="Add any additional notes or comments about this payment..."
          className="h-28 border-purple-200 focus:border-purple-500 bg-white resize-none"
        />
      </div>
      
      {/* Payment Summary */}
      {paymentForm.baseSalary && (
        <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <DollarSign className="h-6 w-6 mr-3 text-blue-600" />
            Payment Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Base Salary:</span>
              <span className="text-lg font-semibold text-gray-800">₹{paymentForm.baseSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Overtime ({paymentForm.overtimeHours}h @ ₹{paymentForm.overtimeRate}/h):</span>
              <span className="text-lg font-semibold text-blue-600">₹{(paymentForm.overtimeHours * paymentForm.overtimeRate).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-emerald-500" />
                Total Bonuses:
              </span>
              <span className="text-lg font-semibold text-emerald-600">+₹{paymentForm.bonuses.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium flex items-center">
                <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                Total Deductions:
              </span>
              <span className="text-lg font-semibold text-red-600">-₹{paymentForm.deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-lg">Net Salary:</span>
                <span className="text-white font-bold text-2xl">₹{calculateTotals(paymentForm).netSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
        <Button 
          variant="outline" 
          onClick={() => setIsPaymentDialogOpen(false)}
          className="px-8 py-3 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button 
          onClick={editingPayment ? handleEditPayment : handleAddPayment}
          className="px-8 py-3 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {editingPayment ? 'Update Payment' : 'Add Payment'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* View Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeView === 'current' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('current')}
        >
          Current Payments
        </Button>
        <Button
          variant={activeView === 'history' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('history')}
        >
          Payment History
        </Button>
      </div>

      {activeView === 'current' && renderCurrentPayments()}
      
      {activeView === 'history' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Payment History</h2>
            <p className="text-gray-600">View past payment records</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {mockPaymentHistory.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{payment.driverName}</h4>
                      <p className="text-sm text-gray-600">{payment.month}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">₹{payment.netSalary.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverPayment;