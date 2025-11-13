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
app.use(errorMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", router);

app.get("/", (req, res) => {
  res.send({ message: "Hello API From Auth Service" });
});

app.get("/docs", (req, res) => {
  res.json(swaggerDocument);
});

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
  console.log(`Swagger at http://localhost:${port}/docs`);
});

server.on("error", (error) => console.log("Server error: ", error));