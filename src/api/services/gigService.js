/**
 * Gig service for the PulseHustle application
 * Handles gig creation, retrieval, and management
 */

import { supabase } from '../../supabase';
import { executeDbOperation, logDbOperation, withTransaction } from '../utils/dbUtils';
import * as AiMatchingService from './aiMatchingService';
import * as GrokService from './grokService';
import * as StatsService from './statsService';

/**
 * Create a gig without payment
 * 
 * @param {Object} gigData - Gig data to create
 * @param {string} userId - User ID creating the gig
 * @returns {Promise<Object>} - Result of the operation
 */
export const createGig = async (gigData, userId) => {
  try {
    // Validate input
    if (!gigData.title) {
      throw new Error('Gig title is required');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Log the operation
    await logDbOperation('create_gig', 'gigs', { userId });
    
    // Set default values
    const hours = gigData.hours || 40;
    const pay = gigData.pay || 600; // Default $600
    const workerRate = Math.round(pay * 0.95); // 95% to worker
    const platformFee = pay - workerRate; // 5% platform fee
    
    // Insert gig record
    const { data, error } = await executeDbOperation(async () => {
      return await supabase
        .from('gigs')
        .insert([
          {
            title: gigData.title,
            description: gigData.description,
            hours: hours,
            pay: pay,
            worker_rate: workerRate,
            platform_fee: platformFee,
            payment_type: gigData.payment_type || 'fixed',
            location: gigData.location || 'remote',
            remote: gigData.remote !== false, // Default to remote
            user_id: userId,
            status: 'posted',
            skills_required: gigData.skills_required || [],
            duration: gigData.duration || `${hours} hours`,
            created_at: new Date().toISOString()
          }
        ])
        .select();
    });
    
    if (error) throw error;
    
    // Record job creation in stats
    await StatsService.recordJobCreation(data[0].id);
    
    // Start AI matching job
    await AiMatchingService.createMatchingJob(data[0].id);
    
    return { 
      success: true, 
      message: 'Gig created successfully', 
      data: data[0] 
    };
  } catch (error) {
    console.error('Error creating gig:', error);
    
    // Record error
    await executeDbOperation(async () => {
      await supabase.from('errors').insert({
        message: `Gig creation error: ${error.message}`,
        stack: error.stack,
        context: { userId },
        created_at: new Date().toISOString()
      });
    });
    
    return { 
      success: false, 
      error: error.message || 'Error creating gig' 
    };
  }
};

/**
 * Get gigs with optional filtering
 * 
 * @param {Object} filters - Filters to apply
 * @param {string} filters.search - Search term
 * @param {string} filters.payment_type - Payment type filter
 * @param {string} filters.location - Location filter
 * @param {Array} filters.rate_range - Min and max rate [min, max]
 * @param {string} filters.user_id - Filter by creator
 * @param {string} filters.status - Filter by status
 * @param {boolean} filters.remote - Filter by remote
 * @param {Array} filters.skills - Required skills
 * @param {number} filters.page - Page number
 * @param {number} filters.per_page - Items per page
 * @returns {Promise<Object>} - Result of the operation
 */
export const getGigs = async (filters = {}) => {
  try {
    // Log the operation
    await logDbOperation('get_gigs', 'gigs', filters);
    
    // Start query
    let query = supabase
      .from('gigs')
      .select('*');
    
    // Apply filters
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    if (filters.payment_type) {
      query = query.eq('payment_type', filters.payment_type);
    }
    
    if (filters.location) {
      query = query.eq('location', filters.location);
    }
    
    if (filters.rate_range && Array.isArray(filters.rate_range) && filters.rate_range.length === 2) {
      query = query.gte('pay', filters.rate_range[0]).lte('pay', filters.rate_range[1]);
    }
    
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.remote !== undefined) {
      query = query.eq('remote', filters.remote);
    }
    
    if (filters.skills && Array.isArray(filters.skills) && filters.skills.length > 0) {
      // This is a simplified approach; in a real DB this would use containment operators
      filters.skills.forEach(skill => {
        query = query.contains('skills_required', [skill]);
      });
    }
    
    // Order by creation date, newest first
    query = query.order('created_at', { ascending: false });
    
    // Pagination
    const page = filters.page || 1;
    const perPage = filters.per_page || 10;
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;
    
    query = query.range(start, end);
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      success: true,
      data,
      pagination: {
        page,
        per_page: perPage,
        total: count
      }
    };
  } catch (error) {
    console.error('Error getting gigs:', error);
    
    // Record error
    await executeDbOperation(async () => {
      await supabase.from('errors').insert({
        message: `Gig retrieval error: ${error.message}`,
        stack: error.stack,
        context: { filters },
        created_at: new Date().toISOString()
      });
    });
    
    return { 
      success: false, 
      error: error.message || 'Error getting gigs' 
    };
  }
};

/**
 * Get a gig by ID
 * 
 * @param {string} gigId - Gig ID to retrieve
 * @returns {Promise<Object>} - Result of the operation
 */
export const getGigById = async (gigId) => {
  try {
    // Log the operation
    await logDbOperation('get_gig', 'gigs', { gigId });
    
    // Get gig
    const { data, error } = await supabase
      .from('gigs')
      .select('*')
      .eq('id', gigId)
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error getting gig:', error);
    
    // Record error
    await executeDbOperation(async () => {
      await supabase.from('errors').insert({
        message: `Gig retrieval error: ${error.message}`,
        stack: error.stack,
        context: { gigId },
        created_at: new Date().toISOString()
      });
    });
    
    return { 
      success: false, 
      error: error.message || 'Error getting gig' 
    };
  }
};

/**
 * Update a gig
 * 
 * @param {string} gigId - Gig ID to update
 * @param {Object} updates - Updates to apply
 * @param {string} userId - User ID making the update
 * @returns {Promise<Object>} - Result of the operation
 */
export const updateGig = async (gigId, updates, userId) => {
  try {
    // Log the operation
    await logDbOperation('update_gig', 'gigs', { gigId, userId });
    
    // Check ownership
    const { data: gig, error: getError } = await supabase
      .from('gigs')
      .select('user_id, status')
      .eq('id', gigId)
      .single();
    
    if (getError) throw getError;
    
    if (gig.user_id !== userId) {
      throw new Error('You do not have permission to update this gig');
    }
    
    if (['completed', 'cancelled'].includes(gig.status)) {
      throw new Error('Cannot update a completed or cancelled gig');
    }
    
    // Prepare updates
    const updateData = {};
    
    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.hours) updateData.hours = updates.hours;
    if (updates.location) updateData.location = updates.location;
    if (updates.remote !== undefined) updateData.remote = updates.remote;
    if (updates.skills_required) updateData.skills_required = updates.skills_required;
    if (updates.duration) updateData.duration = updates.duration;
    
    // Only allow pay updates if the gig hasn't been paid for
    if (updates.pay && gig.status !== 'paid') {
      updateData.pay = updates.pay;
      updateData.worker_rate = Math.round(updates.pay * 0.95);
      updateData.platform_fee = updates.pay - updateData.worker_rate;
    }
    
    updateData.updated_at = new Date().toISOString();
    
    // Update gig
    const { data, error } = await executeDbOperation(async () => {
      return await supabase
        .from('gigs')
        .update(updateData)
        .eq('id', gigId)
        .select();
    });
    
    if (error) throw error;
    
    // If relevant fields were updated, create a new matching job
    if (updates.title || updates.description || updates.skills_required) {
      await AiMatchingService.createMatchingJob(gigId);
    }
    
    return {
      success: true,
      message: 'Gig updated successfully',
      data: data[0]
    };
  } catch (error) {
    console.error('Error updating gig:', error);
    
    // Record error
    await executeDbOperation(async () => {
      await supabase.from('errors').insert({
        message: `Gig update error: ${error.message}`,
        stack: error.stack,
        context: { gigId, userId },
        created_at: new Date().toISOString()
      });
    });
    
    return { 
      success: false, 
      error: error.message || 'Error updating gig' 
    };
  }
};

/**
 * Change gig status
 * 
 * @param {string} gigId - Gig ID to update
 * @param {string} status - New status
 * @param {string} userId - User ID making the update
 * @returns {Promise<Object>} - Result of the operation
 */
export const changeGigStatus = async (gigId, status, userId) => {
  try {
    // Log the operation
    await logDbOperation('change_status', 'gigs', { gigId, status, userId });
    
    // Check ownership
    const { data: gig, error: getError } = await supabase
      .from('gigs')
      .select('user_id, status')
      .eq('id', gigId)
      .single();
    
    if (getError) throw getError;
    
    if (gig.user_id !== userId) {
      throw new Error('You do not have permission to update this gig');
    }
    
    // Validate status transition
    const validStatuses = ['posted', 'processing', 'paid', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    
    // Update status
    const { data, error } = await executeDbOperation(async () => {
      return await supabase
        .from('gigs')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', gigId)
        .select();
    });
    
    if (error) throw error;
    
    // If status changed to completed, update stats
    if (status === 'completed') {
      await StatsService.recordJobCompletion(gigId);
    }
    
    // If status changed to cancelled, handle cleanup
    if (status === 'cancelled') {
      // Handle cancellation logic
    }
    
    return {
      success: true,
      message: `Gig status changed to ${status}`,
      data: data[0]
    };
  } catch (error) {
    console.error('Error changing gig status:', error);
    
    // Record error
    await executeDbOperation(async () => {
      await supabase.from('errors').insert({
        message: `Status change error: ${error.message}`,
        stack: error.stack,
        context: { gigId, status, userId },
        created_at: new Date().toISOString()
      });
    });
    
    return { 
      success: false, 
      error: error.message || 'Error changing gig status' 
    };
  }
};

/**
 * Calculate gig price using Grok AI
 * 
 * @param {number} hours - Number of hours for the gig
 * @returns {Promise<Object>} - Result of the operation with pricing data
 */
export const calculateGigPrice = async (hours) => {
  return GrokService.calculatePrice(hours);
};

/**
 * Send gig to Give40
 * 
 * @param {string} gigId - ID of the gig to send
 * @returns {Promise<Object>} - Result of the operation
 */
export const sendGigToGive40 = async (gigId) => {
  return GrokService.pingGive40(gigId);
}; 