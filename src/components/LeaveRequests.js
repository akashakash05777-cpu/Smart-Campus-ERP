import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, Check, X, Clock, User, Calendar, AlertCircle } from 'lucide-react';
import { useDepartment } from '../contexts/DepartmentContext';
import { useAuth } from '../contexts/AuthContext';

const LeaveRequests = () => {
  const { user } = useAuth();
  const { departmentData, loading, approveLeaveRequest, rejectLeaveRequest } = useDepartment();
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!departmentData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600">No department data available</h2>
      </div>
    );
  }

  const leaveApplications = departmentData.leaveApplications || [];

  // Filter applications based on status
  const filteredApplications = leaveApplications.filter(app => {
    if (filter === 'all') return true;
    return app.status.toLowerCase() === filter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'Staff' ? User : User;
  };

  const handleApprove = async (requestId) => {
    setActionLoading(requestId);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      approveLeaveRequest(requestId);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error approving request:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      rejectLeaveRequest(requestId);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = leaveApplications.filter(app => app.status === 'Pending').length;
  const approvedCount = leaveApplications.filter(app => app.status === 'Approved').length;
  const rejectedCount = leaveApplications.filter(app => app.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="text-gray-600">{departmentData.name} Department</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{leaveApplications.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Requests' },
              { key: 'pending', label: 'Pending' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leave Applications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Leave Applications ({filteredApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const TypeIcon = getTypeIcon(application.type);
                return (
                  <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <TypeIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{application.applicant}</h3>
                          <p className="text-sm text-gray-600">{application.type}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{application.days} days</p>
                          <p className="text-xs text-gray-500">{application.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Reason: <span className="font-medium">{application.reason}</span></p>
                        </div>
                        
                        {application.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedRequest(application)}
                              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleApprove(application.id)}
                              disabled={actionLoading === application.id}
                              className="px-3 py-1 text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {actionLoading === application.id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleReject(application.id)}
                              disabled={actionLoading === application.id}
                              className="px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {actionLoading === application.id ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests found</h3>
              <p className="text-gray-600">No {filter === 'all' ? '' : filter} leave requests at the moment.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Leave Request Details</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedRequest.applicant}</h4>
                  <p className="text-gray-600">{selectedRequest.type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <p className="font-medium">{selectedRequest.days} days</p>
                </div>
                <div>
                  <span className="text-gray-500">Applied on:</span>
                  <p className="font-medium">{selectedRequest.date}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Reason:</span>
                  <p className="font-medium">{selectedRequest.reason}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>
              
              {selectedRequest.status === 'Pending' && (
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={actionLoading === selectedRequest.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    {actionLoading === selectedRequest.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={actionLoading === selectedRequest.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    {actionLoading === selectedRequest.id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;