import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to Todo App
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {isAuthenticated ? (
          <div>
            <p className="text-gray-600 mb-4">
              Welcome back, {user?.name}! You can manage your todos from the
              dashboard.
            </p>
            <button
              onClick={() => navigate("/todos")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Go to Todos
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Please log in or register to start managing your todos.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
