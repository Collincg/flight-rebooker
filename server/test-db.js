const { Pool } = require('pg');

// URL encode the password: j&ct2AnK!q5?%Tp becomes j%26ct2AnK!q5?%25Tp
const encodedUrl = 'postgresql://postgres.jmkopacozxlscotgnmfz:j%26ct2AnK!q5%3F%25Tp@aws-0-us-east-2.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString: encodedUrl,
  ssl: { rejectUnauthorized: false },
  max: 1,
  connectionTimeoutMillis: 5000,
});

console.log('Testing database connection...');

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
  } else {
    console.log('✅ Connection successful!');
    client.query('SELECT NOW()', (err, result) => {
      release();
      if (err) {
        console.error('❌ Query failed:', err.message);
      } else {
        console.log('✅ Query successful:', result.rows[0]);
      }
      process.exit(0);
    });
  }
});