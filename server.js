require('dotenv').config();

const createApp = require('./src/config/app');
const { testConnection, closeConnection } = require('./src/config/database');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create Express app
const app = createApp();

// Graceful shutdown handler
const gracefulShutdown = () => {
  console.log('\n🔄 Received shutdown signal. Closing server gracefully...');
  
  server.close(async () => {
    console.log('🛑 HTTP server closed');
    
    // Close database connection
    await closeConnection();
    
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.log('⏰ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`
🚀 CalmApp API Server is running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Environment: ${NODE_ENV}
🌐 Server: http://localhost:${PORT}
🏥 Health Check: http://localhost:${PORT}/health
📚 API Base: http://localhost:${PORT}/api/v1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    // Global exception handlers
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    global.server = server;
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 