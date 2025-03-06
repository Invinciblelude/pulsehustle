import { createClient } from '@supabase/supabase-js';

// Use environment variables and strip any quotes
let supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
let supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Strip quotes if present
if (supabaseUrl) {
  supabaseUrl = supabaseUrl.replace(/^['"](.*)['"]$/, '$1');
}
if (supabaseAnonKey) {
  supabaseAnonKey = supabaseAnonKey.replace(/^['"](.*)['"]$/, '$1');
}

let supabase;

// Check if environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Falling back to hardcoded values.');
  // Fallback to hardcoded values (for development only)
  const fallbackUrl = 'https://ztskirwngauupmszsrjm.supabase.co';
  const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0c2tpcnduZ2F1dXBtc3pzcmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNzA2ODcsImV4cCI6MjA1Njc0NjY4N30.yFrlG9P1ym-azn-gVwlwtKMMckP5jeQSCxcRz9woC9E';
  
  // Create a single supabase client for interacting with your database
  supabase = createClient(fallbackUrl, fallbackKey);
} else {
  // Create a single supabase client for interacting with your database
  console.log('Using environment variables for Supabase connection');
  console.log('URL:', supabaseUrl);
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Optional helper functions
export const signUp = async (email, password) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export { supabase };
export default supabase;

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