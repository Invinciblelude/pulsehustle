# PulseHustle Backend API

This directory contains the backend API services for the PulseHustle application.

## Architecture

The API is structured using a service-oriented architecture with the following components:

### API Entry Point (index.js)

The `index.js` file provides a unified interface to all backend services. It exports the following objects:
- `Payments`: Payment-related operations
- `Gigs`: Gig-related operations
- `AiMatching`: AI matching operations
- `Grok`: Grok AI pricing and integration
- `Stats`: Platform statistics
- `Contact`: Contact form management
- `DB`: Database utilities
- `Models`: Database models

### API Routes (routes.js)

The `routes.js` file provides Express API routes that expose our services:

| Method | Route | Description | Auth Required |
|--------|-------|-------------|--------------|
| POST | /api/gigs | Create a new gig | Yes |
| GET | /api/gigs | Get all gigs with filters | No |
| GET | /api/gigs/:id | Get a specific gig | No |
| PUT | /api/gigs/:id | Update a gig | Yes |
| PATCH | /api/gigs/:id/status | Change gig status | Yes |
| POST | /api/pay | Process a gig payment | Yes |
| POST | /api/payments/paypal | Process a PayPal payment | No |
| GET | /api/payments/history | Get payment history | Yes |
| POST | /api/price | Calculate price with Grok AI | No |
| POST | /api/ping | Send gig to Give40 | Yes |
| GET | /api/gigs/:id/matches | Get AI matches for a gig | Yes |
| GET | /api/stats | Get platform statistics | No |
| POST | /api/contact | Submit a contact message | No |
| GET | /api/admin/messages | Get unprocessed contact messages | Yes |
| POST | /api/admin/messages/:id/process | Mark a message as processed | Yes |

### Services

Service files contain business logic organized by domain:
- `paymentService.js`: Payment processing and management
- `gigService.js`: Gig creation, retrieval, and management
- `aiMatchingService.js`: AI-based matching between gigs and users
- `grokService.js`: Integration with Grok AI for pricing
- `statsService.js`: Platform statistics and projections
- `contactService.js`: Contact form submissions and messaging

### Models

Database models define the structure of data:
- `dbModels.js`: Defines models for profiles, gigs, payments, applications, audit logs, AI matching, errors, stats, and contact messages

### Utilities

Utility functions for common operations:
- `dbUtils.js`: Transaction management, error handling, and logging for database operations

## Database Design

The application uses Supabase as the backend database. Key tables include:

- `profiles`: User profile information
- `gigs`: Available work opportunities with the following fields:
  - `id`: UUID (auto-generated)
  - `hours`: Number of hours (typically 40)
  - `pay`: Payment amount (default $600)
  - `location`: Physical location or 'remote'
  - `status`: Status of the gig ('posted', 'processing', 'paid', 'completed', 'cancelled')
  - `created_at`: Timestamp when created
- `payments`: Payment records
- `applications`: User applications to gigs
- `audit_logs`: System audit logs
- `ai_matching_jobs`: Records of AI-based matching operations
- `errors`: Error tracking
- `stats`: Platform statistics
- `contact_messages`: Contact form submissions

## Security

- API security uses service keys for protected endpoints
- Permissions are checked for all operations that modify data
- Input validation is performed on all services
- Error logging and auditing for all operations

## Grok AI Integration

The platform integrates with Grok 3 AI for:

1. **Pricing Calculation**: Calculate fair pricing for gigs based on hours
   - Input: Hours (default 40)
   - Output: Price range ($15-$25/hour, typically $600)

2. **Give40 Integration**: Sending gigs to the Give40 platform
   - Sends worker payment ($570) to CashNowZap.com
   - Receives confirmation from Grok AI

## Statistics

The platform tracks key metrics:
- Jobs created (weekly goal: 10)
- Annual projection (520 jobs/year)
- Total earnings
- Worker earnings (95% of total)
- Platform fees (5% of total)

## Usage

Import the API from the entry point:

```javascript
import { Payments, Gigs, AiMatching, Grok, Stats, Contact } from '../api';

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

// Calculate price with Grok AI
const calculatePrice = async (hours) => {
  const result = await Grok.calculatePrice(hours);
  if (result.success) {
    // Use pricing data: result.data.total_price, result.data.worker_price
  }
};

// Get platform statistics
const getStats = async () => {
  const result = await Stats.getPlatformStats();
  if (result.success) {
    // Use stats: result.data.jobs_created, result.data.worker_earnings
  }
};
```

## Deprecated Functionality

The original `paymentAPI.js` file is now deprecated. It forwards all requests to the new service layer for backward compatibility. New code should use the centralized API from `index.js`. 