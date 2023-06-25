const handler = require("./handler");
const schema = require("./schema");

async function users(server) {
  server.route({
    method: "POST",
    url: "/create-feed",
    schema: schema.createFeedValidation.schema,
    preHandler: [server.authenticate, server.createFeedAuthorization],
    handler: async function (req, res) {
      return await handler.createFeedFunction(server, req, res);
    },
  });

  server.route({
    method: "GET",
    url: "/get-feed-list",
    schema: schema.getFeedListValidation.schema,
    preHandler: server.authenticate,
    handler: async function (req, res) {
      return await handler.getFeedListFunction(server, req, res);
    },
  });

  server.route({
    method: "GET",
    url: "/get-feed-detail/:feed_id",
    schema: schema.getFeedDetailsValidation.schema,
    preHandler: server.authenticate,
    handler: async function (req, res) {
      return await handler.getFeedDetailsFunction(server, req, res);
    },
  });

  server.route({
    method: "DELETE",
    url: "/delete-feed/:feed_id",
    schema: schema.deleteFeedValidation.schema,
    preHandler: [server.authenticate, server.createUserAuthorization],
    handler: async function (req, res) {
      return await handler.deleteFeedFunction(server, req, res);
    },
  });

  server.route({
    method: "PUT",
    url: "/assign-user-to-feed/:feed_id",
    schema: schema.assignFeedtoUserValidation.schema,
    preHandler: [server.authenticate, server.createUserAuthorization],
    handler: async function (req, res) {
      return await handler.assignFeedtoUserFunction(server, req, res);
    },
  });

  server.route({
    method: "PUT",
    url: "/update-feed/:feed_id/delete-access/:user_id",
    schema: schema.assignFeeddeeteAccessValidation.schema,
    preHandler: [server.authenticate, server.createFeedAuthorization],
    handler: async function (req, res) {
      return await handler.updatefeedediteAccessFunction(server, req, res);
    },
  });
}

module.exports = users;
