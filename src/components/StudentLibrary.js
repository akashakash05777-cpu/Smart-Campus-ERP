import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Book, 
  Search, 
  Filter, 
  Clock, 
  BookOpen,
  Download,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Eye,
  Bookmark,
  Library
} from 'lucide-react';

const StudentLibrary = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('catalog');

  // Mock library data
  const mockBooks = [
    {
      id: 1,
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '978-0262033848',
      category: 'Computer Science',
      publisher: 'MIT Press',
      publishYear: 2009,
      edition: '3rd Edition',
      totalCopies: 5,
      availableCopies: 2,
      rating: 4.8,
      description: 'A comprehensive textbook on computer algorithms covering design and analysis.',
      coverImage: '/api/placeholder/150/200',
      location: 'CS Section - Shelf A3',
      language: 'English',
      pages: 1312
    },
    {
      id: 2,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      category: 'Computer Science',
      publisher: 'Prentice Hall',
      publishYear: 2008,
      edition: '1st Edition',
      totalCopies: 8,
      availableCopies: 0,
      rating: 4.6,
      description: 'A handbook of agile software craftsmanship with practical advice.',
      coverImage: '/api/placeholder/150/200',
      location: 'CS Section - Shelf B2',
      language: 'English',
      pages: 464
    },
    {
      id: 3,
      title: 'Calculus: Early Transcendentals',
      author: 'James Stewart',
      isbn: '978-1285741550',
      category: 'Mathematics',
      publisher: 'Cengage Learning',
      publishYear: 2015,
      edition: '8th Edition',
      totalCopies: 12,
      availableCopies: 7,
      rating: 4.3,
      description: 'Comprehensive calculus textbook with applications and theory.',
      coverImage: '/api/placeholder/150/200',
      location: 'Math Section - Shelf M1',
      language: 'English',
      pages: 1368
    },
    {
      id: 4,
      title: 'Principles of Marketing',
      author: 'Philip Kotler',
      isbn: '978-0134492513',
      category: 'Business',
      publisher: 'Pearson',
      publishYear: 2017,
      edition: '17th Edition',
      totalCopies: 6,
      availableCopies: 3,
      rating: 4.4,
      description: 'Comprehensive guide to modern marketing principles and practices.',
      coverImage: '/api/placeholder/150/200',
      location: 'Business Section - Shelf B5',
      language: 'English',
      pages: 720
    },
    {
      id: 5,
      title: 'Physics for Scientists and Engineers',
      author: 'Raymond A. Serway',
      isbn: '978-1133947271',
      category: 'Physics',
      publisher: 'Cengage Learning',
      publishYear: 2013,
      edition: '9th Edition',
      totalCopies: 10,
      availableCopies: 4,
      rating: 4.5,
      description: 'Comprehensive physics textbook covering mechanics, thermodynamics, and more.',
      coverImage: '/api/placeholder/150/200',
      location: 'Physics Section - Shelf P2',
      language: 'English',
      pages: 1616
    },
    {
      id: 6,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      category: 'Literature',
      publisher: 'Scribner',
      publishYear: 2004,
      edition: 'Reprint Edition',
      totalCopies: 15,
      availableCopies: 12,
      rating: 4.2,
      description: 'Classic American novel set in the Jazz Age.',
      coverImage: '/api/placeholder/150/200',
      location: 'Literature Section - Shelf L3',
      language: 'English',
      pages: 180
    }
  ];

  const mockBorrowedBooks = [
    {
      id: 1,
      bookId: 1,
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      borrowDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'borrowed',
      renewalCount: 1,
      maxRenewals: 2
    },
    {
      id: 2,
      bookId: 4,
      title: 'Principles of Marketing',
      author: 'Philip Kotler',
      borrowDate: '2024-01-20',
      dueDate: '2024-02-20',
      status: 'overdue',
      renewalCount: 0,
      maxRenewals: 2
    },
    {
      id: 3,
      bookId: 6,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      borrowDate: '2024-02-01',
      dueDate: '2024-03-01',
      status: 'returned',
      returnDate: '2024-02-28',
      renewalCount: 0,
      maxRenewals: 2
    }
  ];

  const mockReservedBooks = [
    {
      id: 1,
      bookId: 2,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      reservationDate: '2024-02-10',
      expectedAvailableDate: '2024-02-25',
      status: 'waiting',
      queuePosition: 2
    }
  ];

  useEffect(() => {
    setBooks(mockBooks);
    setBorrowedBooks(mockBorrowedBooks);
    setReservedBooks(mockReservedBooks);
    setFilteredBooks(mockBooks);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter books based on search and filters
  useEffect(() => {
    let filtered = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.isbn.includes(searchTerm);
      
      const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
      
      const matchesAvailability = availabilityFilter === 'all' || 
                                 (availabilityFilter === 'available' && book.availableCopies > 0) ||
                                 (availabilityFilter === 'unavailable' && book.availableCopies === 0);
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
    
    setFilteredBooks(filtered);
  }, [searchTerm, categoryFilter, availabilityFilter, books]);

  // Get availability status
  const getAvailabilityStatus = (book) => {
    if (book.availableCopies > 0) {
      return { status: 'available', color: 'text-green-600', icon: CheckCircle };
    } else {
      return { status: 'unavailable', color: 'text-red-600', icon: XCircle };
    }
  };

  // Get borrowing status
  const getBorrowingStatus = (status) => {
    switch (status) {
      case 'borrowed':
        return { variant: 'default', color: 'text-blue-600', icon: BookOpen };
      case 'overdue':
        return { variant: 'destructive', color: 'text-red-600', icon: AlertCircle };
      case 'returned':
        return { variant: 'outline', color: 'text-green-600', icon: CheckCircle };
      default:
        return { variant: 'secondary', color: 'text-gray-600', icon: Clock };
    }
  };

  // Calculate days until due
  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle book reservation
  const handleReserveBook = (book) => {
    const newReservation = {
      id: reservedBooks.length + 1,
      bookId: book.id,
      title: book.title,
      author: book.author,
      reservationDate: new Date().toISOString().split('T')[0],
      expectedAvailableDate: '2024-03-15',
      status: 'waiting',
      queuePosition: 1
    };
    setReservedBooks([...reservedBooks, newReservation]);
  };

  // Handle book renewal
  const handleRenewBook = (borrowedBookId) => {
    setBorrowedBooks(prev => prev.map(book => 
      book.id === borrowedBookId && book.renewalCount < book.maxRenewals
        ? { ...book, renewalCount: book.renewalCount + 1, dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
        : book
    ));
  };

  // Get unique categories
  const categories = [...new Set(books.map(book => book.category))];

  // Calculate statistics
  const stats = {
    totalBooks: books.length,
    borrowedCount: borrowedBooks.filter(b => b.status === 'borrowed').length,
    reservedCount: reservedBooks.filter(r => r.status === 'waiting').length,
    overdueCount: borrowedBooks.filter(b => b.status === 'overdue').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Portal</h1>
          <p className="text-gray-600 mt-1">Discover, borrow, and manage your academic resources</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Reading List
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
              <Library className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Borrowed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.borrowedCount}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reserved</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.reservedCount}</p>
              </div>
              <Bookmark className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdueCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'catalog', label: 'Book Catalog', icon: Book },
          { id: 'borrowed', label: 'My Books', icon: BookOpen },
          { id: 'reserved', label: 'Reservations', icon: Bookmark }
        ].map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TabIcon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Book Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search books, authors, ISBN..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Books</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const availability = getAvailabilityStatus(book);
              const AvailabilityIcon = availability.icon;
              
              return (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-20 h-28 bg-gray-200 rounded-md flex items-center justify-center">
                        <Book className="h-8 w-8 text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{book.category}</Badge>
                          <div className={`flex items-center gap-1 text-sm ${availability.color}`}>
                            <AvailabilityIcon className="h-4 w-4" />
                            {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Unavailable'}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">({book.rating})</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          {book.availableCopies > 0 ? (
                            <Button size="sm">
                              <BookOpen className="h-4 w-4 mr-1" />
                              Borrow
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReserveBook(book)}
                            >
                              <Bookmark className="h-4 w-4 mr-1" />
                              Reserve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>ISBN: {book.isbn}</span>
                        <span>{book.pages} pages</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* My Books Tab */}
      {activeTab === 'borrowed' && (
        <div className="space-y-4">
          {borrowedBooks.map((book) => {
            const status = getBorrowingStatus(book.status);
            const StatusIcon = status.icon;
            const daysUntilDue = getDaysUntilDue(book.dueDate);
            
            return (
              <Card key={book.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <Badge variant={status.variant} className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {book.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">by {book.author}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Borrowed Date</p>
                          <p className="font-medium">{new Date(book.borrowDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Due Date</p>
                          <p className={`font-medium ${
                            book.status === 'overdue' ? 'text-red-600' : 
                            daysUntilDue <= 3 ? 'text-yellow-600' : 'text-gray-900'
                          }`}>
                            {new Date(book.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Renewals</p>
                          <p className="font-medium">{book.renewalCount}/{book.maxRenewals}</p>
                        </div>
                        {book.returnDate && (
                          <div>
                            <p className="text-gray-500">Returned Date</p>
                            <p className="font-medium">{new Date(book.returnDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                      
                      {book.status === 'borrowed' && daysUntilDue <= 7 && (
                        <div className={`mt-3 p-3 rounded-lg ${
                          daysUntilDue <= 0 ? 'bg-red-50 border-l-4 border-red-400' :
                          daysUntilDue <= 3 ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                          'bg-blue-50 border-l-4 border-blue-400'
                        }`}>
                          <p className={`text-sm font-medium ${
                            daysUntilDue <= 0 ? 'text-red-800' :
                            daysUntilDue <= 3 ? 'text-yellow-800' :
                            'text-blue-800'
                          }`}>
                            {daysUntilDue <= 0 ? 
                              `Overdue by ${Math.abs(daysUntilDue)} days` :
                              `Due in ${daysUntilDue} days`
                            }
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {book.status === 'borrowed' && book.renewalCount < book.maxRenewals && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRenewBook(book.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Renew
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reservations Tab */}
      {activeTab === 'reserved' && (
        <div className="space-y-4">
          {reservedBooks.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{reservation.title}</h3>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        WAITING
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">by {reservation.author}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Reserved Date</p>
                        <p className="font-medium">{new Date(reservation.reservationDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expected Available</p>
                        <p className="font-medium">{new Date(reservation.expectedAvailableDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Queue Position</p>
                        <p className="font-medium">#{reservation.queuePosition}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {reservedBooks.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations</h3>
                <p className="text-gray-600">You haven't reserved any books yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty States */}
      {activeTab === 'catalog' && filteredBooks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'borrowed' && borrowedBooks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No borrowed books</h3>
            <p className="text-gray-600">You haven't borrowed any books yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentLibrary;