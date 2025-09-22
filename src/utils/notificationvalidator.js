/**
 * NotificationValidator.js
 * Utility class for validating notification data before saving to pool or sending
 */

class NotificationValidator {
  /**
   * Validates basic notification data
   * @param {Object} notification - The notification object to validate
   * @returns {Object} - { isValid: boolean, errors: string[] }
   */
  validate(notification) {
    const errors = [];
    
    // Check required fields
    if (!notification.title || notification.title.trim() === '') {
      errors.push('Title is required');
    } else if (notification.title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }
    
    if (!notification.message || notification.message.trim() === '') {
      errors.push('Message content is required');
    } else if (notification.message.length > 2000) {
      errors.push('Message content must be less than 2000 characters');
    }
    
    if (!notification.type || notification.type.trim() === '') {
      errors.push('Notification type is required');
    }
    
    if (!notification.audience || notification.audience.trim() === '') {
      errors.push('Target audience is required');
    }
    
    // Audience-specific validations
    if (notification.audience === 'students') {
      if (!notification.departments || notification.departments.length === 0) {
        errors.push('At least one department must be selected for student notifications');
      }
    }
    
    // Schedule validations
    if (notification.scheduleType === 'scheduled') {
      if (!notification.scheduledDate) {
        errors.push('Scheduled date is required for scheduled notifications');
      }
      
      if (!notification.scheduledTime) {
        errors.push('Scheduled time is required for scheduled notifications');
      }
      
      // Validate that scheduled date/time is in the future
      if (notification.scheduledDate && notification.scheduledTime) {
        const scheduledDateTime = new Date(`${notification.scheduledDate}T${notification.scheduledTime}`);
        if (scheduledDateTime <= new Date()) {
          errors.push('Scheduled date and time must be in the future');
        }
      }
    }
    
    // Priority validation
    if (notification.priority && !['low', 'normal', 'high', 'urgent'].includes(notification.priority)) {
      errors.push('Invalid priority level');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validates notification data specifically for saving to pool
   * @param {Object} notification - The notification object to validate
   * @returns {Object} - { isValid: boolean, errors: string[] }
   */
  validateForPool(notification) {
    // First run basic validation
    const basicValidation = this.validate(notification);
    
    if (!basicValidation.isValid) {
      return basicValidation;
    }
    
    const errors = [];
    
    // Additional pool-specific validations could be added here
    // For example, checking if similar notification already exists in pool
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validates notification data specifically for sending
   * @param {Object} notification - The notification object to validate
   * @returns {Object} - { isValid: boolean, errors: string[] }
   */
  validateForSending(notification) {
    // First run basic validation
    const basicValidation = this.validate(notification);
    
    if (!basicValidation.isValid) {
      return basicValidation;
    }
    
    const errors = [];
    
    // Check recipient count
    if (!notification.recipientCount || notification.recipientCount <= 0) {
      errors.push('Notification must have at least one recipient');
    }
    
    // Additional sending-specific validations could be added here
    // For example, rate limiting, quota checks, etc.
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export a singleton instance
const notificationValidator = new NotificationValidator();
export default notificationValidator;