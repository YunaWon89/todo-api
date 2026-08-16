import express from "express";
import todoRouter from "./routes/todos";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(
    new Date().toISOString(),
    req.method,
    req.path
  );

  next();
});

// Todo routes
app.use("/api/todos", todoRouter);

// Временно, для проверки
app.get("/", (req, res) => {
  res.send("Hello Todo API");
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.path}`
  });
});
 

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});