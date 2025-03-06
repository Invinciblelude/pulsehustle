import React, { useState } from 'react';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  signInWithGitHub, 
  signInWithX 
} from '../api/services/authService';

const AuthComponent = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = isLogin 
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);

      if (response.error) {
        setError(response.error);
      } else if (response.success) {
        // Call the success callback if provided
        if (onAuthSuccess) {
          onAuthSuccess(response.data);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setError('');
    setLoading(true);

    try {
      let response;
      
      switch(provider) {
        case 'google':
          response = await signInWithGoogle();
          break;
        case 'github':
          response = await signInWithGitHub();
          break;
        case 'twitter':
          response = await signInWithX();
          break;
        default:
          throw new Error('Invalid provider');
      }

      if (response.error) {
        setError(response.error);
      }
      // Note: For OAuth providers, the success callback will be handled by
      // the auth state change listener in the parent component
    } catch (error) {
      setError('An unexpected error occurred with social sign-in');
      console.error('Social auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleEmailAuth}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button primary-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>OR</span>
        </div>
        
        <div className="social-auth-buttons">
          <button 
            className="social-button google-button"
            onClick={() => handleSocialAuth('google')}
            disabled={loading}
          >
            <img 
              src="/assets/google-icon.png" 
              alt="Google logo" 
              className="social-icon" 
            />
            {isLogin ? 'Log in with Google' : 'Sign up with Google'}
          </button>
          
          <button 
            className="social-button github-button"
            onClick={() => handleSocialAuth('github')}
            disabled={loading}
          >
            <img 
              src="/assets/github-icon.png" 
              alt="GitHub logo" 
              className="social-icon" 
            />
            {isLogin ? 'Log in with GitHub' : 'Sign up with GitHub'}
          </button>
          
          <button 
            className="social-button twitter-button"
            onClick={() => handleSocialAuth('twitter')}
            disabled={loading}
          >
            <img 
              src="/assets/twitter-icon.png" 
              alt="X (Twitter) logo" 
              className="social-icon" 
            />
            {isLogin ? 'Log in with X' : 'Sign up with X'}
          </button>
        </div>
        
        <div className="auth-switch">
          <button 
            className="switch-button"
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
          >
            {isLogin 
              ? "Don't have an account? Sign Up" 
              : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent; 