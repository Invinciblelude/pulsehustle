import React, { useState } from 'react';
import './SearchFilters.css';

const SearchFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    payment_type: '',
    location: '',
    min_rate: '',
    max_rate: '',
    skills: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedFilters = {
      ...filters,
      skills: filters.skills ? filters.skills.split(',').map(s => s.trim()) : [],
      min_rate: filters.min_rate ? Number(filters.min_rate) : null,
      max_rate: filters.max_rate ? Number(filters.max_rate) : null
    };
    onFilter(formattedFilters);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      payment_type: '',
      location: '',
      min_rate: '',
      max_rate: '',
      skills: ''
    });
    onFilter({});
  };

  return (
    <div className="search-filters">
      <form onSubmit={handleSubmit}>
        <div className="search-bar">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search gigs..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <select
              name="payment_type"
              value={filters.payment_type}
              onChange={handleChange}
            >
              <option value="">Payment Type</option>
              <option value="hourly">Hourly</option>
              <option value="fixed">Fixed Price</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              name="location"
              value={filters.location}
              onChange={handleChange}
            >
              <option value="">Location</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="filter-group rate-range">
            <input
              type="number"
              name="min_rate"
              value={filters.min_rate}
              onChange={handleChange}
              placeholder="Min Rate"
              min="0"
            />
            <span>-</span>
            <input
              type="number"
              name="max_rate"
              value={filters.max_rate}
              onChange={handleChange}
              placeholder="Max Rate"
              min="0"
            />
          </div>

          <div className="filter-group skills-filter">
            <input
              type="text"
              name="skills"
              value={filters.skills}
              onChange={handleChange}
              placeholder="Skills (comma separated)"
            />
          </div>

          <div className="filter-actions">
            <button type="submit" className="apply-filters">
              Apply Filters
            </button>
            <button type="button" onClick={clearFilters} className="clear-filters">
              Clear
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters; 