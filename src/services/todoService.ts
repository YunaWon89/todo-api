import { Todo } from "../models/Todo";

interface GetTodosOptions {
  completed?: boolean;
  sort?: "createdAt" | "dueDate";
  page: number;
  limit: number;
}

const formatTodo = (todo: any) => {
  const { _id, __v, ...data } = todo;

  return {
    id: _id.toString(),
    ...data,
  };
};

export const getTodos = async ({
  completed,
  sort = "createdAt",
  page,
  limit,
}: GetTodosOptions) => {
  const filter: { completed?: boolean } = {};

  if (completed !== undefined) {
    filter.completed = completed;
  }

  const sortOption: Record<string, 1 | -1> =
    sort === "dueDate" ? { dueDate: 1 } : { createdAt: -1 };

  const skip = (page - 1) * limit;

  const [todos, total, filtered] = await Promise.all([
    Todo.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),

    Todo.countDocuments(),

    Todo.countDocuments(filter),
  ]);

  return {
    todos: todos.map(formatTodo),
    total,
    filtered,
    page,
    limit,
  };
};

export const getTodoById = async (id: string) => {
  const todo = await Todo.findById(id).lean();

  return todo ? formatTodo(todo) : null;
};

export const createTodo = async (data: {
  title: string;
  description?: string;
  completed?: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
}) => {
  const todo = await Todo.create(data);

  return formatTodo(todo.toObject());
};

export const updateTodo = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: "low" | "medium" | "high";
    dueDate?: string;
  },
) => {
  const todo = await Todo.findByIdAndUpdate(
    id,
    {
      ...data,
      updatedAt: new Date(),
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).lean();

  return todo ? formatTodo(todo) : null;
};

export const deleteTodo = async (id: string) => {
  const todo = await Todo.findByIdAndDelete(id).lean();

  return todo ? formatTodo(todo) : null;
};
