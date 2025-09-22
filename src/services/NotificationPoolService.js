/**
 * NotificationPoolService.js
 * Service for managing notification pool operations
 */

import notificationValidator from '../utils/notificationvalidator';
import notificationAuditLogger from '../utils/NotificationAuditLogger';

class NotificationPoolService {
  constructor() {
    this.poolStorageKey = 'notification_pool';
    this.sentStorageKey = 'sent_notifications';
  }

/**
   * Save a notification to the pool
   * @param {Object} notification - The notification to save
   * @param {Object} user - The user performing the action
   * @param {Function} [onSuccess] - Callback function on success
   * @param {Function} [onError] - Callback function on error
   * @returns {Promise<Object>} - Promise resolving to the saved notification or error
   */
  async saveToPool(notification, user, onSuccess = null, onError = null) {
    try {
      // Start transaction
      const transaction = this.beginTransaction();
      
      try {
        // Validate notification
        const validationResult = notificationValidator.validateForPool(notification);
        if (!validationResult.isValid) {
          throw new Error('Validation failed: ' + validationResult.errors.join(', '));
        }
        
        // Prepare notification for pool
        const poolNotification = {
          ...notification,
          id: notification.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          createdBy: user?.id || 'system',
          status: 'draft'
        };
        
        // Get current pool
        const currentPool = this.getPool();
        
        // Add to pool
        const updatedPool = [poolNotification, ...currentPool];
        
        // Save to storage
        localStorage.setItem(this.poolStorageKey, JSON.stringify(updatedPool));
        
        // Commit transaction
        this.commitTransaction(transaction);
        
        // Log the action
        notificationAuditLogger.logAction({
          action: 'save_to_pool',
          notification: poolNotification,
          user,
          result: 'success'
        });
        
        // Call success callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(poolNotification);
        }
        
        return {
          success: true,
          notification: poolNotification
        };
      } catch (error) {
        // Rollback transaction
        this.rollbackTransaction(transaction);
        
        // Log the error
        notificationAuditLogger.logAction({
          action: 'save_to_pool',
          notification,
          user,
          result: 'error',
          errorMessage: error.message
        });
        
        // Call error callback if provided
        if (onError && typeof onError === 'function') {
          onError(error);
        }
        
        throw error;
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        validationErrors: error.message.includes('Validation failed') ? 
          error.message.replace('Validation failed: ', '').split(', ') : 
          null
      };
    }
  }

  /**
   * Get all notifications in the pool
   * @returns {Array} - Array of notifications in the pool
   */
  getPool() {
    try {
      const poolJson = localStorage.getItem(this.poolStorageKey);
      return poolJson ? JSON.parse(poolJson) : [];
    } catch (error) {
      console.error('Error retrieving notification pool:', error);
      return [];
    }
  }

  /**
   * Delete a notification from the pool
   * @param {string} notificationId - ID of the notification to delete
   * @param {Object} user - The user performing the action
   * @param {Function} [onSuccess] - Callback function on success
   * @param {Function} [onError] - Callback function on error
   * @returns {Promise<Object>} - Promise resolving to success status or error
   */
  async deleteFromPool(notificationId, user, onSuccess = null, onError = null) {
    try {
      // Start transaction
      const transaction = this.beginTransaction();
      
      try {
        // Get current pool
        const currentPool = this.getPool();
        
        // Find notification to delete
        const notificationToDelete = currentPool.find(n => n.id === notificationId);
        
        if (!notificationToDelete) {
          throw new Error('Notification not found in pool');
        }
        
        // Remove from pool
        const updatedPool = currentPool.filter(n => n.id !== notificationId);
        
        // Save to storage
        localStorage.setItem(this.poolStorageKey, JSON.stringify(updatedPool));
        
        // Commit transaction
        this.commitTransaction(transaction);
        
        // Log the action
        notificationAuditLogger.logAction({
          action: 'delete_from_pool',
          notification: notificationToDelete,
          user,
          result: 'success'
        });
        
        // Call success callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
        
        return {
          success: true
        };
      } catch (error) {
        // Rollback transaction
        this.rollbackTransaction(transaction);
        
        // Log the error
        notificationAuditLogger.logAction({
          action: 'delete_from_pool',
          notification: { id: notificationId },
          user,
          result: 'error',
          errorMessage: error.message
        });
        
        // Call error callback if provided
        if (onError && typeof onError === 'function') {
          onError(error);
        }
        
        throw error;
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send a notification from the pool
   * @param {string} notificationId - ID of the notification to send
   * @param {Object} user - The user performing the action
   * @param {Function} [onSuccess] - Callback function on success
   * @param {Function} [onError] - Callback function on error
   * @returns {Promise<Object>} - Promise resolving to the sent notification or error
   */
  async sendFromPool(notificationId, user, onSuccess = null, onError = null) {
    try {
      // Start transaction
      const transaction = this.beginTransaction();
      
      try {
        // Get current pool
        const currentPool = this.getPool();
        
        // Find notification to send
        const notificationToSend = currentPool.find(n => n.id === notificationId);
        
        if (!notificationToSend) {
          throw new Error('Notification not found in pool');
        }
        
        // Validate notification for sending
        const validationResult = notificationValidator.validateForSending(notificationToSend);
        if (!validationResult.isValid) {
          throw new Error('Validation failed: ' + validationResult.errors.join(', '));
        }
        
        // In a real app, this would send the notification through a messaging service
        // For now, we'll simulate sending by moving it from pool to sent notifications
        
        // Remove from pool
        const updatedPool = currentPool.filter(n => n.id !== notificationId);
        localStorage.setItem(this.poolStorageKey, JSON.stringify(updatedPool));
        
        // Add to sent notifications
        const sentNotification = {
          ...notificationToSend,
          sentAt: new Date().toISOString(),
          sentBy: user?.id || 'system',
          status: 'sent'
        };
        
        const sentNotifications = this.getSentNotifications();
        const updatedSentNotifications = [sentNotification, ...sentNotifications];
        localStorage.setItem(this.sentStorageKey, JSON.stringify(updatedSentNotifications));
        
        // Commit transaction
        this.commitTransaction(transaction);
        
        // Log the action
        notificationAuditLogger.logAction({
          action: 'send_from_pool',
          notification: sentNotification,
          user,
          result: 'success'
        });
        
        // Call success callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(sentNotification);
        }
        
        return {
          success: true,
          notification: sentNotification
        };
      } catch (error) {
        // Rollback transaction
        this.rollbackTransaction(transaction);
        
        // Log the error
        notificationAuditLogger.logAction({
          action: 'send_from_pool',
          notification: { id: notificationId },
          user,
          result: 'error',
          errorMessage: error.message
        });
        
        // Call error callback if provided
        if (onError && typeof onError === 'function') {
          onError(error);
        }
        
        throw error;
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        validationErrors: error.message.includes('Validation failed') ? 
          error.message.replace('Validation failed: ', '').split(', ') : 
          null
      };
    }
  }

  /**
   * Get all sent notifications
   * @returns {Array} - Array of sent notifications
   */
  getSentNotifications() {
    try {
      const sentJson = localStorage.getItem(this.sentStorageKey);
      return sentJson ? JSON.parse(sentJson) : [];
    } catch (error) {
      console.error('Error retrieving sent notifications:', error);
      return [];
    }
  }

  /**
   * Begin a transaction
   * @private
   * @returns {Object} - Transaction object with snapshot of current state
   */
  beginTransaction() {
    // In a real app with a database, this would start an actual transaction
    // For localStorage, we'll just take a snapshot of the current state
    return {
      poolSnapshot: localStorage.getItem(this.poolStorageKey),
      sentSnapshot: localStorage.getItem(this.sentStorageKey),
      timestamp: Date.now()
    };
  }

  /**
   * Commit a transaction
   * @private
   * @param {Object} transaction - The transaction to commit
   */
  commitTransaction(transaction) {
    // In a real app, this would commit the database transaction
    // For localStorage, we don't need to do anything
  }

  /**
   * Rollback a transaction
   * @private
   * @param {Object} transaction - The transaction to rollback
   */
  rollbackTransaction(transaction) {
    // In a real app, this would rollback the database transaction
    // For localStorage, we'll restore the previous state
    if (transaction.poolSnapshot !== null) {
      localStorage.setItem(this.poolStorageKey, transaction.poolSnapshot);
    } else {
      localStorage.removeItem(this.poolStorageKey);
    }
    
    if (transaction.sentSnapshot !== null) {
      localStorage.setItem(this.sentStorageKey, transaction.sentSnapshot);
    } else {
      localStorage.removeItem(this.sentStorageKey);
    }
  }
}

// Export a singleton instance
const notificationPoolService = new NotificationPoolService();
export default notificationPoolService;