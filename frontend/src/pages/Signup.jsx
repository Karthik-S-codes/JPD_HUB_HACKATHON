import axios from "axios";
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
      await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <div className="w-full max-w-md mx-4">
        <div className="bg-slate-800 bg-opacity-40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-20">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-emerald-400 mb-2">Get Started</h2>
            <p className="text-gray-400 text-sm">Create your account today</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-500"
              />
            </div>

            <button
              onClick={signup}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-emerald-500/50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
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
