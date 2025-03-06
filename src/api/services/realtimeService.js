/**
 * Realtime service for the PulseHustle application
 * Handles WebSocket connections and real-time updates
 */

import { supabase } from '../../supabase';
import { logDbOperation } from '../utils/dbUtils';

/**
 * Initialize realtime subscriptions for a client
 * 
 * @param {string} userId - User ID to subscribe for
 * @param {Function} onGigUpdate - Callback for gig updates
 * @param {Function} onNewMatch - Callback for new matches
 * @param {Function} onPaymentUpdate - Callback for payment updates
 * @returns {Object} - Subscription objects that can be used to unsubscribe
 */
export const initializeRealtimeSubscriptions = async (userId, onGigUpdate, onNewMatch, onPaymentUpdate) => {
  try {
    // Log the operation
    await logDbOperation('init_realtime', 'subscriptions', { userId });
    
    // Subscribe to gig updates for the user
    const gigSubscription = supabase
      .channel('gig-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'gigs',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Gig change received:', payload);
          if (onGigUpdate) onGigUpdate(payload);
        }
      )
      .subscribe();
      
    // Subscribe to AI matches for the user's gigs
    const matchSubscription = supabase
      .channel('match-updates')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'ai_matching_jobs'
        },
        async (payload) => {
          // Check if the match is for one of the user's gigs
          const { data, error } = await supabase
            .from('gigs')
            .select('id')
            .eq('id', payload.new.gig_id)
            .eq('user_id', userId)
            .single();
            
          if (!error && data && onNewMatch) {
            console.log('New match received:', payload);
            onNewMatch(payload);
          }
        }
      )
      .subscribe();
      
    // Subscribe to payment updates
    const paymentSubscription = supabase
      .channel('payment-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'payments',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Payment update received:', payload);
          if (onPaymentUpdate) onPaymentUpdate(payload);
        }
      )
      .subscribe();
      
    return {
      gigSubscription,
      matchSubscription,
      paymentSubscription,
      
      // Helper method to unsubscribe from all
      unsubscribeAll: () => {
        gigSubscription.unsubscribe();
        matchSubscription.unsubscribe();
        paymentSubscription.unsubscribe();
      }
    };
  } catch (error) {
    console.error('Error initializing realtime subscriptions:', error);
    throw error;
  }
};

/**
 * Subscribe to platform statistics updates
 * 
 * @param {Function} onStatsUpdate - Callback for stats updates
 * @returns {Object} - Subscription object
 */
export const subscribeToStats = (onStatsUpdate) => {
  try {
    const statsSubscription = supabase
      .channel('stats-updates')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'stats'
        },
        (payload) => {
          console.log('Stats update received:', payload);
          if (onStatsUpdate) onStatsUpdate(payload.new);
        }
      )
      .subscribe();
      
    return {
      statsSubscription,
      unsubscribe: () => statsSubscription.unsubscribe()
    };
  } catch (error) {
    console.error('Error subscribing to stats:', error);
    throw error;
  }
};

/**
 * Broadcast a notification to admin users
 * 
 * @param {string} event - Event type
 * @param {Object} payload - Event payload
 * @returns {Promise<Object>} - Result of the operation
 */
export const broadcastAdminNotification = async (event, payload) => {
  try {
    // Log the operation
    await logDbOperation('broadcast', 'admin_notifications', { event });
    
    // In a real implementation, this would use Supabase's broadcast channel
    // For now, we'll simulate it
    console.log(`Admin broadcast: ${event}`, payload);
    
    return {
      success: true,
      message: 'Admin notification broadcast successfully'
    };
  } catch (error) {
    console.error('Error broadcasting admin notification:', error);
    return { 
      success: false, 
      error: error.message || 'Error broadcasting notification' 
    };
  }
}; 