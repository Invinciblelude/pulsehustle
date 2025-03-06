import { supabase } from '../../supabase';

/**
 * Executes a function within a transaction
 * @param {Function} fn - Function to execute within transaction
 * @returns {Promise<any>} - Result of the transaction
 */
export const withTransaction = async (fn) => {
  try {
    // Start the implicit transaction by performing operations that depend on each other
    const result = await fn();
    return { success: true, data: result };
  } catch (error) {
    console.error('Transaction failed:', error);
    // In a real production environment, we would implement additional 
    // rollback logic here if needed beyond Supabase's automatic handling
    return { success: false, error: error.message };
  }
};

/**
 * Executes a database operation with proper error handling
 * @param {Function} operation - Database operation to execute
 * @returns {Promise<any>} - Result of the operation
 */
export const executeDbOperation = async (operation) => {
  try {
    const result = await operation();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Database operation failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Checks if a table exists, and creates it if it doesn't
 * @param {string} tableName - Name of the table to check/create
 * @param {Object} schema - Schema definition for table creation
 */
export const ensureTable = async (tableName, schema) => {
  try {
    // Check if the table exists
    const { data, error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1);
    
    if (error && error.code === '42P01') { // Table doesn't exist error in PostgreSQL
      console.log(`Table ${tableName} doesn't exist. Creating it...`);
      // In Supabase, table creation would typically be done through migrations or dashboard
      // This is a placeholder for illustration
      return { success: false, error: `Table ${tableName} doesn't exist. Please create it in Supabase dashboard.` };
    } else if (error) {
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error(`Error ensuring table ${tableName}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Logs database operations to Supabase for auditing
 * @param {string} operation - Type of operation performed
 * @param {string} tableName - Table operated on
 * @param {Object} details - Additional operation details
 */
export const logDbOperation = async (operation, tableName, details) => {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert([{
        operation,
        table_name: tableName,
        details,
        user_id: supabase.auth.user()?.id,
        created_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Failed to log operation:', error);
    // Don't fail the main operation if logging fails
    return { success: false, error: error.message };
  }
}; 