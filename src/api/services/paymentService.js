import { supabase } from '../../supabase';
import { withTransaction, executeDbOperation, logDbOperation } from '../utils/dbUtils';

/**
 * Records a payment in the database
 * @param {Object} paymentData - Payment data to record
 * @returns {Promise<Object>} - Result of the operation
 */
export const recordPayment = async (paymentData) => {
  return executeDbOperation(async () => {
    // Validate payment data
    if (!paymentData.amount || !paymentData.paymentMethod || !paymentData.status) {
      throw new Error('Invalid payment data: amount, paymentMethod, and status are required');
    }

    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          amount: paymentData.amount,
          status: paymentData.status,
          payment_method: paymentData.paymentMethod,
          description: paymentData.description,
          user_id: paymentData.userId || null,
          metadata: paymentData.metadata || {},
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    
    // Log the operation
    await logDbOperation('create', 'payments', {
      payment_id: data[0].id,
      amount: paymentData.amount,
      payment_method: paymentData.paymentMethod
    });

    return data;
  });
};

/**
 * Get payment history for a user
 * @param {string} userId - User ID to get payment history for
 * @returns {Promise<Object>} - Result of the operation
 */
export const getPaymentHistory = async (userId) => {
  return executeDbOperation(async () => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Log the operation
    await logDbOperation('read', 'payments', {
      user_id: userId,
      count: data.length
    });

    return data;
  });
};

/**
 * Process PayPal payment
 * @param {number} amount - Payment amount
 * @param {string} description - Payment description
 * @param {string} redirectUrl - URL to redirect to after payment
 * @returns {Promise<Object>} - Result of the operation
 */
export const processPayPalPayment = async (amount, description, redirectUrl, userId = null) => {
  return withTransaction(async () => {
    try {
      // In production, this would initiate a PayPal payment flow
      // For now, we're just simulating the process
      
      // Record the pending payment
      const pendingPayment = await recordPayment({
        amount,
        status: 'pending',
        paymentMethod: 'paypal',
        description,
        userId,
        metadata: { redirectUrl }
      });
      
      if (!pendingPayment.success) {
        throw new Error(pendingPayment.error || 'Failed to record payment');
      }
      
      // Return data needed for frontend to redirect to PayPal
      return {
        success: true,
        paymentId: pendingPayment.data[0].id,
        redirectUrl: `https://www.paypal.com/paypalme/invinciblelude/${amount}`,
        message: 'Redirecting to PayPal...'
      };
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      throw error;
    }
  });
};

/**
 * Create a gig payment and the associated gig
 * @param {Object} gigData - Gig data
 * @param {string} userId - User ID creating the gig
 * @returns {Promise<Object>} - Result of the operation
 */
export const processGigPayment = async (gigData, userId) => {
  return withTransaction(async () => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      if (!gigData.title || !gigData.description) {
        throw new Error('Gig title and description are required');
      }
      
      // First record the payment
      const payment = await recordPayment({
        amount: 600, // $600 fixed price
        status: 'completed',
        paymentMethod: 'paypal',
        description: `Payment for gig: ${gigData.title}`,
        userId: userId,
        metadata: { 
          gigId: gigData.id,
          workerEarnings: 570, // $570 to worker (95%)
          platformFee: 30 // $30 platform fee (5%)
        }
      });
      
      if (!payment.success) {
        throw new Error(payment.error || 'Failed to record payment');
      }
      
      // Then create the gig record
      const { data, error } = await supabase
        .from('gigs')
        .insert([
          {
            title: gigData.title,
            description: gigData.description,
            payment_type: 'fixed',
            rate: 600,
            worker_rate: 570,
            platform_fee: 30,
            user_id: userId,
            payment_id: payment.data[0].id,
            status: 'active',
            created_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Log the operation
      await logDbOperation('create', 'gigs', {
        gig_id: data[0].id,
        payment_id: payment.data[0].id,
        user_id: userId
      });
      
      // Queue an AI matching job if we were in production
      // This would be handled by a background worker
      
      return { 
        success: true, 
        message: 'Gig created successfully', 
        data 
      };
    } catch (error) {
      console.error('Error processing gig payment:', error);
      throw error;
    }
  });
};

/**
 * Update payment status
 * @param {string} paymentId - Payment ID to update
 * @param {string} status - New payment status
 * @returns {Promise<Object>} - Result of the operation
 */
export const updatePaymentStatus = async (paymentId, status) => {
  return executeDbOperation(async () => {
    if (!paymentId || !status) {
      throw new Error('Payment ID and status are required');
    }

    const { data, error } = await supabase
      .from('payments')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select();

    if (error) throw error;
    
    // Log the operation
    await logDbOperation('update', 'payments', {
      payment_id: paymentId,
      status
    });

    return data;
  });
}; 