import { Router } from "express";
import { todos, Todo } from "../data/todos";
import {
  validateTodo,
  validateTodoUpdate,
} from "../middleware/validation";

const router = Router();

// GET /api/todos
router.get("/", (req, res) => {
  let filtered = [...todos];

  // Filter by completed
  if (req.query.completed !== undefined) {
    const completed = req.query.completed === "true";

    filtered = filtered.filter(
      (todo) => todo.completed === completed
    );
  }

  // Sort by createdAt or dueDate
  if (req.query.sort === "createdAt") {
    filtered.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
  }

  if (req.query.sort === "dueDate") {
    filtered.sort(
      (a, b) =>
        new Date(a.dueDate ?? 0).getTime() -
        new Date(b.dueDate ?? 0).getTime()
    );
  }

  res.json({
    todos: filtered,
    total: todos.length,
    filtered: filtered.length,
  });
});

// GET /api/todos/:id
router.get("/:id", (req, res) => {
  const todo = todos.find(
    (todo) => todo.id === Number(req.params.id)
  );

  if (!todo) {
    return res.status(404).json({
      error: "Todo not found",
    });
  }

  return res.json(todo);
});

// POST /api/todos
router.post("/", validateTodo, (req, res) => {
  const body = req.body || {};

  const {
    title,
    description,
    priority,
    dueDate,
  } = body;

  const newTodo: Todo = {
    title,
    description,
    priority,
    dueDate,
    completed: false,
    id:
      todos.length === 0
        ? 1
        : Math.max(...todos.map((todo) => todo.id)) + 1,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);

  return res.status(201).json(newTodo);
});

// PUT /api/todos/:id
router.put("/:id", validateTodoUpdate, (req, res) => {
  const todo = todos.find(
    (todo) => todo.id === Number(req.params.id)
  );

  if (!todo) {
    return res.status(404).json({
      error: "Todo not found",
    });
  }

  const body = req.body || {};

  const {
    title,
    description,
    completed,
    priority,
    dueDate,
  } = body;

  if (title !== undefined) {
    todo.title = title;
  }

  if (description !== undefined) {
    todo.description = description;
  }

  if (completed !== undefined) {
    todo.completed = completed;
  }

  if (priority !== undefined) {
    todo.priority = priority;
  }

  if (dueDate !== undefined) {
    todo.dueDate = dueDate;
  }

  todo.updatedAt = new Date().toISOString();

  return res.json(todo);
});

// DELETE /api/todos/:id
router.delete("/:id", (req, res) => {
  const index = todos.findIndex(
    (todo) => todo.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Todo not found",
    });
  }

  todos.splice(index, 1);

  return res.status(204).send();
});

export default router;
