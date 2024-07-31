// import { SwaggerOptions } from "swagger-ui-express";

import { SwaggerOptions } from "swagger-ui-express";

// const options: SwaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "API Documentation",
//       version: "1.0.0",
//       description: "API documentation for the project",
//     },
//   },
//   apis: ["../src/controllers/*.ts"],
// };

// export default options;

export const swaggerOptions: SwaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Employee API",
      description: "Employee API Information",
      contact: {
        name: "Sagi Weizmann",
      },
    },
  },
  apis: ["./src/controllers/*.ts"],
};
