const successSchema = {
  status: {
    type: "boolean",
    default: true,
  },
  statusCode: {
    type: "integer",
    default: 200,
  },
};
const errorSchema = {
  description: "Srever Error response",
  type: "object",
  properties: {
    status: {
      type: "boolean",
      description: "boolean type",
      default: false,
    },
    statusCode: {
      type: "integer",
      description: "status code",
      default: 500,
    },
    message: {
      type: "string",
      description: "Error Message",
      default: "Something went wrong",
    },
  },
};

const badRequestErrorSchema = {
  description: "Bad Request Error response",
  type: "object",
  properties: {
    status: {
      type: "boolean",
      description: "boolean type",
      default: false,
    },
    statusCode: {
      type: "integer",
      description: "status code",
      default: 400,
    },
    message: {
      type: "string",
      description: "Error Message",
      default: "Bad Requests",
    },
  },
};

const unauthorizedErrorSchema = {
  description: "Unauthorized Error response",
  type: "object",
  properties: {
    status: {
      type: "boolean",
      description: "boolean type",
      default: false,
    },
    statusCode: {
      type: "integer",
      description: "status code",
      default: 401,
    },
    message: {
      type: "string",
      description: "Error Message",
      default: "Unauthorised Access",
    },
  },
};

const forbiddenErrorSchema = {
  description: "Unauthorized Error response",
  type: "object",
  properties: {
    status: {
      type: "boolean",
      description: "boolean type",
      default: false,
    },
    statusCode: {
      type: "integer",
      description: "status code",
      default: 403,
    },
    message: {
      type: "string",
      description: "Error Message",
      default: "Access Forbidden",
    },
  },
};

module.exports = {
  successSchema,
  errorSchema,
  badRequestErrorSchema,
  unauthorizedErrorSchema,
  forbiddenErrorSchema,
};
