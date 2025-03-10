import { useState } from 'react';
import { supabase } from '../supabase';
import { Payments } from '../api'; // Import our new centralized API interface

const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  
  // Get current user
  const getCurrentUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  };
  
  // Handle PayPal payment
  const handlePayPalPayment = async (amount, description) => {
    setLoading(true);
    setError(null);
    
    try {
      // We don't use the user here but keep for consistency with getCurrentUser pattern
      await getCurrentUser();
      
      const result = await Payments.processPayPal(
        amount, 
        description,
        window.location.origin + '/payment-success'
      );
      
      setPaymentData(result);
      
      if (result.success && result.redirectUrl) {
        // For development testing, we'll open a new tab
        window.open(result.redirectUrl, '_blank');
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'Payment processing failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Handle gig payment and creation
  const handleGigPayment = async (gigData) => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error('You must be logged in to create a gig');
      }
      
      const result = await Payments.processGig(gigData, user.id);
      setPaymentData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Gig payment processing failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Need40 donation
  const handleDonation = async (amount = 40) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Payments.processPayPal(
        amount,
        'Donation to Need40 initiative',
        window.location.origin + '/thank-you'
      );
      
      setPaymentData(result);
      
      if (result.success && result.redirectUrl) {
        // For development testing, we'll open a new tab
        window.open(result.redirectUrl, '_blank');
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'Donation processing failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    paymentData,
    handlePayPalPayment,
    handleGigPayment,
    handleDonation
  };
};

export default usePayment; 