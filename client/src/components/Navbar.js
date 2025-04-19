import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HomeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check if user is admin
  const isAdmin = user?.role === 0;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center text-blue-600 hover:text-blue-700 transition duration-200"
            >
              <HomeIcon className="h-6 w-6 mr-2" />
              <span className="text-xl font-semibold">Todo App</span>
            </Link>

            {/* Show these links only when authenticated */}
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin/users"
                      className="text-gray-700 hover:text-blue-600 transition duration-200 flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      <UsersIcon className="h-5 w-5 mr-1" />
                      Users
                    </Link>
                    <Link
                      to="/admin/todos"
                      className="text-gray-700 hover:text-blue-600 transition duration-200 flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      <ClipboardDocumentListIcon className="h-5 w-5 mr-1" />
                      All Tasks
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/todos"
                    className="text-gray-700 hover:text-blue-600 transition duration-200 flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <ClipboardDocumentListIcon className="h-5 w-5 mr-1" />
                    My Tasks
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 transition duration-200 flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <UserIcon className="h-5 w-5 mr-1" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 transition duration-200 flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition duration-200 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
