import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, UserPlus, Edit, Trash2, Plus, Search, Building2, GraduationCap } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const AdminDepartmentManager = () => {
  const { user } = useAuth();
  const { getAllDepartments, addStudent, updateStudent, deleteStudent, addStaff, updateStaff, deleteStaff, addNotification } = useData();
  const [activeTab, setActiveTab] = useState('students'); // students, staff, overview
  const [selectedDepartment, setSelectedDepartment] = useState('computer-science');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const departments = getAllDepartments();
  const currentDepartment = departments.find(dept => dept.id === selectedDepartment);

  // Filter data based on search term
  const getFilteredData = () => {
    if (!currentDepartment) return [];
    
    const data = activeTab === 'students' ? currentDepartment.students : currentDepartment.staff;
    return data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.rollNumber && item.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleAdd = () => {
    setFormData({});
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      if (activeTab === 'students') {
        deleteStudent(selectedDepartment, item.id);
        addNotification({
          type: 'alert',
          priority: 'medium',
          title: 'Student Deleted',
          message: `Student ${item.name} has been removed from ${currentDepartment.name} department`,
          department: currentDepartment.name
        });
      } else {
        deleteStaff(selectedDepartment, item.id);
        addNotification({
          type: 'alert',
          priority: 'medium',
          title: 'Staff Deleted',
          message: `Staff member ${item.name} has been removed from ${currentDepartment.name} department`,
          department: currentDepartment.name
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      // Update existing item
      if (activeTab === 'students') {
        updateStudent(selectedDepartment, editingItem.id, formData);
        addNotification({
          type: 'announcement',
          priority: 'low',
          title: 'Student Updated',
          message: `Student ${formData.name} information has been updated`,
          department: currentDepartment.name
        });
      } else {
        updateStaff(selectedDepartment, editingItem.id, formData);
        addNotification({
          type: 'announcement',
          priority: 'low',
          title: 'Staff Updated',
          message: `Staff member ${formData.name} information has been updated`,
          department: currentDepartment.name
        });
      }
      setShowEditModal(false);
    } else {
      // Add new item
      if (activeTab === 'students') {
        addStudent(selectedDepartment, formData);
        addNotification({
          type: 'announcement',
          priority: 'medium',
          title: 'New Student Added',
          message: `Student ${formData.name} has been added to ${currentDepartment.name} department`,
          department: currentDepartment.name
        });
      } else {
        addStaff(selectedDepartment, formData);
        addNotification({
          type: 'announcement',
          priority: 'medium',
          title: 'New Staff Added',
          message: `Staff member ${formData.name} has been added to ${currentDepartment.name} department`,
          department: currentDepartment.name
        });
      }
      setShowAddModal(false);
    }
    
    setFormData({});
    setEditingItem(null);
  };

  const renderStudentForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
          <input
            type="text"
            value={formData.rollNumber || ''}
            onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
          <input
            type="text"
            value={formData.class || ''}
            onChange={(e) => setFormData({...formData, class: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
          <select
            value={formData.year || ''}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Program *</label>
          <select
            value={formData.program || ''}
            onChange={(e) => setFormData({...formData, program: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Program</option>
            {currentDepartment?.programs?.map(program => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStaffForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
          <select
            value={formData.position || ''}
            onChange={(e) => setFormData({...formData, position: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Position</option>
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Lecturer">Lecturer</option>
            <option value="Department Head">Department Head</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
          <input
            type="text"
            value={formData.specialization || ''}
            onChange={(e) => setFormData({...formData, specialization: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
          <input
            type="text"
            value={formData.experience || ''}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 5 years"
          />
        </div>
      </div>
    </div>
  );

  const renderModal = (isEdit = false) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEdit ? 'Edit' : 'Add'} {activeTab === 'students' ? 'Student' : 'Staff Member'}
            </h2>
            <button
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setFormData({});
                setEditingItem(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {activeTab === 'students' ? renderStudentForm() : renderStaffForm()}
            
            <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setFormData({});
                  setEditingItem(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEdit ? 'Update' : 'Add'} {activeTab === 'students' ? 'Student' : 'Staff Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (!currentDepartment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600">Department not found</h2>
      </div>
    );
  }

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600">Manage students and staff across departments</p>
        </div>
      </div>

      {/* Department Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Building2 className="h-5 w-5 text-blue-600" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <div className="ml-auto flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {currentDepartment.totalStudents} Students
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                {currentDepartment.totalStaff} Staff
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            {[
              { key: 'students', label: 'Students', icon: Users },
              { key: 'staff', label: 'Staff', icon: GraduationCap }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search and Add */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add {activeTab === 'students' ? 'Student' : 'Staff Member'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {activeTab === 'students' ? <Users className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
            {activeTab === 'students' ? 'Students' : 'Staff Members'} ({filteredData.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  {activeTab === 'students' ? (
                    <>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Roll Number</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Class</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Program</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Attendance</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Position</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Specialization</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Experience</th>
                    </>
                  )}
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                    </td>
                    {activeTab === 'students' ? (
                      <>
                        <td className="py-3 px-4 text-gray-600">{item.rollNumber}</td>
                        <td className="py-3 px-4 text-gray-600">{item.class}</td>
                        <td className="py-3 px-4 text-gray-600">{item.program}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.attendance >= 90 ? 'bg-green-100 text-green-800' :
                            item.attendance >= 75 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.attendance}%
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 text-gray-600">{item.position}</td>
                        <td className="py-3 px-4 text-gray-600">{item.specialization}</td>
                        <td className="py-3 px-4 text-gray-600">{item.experience}</td>
                      </>
                    )}
                    <td className="py-3 px-4 text-gray-600">{item.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  {activeTab === 'students' ? <Users className="h-12 w-12 mx-auto" /> : <GraduationCap className="h-12 w-12 mx-auto" />}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} found
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms.' : `No ${activeTab} have been added yet.`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showAddModal && renderModal(false)}
      {showEditModal && renderModal(true)}
    </div>
  );
};

export default AdminDepartmentManager;