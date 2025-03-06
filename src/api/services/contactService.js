/**
 * Contact service for the PulseHustle application
 * Handles contact form submissions and messaging
 */

import { supabase } from '../../supabase';
import { executeDbOperation, logDbOperation } from '../utils/dbUtils';

/**
 * Queue a contact message
 * 
 * @param {Object} contactData - Contact message data
 * @param {string} contactData.email - Email address
 * @param {string} contactData.name - Name of the sender
 * @param {string} contactData.message - Message content
 * @returns {Promise<Object>} - Result of the operation
 */
export const queueContactMessage = async (contactData) => {
  try {
    // Validate input
    if (!contactData.email) {
      throw new Error('Email is required');
    }
    
    // Log the operation
    await logDbOperation('queue_contact', 'contact_messages', { 
      email: contactData.email 
    });
    
    // Insert contact message
    const { data, error } = await executeDbOperation(async () => {
      return await supabase
        .from('contact_messages')
        .insert({
          email: contactData.email,
          name: contactData.name || '',
          message: contactData.message || '',
          status: 'queued',
          created_at: new Date().toISOString()
        })
        .select();
    });
    
    if (error) throw error;
    
    // In a real implementation, you might trigger a notification or email here
    
    return {
      success: true,
      message: 'Contact message queued successfully',
      data: data[0]
    };
  } catch (error) {
    console.error('Error queueing contact message:', error);
    
    // Record error
    await executeDbOperation(async () => {
      await supabase.from('errors').insert({
        message: `Contact queue error: ${error.message}`,
        stack: error.stack,
        context: { email: contactData?.email },
        created_at: new Date().toISOString()
      });
    });
    
    return { 
      success: false, 
      error: error.message || 'Error queueing contact message' 
    };
  }
};

/**
 * Get unprocessed contact messages
 * 
 * @returns {Promise<Object>} - Result of the operation
 */
export const getUnprocessedMessages = async () => {
  try {
    // Log the operation
    await logDbOperation('get_messages', 'contact_messages', {});
    
    // Get unprocessed messages
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error getting unprocessed messages:', error);
    
    // Record error
    await executeDbOperation(async () => {
      await supabase.from('errors').insert({
        message: `Message retrieval error: ${error.message}`,
        stack: error.stack,
        context: {},
        created_at: new Date().toISOString()
      });
    });
    
    return { 
      success: false, 
      error: error.message || 'Error getting unprocessed messages' 
    };
  }
};

/**
 * Mark a contact message as processed
 * 
 * @param {string} messageId - ID of the message to mark as processed
 * @returns {Promise<Object>} - Result of the operation
 */
export const markMessageProcessed = async (messageId) => {
  try {
    // Log the operation
    await logDbOperation('mark_processed', 'contact_messages', { messageId });
    
    // Update message status
    const { error } = await executeDbOperation(async () => {
      return await supabase
        .from('contact_messages')
        .update({
          status: 'processed',
          processed_at: new Date().toISOString()
        })
        .eq('id', messageId);
    });
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Contact message marked as processed'
    };
  } catch (error) {
    console.error('Error marking message as processed:', error);
    
    // Record error
    await executeDbOperation(async () => {
      await supabase.from('errors').insert({
        message: `Message processing error: ${error.message}`,
        stack: error.stack,
        context: { messageId },
        created_at: new Date().toISOString()
      });
    });
    
    return { 
      success: false, 
      error: error.message || 'Error marking message as processed' 
    };
  }
}; 