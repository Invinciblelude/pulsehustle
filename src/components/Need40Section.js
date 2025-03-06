import React, { useState } from 'react';
import './Need40Section.css';

const Need40Section = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGive40Click = () => {
    setIsLoading(true);
    window.location.href = 'https://www.paypal.com/paypalme/invinciblelude/40';
  };

  const handlePayPalClick = () => {
    setIsLoading(true);
    window.location.href = 'https://www.paypal.com/paypalme/invinciblelude';
  };

  const handleXShare = () => {
    const text = "Join the fair work movement! 🚀 Post $600 gigs, workers earn $540 (90%), platform fee just $60 (10%). Powered by Grok AI! #PulseHustle #Need40 #FairWork";
    const url = "https://pulsehustle.com";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <section className="need40-section">
      <div className="ai-badge">
        Powered by Grok AI
        <span className="pulse"></span>
      </div>

      <div className="need40-header">
        <h1>Need40: Fair Work Platform</h1>
        <p className="purpose-line">
          Post $600 Gigs → Workers Earn $540 (90%) → Just $60 Fee (10%)
          <br />
          <span className="highlight">Real-time AI matching powered by Grok</span>
        </p>
        <div className="stats-banner">
          <span>
            <strong>$31K</strong>
            Year One Goal
          </span>
          <span>
            <strong>$540</strong>
            Worker Earnings
          </span>
          <span>
            <strong>10%</strong>
            Platform Fee
          </span>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="give40-button" 
          onClick={handleGive40Click}
          disabled={isLoading}
        >
          {isLoading ? 'Redirecting...' : 'Give40: Support'}
          <span className="button-detail">Help create fair work opportunities</span>
        </button>
        <button 
          className="paypal-button" 
          onClick={handlePayPalClick}
          disabled={isLoading}
        >
          {isLoading ? 'Redirecting...' : 'Pay $600'}
          <span className="button-detail">$540 to worker, $60 platform fee</span>
        </button>
        <button className="x-share-button" onClick={handleXShare}>
          Share Movement
          <span className="button-detail">Help spread fair work opportunities</span>
        </button>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>Grok AI Integration</h3>
          <p>Real-time matching algorithm connects talent to $600 opportunities within seconds</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>90% Worker Share</h3>
          <p>Workers keep $540 of every $600 gig—one of the most generous platforms available</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Sustainable Growth</h3>
          <p>Just 10 gigs per week sustains the platform and covers all costs</p>
        </div>
      </div>

      <div className="contact-section">
        <div className="realtime-badge">
          <span className="pulse"></span>
          Live Opportunities
        </div>
        <h3>Ready to Join the Movement?</h3>
        <p>Be part of the fair work revolution—Post or earn from $600 gigs</p>
        <div className="contact-buttons">
          <button 
            className="post-button" 
            onClick={() => {
              const element = document.querySelector('.post-gig-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Post $600 Gig
          </button>
          <button 
            className="earn-button"
            onClick={() => {
              const element = document.querySelector('.gigs-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Earn $540 Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Need40Section; 