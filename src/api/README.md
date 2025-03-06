# PulseHustle Backend API

This directory contains the backend API services for the PulseHustle application.

## Architecture

The API is structured using a service-oriented architecture with the following components:

### API Entry Point (index.js)

The `index.js` file provides a unified interface to all backend services. It exports the following objects:
- `Payments`: Payment-related operations
- `Gigs`: Gig-related operations
- `AiMatching`: AI matching operations
- `DB`: Database utilities
- `Models`: Database models

### Services

Service files contain business logic organized by domain:
- `paymentService.js`: Payment processing and management
- `gigService.js`: Gig creation, retrieval, and management
- `aiMatchingService.js`: AI-based matching between gigs and users

### Models

Database models define the structure of data:
- `dbModels.js`: Defines models for profiles, gigs, payments, applications, audit logs, and AI matching

### Utilities

Utility functions for common operations:
- `dbUtils.js`: Transaction management, error handling, and logging for database operations

## Database Design

The application uses Supabase as the backend database. Key tables include:

- `profiles`: User profile information
- `gigs`: Available work opportunities 
- `payments`: Payment records
- `applications`: User applications to gigs
- `audit_logs`: System audit logs
- `ai_matching_jobs`: Records of AI-based matching operations

## Usage

Import the API from the entry point:

```javascript
import { Payments, Gigs, AiMatching } from '../api';

// Create a gig
const createGig = async (gigData) => {
  const result = await Gigs.create(gigData, userId);
  if (result.success) {
    // Handle success
  }
};

// Process a payment
const processPayment = async (amount, description) => {
  const result = await Payments.processPayPal(amount, description, redirectUrl);
  if (result.success) {
    // Handle success
  }
};

// Get AI matches for a gig
const getMatches = async (gigId) => {
  const result = await AiMatching.getMatches(gigId);
  if (result.success) {
    // Handle success
  }
};
```

## Deprecated Functionality

The original `paymentAPI.js` file is now deprecated. It forwards all requests to the new service layer for backward compatibility. New code should use the centralized API from `index.js`. 