import { supabase } from '../supabase';

// Record a payment in the database
export const recordPayment = async (paymentData) => {
  try {
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
    return { success: true, data };
  } catch (error) {
    console.error('Error recording payment:', error);
    return { success: false, error: error.message };
  }
};

// Get payment history for a user
export const getPaymentHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return { success: false, error: error.message };
  }
};

// Process PayPal payment (mock function - in production this would use PayPal SDK)
export const processPayPalPayment = async (amount, description, redirectUrl) => {
  try {
    // In production, this would initiate a PayPal payment flow
    // For now, we're just simulating the process
    
    // Record the pending payment
    const pendingPayment = await recordPayment({
      amount,
      status: 'pending',
      paymentMethod: 'paypal',
      description,
      metadata: { redirectUrl }
    });
    
    // Return data needed for frontend to redirect to PayPal
    return {
      success: true,
      paymentId: pendingPayment.data?.[0]?.id,
      redirectUrl: `https://www.paypal.com/paypalme/invinciblelude/${amount}`,
      message: 'Redirecting to PayPal...'
    };
  } catch (error) {
    console.error('Error processing PayPal payment:', error);
    return { success: false, error: error.message };
  }
};

// Create a gig payment
export const processGigPayment = async (gigData, userId) => {
  try {
    // First record the payment
    const payment = await recordPayment({
      amount: 600, // $600 fixed price
      status: 'completed',
      paymentMethod: 'paypal',
      description: `Payment for gig: ${gigData.title}`,
      userId: userId,
      metadata: { gigId: gigData.id }
    });
    
    if (!payment.success) throw new Error(payment.error);
    
    // Then create the gig record
    const { data, error } = await supabase
      .from('gigs')
      .insert([
        {
          title: gigData.title,
          description: gigData.description,
          payment_type: 'fixed',
          rate: 600,
          user_id: userId,
          payment_id: payment.data[0].id,
          status: 'active'
        }
      ])
      .select();
      
    if (error) throw error;
    
    return { 
      success: true, 
      message: 'Gig created successfully', 
      data 
    };
  } catch (error) {
    console.error('Error processing gig payment:', error);
    return { success: false, error: error.message };
  }
}; 