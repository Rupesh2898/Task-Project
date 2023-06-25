const schema = require("../../schema/common_schema");

const createUserValidation = {
  schema: {
    tags: ["Authentication"],
    security: [
      {
        basicAuth: [],
      },
    ],
    body: {
      type: "object",
      properties: {
        name: {
          type: "string",
          minLength: 1,
          maxLength: 200,
        },
        email: {
          type: "string",
          minLength: 1,
          maxLength: 319,
        },
        role: {
          type: "string",
          enum: ["SUPER_ADMIN", "ADMIN", "USER"],
        },
        password: {
          type: "string",
          minLength: 1,
          maxLength: 100,
        },
        feed_ids: {
          type: "array",
        },
      },
      required: ["name", "email", "role", "password"],
      additionalProperties: false,
    },
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
  createUserValidation,
};
