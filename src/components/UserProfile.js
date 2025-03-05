import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import './UserProfile.css';

const UserProfile = ({ userId, isEditable = false }) => {
  const [profile, setProfile] = useState({
    fullName: '',
    title: '',
    bio: '',
    skills: [],
    hourlyRate: '',
    availability: {
      hoursPerWeek: '',
      preferredHours: [],
      timezone: '',
    },
    experience: [],
    portfolio: [],
    contactInfo: {
      email: '',
      phone: '',
      linkedin: '',
      github: '',
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(prev => ({
          ...prev,
          ...data,
          skills: data.skills || [],
          experience: data.experience || [],
          portfolio: data.portfolio || [],
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillAdd = () => {
    if (newSkill.trim()) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleExperienceAdd = () => {
    if (newExperience.title && newExperience.company) {
      setProfile(prev => ({
        ...prev,
        experience: [...prev.experience, newExperience]
      }));
      setNewExperience({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', userId);

      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <h1>{profile.fullName}</h1>
          <h2>{profile.title}</h2>
          {!isEditing ? (
            <>
              <p className="rate">Hourly Rate: ${profile.hourlyRate}/hr</p>
              <p className="availability">
                Available: {profile.availability.hoursPerWeek} hours/week
              </p>
            </>
          ) : (
            <>
              <input
                type="number"
                name="hourlyRate"
                value={profile.hourlyRate}
                onChange={handleChange}
                placeholder="Hourly Rate"
              />
              <input
                type="number"
                name="availability.hoursPerWeek"
                value={profile.availability.hoursPerWeek}
                onChange={handleChange}
                placeholder="Hours per week"
              />
            </>
          )}
        </div>
        {isEditable && (
          <button 
            className="edit-button"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        )}
      </div>

      <div className="profile-section">
        <h3>About Me</h3>
        {!isEditing ? (
          <p>{profile.bio}</p>
        ) : (
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell clients about yourself..."
            rows="4"
          />
        )}
      </div>

      <div className="profile-section">
        <h3>Skills</h3>
        <div className="skills-container">
          {profile.skills.map((skill, index) => (
            <div key={index} className="skill-tag">
              {skill}
              {isEditing && (
                <button 
                  className="remove-skill"
                  onClick={() => handleSkillRemove(skill)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <div className="add-skill">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
              />
              <button onClick={handleSkillAdd}>Add</button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-section">
        <h3>Experience</h3>
        <div className="experience-list">
          {profile.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <h4>{exp.title}</h4>
              <p className="company">{exp.company}</p>
              <p className="dates">
                {exp.startDate} - {exp.endDate || 'Present'}
              </p>
              <p className="description">{exp.description}</p>
            </div>
          ))}
          {isEditing && (
            <div className="add-experience">
              <input
                type="text"
                value={newExperience.title}
                onChange={(e) => setNewExperience(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                placeholder="Job Title"
              />
              <input
                type="text"
                value={newExperience.company}
                onChange={(e) => setNewExperience(prev => ({
                  ...prev,
                  company: e.target.value
                }))}
                placeholder="Company"
              />
              <div className="date-inputs">
                <input
                  type="date"
                  value={newExperience.startDate}
                  onChange={(e) => setNewExperience(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                />
                <input
                  type="date"
                  value={newExperience.endDate}
                  onChange={(e) => setNewExperience(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                />
              </div>
              <textarea
                value={newExperience.description}
                onChange={(e) => setNewExperience(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="Description"
                rows="3"
              />
              <button onClick={handleExperienceAdd}>Add Experience</button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-section">
        <h3>Contact Information</h3>
        {!isEditing ? (
          <div className="contact-info">
            <p>Email: {profile.contactInfo.email}</p>
            <p>Phone: {profile.contactInfo.phone}</p>
            {profile.contactInfo.linkedin && (
              <a href={profile.contactInfo.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn Profile
              </a>
            )}
            {profile.contactInfo.github && (
              <a href={profile.contactInfo.github} target="_blank" rel="noopener noreferrer">
                GitHub Profile
              </a>
            )}
          </div>
        ) : (
          <div className="contact-form">
            <input
              type="email"
              name="contactInfo.email"
              value={profile.contactInfo.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="tel"
              name="contactInfo.phone"
              value={profile.contactInfo.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
            <input
              type="url"
              name="contactInfo.linkedin"
              value={profile.contactInfo.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
            />
            <input
              type="url"
              name="contactInfo.github"
              value={profile.contactInfo.github}
              onChange={handleChange}
              placeholder="GitHub URL"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 