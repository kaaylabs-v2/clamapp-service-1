require('dotenv').config();

module.exports = {
    development: {
    client: 'mssql',
    connection: {
      server: '122.165.127.194',
      port: 27043,
      database: 'CLAMAPP_DEV',
      user: 'Clamapp-db',
      password: 'Kaay@123',
      options: {
        encrypt: false,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000
      }
    },
         pool: { 
       min: 2, 
       max: 10, 
       acquireTimeoutMillis: 60000,
       idleTimeoutMillis: 30000 
     },
    //  migrations: {
    //    directory: './src/migrations',
    //    tableName: 'knex_migrations'
    //  },
    //  seeds: {
    //    directory: './src/seeds'
    //  }
  },
  production: {
    client: 'mssql',
    connection: {
      server: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 1433,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      options: {
        encrypt: true, // Required for production
        enableArithAbort: true,
        trustServerCertificate: false
      },
      pool: {
        min: 5,
        max: 20,
        acquireTimeoutMillis: 60000,
        idleTimeoutMillis: 30000
      }
    },
    migrations: {
      directory: './src/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './src/seeds'
    }
  }
}; 