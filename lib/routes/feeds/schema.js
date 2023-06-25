const schema = require("../../schema/common_schema");

const createFeedValidation = {
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
        },
        url: {
          type: "string",
        },
        description: {
          type: "string",
        },
        user_ids: {
          type: "array",
        },
      },
      required: ["name"],
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

const getFeedListValidation = {
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
                type: "array",
                items: {
                  id: {
                    type: "number",
                  },
                  name: {
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

const getFeedDetailsValidation = {
  schema: {
    tags: ["Authentication"],
    security: [
      {
        basicAuth: [],
      },
    ],
    params: {
      type: "object",
      properties: {
        feed_id: {
          type: "number",
        },
      },
      required: ["feed_id"],
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
                  url: {
                    type: "string",
                  },
                  description: {
                    type: "string",
                  },
                  feed_editable: {
                    type: "boolean",
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

const deleteFeedValidation = {
  schema: {
    tags: ["Authentication"],
    security: [
      {
        basicAuth: [],
      },
    ],
    params: {
      type: "object",
      properties: {
        feed_id: {
          type: "number",
        },
      },
      required: ["feed_id"],
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

const assignFeedtoUserValidation = {
  schema: {
    tags: ["Authentication"],
    security: [
      {
        basicAuth: [],
      },
    ],
    params: {
      type: "object",
      properties: {
        feed_id: {
          type: "number",
        },
      },
      required: ["feed_id"],
      additionalProperties: false,
    },
    body: {
      type: "object",
      properties: {
        user_ids: {
          type: "array",
        },
      },
      required: ["user_ids"],
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

const assignFeeddeeteAccessValidation = {
  schema: {
    tags: ["Authentication"],
    security: [
      {
        basicAuth: [],
      },
    ],
    params: {
      type: "object",
      properties: {
        feed_id: {
          type: "number",
        },
        user_id: {
          type: "number",
        },
      },
      required: ["feed_id", "user_id"],
      additionalProperties: false,
    },
    body: {
      type: "object",
      properties: {
        feed_editable: {
          type: "boolean",
        },
      },
      required: ["feed_editable"],
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
  createFeedValidation,
  getFeedListValidation,
  getFeedDetailsValidation,
  deleteFeedValidation,
  assignFeedtoUserValidation,
  assignFeeddeeteAccessValidation,
};
