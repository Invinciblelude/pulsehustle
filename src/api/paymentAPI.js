import { supabase } from '../supabase';
import * as PaymentService from './services/paymentService';
import * as GigService from './services/gigService';

/**
 * @deprecated Use the API from './index.js' - Payments.recordPayment() instead.
 * Record a payment in the database
 */
export const recordPayment = async (paymentData) => {
  // Forward to the new service implementation
  return PaymentService.recordPayment(paymentData);
};

/**
 * @deprecated Use the API from './index.js' - Payments.getHistory() instead.
 * Get payment history for a user
 */
export const getPaymentHistory = async (userId) => {
  // Forward to the new service implementation
  return PaymentService.getPaymentHistory(userId);
};

/**
 * @deprecated Use the API from './index.js' - Payments.processPayPal() instead.
 * Process PayPal payment (mock function - in production this would use PayPal SDK)
 */
export const processPayPalPayment = async (amount, description, redirectUrl, userId) => {
  // Forward to the new service implementation
  return PaymentService.processPayPalPayment(amount, description, redirectUrl, userId);
};

/**
 * @deprecated Use the API from './index.js' - Payments.processGig() instead.
 * Create a gig payment
 */
export const processGigPayment = async (gigData, userId) => {
  // Forward to the new service implementation
  return PaymentService.processGigPayment(gigData, userId);
}; 