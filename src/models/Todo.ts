import mongoose, { Document, Schema } from "mongoose";

export interface TodoDocument extends Document {
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const todoSchema = new Schema<TodoDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    dueDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

todoSchema.index({ createdAt: -1 });
todoSchema.index({ completed: 1 });
todoSchema.index({ dueDate: 1 });

export const Todo = mongoose.model<TodoDocument>("Todo", todoSchema);
