import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const { api } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const [usersResponse, todosResponse] = await Promise.all([
        api.get("/users/count"),
        api.get("/todos/stats"),
      ]);

      if (usersResponse.data.success && todosResponse.data.success) {
        setStats({
          totalUsers: usersResponse.data.count,
          totalTodos: todosResponse.data.totalTodos,
          completedTodos: todosResponse.data.completedTodos,
          pendingTodos: todosResponse.data.pendingTodos,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <ChartBarIcon className="h-8 w-8 text-blue-500" />
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Tasks Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalTodos}
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completed Tasks
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.completedTodos}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pendingTodos}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Management Card */}
          <Link
            to="/admin/users"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  User Management
                </h3>
                <p className="text-gray-600">View and manage user accounts</p>
              </div>
            </div>
          </Link>

          {/* Task Management Card */}
          <Link
            to="/admin/todos"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-4 rounded-lg">
                <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Task Management
                </h3>
                <p className="text-gray-600">Monitor and manage all tasks</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          System Status
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <div className="h-4 w-4 bg-green-400 rounded-full"></div>
            </div>
            <p className="text-gray-600">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
