import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email, password) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Profile functions
export const getProfile = async (userId) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
};

export const updateProfile = async (userId, updates) => {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
};

// Gig functions
export const createGig = async (gigData) => {
  return await supabase
    .from('gigs')
    .insert([gigData]);
};

export const getGigs = async (filters = {}) => {
  let query = supabase
    .from('gigs')
    .select('*, profiles(username, avatar_url)');

  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }
  if (filters.payment_type) {
    query = query.eq('payment_type', filters.payment_type);
  }
  if (filters.location) {
    query = query.eq('location', filters.location);
  }
  if (filters.min_rate) {
    query = query.gte('rate', filters.min_rate);
  }
  if (filters.max_rate) {
    query = query.lte('rate', filters.max_rate);
  }
  if (filters.skills && filters.skills.length > 0) {
    query = query.contains('skills', filters.skills);
  }

  return await query.order('created_at', { ascending: false });
};

export const updateGig = async (gigId, updates) => {
  return await supabase
    .from('gigs')
    .update(updates)
    .eq('id', gigId);
};

export const deleteGig = async (gigId) => {
  return await supabase
    .from('gigs')
    .delete()
    .eq('id', gigId);
};

// Application functions
export const applyToGig = async (applicationData) => {
  return await supabase
    .from('applications')
    .insert([applicationData]);
};

export const getApplications = async (gigId) => {
  return await supabase
    .from('applications')
    .select('*, profiles(*)')
    .eq('gig_id', gigId);
};

export const updateApplication = async (applicationId, updates) => {
  return await supabase
    .from('applications')
    .update(updates)
    .eq('id', applicationId);
}; 