/**
 * This is the main API interface for the PulseHustle application.
 * It provides a unified interface to all backend services.
 */

// Service imports
import * as PaymentService from './services/paymentService';
import * as GigService from './services/gigService';
import * as AiMatchingService from './services/aiMatchingService';
import * as GrokService from './services/grokService';
import * as StatsService from './services/statsService';
import * as ContactService from './services/contactService';
import * as ProfileService from './services/profileService';
import * as RealtimeService from './services/realtimeService';

// Database utilities
import * as DbUtils from './utils/dbUtils';

// Api Models
import * as DbModels from './models/dbModels';

/**
 * Payment API
 */
export const Payments = {
  /**
   * Record a payment
   * @param {Object} paymentData - Payment data to record
   * @returns {Promise<Object>} - Result of the operation
   */
  recordPayment: PaymentService.recordPayment,

  /**
   * Get payment history for a user
   * @param {string} userId - User ID to get payment history for
   * @returns {Promise<Object>} - Result of the operation
   */
  getHistory: PaymentService.getPaymentHistory,

  /**
   * Process PayPal payment
   * @param {number} amount - Payment amount
   * @param {string} description - Payment description
   * @param {string} redirectUrl - URL to redirect to after payment
   * @param {string} userId - Optional user ID
   * @returns {Promise<Object>} - Result of the operation
   */
  processPayPal: PaymentService.processPayPalPayment,

  /**
   * Process gig payment
   * @param {Object} gigData - Gig data
   * @param {string} userId - User ID creating the gig
   * @returns {Promise<Object>} - Result of the operation
   */
  processGig: PaymentService.processGigPayment,

  /**
   * Update payment status
   * @param {string} paymentId - Payment ID to update
   * @param {string} status - New payment status
   * @returns {Promise<Object>} - Result of the operation
   */
  updateStatus: PaymentService.updatePaymentStatus
};

/**
 * Gig API
 */
export const Gigs = {
  /**
   * Create a new gig
   * @param {Object} gigData - Gig data
   * @param {string} userId - User ID creating the gig
   * @returns {Promise<Object>} - Result of the operation
   */
  create: GigService.createGig,

  /**
   * Get all gigs with filters
   * @param {Object} filters - Filters to apply
   * @returns {Promise<Object>} - Result of the operation
   */
  getAll: GigService.getGigs,

  /**
   * Get a gig by ID
   * @param {string} gigId - Gig ID
   * @returns {Promise<Object>} - Result of the operation
   */
  getById: GigService.getGigById,

  /**
   * Update a gig
   * @param {string} gigId - Gig ID
   * @param {Object} updates - Updates to apply
   * @param {string} userId - User ID making the update
   * @returns {Promise<Object>} - Result of the operation
   */
  update: GigService.updateGig,

  /**
   * Change gig status
   * @param {string} gigId - Gig ID
   * @param {string} status - New status
   * @param {string} userId - User ID making the update
   * @returns {Promise<Object>} - Result of the operation
   */
  changeStatus: GigService.changeGigStatus,
  
  /**
   * Calculate gig price using Grok AI
   * @param {number} hours - Number of hours for the gig
   * @returns {Promise<Object>} - Result of the operation
   */
  calculatePrice: GigService.calculateGigPrice,

  /**
   * Send gig to Give40
   * @param {string} gigId - ID of the gig to send
   * @returns {Promise<Object>} - Result of the operation
   */
  sendToGive40: GigService.sendGigToGive40
};

/**
 * AI Matching API
 */
export const AiMatching = {
  /**
   * Create a matching job
   * @param {string} gigId - Gig ID to match
   * @returns {Promise<Object>} - Result of the operation
   */
  createJob: AiMatchingService.createMatchingJob,

  /**
   * Process a matching job
   * @param {string} jobId - Job ID to process
   * @returns {Promise<Object>} - Result of the operation
   */
  processJob: AiMatchingService.processMatchingJob,

  /**
   * Get matches for a gig
   * @param {string} gigId - Gig ID to get matches for
   * @returns {Promise<Object>} - Result of the operation
   */
  getMatches: AiMatchingService.getGigMatches
};

/**
 * Grok AI API
 */
export const Grok = {
  /**
   * Calculate price using Grok AI
   * @param {number} hours - Number of hours for the gig
   * @returns {Promise<Object>} - Result of the operation
   */
  calculatePrice: GrokService.calculatePrice,

  /**
   * Send a gig to Give40 service
   * @param {string} gigId - ID of the gig to send
   * @returns {Promise<Object>} - Result of the operation
   */
  pingGive40: GrokService.pingGive40
};

/**
 * Stats API
 */
export const Stats = {
  /**
   * Get platform statistics
   * @returns {Promise<Object>} - Result of the operation
   */
  getPlatformStats: StatsService.getPlatformStats,

  /**
   * Record a job creation event
   * @param {string} gigId - ID of the gig that was created
   * @returns {Promise<Object>} - Result of the operation
   */
  recordJobCreation: StatsService.recordJobCreation,
  
  /**
   * Record a job completion event
   * @param {string} gigId - ID of the gig that was completed
   * @returns {Promise<Object>} - Result of the operation
   */
  recordJobCompletion: StatsService.recordJobCompletion
};

/**
 * Contact API
 */
export const Contact = {
  /**
   * Queue a contact message
   * @param {Object} contactData - Contact message data
   * @returns {Promise<Object>} - Result of the operation
   */
  queueMessage: ContactService.queueContactMessage,

  /**
   * Get unprocessed contact messages
   * @returns {Promise<Object>} - Result of the operation
   */
  getUnprocessedMessages: ContactService.getUnprocessedMessages,

  /**
   * Mark a contact message as processed
   * @param {string} messageId - ID of the message to mark as processed
   * @returns {Promise<Object>} - Result of the operation
   */
  markProcessed: ContactService.markMessageProcessed
};

/**
 * Profile API
 */
export const Profiles = {
  /**
   * Get a user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Result of the operation
   */
  getProfile: ProfileService.getProfile,
  
  /**
   * Update a user profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Result of the operation
   */
  updateProfile: ProfileService.updateProfile,
  
  /**
   * Get profiles by skills
   * @param {Array} skills - Skills to match
   * @param {number} limit - Maximum number of profiles to return
   * @returns {Promise<Object>} - Result of the operation
   */
  getBySkills: ProfileService.getProfilesBySkills,
  
  /**
   * Get a user's applications
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Result of the operation
   */
  getApplications: ProfileService.getUserApplications,
  
  /**
   * Apply for a gig
   * @param {string} gigId - Gig ID
   * @param {string} userId - User ID
   * @param {Object} applicationData - Application data
   * @returns {Promise<Object>} - Result of the operation
   */
  applyForGig: ProfileService.applyForGig
};

/**
 * Realtime API
 */
export const Realtime = {
  /**
   * Initialize realtime subscriptions
   * @param {string} userId - User ID
   * @param {Function} onGigUpdate - Callback for gig updates
   * @param {Function} onNewMatch - Callback for new matches
   * @param {Function} onPaymentUpdate - Callback for payment updates
   * @returns {Object} - Subscription objects
   */
  initializeSubscriptions: RealtimeService.initializeRealtimeSubscriptions,
  
  /**
   * Subscribe to stats updates
   * @param {Function} onStatsUpdate - Callback for stats updates
   * @returns {Object} - Subscription object
   */
  subscribeToStats: RealtimeService.subscribeToStats,
  
  /**
   * Broadcast an admin notification
   * @param {string} event - Event type
   * @param {Object} payload - Event payload
   * @returns {Promise<Object>} - Result of the operation
   */
  broadcastAdminNotification: RealtimeService.broadcastAdminNotification
};

/**
 * Database utilities
 */
export const DB = {
  /**
   * Execute a function within a transaction
   * @param {Function} fn - Function to execute
   * @returns {Promise<Object>} - Result of the operation
   */
  withTransaction: DbUtils.withTransaction,

  /**
   * Execute a database operation
   * @param {Function} operation - Operation to execute
   * @returns {Promise<Object>} - Result of the operation
   */
  executeOperation: DbUtils.executeDbOperation,

  /**
   * Check if a table exists
   * @param {string} tableName - Table name
   * @param {Object} schema - Table schema
   * @returns {Promise<Object>} - Result of the operation
   */
  ensureTable: DbUtils.ensureTable,

  /**
   * Log a database operation
   * @param {string} operation - Operation type
   * @param {string} tableName - Table name
   * @param {Object} details - Operation details
   * @returns {Promise<Object>} - Result of the operation
   */
  logOperation: DbUtils.logDbOperation
};

/**
 * Database models
 */
export const Models = {
  Profile: DbModels.PROFILE_MODEL,
  Gig: DbModels.GIG_MODEL,
  Payment: DbModels.PAYMENT_MODEL,
  Application: DbModels.APPLICATION_MODEL,
  AuditLog: DbModels.AUDIT_LOG_MODEL,
  AiMatching: DbModels.AI_MATCHING_MODEL,
  Error: DbModels.ERROR_MODEL,
  Stats: DbModels.STATS_MODEL,
  Contact: DbModels.CONTACT_MODEL
}; 