import React, { useState, useEffect } from 'react';
import AuthForm from './AuthForm';
import GigCard from './GigCard';
import UserProfile from './components/UserProfile';
import Need40Section from './components/Need40Section';
import { supabase, getGigs, createGig, signOut } from './supabase';
import TestConnection from './components/TestConnection';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    paymentType: 'hourly',
    rate: '',
    hours: '',
    location: '',
    skills: ''
  });

  useEffect(() => {
    // Check for existing session
    const session = supabase.auth.getSession();
    setUser(session?.user || null);
    setIsAuthenticated(!!session?.user);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsAuthenticated(!!session?.user);
    });

    // Fetch gigs
    fetchGigs();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const { data, error } = await getGigs();
      if (error) throw error;
      setGigs(data || []);
    } catch (error) {
      console.error('Error fetching gigs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = (type) => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const gigData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      const { error } = await createGig(gigData);
      if (error) throw error;

      // Reset form and refresh gigs
      setFormData({
        title: '',
        description: '',
        paymentType: 'hourly',
        rate: '',
        hours: '',
        location: '',
        skills: ''
      });
      fetchGigs();
    } catch (error) {
      console.error('Error creating gig:', error.message);
    }
  };

  return (
    <div className="App">
      <TestConnection />
      <nav className="navbar">
        <div className="logo">PulseHustle</div>
        <div className="nav-links">
          <a href="#home" onClick={() => setShowProfile(false)}>Home</a>
          {isAuthenticated && (
            <a href="#profile" onClick={(e) => {
              e.preventDefault();
              setShowProfile(true);
            }}>My Profile</a>
          )}
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          {!isAuthenticated ? (
            <div className="auth-buttons">
              <button onClick={() => handleAuth('login')} className="login-btn">Login</button>
              <button onClick={() => handleAuth('signup')} className="signup-btn">Sign Up</button>
            </div>
          ) : (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          )}
        </div>
      </nav>

      {showProfile && isAuthenticated ? (
        <UserProfile userId={user.id} isEditable={true} />
      ) : (
        <>
          <div className="hero-section">
            <div className="hero-content">
              <span className="hero-tag">Next-Gen Gig Platform</span>
              <h1>PulseHustle</h1>
              <p>Connect with high-paying gigs that match your skills. Start earning $600+ today! [Test Update]</p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">$600</span>
                  <span className="stat-label">Avg. Gig Value</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24h</span>
                  <span className="stat-label">Fast Payment</span>
                </div>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Secure</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" alt="Workforce" />
              <div className="hero-image-overlay"></div>
            </div>
          </div>

          <main className="main-content">
            <Need40Section />
            
            <section className="gigs-section">
              <div className="section-header">
                <h2>Latest Gigs</h2>
                <p>Find your next opportunity from our curated list of high-quality gigs</p>
              </div>
              <div className="gigs-grid">
                {loading ? (
                  <div className="loading">Loading gigs...</div>
                ) : gigs.length > 0 ? (
                  gigs.map((gig) => (
                    <GigCard key={gig.id} gig={gig} />
                  ))
                ) : (
                  <div className="no-gigs">No gigs available yet</div>
                )}
              </div>
            </section>

            <section className="post-gig-section">
              <div className="form-container">
                <h2>Post Your Gig</h2>
                <p className="form-subtitle">Create opportunities and connect with talent</p>
                <form onSubmit={handleSubmit} className="gig-form">
                  <div className="form-group">
                    <label htmlFor="title">Gig Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Full Stack Developer Needed"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe the gig requirements and expectations"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="paymentType">Payment Type</label>
                      <select
                        id="paymentType"
                        name="paymentType"
                        value={formData.paymentType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select payment type</option>
                        <option value="hourly">Hourly Rate</option>
                        <option value="fixed">Fixed Price</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="rate">Rate ($)</label>
                      <input
                        type="number"
                        id="rate"
                        name="rate"
                        value={formData.rate}
                        onChange={handleChange}
                        placeholder="e.g., 75"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="hours">Estimated Hours</label>
                      <input
                        type="number"
                        id="hours"
                        name="hours"
                        value={formData.hours}
                        onChange={handleChange}
                        placeholder="e.g., 40"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <select
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select location type</option>
                        <option value="remote">Remote</option>
                        <option value="onsite">On-site</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="skills">Required Skills</label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                      required
                    />
                  </div>

                  <div className="form-footer">
                    <button type="submit" className="submit-button">
                      {isAuthenticated ? 'Post Gig' : 'Login to Post Gig'}
                    </button>
                    <p className="form-note">
                      By posting, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </form>
              </div>
            </section>
          </main>
        </>
      )}

      {showAuthModal && (
        <div className="auth-modal">
          <div className="auth-modal-content">
            <h2>{authType === 'login' ? 'Welcome Back!' : 'Join PulseHustle'}</h2>
            <p className="auth-subtitle">
              {authType === 'login' 
                ? 'Log in to post and manage your gigs'
                : 'Create an account to start posting gigs'}
            </p>
            <AuthForm 
              type={authType}
              onClose={() => setShowAuthModal(false)}
              onSuccess={(data) => {
                setUser(data.user);
                setIsAuthenticated(true);
                setShowAuthModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
