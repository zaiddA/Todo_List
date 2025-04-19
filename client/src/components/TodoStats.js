import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const TodoStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/todos/stats");
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        setError("Failed to load statistics");
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [api, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    { title: "Total Tasks", value: stats.total, color: "bg-blue-100" },
    { title: "Completed", value: stats.completed, color: "bg-green-100" },
    { title: "Pending", value: stats.pending, color: "bg-yellow-100" },
    {
      title: "Created This Week",
      value: stats.lastWeekCreated,
      color: "bg-purple-100",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      color: "bg-indigo-100",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Task Statistics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="text-sm text-gray-600">{stat.title}</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoStats;
