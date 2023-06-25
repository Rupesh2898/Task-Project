const handler = require("./handler");
const schema = require("./schema");

async function login(server) {
  server.route({
    method: "POST",
    url: "/login",
    schema: schema.loginValidation.schema,
    handler: async function (req, res) {
      return await handler.loginValidation(server, req, res);
    },
  });
}

module.exports = login;
