const knex = require('knex');
const knexConfig = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

// Create and export the Knex instance
const db = knex(config);

// Test database connection
const testConnection = async () => {
  try {
    await db.raw('SELECT 1 as test');
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.log(error);
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
const closeConnection = async () => {
  try {
    await db.destroy();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
  }
};

module.exports = {
  db,
  testConnection,
  closeConnection
}; 