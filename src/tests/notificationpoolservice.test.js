/**
 * NotificationPoolService.test.js
 * Unit tests for the NotificationPoolService
 */

const notificationPoolService = require('../services/NotificationPoolService');
const notificationValidator = require('../utils/notificationvalidator');
const notificationAuditLogger = require('../utils/NotificationAuditLogger');

// Mock dependencies
jest.mock('../utils/notificationvalidator.js', () => ({
  validateForPool: jest.fn(),
  validateForSending: jest.fn()
}));

jest.mock('../utils/NotificationAuditLogger.js', () => ({
  logAction: jest.fn()
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    // Helper for tests to directly set store
    __setMockData: (data) => {
      store = { ...data };
    },
    __getMockData: () => store
  };
})();

// Mock global localStorage for Node.js environment
global.localStorage = localStorageMock;

describe('NotificationPoolService', () => {
  const mockUser = { id: 'user123', name: 'Test User' };
  const mockNotification = {
    title: 'Test Notification',
    message: 'This is a test notification',
    type: 'exam',
    audience: 'students',
    departments: ['Computer Science'],
    classes: ['CSE-1A'],
    priority: 'high',
    recipientCount: 30
  };

  beforeEach(() => {
    // Clear mocks and localStorage before each test
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('saveToPool', () => {
    it('should successfully save a valid notification to the pool', async () => {
      // Setup
      notificationValidator.validateForPool.mockReturnValue({ isValid: true, errors: [] });
      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();

      // Execute
      const result = await notificationPoolService.saveToPool(
        mockNotification,
        mockUser,
        onSuccessMock,
        onErrorMock
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.notification).toBeDefined();
      expect(result.notification.id).toBeDefined();
      expect(result.notification.createdAt).toBeDefined();
      expect(result.notification.createdBy).toBe(mockUser.id);
      expect(result.notification.status).toBe('draft');
      
      // Check localStorage was updated
      const poolJson = localStorageMock.getItem('notification_pool');
      expect(poolJson).toBeDefined();
      const pool = JSON.parse(poolJson);
      expect(pool.length).toBe(1);
      expect(pool[0].title).toBe(mockNotification.title);
      
      // Check callbacks and audit logging
      expect(onSuccessMock).toHaveBeenCalledWith(result.notification);
      expect(onErrorMock).not.toHaveBeenCalled();
      expect(notificationAuditLogger.logAction).toHaveBeenCalledWith({
        action: 'save_to_pool',
        notification: result.notification,
        user: mockUser,
        result: 'success'
      });
    });

    it('should handle validation errors when saving to pool', async () => {
      // Setup
      const validationErrors = ['Title is required', 'Message is required'];
      notificationValidator.validateForPool.mockReturnValue({ 
        isValid: false, 
        errors: validationErrors 
      });
      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();

      // Execute
      const result = await notificationPoolService.saveToPool(
        mockNotification,
        mockUser,
        onSuccessMock,
        onErrorMock
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Validation failed');
      expect(result.validationErrors).toEqual(validationErrors);
      
      // Check callbacks and audit logging
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalled();
      expect(notificationAuditLogger.logAction).toHaveBeenCalledWith({
        action: 'save_to_pool',
        notification: mockNotification,
        user: mockUser,
        result: 'error',
        errorMessage: expect.stringContaining('Validation failed')
      });
    });
  });

  describe('deleteFromPool', () => {
    it('should successfully delete a notification from the pool', async () => {
      // Setup
      const mockPoolNotification = {
        ...mockNotification,
        id: 'notification123',
        createdAt: new Date().toISOString(),
        createdBy: mockUser.id,
        status: 'draft'
      };
      
      localStorageMock.__setMockData({
        'notification_pool': JSON.stringify([mockPoolNotification])
      });
      
      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();

      // Execute
      const result = await notificationPoolService.deleteFromPool(
        'notification123',
        mockUser,
        onSuccessMock,
        onErrorMock
      );

      // Assert
      expect(result.success).toBe(true);
      
      // Check localStorage was updated
      const poolJson = localStorageMock.getItem('notification_pool');
      expect(poolJson).toBeDefined();
      const pool = JSON.parse(poolJson);
      expect(pool.length).toBe(0);
      
      // Check callbacks and audit logging
      expect(onSuccessMock).toHaveBeenCalled();
      expect(onErrorMock).not.toHaveBeenCalled();
      expect(notificationAuditLogger.logAction).toHaveBeenCalledWith({
        action: 'delete_from_pool',
        notification: mockPoolNotification,
        user: mockUser,
        result: 'success'
      });
    });

    it('should handle errors when notification not found in pool', async () => {
      // Setup
      localStorageMock.__setMockData({
        'notification_pool': JSON.stringify([])
      });
      
      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();

      // Execute
      const result = await notificationPoolService.deleteFromPool(
        'nonexistent',
        mockUser,
        onSuccessMock,
        onErrorMock
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Notification not found in pool');
      
      // Check callbacks and audit logging
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalled();
      expect(notificationAuditLogger.logAction).toHaveBeenCalledWith({
        action: 'delete_from_pool',
        notification: { id: 'nonexistent' },
        user: mockUser,
        result: 'error',
        errorMessage: 'Notification not found in pool'
      });
    });
  });

  describe('sendFromPool', () => {
    it('should successfully send a notification from the pool', async () => {
      // Setup
      const mockPoolNotification = {
        ...mockNotification,
        id: 'notification123',
        createdAt: new Date().toISOString(),
        createdBy: mockUser.id,
        status: 'draft'
      };
      
      localStorageMock.__setMockData({
        'notification_pool': JSON.stringify([mockPoolNotification]),
        'sent_notifications': JSON.stringify([])
      });
      
      notificationValidator.validateForSending.mockReturnValue({ isValid: true, errors: [] });
      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();

      // Execute
      const result = await notificationPoolService.sendFromPool(
        'notification123',
        mockUser,
        onSuccessMock,
        onErrorMock
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.notification).toBeDefined();
      expect(result.notification.sentAt).toBeDefined();
      expect(result.notification.sentBy).toBe(mockUser.id);
      expect(result.notification.status).toBe('sent');
      
      // Check localStorage was updated
      const poolJson = localStorageMock.getItem('notification_pool');
      const sentJson = localStorageMock.getItem('sent_notifications');
      
      expect(poolJson).toBeDefined();
      expect(sentJson).toBeDefined();
      
      const pool = JSON.parse(poolJson);
      const sent = JSON.parse(sentJson);
      
      expect(pool.length).toBe(0);
      expect(sent.length).toBe(1);
      expect(sent[0].id).toBe('notification123');
      
      // Check callbacks and audit logging
      expect(onSuccessMock).toHaveBeenCalledWith(result.notification);
      expect(onErrorMock).not.toHaveBeenCalled();
      expect(notificationAuditLogger.logAction).toHaveBeenCalledWith({
        action: 'send_from_pool',
        notification: result.notification,
        user: mockUser,
        result: 'success'
      });
    });
  });
});