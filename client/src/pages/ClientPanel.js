import React from "react";
import TodoList from "./TodoList";
import { useAuth } from "../context/AuthContext";

const ClientPanel = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name}</p>
      </div>

      {/* Client's Todo List */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <TodoList />
      </div>
    </div>
  );
};

export default ClientPanel;
