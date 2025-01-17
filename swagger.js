export default {
  openapi: "3.0.0",
  info: {
    title: "Assessment Platform API",
    version: "1.0.0",
    description: "API documentation for the Assessment Platform",
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local development server",
    },
  ],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string" },
                  role: { type: "string", enum: ["admin", "user"] },
                },
                required: ["username", "password"],
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Username already exists" },
          500: { description: "Server error" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Log in a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string" },
                },
                required: ["username", "password"],
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid username or password" },
          500: { description: "Server error" },
        },
      },
    },
    "/assessments": {
      post: {
        summary: "Create a new assessment (Admin only)",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  userGroup: { type: "array", items: { type: "string" } },
                  timeLimit: { type: "number" },
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        weightage: { type: "number" },
                      },
                    },
                  },
                },
                required: [
                  "name",
                  "type",
                  "userGroup",
                  "timeLimit",
                  "questions",
                ],
              },
            },
          },
        },
        responses: {
          201: { description: "Assessment created successfully" },
          403: { description: "Access denied: Insufficient permissions" },
          500: { description: "Server error" },
        },
      },
      get: {
        summary: "Get all assessments",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "List of assessments" },
          403: { description: "Access denied: Insufficient permissions" },
          500: { description: "Server error" },
        },
      },
    },
    "/assessments/{id}": {
      get: {
        summary: "Get a specific assessment",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Assessment details" },
          404: { description: "Assessment not found" },
          500: { description: "Server error" },
        },
      },
      put: {
        summary: "Update an assessment (Admin only)",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  userGroup: { type: "array", items: { type: "string" } },
                  timeLimit: { type: "number" },
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        weightage: { type: "number" },
                      },
                    },
                  },
                },
                required: [
                  "name",
                  "type",
                  "userGroup",
                  "timeLimit",
                  "questions",
                ],
              },
            },
          },
        },
        responses: {
          200: { description: "Assessment updated successfully" },
          404: { description: "Assessment not found" },
          500: { description: "Server error" },
        },
      },
      delete: {
        summary: "Delete an assessment (Admin only)",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Assessment deleted successfully" },
          404: { description: "Assessment not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/statistics/{assessmentId}": {
      get: {
        summary: "Get statistics for an assessment (Admin only)",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "assessmentId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Assessment statistics" },
          404: { description: "Assessment not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/invitations/{assessmentId}/invite": {
      post: {
        summary: "Send invitations to users",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "assessmentId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  users: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["users"],
              },
            },
          },
        },
        responses: {
          201: { description: "Invitations sent successfully" },
          404: { description: "Assessment not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/dashboard/metrics": {
      get: {
        summary: "Get dashboard metrics",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Dashboard metrics summary" },
          403: { description: "Access denied: Insufficient permissions" },
          500: { description: "Server error" },
        },
      },
    },
    "/dashboard/charts": {
      get: {
        summary: "Get chart data for the dashboard",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Chart data by assessment type" },
          403: { description: "Access denied: Insufficient permissions" },
          500: { description: "Server error" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
