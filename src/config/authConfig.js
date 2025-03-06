/**
 * Authentication Configuration
 * Centralized auth settings for the application
 */

// Get deployment URL from environment or fall back to localhost
const appUrl = process.env.REACT_APP_APP_URL || window.location.origin;
const appName = process.env.REACT_APP_WEBSITE_NAME || 'PulseHustle';

// OAuth Providers configuration
export const oauthProviders = {
  google: {
    name: 'Google',
    scopes: 'email profile',
    /* 
     * Additional Google-specific options can be added here,
     * such as prompt: 'select_account' to always show the account selector
     */
  },
  x: {
    name: 'X',
    scopes: 'user:email',
  },
  github: {
    name: 'GitHub',
    scopes: 'user:email',
  },
  facebook: {
    name: 'Facebook',
    scopes: 'email,public_profile',
    /* 
     * Additional Facebook-specific options can be added here,
     * such as profileFields: ['id', 'email', 'name', 'picture']
     */
  },
  // You can add more providers here like LinkedIn, etc.
};

// Auth callback configuration
export const authCallbackConfig = {
  // Default redirect after successful authentication
  defaultRedirectPath: '/dashboard',
  
  // Path for OAuth callback handling
  callbackPath: '/auth/callback',
  
  // Get the full callback URL based on current origin or environment variable
  getCallbackUrl: () => `${appUrl}/auth/callback`,
};

// Session configuration
export const sessionConfig = {
  // How long to persist the session in local storage (in seconds)
  persistSessionFor: 24 * 60 * 60, // 24 hours by default
  
  // Whether to autoRefresh the session
  autoRefreshSession: true,
};

// Social Share default configuration
export const socialShareConfig = {
  defaultHashtags: 'PulseHustle,Freelance,GigEconomy',
  defaultVia: 'PulseHustle',
  
  // Default messages for different content types
  shareMessages: {
    gig: 'Check out this gig on PulseHustle! 💼',
    profile: 'Connect with me on PulseHustle! 👋',
    success: 'I just completed a gig on PulseHustle! 🎉',
  }
};

/**
 * Get app branding information for auth providers
 * Used by some providers that request app information
 */
export const getAppBranding = () => ({
  name: appName,
  logoUrl: `${appUrl}/logo.png`,
  websiteUrl: appUrl,
  privacyPolicyUrl: `${appUrl}/privacy`,
  termsOfServiceUrl: `${appUrl}/terms`,
});

export default {
  oauthProviders,
  authCallbackConfig,
  sessionConfig,
  socialShareConfig,
  getAppBranding,
}; 