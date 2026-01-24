import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    totalClicks: 0,
    topPerformers: [],
    allLinks: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetchAnalytics(token);
  }, []);

  const fetchAnalytics = async (token) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/analytics", {
        headers: { authorization: token }
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const exportAnalyticsCSV = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `http://localhost:5000/analytics/export/${userId}`,
        { responseType: 'blob' }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export analytics:", err);
      alert("Failed to export analytics");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <p className="text-emerald-400 text-xl">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-all flex items-center gap-2 mb-6"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-emerald-400">Analytics Dashboard</h1>
            <button
              onClick={exportAnalyticsCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-emerald-500/50"
            >
              <span>📊</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Total Visits */}
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">Total Hub Visits</p>
                <h2 className="text-5xl font-bold text-emerald-400">{analytics.totalVisits}</h2>
              </div>
              <div className="text-5xl">👁️</div>
            </div>
          </div>

          {/* Total Clicks */}
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">Total Link Clicks</p>
                <h2 className="text-5xl font-bold text-teal-400">{analytics.totalClicks}</h2>
              </div>
              <div className="text-5xl">🔗</div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-30 mb-8">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">Top Performing Links</h2>
          {analytics.topPerformers.length === 0 ? (
            <p className="text-gray-400">No data yet</p>
          ) : (
            <div className="space-y-3">
              {analytics.topPerformers.map((link, idx) => (
                <div key={idx} className="bg-slate-900 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-white">{link.title}</p>
                    <p className="text-gray-400 text-sm">
                      {link.clicks} clicks • {link.visits} visits
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="bg-emerald-500 bg-opacity-20 text-emerald-400 px-3 py-1 rounded">
                      {((link.clicks / Math.max(analytics.totalClicks, 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Links Stats */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-30">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">All Links Performance</h2>
          {analytics.allLinks.length === 0 ? (
            <p className="text-gray-400">No links created yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Link</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Clicks</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Visits</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.allLinks.map((link, idx) => (
                    <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700 hover:bg-opacity-20 transition">
                      <td className="py-3 px-4 text-white">{link.title}</td>
                      <td className="py-3 px-4 text-center text-emerald-400">{link.clicks}</td>
                      <td className="py-3 px-4 text-center text-teal-400">{link.visits}</td>
                      <td className="py-3 px-4 text-center text-gray-400">
                        {link.visits > 0 ? ((link.clicks / link.visits) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
