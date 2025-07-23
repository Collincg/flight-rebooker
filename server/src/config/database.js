const { Pool } = require('pg');

// Simple configuration optimized for Supabase transaction pooler
const pool = new Pool({
  host: 'aws-0-us-east-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.jmkopacozxlscotgnmfz',
  password: 'j&ct2AnK!q5?%Tp',
  ssl: {
    rejectUnauthorized: false
  },
  // Configuration for Supabase transaction pooler
  max: 1, // Limit connections for transaction pooler
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 5000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(-1);
  } else {
    console.log(`📊 Database connected successfully to Supabase`);
    release();
  }
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err.message);
});

module.exports = pool;