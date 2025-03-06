import { supabase } from '../../supabase';
import { executeDbOperation, logDbOperation } from '../utils/dbUtils';

/**
 * Create an AI matching job to find matching workers for a gig
 * @param {string} gigId - ID of the gig to match
 * @returns {Promise<Object>} - Result of the operation
 */
export const createMatchingJob = async (gigId) => {
  return executeDbOperation(async () => {
    if (!gigId) {
      throw new Error('Gig ID is required');
    }

    // Check if gig exists
    const { data: gig, error: gigError } = await supabase
      .from('gigs')
      .select('*')
      .eq('id', gigId)
      .single();

    if (gigError) throw gigError;
    if (!gig) throw new Error(`Gig with ID ${gigId} not found`);

    // Create matching job
    const { data, error } = await supabase
      .from('ai_matching_jobs')
      .insert([
        {
          gig_id: gigId,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    
    // Log the operation
    await logDbOperation('create', 'ai_matching_jobs', {
      job_id: data[0].id,
      gig_id: gigId
    });

    // In a real production environment, this would trigger a background job
    // Here we'll simulate processing it synchronously for demo purposes
    setTimeout(() => processMatchingJob(data[0].id), 100);

    return data;
  });
};

/**
 * Process an AI matching job
 * @param {string} jobId - ID of the job to process
 * @returns {Promise<Object>} - Result of the operation
 */
export const processMatchingJob = async (jobId) => {
  return executeDbOperation(async () => {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    // Get the job
    const { data: job, error: jobError } = await supabase
      .from('ai_matching_jobs')
      .select('*, gigs(*)')
      .eq('id', jobId)
      .single();

    if (jobError) throw jobError;
    if (!job) throw new Error(`Job with ID ${jobId} not found`);

    try {
      // Update job status to processing
      await supabase
        .from('ai_matching_jobs')
        .update({ status: 'processing' })
        .eq('id', jobId);

      // In a real application, this would call the Super Grok AI API
      // Here we'll simulate finding matches based on skills and availability
      
      // Find profiles with matching skills
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Simple matching algorithm (in production this would be much more sophisticated)
      // and would use the Super Grok AI for natural language matching
      const matches = profiles.map(profile => {
        // Simulated matching score based on random factors
        const score = Math.random() * 100;
        return {
          profile_id: profile.id,
          score: score.toFixed(2)
        };
      }).sort((a, b) => b.score - a.score).slice(0, 5); // Top 5 matches

      // Update job with matches
      const { data, error } = await supabase
        .from('ai_matching_jobs')
        .update({
          status: 'completed',
          matched_profiles: matches.map(m => m.profile_id),
          matching_score: matches,
          completed_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .select();

      if (error) throw error;
      
      // Log the operation
      await logDbOperation('update', 'ai_matching_jobs', {
        job_id: jobId,
        status: 'completed',
        matches_count: matches.length
      });

      // Notify matched users (in production)
      // sendMatchNotifications(job.gig_id, matches);

      return data;
    } catch (error) {
      // If there's an error, update job status to failed
      await supabase
        .from('ai_matching_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString()
        })
        .eq('id', jobId);
      
      throw error;
    }
  });
};

/**
 * Get matches for a gig
 * @param {string} gigId - ID of the gig to get matches for
 * @returns {Promise<Object>} - Result of the operation
 */
export const getGigMatches = async (gigId) => {
  return executeDbOperation(async () => {
    if (!gigId) {
      throw new Error('Gig ID is required');
    }

    // Get the latest matching job for this gig
    const { data: job, error: jobError } = await supabase
      .from('ai_matching_jobs')
      .select('*')
      .eq('gig_id', gigId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (jobError && jobError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw jobError;
    }

    if (!job) {
      // No matching job found, create one
      const newJob = await createMatchingJob(gigId);
      return {
        status: 'pending',
        message: 'Matching job created',
        data: newJob
      };
    }

    // Get profiles for matched users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, skills, hourly_rate')
      .in('id', job.matched_profiles);

    if (profilesError) throw profilesError;

    // Combine profile data with matching scores
    const matchesWithProfiles = profiles.map(profile => {
      const matchData = job.matching_score.find(m => m.profile_id === profile.id);
      return {
        ...profile,
        match_score: matchData ? matchData.score : null
      };
    }).sort((a, b) => b.match_score - a.match_score);

    return {
      status: 'completed',
      message: 'Matches found',
      data: matchesWithProfiles
    };
  });
}; 