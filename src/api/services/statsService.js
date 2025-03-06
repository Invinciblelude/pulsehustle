/**
 * Statistics service for the PulseHustle application
 * Provides metrics and projections for the platform
 */

import { supabase } from '../../supabase';
import { executeDbOperation, logDbOperation } from '../utils/dbUtils';

/**
 * Get platform statistics
 * 
 * @returns {Promise<Object>} - Result of the operation with statistics data
 */
export const getPlatformStats = async () => {
  try {
    // Log the operation
    await logDbOperation('get_stats', 'stats', {});
    
    // Calculate jobs created
    const { count: jobsCreated, error: jobsError } = await supabase
      .from('gigs')
      .select('id', { count: 'exact' });
    
    if (jobsError) throw jobsError;
    
    // Calculate jobs completed
    const { count: jobsCompleted, error: completedError } = await supabase
      .from('gigs')
      .select('id', { count: 'exact' })
      .eq('status', 'completed');
    
    if (completedError) throw completedError;
    
    // Calculate total earnings
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed');
    
    if (paymentsError) throw paymentsError;
    
    const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calculate projections
    const weeklyGoal = 10; // 10 gigs per week
    const annualProjection = weeklyGoal * 52; // 52 weeks in a year
    const workerEarnings = Math.round(totalEarnings * 0.95); // 95% to workers
    const platformFees = totalEarnings - workerEarnings; // 5% platform fee
    
    // Store stats in database
    await executeDbOperation(async () => {
      const { error: statsError } = await supabase
        .from('stats')
        .upsert({
          id: '1', // Single row for platform stats
          jobs_created: jobsCreated,
          jobs_completed: jobsCompleted,
          total_earnings: totalEarnings,
          worker_earnings: workerEarnings,
          platform_fees: platformFees,
          weekly_goal: weeklyGoal,
          annual_projection: annualProjection,
          updated_at: new Date().toISOString()
        });
      
      if (statsError) throw statsError;
    });
    
    return {
      success: true,
      data: {
        jobs_created: jobsCreated,
        jobs_completed: jobsCompleted,
        total_earnings: totalEarnings,
        worker_earnings: workerEarnings,
        platform_fees: platformFees,
        weekly_goal: weeklyGoal,
        annual_projection: annualProjection,
        launch_date: '2024-04-08'
      }
    };
  } catch (error) {
    console.error('Error getting platform stats:', error);
    
    // Record error
    await executeDbOperation(async () => {
      await supabase.from('errors').insert({
        message: `Stats error: ${error.message}`,
        stack: error.stack,
        context: {},
        created_at: new Date().toISOString()
      });
    });
    
    return { 
      success: false, 
      error: error.message || 'Error getting statistics' 
    };
  }
};

/**
 * Record a job creation event
 * Updates the statistics accordingly
 * 
 * @param {string} gigId - ID of the gig that was created
 * @returns {Promise<Object>} - Result of the operation
 */
export const recordJobCreation = async (gigId) => {
  try {
    // Log the operation
    await logDbOperation('record_job', 'stats', { gigId });
    
    // Get the stats
    const { data: stats, error: statsError } = await supabase
      .from('stats')
      .select('*')
      .eq('id', '1')
      .single();
    
    if (statsError && statsError.code !== 'PGRST116') { // PGRST116 is "row not found"
      throw statsError;
    }
    
    const currentStats = stats || {
      id: '1',
      jobs_created: 0,
      jobs_completed: 0,
      total_earnings: 0,
      worker_earnings: 0,
      platform_fees: 0,
      weekly_goal: 10,
      annual_projection: 520
    };
    
    // Update stats
    await executeDbOperation(async () => {
      const { error: updateError } = await supabase
        .from('stats')
        .upsert({
          ...currentStats,
          jobs_created: (currentStats.jobs_created || 0) + 1,
          updated_at: new Date().toISOString()
        });
      
      if (updateError) throw updateError;
    });
    
    return {
      success: true,
      message: 'Job creation recorded in statistics'
    };
  } catch (error) {
    console.error('Error recording job creation:', error);
    
    // Record error
    await executeDbOperation(async () => {
      await supabase.from('errors').insert({
        message: `Job recording error: ${error.message}`,
        stack: error.stack,
        context: { gigId },
        created_at: new Date().toISOString()
      });
    });
    
    return { 
      success: false, 
      error: error.message || 'Error recording job creation' 
    };
  }
};

/**
 * Record a job completion event
 * Updates the statistics accordingly
 * 
 * @param {string} gigId - ID of the gig that was completed
 * @returns {Promise<Object>} - Result of the operation
 */
export const recordJobCompletion = async (gigId) => {
  try {
    // Log the operation
    await logDbOperation('record_completion', 'stats', { gigId });
    
    // Get the gig to calculate earnings
    const { data: gig, error: gigError } = await supabase
      .from('gigs')
      .select('pay, worker_rate, platform_fee')
      .eq('id', gigId)
      .single();
    
    if (gigError) throw gigError;
    
    // Get the current stats
    const { data: stats, error: statsError } = await supabase
      .from('stats')
      .select('*')
      .eq('id', '1')
      .single();
    
    if (statsError && statsError.code !== 'PGRST116') { // PGRST116 is "row not found"
      throw statsError;
    }
    
    const currentStats = stats || {
      id: '1',
      jobs_created: 0,
      jobs_completed: 0,
      total_earnings: 0,
      worker_earnings: 0,
      platform_fees: 0,
      weekly_goal: 10,
      annual_projection: 520
    };
    
    // Update stats with completion data
    await executeDbOperation(async () => {
      const { error: updateError } = await supabase
        .from('stats')
        .upsert({
          ...currentStats,
          jobs_completed: (currentStats.jobs_completed || 0) + 1,
          total_earnings: (currentStats.total_earnings || 0) + (gig.pay || 0),
          worker_earnings: (currentStats.worker_earnings || 0) + (gig.worker_rate || 0),
          platform_fees: (currentStats.platform_fees || 0) + (gig.platform_fee || 0),
          updated_at: new Date().toISOString()
        });
      
      if (updateError) throw updateError;
    });
    
    return {
      success: true,
      message: 'Job completion recorded in statistics'
    };
  } catch (error) {
    console.error('Error recording job completion:', error);
    
    // Record error
    await executeDbOperation(async () => {
      await supabase.from('errors').insert({
        message: `Completion recording error: ${error.message}`,
        stack: error.stack,
        context: { gigId },
        created_at: new Date().toISOString()
      });
    });
    
    return { 
      success: false, 
      error: error.message || 'Error recording job completion' 
    };
  }
};

/**
 * Records a social share event for tracking and analytics
 * @param {Object} shareData - Data about the share event
 * @param {string} shareData.gigId - ID of the gig being shared
 * @param {string} shareData.platform - Platform the content was shared on (twitter, facebook, linkedin, etc.)
 * @param {string|null} shareData.userId - ID of the user who shared (null if anonymous)
 * @returns {Promise<Object>} Success or error response
 */
export const recordSocialShare = async (shareData) => {
  try {
    // Validate required fields
    if (!shareData.gigId || !shareData.platform) {
      console.error('Missing required fields for social share tracking');
      return { error: 'Missing required fields' };
    }

    // If userId isn't provided, try to get the current user
    if (!shareData.userId) {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        shareData.userId = data.user.id;
      }
    }

    // Record the share event
    const { data, error } = await supabase
      .from('social_shares')
      .insert([
        {
          gig_id: shareData.gigId,
          platform: shareData.platform,
          user_id: shareData.userId,
          ip_address: null, // We don't collect IP addresses for privacy reasons
        }
      ]);

    if (error) {
      console.error('Error recording social share:', error.message);
      // Don't return error to avoid disrupting user experience
      return { success: false };
    }

    // Also increment the share counter for the gig
    await supabase.rpc('increment_gig_share_count', { 
      gig_id: shareData.gigId,
      platform: shareData.platform
    });

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error recording social share:', error.message);
    // Don't return error to avoid disrupting user experience
    return { success: false };
  }
}; 