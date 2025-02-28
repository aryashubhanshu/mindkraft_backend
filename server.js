import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv-safe";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.js";

import routes from "./routes/index.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

dotenv.config({
  example: "./.env.example",
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", routes);
app.use(errorMiddleware);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error: ", err));

// Routes for the app
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});
