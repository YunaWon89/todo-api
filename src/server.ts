import express from "express";
import dotenv from "dotenv";
import todoRouter from "./routes/todos";
import { errorHandler } from "./middleware/errorHandler";
import { connectDB } from "./config/database";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log(
    new Date().toISOString(),
    req.method,
    req.path
  );

  next();
});


app.use("/api/todos", todoRouter);


app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: "connected"
  });
});

// Временно, для проверки
app.get("/", (req, res) => {
  res.send("Hello Todo API");
});


app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.path}`
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();