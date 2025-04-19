import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "client",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      // Convert role to number before sending
      const registrationData = {
        ...formData,
        role: formData.role === "admin" ? 0 : 1,
      };

      const success = await register(registrationData);

      if (success) {
        toast.success("Registration successful!");
        // Navigate based on role
        if (formData.role === "admin") {
          navigate("/admin/users");
        } else {
          navigate("/todos");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 p-4">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Join us to get started with your journey
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-white/70" />
              </div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-white/20 bg-white/10 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
                placeholder="Full Name"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-white/70" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-white/20 bg-white/10 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-white/70" />
              </div>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-white/20 bg-white/10 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
                placeholder="Phone Number"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-white/70" />
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-white/20 bg-white/10 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
                placeholder="Password"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircleIcon className="h-5 w-5 text-white/70" />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-white/20 bg-white/10 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-purple-600 bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-200 transform hover:scale-105"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ArrowRightOnRectangleIcon
                  className="h-5 w-5 text-purple-600 group-hover:text-purple-700"
                  aria-hidden="true"
                />
              </span>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-white/80">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-white hover:text-white/90 transition duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
