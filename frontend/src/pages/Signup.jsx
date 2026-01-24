import api from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      setError("");
      console.log("📤 Sending signup request to:", api.defaults.baseURL + "/signup");
      console.log("📋 Data:", { name, email, password });
      
      const res = await api.post("/signup", {
        name,
        email,
        password
      });
      
      console.log("✅ Signup successful:", res.data);
      navigate("/");
    } catch (err) {
      console.error("❌ Signup error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config?.url
      });
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 bg-opacity-60 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-2">Get Started</h2>
            <p className="text-gray-400 text-xs sm:text-sm">Create your account today</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-xs sm:text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && signup()}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && signup()}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && signup()}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500 text-sm"
              />
            </div>

            <button
              onClick={signup}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-emerald-500/50 text-sm sm:text-base"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              Already have an account?{" "}
              <a href="/" className="text-emerald-400 hover:underline font-medium transition-all">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
