import { Request, Response, NextFunction } from "express";

export const validateTodo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, priority, dueDate } = req.body;
  const errors: string[] = [];

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (typeof title === "string" && title.length > 100) {
    errors.push("Title must be 100 characters or less");
  }

  if (description !== undefined && typeof description !== "string") {
    errors.push("Description must be a string");
  }

  if (typeof description === "string" && description.length > 500) {
    errors.push("Description must be 500 characters or less");
  }

  if (
    priority &&
    !["low", "medium", "high"].includes(priority)
  ) {
    errors.push("Priority must be low, medium, or high");
  }

  if (dueDate !== undefined) {
    if (typeof dueDate !== "string") {
      errors.push("Due date must be a string");
    } else if (isNaN(Date.parse(dueDate))) {
      errors.push("Due date must be a valid date");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateTodoUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, completed, priority, dueDate } = req.body;
  const errors: string[] = [];

  if (completed !== undefined && typeof completed !== "boolean") {
    errors.push("Completed must be a boolean");
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      errors.push("Title must be a non-empty string");
    }

    if (typeof title === "string" && title.length > 100) {
      errors.push("Title must be 100 characters or less");
    }
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      errors.push("Description must be a string");
    }

    if (
      typeof description === "string" &&
      description.length > 500
    ) {
      errors.push("Description must be 500 characters or less");
    }
  }

  if (
    priority !== undefined &&
    !["low", "medium", "high"].includes(priority)
  ) {
    errors.push("Priority must be low, medium, or high");
  }

  if (dueDate !== undefined) {
    if (typeof dueDate !== "string") {
      errors.push("Due date must be a string");
    } else if (isNaN(Date.parse(dueDate))) {
      errors.push("Due date must be a valid date");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

