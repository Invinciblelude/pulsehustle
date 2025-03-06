/**
 * This file defines the data models used in the application
 * These serve as references for expected data structure and would be used
 * for validation in a larger application
 */

/**
 * User Profile Model
 */
export const PROFILE_MODEL = {
  id: 'string', // UUID from Supabase Auth
  username: 'string',
  full_name: 'string',
  bio: 'string',
  avatar_url: 'string',
  website: 'string',
  location: 'string',
  skills: 'array', // Array of strings
  hourly_rate: 'number',
  created_at: 'timestamp',
  updated_at: 'timestamp'
};

/**
 * Gig Model
 */
export const GIG_MODEL = {
  id: 'string', // UUID
  title: 'string',
  description: 'string',
  hours: 'number', // Number of hours (typically 40)
  pay: 'number', // Default: 600, total payment amount
  worker_rate: 'number', // Default: 570, payment to worker (95%)
  platform_fee: 'number', // Default: 30, platform fee (5%)
  payment_type: 'string', // 'fixed' or 'hourly'
  location: 'string', // Physical location or 'remote'
  remote: 'boolean', // Whether this is a remote gig
  user_id: 'string', // Creator of the gig
  status: 'string', // 'posted', 'processing', 'paid', 'completed', 'canceled'
  payment_id: 'string', // Reference to payment
  skills_required: 'array', // Array of required skills
  duration: 'string', // Duration of the gig (e.g., '1 week', '1 month')
  created_at: 'timestamp',
  updated_at: 'timestamp'
};

/**
 * Payment Model
 */
export const PAYMENT_MODEL = {
  id: 'string', // UUID
  amount: 'number',
  status: 'string', // 'pending', 'completed', 'failed', 'refunded'
  payment_method: 'string', // 'paypal', 'stripe', etc.
  description: 'string',
  user_id: 'string', // Who made the payment
  metadata: 'object', // Additional data
  created_at: 'timestamp',
  updated_at: 'timestamp'
};

/**
 * Application Model (for job applications)
 */
export const APPLICATION_MODEL = {
  id: 'string', // UUID
  gig_id: 'string',
  user_id: 'string',
  cover_letter: 'string',
  status: 'string', // 'submitted', 'reviewing', 'accepted', 'rejected'
  created_at: 'timestamp',
  updated_at: 'timestamp'
};

/**
 * Audit Log Model (for system auditing)
 */
export const AUDIT_LOG_MODEL = {
  id: 'string', // UUID
  operation: 'string', // 'create', 'update', 'delete'
  table_name: 'string',
  details: 'object',
  user_id: 'string',
  created_at: 'timestamp'
};

/**
 * AI Matching Job Model
 */
export const AI_MATCHING_MODEL = {
  id: 'string', // UUID
  gig_id: 'string',
  matched_profiles: 'array', // Array of profile IDs with matching scores
  matching_score: 'number',
  status: 'string', // 'pending', 'processing', 'completed'
  created_at: 'timestamp',
  completed_at: 'timestamp'
};

/**
 * Error tracking model
 */
export const ERROR_MODEL = {
  id: 'string', // UUID
  message: 'string',
  stack: 'string',
  context: 'object', // Additional context data
  created_at: 'timestamp'
};

/**
 * Stats model
 */
export const STATS_MODEL = {
  id: 'string', // UUID
  jobs_created: 'number',
  jobs_completed: 'number',
  total_earnings: 'number',
  worker_earnings: 'number',
  platform_fees: 'number',
  weekly_goal: 'number', // Default: 10
  annual_projection: 'number', // Default: 520
  updated_at: 'timestamp'
};

/**
 * Contact message model
 */
export const CONTACT_MODEL = {
  id: 'string', // UUID
  email: 'string',
  name: 'string',
  message: 'string',
  status: 'string', // 'queued', 'processed', 'failed'
  created_at: 'timestamp',
  processed_at: 'timestamp'
}; 