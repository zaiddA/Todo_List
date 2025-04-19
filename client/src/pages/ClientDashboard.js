import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-modal";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

// Set the app element for react-modal
Modal.setAppElement("#root");

const ClientDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [editingTodo, setEditingTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/todos/my", {
        withCredentials: true,
      });
      setTodos(res.data.data);
    } catch (error) {
      toast.error("Error fetching todos");
    }
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/todos", newTodo, {
        withCredentials: true,
      });
      setNewTodo({ title: "", description: "" });
      toast.success("Todo created successfully");
      fetchTodos();
      setActiveTab("view");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating todo");
    }
  };

  const handleUpdateTodoStatus = async (id, completed) => {
    try {
      await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        { completed },
        { withCredentials: true }
      );
      fetchTodos();
      toast.success("Todo status updated");
    } catch (error) {
      toast.error("Error updating todo status");
    }
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/todos/${editingTodo._id}`,
        {
          title: editingTodo.title,
          description: editingTodo.description,
          completed: editingTodo.completed,
        },
        { withCredentials: true }
      );
      setIsModalOpen(false);
      setEditingTodo(null);
      fetchTodos();
      toast.success("Todo updated successfully");
    } catch (error) {
      toast.error("Error updating todo");
    }
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/todos/${id}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.message) {
          toast.success(response.data.message);
        }
        fetchTodos();
      } catch (error) {
        console.error("Delete error:", error);
        if (error.response?.status === 404) {
          toast.error("Todo not found");
        } else if (error.response?.status === 403) {
          toast.error("You are not authorized to delete this todo");
        } else {
          toast.error(error.response?.data?.message || "Error deleting todo");
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const openEditModal = (todo) => {
    setEditingTodo({ ...todo });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <ClipboardDocumentListIcon className="h-8 w-8 text-indigo-600" />
                <h1 className="ml-2 text-xl font-bold text-gray-800">
                  Todo Manager
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab("create")}
                  className={`${
                    activeTab === "create"
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  <PlusIcon className="h-5 w-5 mr-1" />
                  Create Todo
                </button>
                <button
                  onClick={() => setActiveTab("view")}
                  className={`${
                    activeTab === "view"
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-1" />
                  View Todos
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                >
                  <UserCircleIcon className="h-5 w-5 mr-1" />
                  Profile
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === "create" ? (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow-xl rounded-lg p-6 transform transition duration-500 hover:scale-105">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create New Todo
              </h2>
              <form onSubmit={handleCreateTodo}>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={newTodo.title}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, title: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={newTodo.description}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, description: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
                  >
                    Create Todo
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {todos.map((todo) => (
                  <li
                    key={todo._id}
                    className="px-6 py-4 hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex items-center">
                          {todo.completed ? (
                            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <input
                              type="checkbox"
                              checked={todo.completed}
                              onChange={(e) =>
                                handleUpdateTodoStatus(
                                  todo._id,
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition duration-150 ease-in-out"
                            />
                          )}
                          <div className="ml-3">
                            <p
                              className={`text-sm font-medium ${
                                todo.completed
                                  ? "text-gray-500 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {todo.title}
                            </p>
                            {todo.description && (
                              <p className="text-sm text-gray-500 truncate">
                                {todo.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center ml-4 space-x-4">
                        <button
                          onClick={() => openEditModal(todo)}
                          className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out transform hover:scale-110"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo._id)}
                          className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out transform hover:scale-110"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                {todos.length === 0 && (
                  <li className="px-6 py-8 text-center">
                    <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No todos
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new todo.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab("create")}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        New Todo
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Edit Todo Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md transform transition duration-500 hover:scale-105">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Edit Todo</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          {editingTodo && (
            <form onSubmit={handleUpdateTodo}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    required
                    value={editingTodo.title}
                    onChange={(e) =>
                      setEditingTodo({ ...editingTodo, title: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    rows={3}
                    value={editingTodo.description}
                    onChange={(e) =>
                      setEditingTodo({
                        ...editingTodo,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ClientDashboard;
