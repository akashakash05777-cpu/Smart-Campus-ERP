import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { CreditCard, Plus, Search, Filter, IndianRupee, Calendar, Receipt } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

// Mock data for students with fee information
const mockStudentsData = [
  { 
    id: 1, 
    name: 'Arjun Sharma', 
    total_fee: 50000, 
    paid_fee: 50000, 
    outstanding_fee: 0, 
    fee_status: 'paid',
    course: 'B.Tech CSE',
    roll_no: 'CS2024001'
  },
  { 
    id: 2, 
    name: 'Priya Patel', 
    total_fee: 45000, 
    paid_fee: 40000, 
    outstanding_fee: 5000, 
    fee_status: 'pending',
    course: 'B.Com',
    roll_no: 'CM2024002'
  },
  { 
    id: 3, 
    name: 'Rohit Kumar', 
    total_fee: 48000, 
    paid_fee: 23000, 
    outstanding_fee: 25000, 
    fee_status: 'pending',
    course: 'BBA',
    roll_no: 'BA2024003'
  },
  { 
    id: 4, 
    name: 'Sneha Singh', 
    total_fee: 46000, 
    paid_fee: 46000, 
    outstanding_fee: 0, 
    fee_status: 'paid',
    course: 'B.Sc Physics',
    roll_no: 'PH2024004'
  },
  { 
    id: 5, 
    name: 'Vikram Joshi', 
    total_fee: 52000, 
    paid_fee: 44000, 
    outstanding_fee: 8000, 
    fee_status: 'pending',
    course: 'B.Tech ECE',
    roll_no: 'EC2024005'
  },
  { 
    id: 6, 
    name: 'Anita Verma', 
    total_fee: 43000, 
    paid_fee: 43000, 
    outstanding_fee: 0, 
    fee_status: 'paid',
    course: 'B.Sc Chemistry',
    roll_no: 'CH2024006'
  },
  { 
    id: 7, 
    name: 'Rajesh Gupta', 
    total_fee: 49000, 
    paid_fee: 35000, 
    outstanding_fee: 14000, 
    fee_status: 'overdue',
    course: 'BA English',
    roll_no: 'EN2024007'
  }
];

// Mock transaction data
const mockTransactionsData = [
  {
    id: 1,
    student_name: 'Arjun Sharma',
    amount: 25000,
    payment_mode: 'upi',
    payment_date: '2024-01-15',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    student_name: 'Priya Patel',
    amount: 40000,
    payment_mode: 'bank_transfer',
    payment_date: '2024-01-14',
    created_at: '2024-01-14T14:20:00Z'
  },
  {
    id: 3,
    student_name: 'Rohit Kumar',
    amount: 23000,
    payment_mode: 'card',
    payment_date: '2024-01-13',
    created_at: '2024-01-13T09:15:00Z'
  },
  {
    id: 4,
    student_name: 'Sneha Singh',
    amount: 46000,
    payment_mode: 'cash',
    payment_date: '2024-01-12',
    created_at: '2024-01-12T16:45:00Z'
  },
  {
    id: 5,
    student_name: 'Vikram Joshi',
    amount: 44000,
    payment_mode: 'upi',
    payment_date: '2024-01-11',
    created_at: '2024-01-11T11:30:00Z'
  },
  {
    id: 6,
    student_name: 'Anita Verma',
    amount: 43000,
    payment_mode: 'bank_transfer',
    payment_date: '2024-01-10',
    created_at: '2024-01-10T13:25:00Z'
  },
  {
    id: 7,
    student_name: 'Rajesh Gupta',
    amount: 35000,
    payment_mode: 'card',
    payment_date: '2024-01-09',
    created_at: '2024-01-09T15:40:00Z'
  },
  {
    id: 8,
    student_name: 'Arjun Sharma',
    amount: 25000,
    payment_mode: 'upi',
    payment_date: new Date().toISOString().split('T')[0], // Today's transaction
    created_at: new Date().toISOString()
  }
];

const FeeCollection = () => {
  const [students, setStudents] = useState(mockStudentsData);
  const [transactions, setTransactions] = useState(mockTransactionsData);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    payment_mode: '',
    payment_date: new Date().toISOString().split('T')[0]
  });

  const { toast } = useToast();

  const paymentModes = [
    { value: 'upi', label: 'UPI' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'card', label: 'Card' },
    { value: 'cash', label: 'Cash' }
  ];

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, filterMode]);

  const filterTransactions = () => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.payment_mode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Payment mode filter
    if (filterMode !== 'all') {
      filtered = filtered.filter(transaction => transaction.payment_mode === filterMode);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredTransactions(filtered);
  };

  const handleStudentSelect = (studentId) => {
    const student = students.find(s => s.id === parseInt(studentId));
    setSelectedStudent(student);
    setFormData({
      ...formData,
      student_id: studentId,
      amount: student?.outstanding_fee || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const newTransaction = {
        id: transactions.length + 1,
        student_name: selectedStudent.name,
        amount: parseFloat(formData.amount),
        payment_mode: formData.payment_mode,
        payment_date: formData.payment_date,
        created_at: new Date().toISOString()
      };
      
      // Update transactions list
      setTransactions([newTransaction, ...transactions]);
      
      // Update student's fee status in local state
      setStudents(students.map(student => {
        if (student.id === parseInt(formData.student_id)) {
          const newPaidFee = student.paid_fee + parseFloat(formData.amount);
          const newOutstandingFee = student.total_fee - newPaidFee;
          return {
            ...student,
            paid_fee: newPaidFee,
            outstanding_fee: Math.max(0, newOutstandingFee),
            fee_status: newOutstandingFee <= 0 ? 'paid' : 'pending'
          };
        }
        return student;
      }));

      // Reset form
      setFormData({
        student_id: '',
        amount: '',
        payment_mode: '',
        payment_date: new Date().toISOString().split('T')[0]
      });
      setSelectedStudent(null);
      setDialogOpen(false);
      
      toast({
        title: "Payment Recorded Successfully!",
        description: `₹${parseFloat(formData.amount).toLocaleString()} payment recorded for ${selectedStudent.name}`,
      });
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPaymentModeBadge = (mode) => {
    const variants = {
      upi: 'bg-blue-100 text-blue-800',
      bank_transfer: 'bg-green-100 text-green-800',
      card: 'bg-purple-100 text-purple-800',
      cash: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={variants[mode] || 'bg-gray-100 text-gray-800'}>
        {mode.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const totalCollected = transactions.reduce((sum, t) => sum + t.amount, 0);
  const todayCollected = transactions
    .filter(t => new Date(t.payment_date).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingStudents = students.filter(s => s.fee_status === 'pending' || s.fee_status === 'overdue');
  const totalOutstanding = pendingStudents.reduce((sum, s) => sum + s.outstanding_fee, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CreditCard className="w-8 h-8 mr-3 text-green-600" />
            Fee Collection
          </h1>
          <p className="text-gray-600 mt-1">
            Manage student fee payments and transactions
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record Fee Payment</DialogTitle>
              <DialogDescription>
                Enter payment details to record a new fee transaction.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="student_id">Select Student</Label>
                <Select value={formData.student_id} onValueChange={handleStudentSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose student" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingStudents.map(student => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.name} - ₹{student.outstanding_fee.toLocaleString()} pending
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedStudent && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Payment Details</p>
                  <p className="text-sm text-blue-700">
                    Outstanding: ₹{selectedStudent.outstanding_fee.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-700">
                    Total Fee: ₹{selectedStudent.total_fee.toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="amount">Payment Amount (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    className="pl-10"
                    max={selectedStudent?.outstanding_fee || undefined}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payment_mode">Payment Mode</Label>
                <Select value={formData.payment_mode} onValueChange={(value) => setFormData({...formData, payment_mode: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentModes.map(mode => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment_date">Payment Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="payment_date"
                    name="payment_date"
                    type="date"
                    value={formData.payment_date}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? 'Recording...' : 'Record Payment'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Collected</p>
                <p className="text-2xl font-bold text-green-600">₹{totalCollected.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Collection</p>
                <p className="text-2xl font-bold text-blue-600">₹{todayCollected.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding Dues</p>
                <p className="text-2xl font-bold text-red-600">₹{totalOutstanding.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <Receipt className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Students</p>
                <p className="text-2xl font-bold text-orange-600">{pendingStudents.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            View and track all fee payment records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by student name or payment mode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterMode} onValueChange={setFilterMode}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                {paymentModes.map(mode => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transactions Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Recorded On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-gray-50">
                    <TableCell>
                      <p className="font-medium text-gray-900">{transaction.student_name}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-green-600">
                        ₹{transaction.amount.toLocaleString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      {getPaymentModeBadge(transaction.payment_mode)}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {new Date(transaction.payment_date).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeeCollection;