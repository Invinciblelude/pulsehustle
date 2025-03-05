import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const TestConnection = () => {
  const [status, setStatus] = useState('Testing connection...');

  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase
          .from('profiles')
          .select('count')
          .single();
        
        if (error) {
          throw error;
        }
        
        setStatus('✅ Connection successful! Database is ready.');
      } catch (error) {
        console.error('Error:', error);
        setStatus('❌ Connection failed. Check console for details.');
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      borderRadius: '8px',
      backgroundColor: status.includes('✅') ? '#e6ffe6' : '#ffe6e6',
      border: '1px solid ' + (status.includes('✅') ? '#00cc00' : '#ff0000')
    }}>
      <h3>Supabase Connection Test</h3>
      <p>{status}</p>
    </div>
  );
};

export default TestConnection; 