const envSchema = require("env-schema");
const S = require("fluent-json-schema");

// env configuration
const env = envSchema({
  dotenv: true,
  schema: S.object()
    .prop("API_PORT", S.number().default(5000).required())
    .prop("ENABLE_REQUEST_LOGGING", S.boolean().default(false).required())
    .prop(
      "LOG_LEVEL",
      S.string()
        .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
        .default("info")
        .required()
    )
    .prop(
      "NODE_ENV",
      S.string()
        .enum(["development", "production"])
        .default("development")
        .required()
    )
    .prop("DATABASE_CONNECTION_LIMIT", S.number().default(1000).required())
    .prop("DATABASE_HOST", S.string().required())
    .prop("DATABASE_PORT", S.string().required())
    .prop("DATABASE_USER", S.string().required())
    .prop("DATABASE_PASSWORD", S.string().required())
    .prop("DATABASE_NAME", S.string().required())
    .prop("JWT_SECRET", S.string().required())
    .prop("SALT_INFO", S.number().default(10).required())
    .prop("SUPER_ADMIN_EMAIL", S.string().required())
    .prop("SUPER_ADMIN_PASSWORD", S.string().required())
    .prop("SUPER_ADMIN_NAME", S.string().required())
    .prop("CRON_STATUS", S.boolean().default(false).required()),
});

// fastify configuration
const fastifyConfig = {
  NODE_ENV: env.NODE_ENV,
  fastify: {
    host: "0.0.0.0",
    port: env.API_PORT,
  },

  fastifyInit: {
    enableRequestLogging: env.ENABLE_REQUEST_LOGGING,
    disableRequestLogging: true,
    connectionTimeout: 300000,
    logger: {
      level: env.LOG_LEVEL,
    },
  },
};

module.exports = { fastifyConfig, env };
