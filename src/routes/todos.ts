import { Router } from "express";
import mongoose from "mongoose";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoService";
import { validateTodo, validateTodoUpdate } from "../middleware/validation";

const router = Router();

// GET /api/todos
router.get("/", async (req, res, next) => {
  try {
    const completed =
      req.query.completed !== undefined
        ? req.query.completed === "true"
        : undefined;

    const sort =
      req.query.sort === "dueDate"
        ? "dueDate"
        : "createdAt";

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      50
    );

    const result = await getTodos({
      completed,
      sort,
      page,
      limit,
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/todos/:id
router.get("/:id", async (req, res, next) => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        error: "Todo not found",
      });
    }

    const todo = await getTodoById(id);

    if (!todo) {
      return res.status(404).json({
        error: "Todo not found",
      });
    }

    return res.json(todo);
  } catch (error) {
    next(error);
  }
});

// POST /api/todos
router.post("/", validateTodo, async (req, res, next) => {
  try {
    const todo = await createTodo(req.body);

    return res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
});

// PUT /api/todos/:id
router.put("/:id", validateTodoUpdate, async (req, res, next) => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        error: "Todo not found",
      });
    }

    const todo = await updateTodo(id, req.body);

    if (!todo) {
      return res.status(404).json({
        error: "Todo not found",
      });
    }

    return res.json(todo);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/todos/:id/toggle
router.patch("/:id/toggle", async (req, res, next) => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        error: "Todo not found",
      });
    }

    const currentTodo = await getTodoById(id);

    if (!currentTodo) {
      return res.status(404).json({
        error: "Todo not found",
      });
    }

    const todo = await updateTodo(id, {
      completed: !currentTodo.completed,
    });

    return res.json(todo);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/todos/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        error: "Todo not found",
      });
    }

    const todo = await deleteTodo(id);

    if (!todo) {
      return res.status(404).json({
        error: "Todo not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
