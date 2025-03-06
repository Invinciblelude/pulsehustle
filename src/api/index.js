/**
 * This is the main API interface for the PulseHustle application.
 * It provides a unified interface to all backend services.
 */

// Service imports
import * as PaymentService from './services/paymentService';
import * as GigService from './services/gigService';
import * as AiMatchingService from './services/aiMatchingService';

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
  changeStatus: GigService.changeGigStatus
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
  AiMatching: DbModels.AI_MATCHING_MODEL
}; 