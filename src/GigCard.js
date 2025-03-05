import React from 'react';
import './GigCard.css';

const GigCard = ({ gig }) => {
  const {
    title,
    description,
    paymentType,
    rate,
    hours,
    skills,
    location,
    postedDate
  } = gig;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="gig-card">
      <div className="gig-card-header">
        <h3>{title}</h3>
        <span className="gig-rate">
          {paymentType === 'hourly' ? `$${rate}/hr` : `$${rate}`}
        </span>
      </div>
      
      <p className="gig-description">{description}</p>
      
      <div className="gig-details">
        <div className="gig-detail">
          <i className="far fa-clock"></i>
          <span>{hours} hours</span>
        </div>
        <div className="gig-detail">
          <i className="fas fa-map-marker-alt"></i>
          <span>{location}</span>
        </div>
        <div className="gig-detail">
          <i className="far fa-calendar-alt"></i>
          <span>{formatDate(postedDate)}</span>
        </div>
      </div>

      <div className="gig-skills">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>

      <div className="gig-card-footer">
        <button className="apply-btn">Apply Now</button>
        <button className="save-btn">
          <i className="far fa-bookmark"></i>
        </button>
      </div>
    </div>
  );
};

export default GigCard; 