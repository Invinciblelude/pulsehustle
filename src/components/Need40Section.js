import React, { useState } from 'react';
import './Need40Section.css';

const Need40Section = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGive40Click = () => {
    setIsLoading(true);
    // Direct PayPal.me link for $40
    window.location.href = 'https://www.paypal.com/paypalme/invinciblelude/40';
  };

  const handlePayPalClick = () => {
    setIsLoading(true);
    // General PayPal.me link
    window.location.href = 'https://www.paypal.com/paypalme/invinciblelude';
  };

  const handleXShare = () => {
    const text = "Join me in supporting PulseHustle - where talent meets opportunity! 🚀 #PulseHustle #Gigs #Need40";
    const url = "https://pulsehustle.com";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <section className="need40-section">
      <div className="need40-header">
        <h1>Need40</h1>
        <p className="purpose-line">
          Empowering the Future of Work Through AI-Driven Opportunities
        </p>
        <div className="stats-banner">
          <span>$40 Goal</span>
          <span>24/7 Support</span>
          <span>100% Secure</span>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="give40-button" 
          onClick={handleGive40Click}
          disabled={isLoading}
        >
          {isLoading ? 'Redirecting...' : 'Give $40'}
          <span className="button-detail">Direct Support</span>
        </button>
        <button 
          className="paypal-button" 
          onClick={handlePayPalClick}
          disabled={isLoading}
        >
          {isLoading ? 'Redirecting...' : 'PayPal'}
          <span className="button-detail">Custom Amount</span>
        </button>
        <button className="x-share-button" onClick={handleXShare}>
          Share on X
          <span className="button-detail">Spread the Word</span>
        </button>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>AI-Powered Matching</h3>
          <p>Advanced algorithms connect talent with perfect opportunities</p>
        </div>
        <div className="feature-card">
          <h3>Community Voting</h3>
          <p>Shape the future of work with your voice and earn rewards</p>
        </div>
        <div className="feature-card">
          <h3>Premium Gigs</h3>
          <p>Access high-paying opportunities vetted by our community</p>
        </div>
      </div>

      <div className="contact-section">
        <h3>Ready to Transform Your Career?</h3>
        <p>Join our community of forward-thinking professionals</p>
        <div className="contact-buttons">
          <button 
            className="post-button" 
            onClick={() => {
              const element = document.querySelector('.post-gig-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Post a Gig
          </button>
          <button 
            className="earn-button"
            onClick={() => {
              const element = document.querySelector('.gigs-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Earning
          </button>
        </div>
      </div>
    </section>
  );
};

export default Need40Section; 