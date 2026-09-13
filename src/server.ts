import express from "express";
import dotenv from "dotenv";
import { createTodoRouter } from "./routes/todos";
import { errorHandler } from "./middleware/errorHandler";
import { connectDB } from "./config/database";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { initSocket } from "./socket";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.path);
  next();
});

app.get("/health", (req, res) => {
  const readyState = mongoose.connection.readyState;

  const databaseStatus = readyState === 1 ? "connected" : "disconnected";

  res.status(readyState === 1 ? 200 : 503).json({
    status: readyState === 1 ? "ok" : "error",
    database: databaseStatus,
  });
});

app.get("/", (req, res) => {
  res.send("Hello Todo API");
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    const server = createServer(app);

    const io = initSocket(server);

    app.use("/api/todos", createTodoRouter(io));

    app.use((req, res) => {
      res.status(404).json({
        error: "Route not found",
        message: `Cannot ${req.method} ${req.path}`,
      });
    });

    app.use(errorHandler);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    const shutdown = async (signal: string) => {
      console.log(`${signal} received. Shutting down gracefully...`);

      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");

        server.close(() => {
          console.log("HTTP server closed.");
          process.exit(0);
        });
      } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
