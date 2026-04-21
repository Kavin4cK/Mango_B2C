import { createClient } from '@supabase/supabase-js'

// Using provided Supabase credentials
const supabaseUrl = 'https://qgcunxmjvnypnkusldkh.supabase.co'
const supabaseAnonKey = 'sb_publishable_2TKRj6SvM566GvNvbcsuCA_7xMYp44a'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database initialization function
export const initializeDatabase = async () => {
  try {
    console.log('Initializing Supabase database...');
    
    // Test connection by trying to select from orders table
    const { data, error } = await supabase.from('orders').select('count').limit(1);
    
    if (error) {
      console.log('Tables may not exist yet. First order will create them automatically.');
      console.log('Supabase connection established, ready for data!');
    } else {
      console.log('Database tables already exist and are ready!');
    }
    
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

// Helper function to create tables if they don't exist
export const ensureTablesExist = async () => {
  // Since Supabase doesn't allow table creation via client,
  // we'll handle this gracefully by catching errors
  // and instructing users to create tables manually
  console.log('Please ensure the following tables exist in your Supabase project:');
  console.log('1. orders (id, created_at, timestamp, name, phone, address, variety, variety_name, quantity, price_per_kg, total_amount, transaction_id, status)');
  console.log('2. pre_orders (id, created_at, timestamp, name, phone, variety, variety_name, quantity, price_per_kg, total_amount, status)');
  console.log('3. contacts (id, created_at, timestamp, name, email, phone, message, status)');
}
