const schema = require("../../schema/common_schema");

const loginValidation = {
  schema: {
    tags: ["Authentication"],
    security: [
      {
        basicAuth: [],
      },
    ],
    response: {
      200: {
        description: "Default response",
        type: "object",
        properties: {
          ...schema.successSchema,
          message: {
            type: "string",
            example: "Successful",
          },
          resources: {
            type: "object",
            properties: {
              data: {
                type: "object",
                properties: {
                  id: {
                    type: "number",
                  },
                  name: {
                    type: "string",
                  },
                  role: {
                    type: "string",
                    enum: ["ADMIN", "SUPER_ADMIN", "USER"],
                  },
                  email: {
                    type: "string",
                  },
                  access_token: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      400: schema.badRequestErrorSchema,
      401: schema.unauthorizedErrorSchema,
      403: schema.forbiddenErrorSchema,
      500: schema.errorSchema,
    },
  },
};

module.exports = {
  loginValidation,
};
