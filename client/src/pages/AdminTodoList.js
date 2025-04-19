import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  CheckIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const AdminTodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api, isAuthenticated, user } = useAuth();

  const fetchTodos = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 0) {
      setLoading(false);
      setTodos([]);
      return;
    }

    try {
      const response = await api.get("/todos/all");
      if (response.data.success) {
        setTodos(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to load todos. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated, user]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleDeleteTodo = async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      if (response.data.success) {
        setTodos(todos.filter((todo) => todo._id !== id));
        toast.success("Todo deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo. Please try again.");
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
        toast.success("Todo status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update todo status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          All Users' Tasks
        </h1>
        <div className="text-sm text-gray-600">Total Tasks: {todos.length}</div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {todos.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            ) : (
              todos.map((todo) => (
                <tr key={todo._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleComplete(todo._id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        todo.completed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <CheckIcon
                        className={`h-4 w-4 mr-1 ${
                          todo.completed ? "text-green-600" : "text-yellow-600"
                        }`}
                      />
                      {todo.completed ? "Completed" : "Pending"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {todo.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {todo.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {todo.user?.name || "Unknown User"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTodoList;
