import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  EnvelopeIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      setResetSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-500 via-fuchsia-600 to-indigo-600 p-4">
      <div className="max-w-md w-full space-y-8 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-white/90">
            Enter your email to receive a password reset link
          </p>
        </div>

        {!resetSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-white/90" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-white/30 bg-white/20 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition duration-200"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 transition duration-200 transform hover:scale-105 shadow-lg"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowPathIcon
                    className={`h-5 w-5 text-white group-hover:text-white/90 ${
                      loading ? "animate-spin" : ""
                    }`}
                    aria-hidden="true"
                  />
                </span>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 text-center">
            <div className="bg-white/20 p-4 rounded-lg border border-white/30">
              <p className="text-white">
                We've sent a password reset link to your email. Please check
                your inbox and follow the instructions to reset your password.
              </p>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-white/90 hover:text-white transition duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
