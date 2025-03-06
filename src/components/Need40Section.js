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
    const text = "Join the $1M labor movement! 🚀 Post $600 gigs, workers earn $480, platform fee $120. Powered by Grok AI! #PulseHustle #Need40 #FutureOfWork";
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
        <h1>Need40: $1M Labor Movement</h1>
        <p className="purpose-line">
          Post $600 Gigs → Workers Earn $480 → Platform Fee $120
          <br />
          <span className="highlight">Real-time AI matching powered by Grok</span>
        </p>
        <div className="stats-banner">
          <span>
            <strong>$62K</strong>
            Year One Goal
          </span>
          <span>
            <strong>$1M</strong>
            Labor Impact
          </span>
          <span>
            <strong>50%</strong>
            Success Rate
          </span>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="give40-button" 
          onClick={handleGive40Click}
          disabled={isLoading}
        >
          {isLoading ? 'Redirecting...' : 'Give40: Earn $480'}
          <span className="button-detail">$480 for 40 hours—50% jobless rate</span>
        </button>
        <button 
          className="paypal-button" 
          onClick={handlePayPalClick}
          disabled={isLoading}
        >
          {isLoading ? 'Redirecting...' : 'Pay $600'}
          <span className="button-detail">$480 to worker, $120 platform fee</span>
        </button>
        <button className="x-share-button" onClick={handleXShare}>
          Share Movement
          <span className="button-detail">Help spread $1M labor opportunity</span>
        </button>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>Grok AI Integration</h3>
          <p>Real-time matching algorithm connects talent to $600 opportunities within seconds</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🗳️</div>
          <h3>Democratic Platform</h3>
          <p>Vote on platform decisions and earn rewards—your voice shapes our future</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Latest: $600 NYC Gig</h3>
          <p>40 hours, $480 earnings—join the 20% of successful posters</p>
        </div>
      </div>

      <div className="contact-section">
        <div className="realtime-badge">
          <span className="pulse"></span>
          Live Opportunities
        </div>
        <h3>Ready to Join the Movement?</h3>
        <p>Be part of the $1M labor revolution—Post or earn from $600 gigs</p>
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
            Earn $480 Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Need40Section; 