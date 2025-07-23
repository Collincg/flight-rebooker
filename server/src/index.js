const app = require('./app');
const config = require('./config');

const startServer = async () => {
  try {
    const server = app.listen(config.PORT, '0.0.0.0', () => {
      console.log(`🚀 Flight Rebooking API running on port ${config.PORT}`);
      console.log(`📍 Environment: ${config.NODE_ENV}`);
      console.log(`🌐 Local: http://localhost:${config.PORT}`);
      
      if (config.NODE_ENV === 'development') {
        console.log(`🔗 Health check: http://localhost:${config.PORT}/`);
      }
    });

    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Process terminated');
      });
    });

    process.on('SIGINT', () => {
      console.log('🛑 SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Process terminated');
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();