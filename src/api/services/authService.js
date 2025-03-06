import { supabase } from '../../supabase';
import { oauthProviders, authCallbackConfig } from '../../config/authConfig';

/**
 * Handles user sign in with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Auth response with user data or error
 */
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error.message);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error during sign in:', error.message);
    return { error: 'An unexpected error occurred' };
  }
};

/**
 * Handles user sign up with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {Object} metadata - Additional user metadata
 * @returns {Promise<Object>} Auth response with user data or error
 */
export const signUpWithEmail = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) {
      console.error('Error signing up:', error.message);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error during sign up:', error.message);
    return { error: 'An unexpected error occurred' };
  }
};

/**
 * Handles sign in with Google
 * @returns {Promise<Object>} Auth response or error
 */
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: authCallbackConfig.getCallbackUrl(),
        scopes: oauthProviders.google.scopes
      }
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error during Google sign in:', error.message);
    return { error: 'An unexpected error occurred' };
  }
};

/**
 * Handles sign in with GitHub
 * @returns {Promise<Object>} Auth response or error
 */
export const signInWithGitHub = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: authCallbackConfig.getCallbackUrl(),
        scopes: oauthProviders.github.scopes
      }
    });

    if (error) {
      console.error('Error signing in with GitHub:', error.message);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error during GitHub sign in:', error.message);
    return { error: 'An unexpected error occurred' };
  }
};

/**
 * Handles sign in with X (Twitter)
 * @returns {Promise<Object>} Auth response or error
 */
export const signInWithX = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: authCallbackConfig.getCallbackUrl(),
        scopes: oauthProviders.x.scopes
      }
    });

    if (error) {
      console.error('Error signing in with X:', error.message);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error during X sign in:', error.message);
    return { error: 'An unexpected error occurred' };
  }
};

/**
 * Handles sign in with Facebook
 * @returns {Promise<Object>} Auth response or error
 */
export const signInWithFacebook = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: authCallbackConfig.getCallbackUrl(),
        scopes: oauthProviders.facebook.scopes
      }
    });

    if (error) {
      console.error('Error signing in with Facebook:', error.message);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error during Facebook sign in:', error.message);
    return { error: 'An unexpected error occurred' };
  }
};

/**
 * Handles user sign out
 * @returns {Promise<Object>} Success or error response
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error.message);
      return { error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Unexpected error during sign out:', error.message);
    return { error: 'An unexpected error occurred' };
  }
};

/**
 * Gets the current authenticated user
 * @returns {Object} User data or null
 */
export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

/**
 * Sets up a listener for auth state changes
 * @param {Function} callback - Function to call on auth state change
 * @returns {Object} Subscription that can be used to unsubscribe
 */
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

/**
 * Handles fetching user profile after authentication
 * @param {string} userId - User ID to fetch profile for
 * @returns {Promise<Object>} User profile or error
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error.message);
      return { error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching profile:', error.message);
    return { error: 'An unexpected error occurred' };
  }
}; 