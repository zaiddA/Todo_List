import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import TodoStats from "../components/TodoStats";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState({ title: "", description: "" });
  const { api, isAuthenticated } = useAuth();

  const fetchTodos = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setTodos([]);
      return;
    }

    try {
      const response = await api.get("/todos/my");
      if (response.data.success) {
        setTodos(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      if (error.response?.status === 401) {
        setTodos([]);
      } else {
        toast.error("Failed to load todos. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const response = await api.post("/todos", newTodo);
      if (response.data.success) {
        setTodos([...todos, response.data.data]);
        setNewTodo({ title: "", description: "" });
        toast.success("Todo added successfully!");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      if (error.response?.status === 401) {
        toast.error("Please log in to add todos");
      } else {
        toast.error("Failed to add todo. Please try again.");
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      if (response.data.success) {
        setTodos(todos.filter((todo) => todo._id !== id));
        toast.success("Todo deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      if (error.response?.status === 401) {
        toast.error("Please log in to delete todos");
      } else {
        toast.error("Failed to delete todo. Please try again.");
      }
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await api.put(`/todos/${id}`, {
        ...todo,
        completed: !todo.completed,
      });
      if (response.data.success) {
        setTodos(
          todos.map((t) =>
            t._id === id ? { ...t, completed: !t.completed } : t
          )
        );
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      if (error.response?.status === 401) {
        toast.error("Please log in to update todos");
      } else {
        toast.error("Failed to update todo. Please try again.");
      }
    }
  };

  const handleEditTodo = async (id) => {
    if (editingId === id) {
      try {
        const response = await api.put(`/todos/${id}`, editText);
        if (response.data.success) {
          setTodos(
            todos.map((t) =>
              t._id === id
                ? {
                    ...t,
                    title: editText.title,
                    description: editText.description,
                  }
                : t
            )
          );
          setEditingId(null);
          setEditText({ title: "", description: "" });
          toast.success("Todo updated successfully!");
        }
      } catch (error) {
        console.error("Error updating todo:", error);
        if (error.response?.status === 401) {
          toast.error("Please log in to edit todos");
        } else {
          toast.error("Failed to update todo. Please try again.");
        }
      }
    } else {
      const todo = todos.find((t) => t._id === id);
      setEditText({
        title: todo.title,
        description: todo.description || "",
      });
      setEditingId(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Please log in to view your todos.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TodoStats />
      <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Tasks</h1>

        <form onSubmit={handleAddTodo} className="mb-6">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={newTodo.title}
              onChange={(e) =>
                setNewTodo({ ...newTodo, title: e.target.value })
              }
              placeholder="Enter task title"
              className="p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
              placeholder="Enter task description (optional)"
              className="p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Task
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center">
              No tasks yet. Add one above!
            </p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className={`p-4 border rounded-lg ${
                  todo.completed ? "bg-gray-50" : "bg-white"
                }`}
              >
                {editingId === todo._id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editText.title}
                      onChange={(e) =>
                        setEditText({ ...editText, title: e.target.value })
                      }
                      className="w-full p-2 border rounded-md bg-gray-50"
                    />
                    <input
                      type="text"
                      value={editText.description}
                      onChange={(e) =>
                        setEditText({
                          ...editText,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md bg-gray-50"
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleComplete(todo._id)}
                      className={`mt-1 p-1 rounded-full ${
                        todo.completed ? "text-green-500" : "text-gray-400"
                      } hover:text-green-600 transition-colors`}
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-medium ${
                          todo.completed
                            ? "text-gray-500 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="text-gray-600 mt-1">{todo.description}</p>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => handleEditTodo(todo._id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    {editingId === todo._id ? (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        Save
                      </>
                    ) : (
                      <>
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </>
                    )}
                  </button>
                  {editingId === todo._id && (
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditText({ title: "", description: "" });
                      }}
                      className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-1"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
