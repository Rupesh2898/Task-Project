const fp = require("fastify-plugin");
const autoLoad = require("@fastify/autoload");
const { join } = require("path");
const jwt = require("./authentication/index");
const userAuthorization = require("./authorization/index");
const database = require("./database/index");

async function plugin(server, config) {
  // on request log
  server.addHook("onRequest", async (req) => {
    if (config.fastifyConfig.fastifyInit.enableRequestLogging)
      req.log.info({ req }, "incoming request");
  });

  // on response log
  server.addHook("onResponse", async (req, res) => {
    if (config.fastifyConfig.fastifyInit.enableRequestLogging)
      req.log.info({ req, res }, "request completed");
  });

  // default response structure
  server.decorate("requestResponse", {
    success: (data) => {
      try {
        return {
          status: data.status
            ? typeof data.status === "boolean"
              ? data.status
              : true
            : true,
          statusCode: data.code
            ? typeof data.code === "number"
              ? data.code
              : 200
            : 200,
          message: data.message || "Successful",
          resources: { data: data.data } || {},
        };
      } catch (error) {
        console.log("plugin ~ requestResponse ~ success ~ error:", error);
        throw new Error(error);
      }
    },
    error: (data) => {
      try {
        return {
          status: data.status
            ? typeof data.status === "boolean"
              ? data.status
              : false
            : false,
          statusCode: data.code
            ? typeof data.code === "number"
              ? data.code
              : 500
            : 500,
          message: data.message || "Oops Something Went Wrong.......",
        };
      } catch (error) {
        console.log("plugin ~ requestResponse ~ error ~ error:", error);
        throw new Error(error);
      }
    },
  });

  // env file configuration
  server.decorate("config", {
    env: config.envConfig,
  });

  // jwt authentication
  server.register(jwt);
  server.register(userAuthorization);

  // database connection
  server.register(database);

  // register all routes
  server.register(autoLoad, {
    dir: join(__dirname, "../routes"),
    dirNameRoutePrefix: false,
    options: { prefix: "/api/v1" },
  });
}

module.exports = fp(plugin);
