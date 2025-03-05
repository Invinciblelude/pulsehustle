import React from 'react';
import './Need40Section.css';

const Need40Section = () => {
  const handleGive40Click = () => {
    // Handle Give $40 button click
    window.open('https://www.paypal.com/paypalme/invinciblelude/40', '_blank');
  };

  const handlePayPalClick = () => {
    // Handle PayPal button click
    window.open('https://www.paypal.com/paypalme/invinciblelude', '_blank');
  };

  const handleXShare = () => {
    const text = "Join me in supporting PulseHustle - where talent meets opportunity! 🚀 #PulseHustle #Gigs";
    const url = "https://pulsehustle.com";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <section className="need40-section">
      <div className="need40-header">
        <h1>Need40</h1>
        <p className="purpose-line">
          Empowering talent through AI-driven gig matching and community support
        </p>
        <div className="stats-banner">
          <span>$40 Goal</span>
          <span>24/7 Support</span>
          <span>100% Secure</span>
        </div>
      </div>

      <div className="action-buttons">
        <button className="give40-button" onClick={handleGive40Click}>
          Give $40
          <span className="button-detail">Support our mission</span>
        </button>
        <button className="paypal-button" onClick={handlePayPalClick}>
          PayPal
          <span className="button-detail">Secure payment</span>
        </button>
        <button className="x-share-button" onClick={handleXShare}>
          Share on X
          <span className="button-detail">Spread the word</span>
        </button>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>AI-Driven Matching</h3>
          <p>Our advanced AI matches your skills with the perfect gigs</p>
        </div>
        <div className="feature-card">
          <h3>Vote & Earn</h3>
          <p>Cast your vote and earn rewards while shaping our platform</p>
        </div>
        <div className="feature-card">
          <h3>Latest Gigs</h3>
          <p>Browse through our curated selection of high-paying opportunities</p>
        </div>
      </div>

      <div className="contact-section">
        <h3>Ready to start?</h3>
        <p>Join our community of talented professionals</p>
        <div className="contact-buttons">
          <button className="post-button" onClick={() => window.location.href = '#post-gig'}>
            Post a Gig
          </button>
          <button className="earn-button" onClick={() => window.location.href = '#browse-gigs'}>
            Start Earning
          </button>
        </div>
      </div>
    </section>
  );
};

export default Need40Section; 