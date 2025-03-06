/**
 * Express API routes for the PulseHustle application
 * These can be used with a server implementation like Express
 */

import { Payments, Gigs, AiMatching, Grok, Stats, Contact } from './index';

/**
 * Initialize API routes on an Express app
 * 
 * @param {Object} app - Express app instance
 */
export const initializeRoutes = (app) => {
  // Add security middleware
  // In a production app, you would add proper authentication middleware here
  const authenticate = (req, res, next) => {
    // Simplified auth check
    // In a real app, this would validate JWT tokens, check permissions, etc.
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.SERVICE_API_KEY) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    next();
  };

  // Error handling middleware
  const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error('API Error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    });
  };

  // Gig Routes
  app.post('/api/gigs', authenticate, asyncHandler(async (req, res) => {
    const result = await Gigs.create(req.body, req.user?.id);
    res.json(result);
  }));

  app.get('/api/gigs', asyncHandler(async (req, res) => {
    const result = await Gigs.getAll(req.query);
    res.json(result);
  }));

  app.get('/api/gigs/:id', asyncHandler(async (req, res) => {
    const result = await Gigs.getById(req.params.id);
    res.json(result);
  }));

  app.put('/api/gigs/:id', authenticate, asyncHandler(async (req, res) => {
    const result = await Gigs.update(req.params.id, req.body, req.user?.id);
    res.json(result);
  }));

  app.patch('/api/gigs/:id/status', authenticate, asyncHandler(async (req, res) => {
    const result = await Gigs.changeStatus(req.params.id, req.body.status, req.user?.id);
    res.json(result);
  }));

  // Payment Routes
  app.post('/api/pay', authenticate, asyncHandler(async (req, res) => {
    const result = await Payments.processGig(req.body, req.user?.id);
    res.json(result);
  }));

  app.post('/api/payments/paypal', asyncHandler(async (req, res) => {
    const { amount, description, redirectUrl } = req.body;
    const result = await Payments.processPayPal(amount, description, redirectUrl, req.user?.id);
    res.json(result);
  }));

  app.get('/api/payments/history', authenticate, asyncHandler(async (req, res) => {
    const result = await Payments.getHistory(req.user?.id);
    res.json(result);
  }));

  // Grok AI Routes
  app.post('/api/price', asyncHandler(async (req, res) => {
    const result = await Grok.calculatePrice(req.body.hours || 40);
    res.json(result);
  }));

  app.post('/api/ping', authenticate, asyncHandler(async (req, res) => {
    const result = await Grok.pingGive40(req.body.gigId);
    res.json(result);
  }));

  // AI Matching Routes
  app.get('/api/gigs/:id/matches', authenticate, asyncHandler(async (req, res) => {
    const result = await AiMatching.getMatches(req.params.id);
    res.json(result);
  }));

  // Stats Routes
  app.get('/api/stats', asyncHandler(async (req, res) => {
    const result = await Stats.getPlatformStats();
    res.json(result);
  }));

  // Contact Routes
  app.post('/api/contact', asyncHandler(async (req, res) => {
    const result = await Contact.queueMessage(req.body);
    res.json(result);
  }));

  // Admin Routes (would typically have additional auth checks)
  app.get('/api/admin/messages', authenticate, asyncHandler(async (req, res) => {
    const result = await Contact.getUnprocessedMessages();
    res.json(result);
  }));

  app.post('/api/admin/messages/:id/process', authenticate, asyncHandler(async (req, res) => {
    const result = await Contact.markProcessed(req.params.id);
    res.json(result);
  }));
}; 