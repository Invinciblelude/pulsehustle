/**
 * Profile service for the PulseHustle application
 * Handles user profile management
 */

import { supabase } from '../../supabase';
import { executeDbOperation, logDbOperation } from '../utils/dbUtils';

/**
 * Get a user profile by ID
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Result of the operation
 */
export const getProfile = async (userId) => {
  try {
    // Log the operation
    await logDbOperation('get_profile', 'profiles', { userId });
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error getting profile:', error);
    return { 
      success: false, 
      error: error.message || 'Error getting profile' 
    };
  }
};

/**
 * Create or update a user profile
 * 
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} - Result of the operation
 */
export const updateProfile = async (userId, profileData) => {
  try {
    // Log the operation
    await logDbOperation('update_profile', 'profiles', { userId });
    
    // Validate profile data
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Prepare profile data
    const profile = {
      id: userId,
      updated_at: new Date().toISOString()
    };
    
    // Add profile fields if provided
    if (profileData.username) profile.username = profileData.username;
    if (profileData.full_name) profile.full_name = profileData.full_name;
    if (profileData.bio) profile.bio = profileData.bio;
    if (profileData.avatar_url) profile.avatar_url = profileData.avatar_url;
    if (profileData.website) profile.website = profileData.website;
    if (profileData.location) profile.location = profileData.location;
    if (profileData.skills) profile.skills = profileData.skills;
    if (profileData.hourly_rate) profile.hourly_rate = profileData.hourly_rate;
    
    // Update profile
    const { data, error } = await executeDbOperation(async () => {
      return await supabase
        .from('profiles')
        .upsert(profile)
        .select();
    });
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Profile updated successfully',
      data: data[0]
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { 
      success: false, 
      error: error.message || 'Error updating profile' 
    };
  }
};

/**
 * Get profiles matching specific skills
 * 
 * @param {Array} skills - Skills to match
 * @param {number} limit - Maximum number of profiles to return
 * @returns {Promise<Object>} - Result of the operation
 */
export const getProfilesBySkills = async (skills, limit = 10) => {
  try {
    // Log the operation
    await logDbOperation('get_by_skills', 'profiles', { skills });
    
    // Get profiles with any of the requested skills
    // In a real application, this would use more sophisticated matching
    let query = supabase
      .from('profiles')
      .select('*');
    
    // Apply skills filter if provided
    if (skills && skills.length > 0) {
      // This assumes 'skills' is stored as an array in Supabase
      // For each skill, look for profiles containing that skill
      skills.forEach(skill => {
        query = query.contains('skills', [skill]);
      });
    }
    
    // Apply limit
    query = query.limit(limit);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error getting profiles by skills:', error);
    return { 
      success: false, 
      error: error.message || 'Error getting profiles by skills' 
    };
  }
};

/**
 * Get a user's applications
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Result of the operation
 */
export const getUserApplications = async (userId) => {
  try {
    // Log the operation
    await logDbOperation('get_applications', 'applications', { userId });
    
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        gigs (
          id, title, description, pay, status
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error getting user applications:', error);
    return { 
      success: false, 
      error: error.message || 'Error getting user applications' 
    };
  }
};

/**
 * Apply for a gig
 * 
 * @param {string} gigId - Gig ID
 * @param {string} userId - User ID
 * @param {Object} applicationData - Application data
 * @returns {Promise<Object>} - Result of the operation
 */
export const applyForGig = async (gigId, userId, applicationData) => {
  try {
    // Log the operation
    await logDbOperation('apply_gig', 'applications', { gigId, userId });
    
    // Check if user already applied
    const { data: existingApplication, error: checkError } = await supabase
      .from('applications')
      .select('id')
      .eq('gig_id', gigId)
      .eq('user_id', userId)
      .single();
    
    if (!checkError && existingApplication) {
      throw new Error('You have already applied for this gig');
    }
    
    // Create application
    const { data, error } = await executeDbOperation(async () => {
      return await supabase
        .from('applications')
        .insert({
          gig_id: gigId,
          user_id: userId,
          cover_letter: applicationData.cover_letter || '',
          status: 'submitted',
          created_at: new Date().toISOString()
        })
        .select();
    });
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Application submitted successfully',
      data: data[0]
    };
  } catch (error) {
    console.error('Error applying for gig:', error);
    return { 
      success: false, 
      error: error.message || 'Error applying for gig' 
    };
  }
}; 