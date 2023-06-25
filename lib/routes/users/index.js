const handler = require("./handler");
const schema = require("./schema");

async function users(server) {
  server.route({
    method: "POST",
    url: "/create-user",
    schema: schema.createUserValidation.schema,
    preHandler: [server.authenticate, server.createUserAuthorization],
    handler: async function (req, res) {
      return await handler.createUserFunction(server, req, res);
    },
  });

  server.route({
    method: "GET",
    url: "/get-user-log",
    schema: schema.userLogValidation.schema,
    preHandler: [server.authenticate, server.createFeedAuthorization],
    handler: async function (req, res) {
      return await handler.getLogFunction(server, req, res);
    },
  });
}

module.exports = users;
