import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Book,
  BookOpen,
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  Upload,
  Bell,
  TrendingUp,
  BarChart3,
  Eye,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { useToast } from './ui/use-toast';

const LibraryManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('catalog');
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Dialog states
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  
  // Form states
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    quantity: 1,
    publicationYear: new Date().getFullYear(),
    description: '',
    digitalCopy: null
  });
  
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    memberType: 'student',
    studentId: '',
    department: ''
  });
  
  const [issueForm, setIssueForm] = useState({
    memberId: '',
    bookId: '',
    dueDate: ''
  });

  // Mock data initialization
  useEffect(() => {
    // Initialize with mock data
    const mockBooks = [
      {
        id: 1,
        title: 'Introduction to Computer Science',
        author: 'John Smith',
        isbn: '978-0123456789',
        category: 'Computer Science',
        quantity: 5,
        available: 3,
        publicationYear: 2023,
        description: 'Comprehensive guide to computer science fundamentals',
        digitalCopy: true,
        addedDate: '2024-01-15'
      },
      {
        id: 2,
        title: 'Advanced Mathematics',
        author: 'Jane Doe',
        isbn: '978-0987654321',
        category: 'Mathematics',
        quantity: 3,
        available: 1,
        publicationYear: 2022,
        description: 'Advanced mathematical concepts and applications',
        digitalCopy: false,
        addedDate: '2024-01-10'
      },
      {
        id: 3,
        title: 'Physics Principles',
        author: 'Robert Johnson',
        isbn: '978-0456789123',
        category: 'Physics',
        quantity: 4,
        available: 4,
        publicationYear: 2023,
        description: 'Fundamental principles of physics',
        digitalCopy: true,
        addedDate: '2024-01-20'
      }
    ];
    
    const mockMembers = [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@college.edu',
        phone: '+1234567890',
        address: '123 College St, City',
        memberType: 'student',
        studentId: 'STU001',
        department: 'Computer Science',
        joinDate: '2024-01-01',
        status: 'active',
        booksIssued: 2,
        finesDue: 0
      },
      {
        id: 2,
        name: 'Dr. Michael Brown',
        email: 'michael@college.edu',
        phone: '+1234567891',
        address: '456 Faculty Ave, City',
        memberType: 'staff',
        employeeId: 'EMP001',
        department: 'Mathematics',
        joinDate: '2023-08-15',
        status: 'active',
        booksIssued: 1,
        finesDue: 25
      }
    ];
    
    const mockTransactions = [
      {
        id: 1,
        memberId: 1,
        memberName: 'Alice Johnson',
        bookId: 1,
        bookTitle: 'Introduction to Computer Science',
        issueDate: '2024-01-25',
        dueDate: '2024-02-08',
        returnDate: null,
        status: 'issued',
        fine: 0
      },
      {
        id: 2,
        memberId: 2,
        memberName: 'Dr. Michael Brown',
        bookId: 2,
        bookTitle: 'Advanced Mathematics',
        issueDate: '2024-01-20',
        dueDate: '2024-02-03',
        returnDate: null,
        status: 'overdue',
        fine: 25
      }
    ];
    
    const mockNotifications = [
      {
        id: 1,
        type: 'overdue',
        title: 'Overdue Book Alert',
        message: 'Advanced Mathematics is overdue by 3 days',
        memberId: 2,
        date: '2024-02-06',
        read: false
      },
      {
        id: 2,
        type: 'due_soon',
        title: 'Book Due Tomorrow',
        message: 'Introduction to Computer Science is due tomorrow',
        memberId: 1,
        date: '2024-02-07',
        read: false
      }
    ];
    
    setBooks(mockBooks);
    setMembers(mockMembers);
    setTransactions(mockTransactions);
    setNotifications(mockNotifications);
  }, []);

  // Book management functions
  const handleAddBook = () => {
    const newBook = {
      id: books.length + 1,
      ...bookForm,
      available: bookForm.quantity,
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    setBooks([...books, newBook]);
    setBookForm({
      title: '',
      author: '',
      isbn: '',
      category: '',
      quantity: 1,
      publicationYear: new Date().getFullYear(),
      description: '',
      digitalCopy: null
    });
    setIsBookDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Book added successfully to the catalog."
    });
  };

  const handleEditBook = () => {
    setBooks(books.map(book => 
      book.id === editingBook.id 
        ? { ...book, ...bookForm }
        : book
    ));
    setEditingBook(null);
    setIsBookDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Book updated successfully."
    });
  };

  const handleDeleteBook = (bookId) => {
    setBooks(books.filter(book => book.id !== bookId));
    toast({
      title: "Success",
      description: "Book removed from catalog."
    });
  };

  // Member management functions
  const handleAddMember = () => {
    const newMember = {
      id: members.length + 1,
      ...memberForm,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      booksIssued: 0,
      finesDue: 0
    };
    
    setMembers([...members, newMember]);
    setMemberForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      memberType: 'student',
      studentId: '',
      department: ''
    });
    setIsMemberDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Member added successfully."
    });
  };

  // Issue/Return functions
  const handleIssueBook = () => {
    const book = books.find(b => b.id === parseInt(issueForm.bookId));
    const member = members.find(m => m.id === parseInt(issueForm.memberId));
    
    if (book && member && book.available > 0) {
      const newTransaction = {
        id: transactions.length + 1,
        memberId: member.id,
        memberName: member.name,
        bookId: book.id,
        bookTitle: book.title,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: issueForm.dueDate,
        returnDate: null,
        status: 'issued',
        fine: 0
      };
      
      setTransactions([...transactions, newTransaction]);
      setBooks(books.map(b => 
        b.id === book.id 
          ? { ...b, available: b.available - 1 }
          : b
      ));
      setMembers(members.map(m => 
        m.id === member.id 
          ? { ...m, booksIssued: m.booksIssued + 1 }
          : m
      ));
      
      setIssueForm({ memberId: '', bookId: '', dueDate: '' });
      setIsIssueDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Book issued to ${member.name} successfully.`
      });
    }
  };

  const handleReturnBook = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      const returnDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date(transaction.dueDate);
      const currentDate = new Date(returnDate);
      const daysLate = Math.max(0, Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24)));
      const fine = daysLate * 5; // $5 per day late
      
      setTransactions(transactions.map(t => 
        t.id === transactionId 
          ? { ...t, returnDate, status: 'returned', fine }
          : t
      ));
      
      setBooks(books.map(b => 
        b.id === transaction.bookId 
          ? { ...b, available: b.available + 1 }
          : b
      ));
      
      setMembers(members.map(m => 
        m.id === transaction.memberId 
          ? { 
              ...m, 
              booksIssued: m.booksIssued - 1,
              finesDue: m.finesDue + fine
            }
          : m
      ));
      
      toast({
        title: "Success",
        description: `Book returned successfully. ${fine > 0 ? `Fine: $${fine}` : ''}`
      });
    }
  };

  // Filter functions
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'available' && book.available > 0) ||
                         (filterStatus === 'issued' && book.available < book.quantity) ||
                         (filterStatus === 'unavailable' && book.available === 0);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(books.map(book => book.category))];
  const overdueTransactions = transactions.filter(t => 
    t.status === 'issued' && new Date(t.dueDate) < new Date()
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-600 mt-1">Manage books, resources, members, and transactions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Book className="h-4 w-4" />
            <span>{books.length} Books</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{members.length} Members</span>
          </Badge>
          <Badge variant="destructive" className="flex items-center space-x-1">
            <AlertTriangle className="h-4 w-4" />
            <span>{overdueTransactions.length} Overdue</span>
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="catalog" className="flex items-center space-x-2">
            <Book className="h-4 w-4" />
            <span>Catalog</span>
          </TabsTrigger>
          <TabsTrigger value="issue-return" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Issue/Return</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Members</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Book Catalog Tab */}
        <TabsContent value="catalog" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Book Catalog</h2>
            <Button 
              onClick={() => {
                setEditingBook(null);
                setBookForm({
                  title: '',
                  author: '',
                  isbn: '',
                  category: '',
                  quantity: 1,
                  publicationYear: new Date().getFullYear(),
                  description: '',
                  digitalCopy: null
                });
                setIsBookDialogOpen(true);
              }}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">by {book.author}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingBook(book);
                          setBookForm(book);
                          setIsBookDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">ISBN:</span>
                      <span>{book.isbn}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <Badge variant="secondary">{book.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Available:</span>
                      <span className={book.available > 0 ? 'text-green-600' : 'text-red-600'}>
                        {book.available}/{book.quantity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Year:</span>
                      <span>{book.publicationYear}</span>
                    </div>
                    {book.digitalCopy && (
                      <div className="flex items-center space-x-1 text-sm text-blue-600">
                        <Download className="h-3 w-3" />
                        <span>Digital copy available</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Issue/Return Tab */}
        <TabsContent value="issue-return" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Issue & Return Management</h2>
            <Button 
              onClick={() => setIsIssueDialogOpen(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Issue Book</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Current Issues</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.filter(t => t.status === 'issued' || t.status === 'overdue').map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{transaction.bookTitle}</p>
                        <p className="text-sm text-gray-600">{transaction.memberName}</p>
                        <p className="text-xs text-gray-500">Due: {transaction.dueDate}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={transaction.status === 'overdue' ? 'destructive' : 'default'}
                        >
                          {transaction.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => handleReturnBook(transaction.id)}
                        >
                          Return
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Returns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Recent Returns</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.filter(t => t.status === 'returned').slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{transaction.bookTitle}</p>
                        <p className="text-sm text-gray-600">{transaction.memberName}</p>
                        <p className="text-xs text-gray-500">Returned: {transaction.returnDate}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {transaction.fine > 0 && (
                          <Badge variant="destructive">
                            Fine: ${transaction.fine}
                          </Badge>
                        )}
                        <Badge variant="secondary">Returned</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Library Members</h2>
            <Button 
              onClick={() => {
                setEditingMember(null);
                setMemberForm({
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  memberType: 'student',
                  studentId: '',
                  department: ''
                });
                setIsMemberDialogOpen(true);
              }}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Member</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{member.email}</p>
                    </div>
                    <Badge variant={member.memberType === 'student' ? 'default' : 'secondary'}>
                      {member.memberType}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{member.address}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Books Issued:</span>
                      <span className="font-medium">{member.booksIssued}</span>
                    </div>
                    {member.finesDue > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Fines Due:</span>
                        <span className="text-red-600 font-medium">${member.finesDue}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Search & Filter</h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by title, author, or ISBN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="issued">Partially Issued</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">ISBN:</span>
                      <span>{book.isbn}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <Badge variant="secondary">{book.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Available:</span>
                      <span className={book.available > 0 ? 'text-green-600' : 'text-red-600'}>
                        {book.available}/{book.quantity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{book.description}</p>
                    {book.digitalCopy && (
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download Digital Copy
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <h2 className="text-2xl font-semibold">Notifications & Alerts</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Overdue Books</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueTransactions.map((transaction) => {
                    const daysOverdue = Math.ceil((new Date() - new Date(transaction.dueDate)) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={transaction.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="font-medium text-red-800">{transaction.bookTitle}</p>
                        <p className="text-sm text-red-600">{transaction.memberName}</p>
                        <p className="text-xs text-red-500">Overdue by {daysOverdue} days</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span>Due Soon</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.filter(t => {
                    const dueDate = new Date(t.dueDate);
                    const today = new Date();
                    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                    return t.status === 'issued' && diffDays <= 3 && diffDays >= 0;
                  }).map((transaction) => {
                    const daysUntilDue = Math.ceil((new Date(transaction.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={transaction.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="font-medium text-yellow-800">{transaction.bookTitle}</p>
                        <p className="text-sm text-yellow-600">{transaction.memberName}</p>
                        <p className="text-xs text-yellow-500">Due in {daysUntilDue} days</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <h2 className="text-2xl font-semibold">Reports & Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Book className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{books.length}</p>
                    <p className="text-sm text-gray-600">Total Books</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{members.length}</p>
                    <p className="text-sm text-gray-600">Active Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{transactions.filter(t => t.status === 'issued' || t.status === 'overdue').length}</p>
                    <p className="text-sm text-gray-600">Books Issued</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">${members.reduce((sum, m) => sum + m.finesDue, 0)}</p>
                    <p className="text-sm text-gray-600">Total Fines</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {books.slice(0, 5).map((book, index) => (
                    <div key={book.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-gray-600">{book.author}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{book.quantity - book.available} issued</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map(category => {
                    const count = books.filter(book => book.category === category).length;
                    const percentage = ((count / books.length) * 100).toFixed(1);
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="font-medium">{category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-2xl font-semibold">Library Settings</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxBooks">Maximum books per member</Label>
                  <Input id="maxBooks" type="number" defaultValue="5" />
                </div>
                <div>
                  <Label htmlFor="loanPeriod">Default loan period (days)</Label>
                  <Input id="loanPeriod" type="number" defaultValue="14" />
                </div>
                <div>
                  <Label htmlFor="fineRate">Fine per day (USD)</Label>
                  <Input id="fineRate" type="number" step="0.01" defaultValue="5.00" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">Email notifications</Label>
                  <input type="checkbox" id="emailNotifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsNotifications">SMS notifications</Label>
                  <input type="checkbox" id="smsNotifications" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="overdueAlerts">Overdue alerts</Label>
                  <input type="checkbox" id="overdueAlerts" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Book Dialog */}
      <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={bookForm.title}
                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                placeholder="Book title"
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={bookForm.author}
                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                placeholder="Author name"
              />
            </div>
            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={bookForm.isbn}
                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                placeholder="978-0123456789"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={bookForm.category}
                onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={bookForm.quantity}
                onChange={(e) => setBookForm({ ...bookForm, quantity: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="year">Publication Year</Label>
              <Input
                id="year"
                type="number"
                value={bookForm.publicationYear}
                onChange={(e) => setBookForm({ ...bookForm, publicationYear: parseInt(e.target.value) })}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={bookForm.description}
                onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                placeholder="Book description..."
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="digitalCopy">Digital Copy</Label>
              <div className="flex items-center space-x-4 mt-2">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload PDF</span>
                </Button>
                <span className="text-sm text-gray-600">Optional: Upload digital version</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsBookDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingBook ? handleEditBook : handleAddBook}>
              {editingBook ? 'Update Book' : 'Add Book'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="memberName">Full Name</Label>
              <Input
                id="memberName"
                value={memberForm.name}
                onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                placeholder="Member name"
              />
            </div>
            <div>
              <Label htmlFor="memberEmail">Email</Label>
              <Input
                id="memberEmail"
                type="email"
                value={memberForm.email}
                onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                placeholder="email@college.edu"
              />
            </div>
            <div>
              <Label htmlFor="memberPhone">Phone</Label>
              <Input
                id="memberPhone"
                value={memberForm.phone}
                onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label htmlFor="memberType">Member Type</Label>
              <Select value={memberForm.memberType} onValueChange={(value) => setMemberForm({ ...memberForm, memberType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="studentId">Student/Employee ID</Label>
              <Input
                id="studentId"
                value={memberForm.studentId}
                onChange={(e) => setMemberForm({ ...memberForm, studentId: e.target.value })}
                placeholder="STU001 or EMP001"
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={memberForm.department}
                onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })}
                placeholder="Computer Science"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="memberAddress">Address</Label>
              <Textarea
                id="memberAddress"
                value={memberForm.address}
                onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
                placeholder="Full address..."
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingMember ? () => {} : handleAddMember}>
              {editingMember ? 'Update Member' : 'Add Member'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Issue Book Dialog */}
      <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Book</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="issueMember">Select Member</Label>
              <Select value={issueForm.memberId} onValueChange={(value) => setIssueForm({ ...issueForm, memberId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name} ({member.memberType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="issueBook">Select Book</Label>
              <Select value={issueForm.bookId} onValueChange={(value) => setIssueForm({ ...issueForm, bookId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose book" />
                </SelectTrigger>
                <SelectContent>
                  {books.filter(book => book.available > 0).map(book => (
                    <SelectItem key={book.id} value={book.id.toString()}>
                      {book.title} (Available: {book.available})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={issueForm.dueDate}
                onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsIssueDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleIssueBook} disabled={!issueForm.memberId || !issueForm.bookId || !issueForm.dueDate}>
              Issue Book
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LibraryManagement;