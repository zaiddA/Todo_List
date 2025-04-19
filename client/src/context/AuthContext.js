import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Create API instance with base URL
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor to include token in headers
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle 401 errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        handleLogout();
        toast.error("Session expired. Please login again.");
      }
      return Promise.reject(error);
    }
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      if (response.data.success) {
        const userData = response.data.data;
        // Ensure user data has a role, defaulting to 1 (user) if not specified
        const userWithRole = {
          ...userData,
          role: userData.role ?? 1,
        };
        setUser(userWithRole);
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Error checking user:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data && response.data.token) {
        const token = response.data.token;
        const userData = response.data.data || response.data.user;

        if (!userData) {
          throw new Error("No user data received");
        }

        // Ensure user data has a role, defaulting to 1 (user) if not specified
        const userWithRole = {
          ...userData,
          role: userData.role ?? 1,
        };

        localStorage.setItem("token", token);
        setUser(userWithRole);
        setIsAuthenticated(true);
        toast.success("Login successful!");
        return true;
      } else {
        throw new Error(response.data?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      // Ensure we're sending the correct data format
      const registrationData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || "",
        role:
          typeof userData.role === "string"
            ? userData.role.toLowerCase() === "admin"
              ? 0
              : 1
            : userData.role ?? 1,
      };

      console.log("Sending registration data:", registrationData);

      const response = await api.post("/auth/register", registrationData);

      console.log("Registration response:", response.data);

      if (response.data && response.data.token) {
        const token = response.data.token;
        const userData = response.data.data || response.data.user;

        if (!userData) {
          throw new Error("No user data received");
        }

        // Ensure user data has a role, defaulting to 1 (user) if not specified
        const userWithRole = {
          ...userData,
          role: userData.role ?? 1,
        };

        localStorage.setItem("token", token);
        setUser(userWithRole);
        setIsAuthenticated(true);
        toast.success("Registration successful!");
        return true;
      } else {
        throw new Error(response.data?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response?.data);

      // Get the specific error message from the response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please check your input and try again.";

      toast.error(errorMessage);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear the token from localStorage and reset the auth state
      handleLogout();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, we still want to clear the auth state
      handleLogout();
    }
  };

  const updateUserDetails = async (userData) => {
    try {
      const response = await api.put("/auth/updatedetails", userData);
      if (response.data.success) {
        setUser(response.data.data);
        toast.success("Profile updated successfully!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Update failed");
      return false;
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.put("/auth/updatepassword", {
        currentPassword,
        newPassword,
      });
      if (response.data.success) {
        toast.success("Password updated successfully!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Password update error:", error);
      toast.error(error.response?.data?.message || "Password update failed");
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    api,
    login,
    register,
    logout,
    updateUserDetails,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
