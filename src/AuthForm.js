import React, { useState } from 'react';
import { signUp, signIn } from './supabase';
import './AuthForm.css';

const AuthForm = ({ type: initialType, onClose, onSuccess }) => {
  const [type, setType] = useState(initialType);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (type === 'signup') {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        // Validate password strength
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const { data, error } = await signUp(formData.email, formData.password);
        if (error) throw error;
        
        onSuccess(data);
        setError('Check your email to confirm your account!');
      } else {
        const { data, error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        onSuccess(data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleType = () => {
    setType(type === 'login' ? 'signup' : 'login');
    setError(null);
  };

  return (
    <div className="auth-form-container">
      <button className="close-button" onClick={onClose}>&times;</button>
      
      <h2>{type === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
      <p className="auth-subtitle">
        {type === 'signup' 
          ? 'Join PulseHustle to start posting and finding gigs'
          : 'Log in to access your account'}
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        {type === 'signup' && (
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={type === 'signup' ? 'Create a password' : 'Enter your password'}
            required
          />
        </div>

        {type === 'signup' && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading 
            ? 'Loading...' 
            : type === 'signup' 
              ? 'Create Account' 
              : 'Log In'}
        </button>
      </form>

      <div className="auth-footer">
        {type === 'login' ? (
          <p>
            Don't have an account?{' '}
            <button className="toggle-button" onClick={toggleType}>
              Sign Up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button className="toggle-button" onClick={toggleType}>
              Log In
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm; 