const fp = require("fastify-plugin");

async function jwt(server, options) {
  async function authenticate(request, reply, done) {
    try {
      // check authorization exists in header or not
      if (!request.headers.authorization) {
        reply.statusCode = 401;
        return reply.send({
          status: false,
          code: 401,
          message: "Unauthorised Access",
        });
      } else {
        // Bearer token authorization
        const bearerToken = request.headers.authorization.split(" ");
        if (bearerToken[0] != "Bearer") {
          reply.statusCode = 401;
          return reply.send({
            status: false,
            code: 401,
            message: "Unauthorised Access",
          });
        }

        // verify token
        try {
          await server.jwt.verify(bearerToken[1]);
        } catch (error) {
          reply.statusCode = 401;
          return reply.send({
            status: false,
            code: 401,
            message:
              error.code === "FAST_JWT_EXPIRED"
                ? "Session Expired Login Again."
                : "Unauthorised Access",
          });
        }

        // decode token
        const payload = await server.jwt.decode(bearerToken[1]);
        request.user = {};
        request.user.id = payload.id;
        request.user.name = payload.name;
        request.user.role = payload.role;

        if (request.url.length > 300) {
          reply.statusCode = 400;
          return reply.send({
            status: false,
            code: 400,
            message: "Bad Request",
          });
        }
      }
    } catch (error) {
      console.log(error);
      reply.statusCode = 401;
      return reply.send({
        status: false,
        code: 401,
        message: "Unauthorised Access",
      });
    }
  }
  server.decorate("authenticate", authenticate);
}

module.exports = fp(jwt);
