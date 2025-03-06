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