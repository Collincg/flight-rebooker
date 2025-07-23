const { Pool } = require('pg');

const config = {
  development: {
    connectionString: process.env.DATABASE_URL_DEV || process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false,
    // Disable prepared statements for Supabase transaction pooler
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  production: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    // Disable prepared statements for Supabase transaction pooler
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  test: {
    connectionString: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
    ssl: false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
};

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

if (!dbConfig.connectionString) {
  throw new Error(`Missing DATABASE_URL for environment: ${environment}`);
}

const pool = new Pool(dbConfig);

pool.on('connect', () => {
  console.log(`📊 Database connected successfully in ${environment} mode`);
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
  process.exit(-1);
});

module.exports = pool;