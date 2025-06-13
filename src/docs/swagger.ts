import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Expense Tracker API",
    version: "1.0.0",
    description: "API docs for the Expense Tracker backend",
  },
  servers: [{ url: "http://localhost:8080" }],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/presentation/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
