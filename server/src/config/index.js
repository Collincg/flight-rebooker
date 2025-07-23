require('dotenv').config();

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_URL_DEV: process.env.DATABASE_URL_DEV,
  DATABASE_URL_TEST: process.env.DATABASE_URL_TEST,
};

const requiredEnvVars = ['DATABASE_URL'];
const missingVars = requiredEnvVars.filter(varName => !config[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

console.log(`🚀 App starting in ${config.NODE_ENV} mode`);

module.exports = config;