const swaggerAutogen = require("swagger-autogen");

const doc = {
    info: {
        title: "Auth Service",
        description: "Auth Service API Documentation",
        version: "1.0.0",
    },
    host: "localhost:6001",
    schemes: ["http"],
}

// Generate at the root of auth-service (not in src)
const outputFile = "./apps/auth-service/swagger-output.json";
const endpointsFiles = ["./apps/auth-service/src/routes/auth.router.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);