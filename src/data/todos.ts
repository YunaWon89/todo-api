//Implement the GET /api/todos endpoint:


export interface Todo {
id: number;
title: string;
description?: string;
completed: boolean;
priority: "low"| "medium"| "high";
dueDate?: string;
createdAt: string;
updatedAt?: string
}

export const todos: Todo[] = [
  {
  id: 1,
  title: "Complete project",
  description: "Finish the TODO API",
  completed: false,
  priority: "high",
  dueDate: "2026-08-15",
  createdAt: "2026-08-09T10:00:00Z"
},

{id: 2,
  title: "Not easy",
  description: "Almost there",
  completed: true,
  priority: "high",
  dueDate: "2026-08-14",
  createdAt: "2026-08-06T12:00:00Z"
},
{
 id: 3,
  title: "Oops",
  description: "Not yet",
  completed: false,
  priority: "high",
  dueDate: "2026-08-11",
  createdAt: "2026-08-03T11:00:00Z"
}
];
