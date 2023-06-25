const fp = require("fastify-plugin");
const SQL = require("@nearform/sql");

async function userAuthorization(server) {
  async function createUserAuthorization(request, reply) {
    try {
      if (
        !request.user.role ||
        ['SUPER_ADMIN, "ADMIN'].includes(request.user.role)
      ) {
        reply.statusCode = 403;
        return reply.send({
          status: false,
          code: 403,
          message: "Access Forbidden",
        });
      }
    } catch (error) {
      console.log(error);
      reply.statusCode = 403;
      return reply.send({
        status: false,
        code: 403,
        message: "Access Forbidden",
      });
    }
  }

  async function createFeedAuthorization(request, reply) {
    try {
      if (!request.user.role || !(request.user.role === "SUPER_ADMIN")) {
        reply.statusCode = 403;
        return reply.send({
          status: false,
          code: 403,
          message: "Access Forbidden",
        });
      }
    } catch (error) {
      console.log(error);
      reply.statusCode = 403;
      return reply.send({
        status: false,
        code: 403,
        message: "Access Forbidden",
      });
    }
  }

  server.decorate("createUserAuthorization", createUserAuthorization);
  server.decorate("createFeedAuthorization", createFeedAuthorization);
}

module.exports = fp(userAuthorization);
