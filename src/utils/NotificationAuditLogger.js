/**
 * NotificationAuditLogger.js
 * Utility class for logging notification-related actions for audit purposes
 */

class NotificationAuditLogger {
  constructor() {
    this.storageKey = 'notification_audit_logs';
  }

  /**
   * Log a notification-related action
   * @param {Object} params - Log parameters
   * @param {string} params.action - The action performed (e.g., 'save_to_pool', 'send', 'delete')
   * @param {Object} params.notification - The notification object
   * @param {Object} params.user - The user who performed the action
   * @param {string} params.result - The result of the action ('success' or 'error')
   * @param {string} [params.errorMessage] - Error message if result is 'error'
   * @returns {Object} - The created log entry
   */
  logAction({ action, notification, user, result, errorMessage = null }) {
    const logEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      notificationId: notification.id,
      notificationTitle: notification.title,
      userId: user?.id || 'system',
      userName: user?.name || 'System',
      userRole: user?.role || 'system',
      result,
      errorMessage
    };

    this.saveLogEntry(logEntry);
    return logEntry;
  }

  /**
   * Save a log entry to storage
   * @param {Object} logEntry - The log entry to save
   * @private
   */
  saveLogEntry(logEntry) {
    try {
      const existingLogs = this.getAllLogs();
      const updatedLogs = [logEntry, ...existingLogs];
      
      // Store in localStorage (in a real app, this would be sent to a server)
      localStorage.setItem(this.storageKey, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Error saving notification audit log:', error);
    }
  }

  /**
   * Get all audit logs, optionally filtered by date range
   * @param {Date} [startDate] - Start date for filtering
   * @param {Date} [endDate] - End date for filtering
   * @returns {Array} - Array of log entries
   */
  getAllLogs(startDate = null, endDate = null) {
    try {
      const logsJson = localStorage.getItem(this.storageKey);
      const logs = logsJson ? JSON.parse(logsJson) : [];
      
      if (!startDate && !endDate) {
        return logs;
      }
      
      return logs.filter(log => {
        const logDate = new Date(log.timestamp);
        
        if (startDate && endDate) {
          return logDate >= startDate && logDate <= endDate;
        } else if (startDate) {
          return logDate >= startDate;
        } else if (endDate) {
          return logDate <= endDate;
        }
        
        return true;
      });
    } catch (error) {
      console.error('Error retrieving notification audit logs:', error);
      return [];
    }
  }

  /**
   * Get logs for a specific notification
   * @param {string} notificationId - ID of the notification
   * @returns {Array} - Array of log entries for the notification
   */
  getLogsByNotificationId(notificationId) {
    const allLogs = this.getAllLogs();
    return allLogs.filter(log => log.notificationId === notificationId);
  }

  /**
   * Get logs for a specific user
   * @param {string} userId - ID of the user
   * @returns {Array} - Array of log entries for the user
   */
  getLogsByUserId(userId) {
    const allLogs = this.getAllLogs();
    return allLogs.filter(log => log.userId === userId);
  }

  /**
   * Get logs for a specific action
   * @param {string} action - The action to filter by
   * @returns {Array} - Array of log entries for the action
   */
  getLogsByAction(action) {
    const allLogs = this.getAllLogs();
    return allLogs.filter(log => log.action === action);
  }

  /**
   * Get logs for a specific time period
   * @param {string} period - Time period ('today', 'week', 'month')
   * @returns {Array} - Array of log entries for the time period
   */
  getLogsByTimePeriod(period) {
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate = null;
    }
    
    return this.getAllLogs(startDate);
  }

  /**
   * Clear all audit logs
   */
  clearAllLogs() {
    localStorage.removeItem(this.storageKey);
  }
}

// Export a singleton instance
const notificationAuditLogger = new NotificationAuditLogger();
export default notificationAuditLogger;