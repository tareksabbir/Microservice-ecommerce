import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/auth.router";
import swaggerUi from "swagger-ui-express";
import { errorMiddleware } from "../../../packages/error-handler/error-middleware";
const swaggerDocument = require("../swagger-output.json");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/docs", (req, res) => {
  res.json(swaggerDocument);
});

// API routes
app.use("/api", router);

// Error middleware MUST be LAST
app.use(errorMiddleware);

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
  console.log(`Swagger at http://localhost:${port}/api-docs`);
});

server.on("error", (error) => console.log("Server error: ", error));