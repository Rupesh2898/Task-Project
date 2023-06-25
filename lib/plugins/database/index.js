const fp = require("fastify-plugin");

// database connection cofiguration
async function databaseConnection(server) {
  server.register(require("@fastify/mysql"), {
    promise: true,
    waitForConnections: true,
    connectionLimit: server.config.env.DATABASE_CONNECTION_LIMIT,
    host: server.config.env.DATABASE_HOST,
    port: server.config.env.DATABASE_PORT,
    user: server.config.env.DATABASE_USER,
    password: server.config.env.DATABASE_PASSWORD,
    database: server.config.env.DATABASE_NAME,
  });
}

module.exports = fp(databaseConnection);
