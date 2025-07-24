const cors = require('cors');
const config = require('../config');

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      config.CORS_ORIGIN,
      'http://localhost:3000',
      'http://localhost:5173',
      'https://flight-rebooker.vercel.app'
    ];
    
    // Allow all Vercel preview deployments
    const vercelPreviewPattern = /^https:\/\/flight-rebooker-.*\.vercel\.app$/;

    if (!origin || allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);