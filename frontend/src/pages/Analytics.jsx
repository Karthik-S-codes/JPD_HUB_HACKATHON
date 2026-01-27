import api from "../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
      const res = await api.get("/analytics", {
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
      const response = await api.get(
        `/analytics/export/${userId}`,
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

  const exportAnalyticsPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const timestamp = new Date();

      doc.setFontSize(16);
      doc.text("Analytics Report", 14, 18);
      doc.setFontSize(10);
      doc.text(`Generated: ${timestamp.toLocaleString()}`, 14, 26);
      doc.text(`Total Visits: ${analytics.totalVisits}`, 14, 32);
      doc.text(`Total Clicks: ${analytics.totalClicks}`, 14, 38);

      const tableData = analytics.allLinks.map((link, idx) => [
        idx + 1,
        link.title || "Untitled",
        link.clicks || 0,
        link.visits || 0,
        link.visits > 0 ? `${((link.clicks / link.visits) * 100).toFixed(1)}%` : "0%"
      ]);

      if (tableData.length === 0) {
        doc.text("No link performance data to export yet.", 14, 48);
      } else {
        autoTable(doc, {
          startY: 48,
          head: [["#", "Link", "Clicks", "Visits", "CTR"]],
          body: tableData,
          styles: { overflow: "linebreak", cellPadding: 3, fontSize: 9 },
          headStyles: { fillColor: [16, 185, 129], textColor: 255 },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: Math.max(pageWidth - 70, 40) },
            2: { cellWidth: 16, halign: "right" },
            3: { cellWidth: 16, halign: "right" },
            4: { cellWidth: 18, halign: "right" }
          }
        });
      }

      doc.save(`analytics_${Date.now()}.pdf`);
    } catch (err) {
      console.error("Failed to export analytics PDF", err);
      alert("Failed to export analytics PDF");
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
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-black p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-all flex items-center gap-2 mb-4 sm:mb-6 text-sm sm:text-base"
          >
            ← Back to Dashboard
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-emerald-400">Analytics Dashboard</h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={exportAnalyticsCSV}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/50 text-sm sm:text-base"
              >
                <span>📊</span>
                <span>Export CSV</span>
              </button>
              <button
                onClick={exportAnalyticsPDF}
                className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border border-emerald-500/40 text-sm sm:text-base"
              >
                <span>📄</span>
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Visits */}
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm font-medium mb-2">Total Hub Visits</p>
                <h2 className="text-3xl sm:text-5xl font-bold text-emerald-400">{analytics.totalVisits}</h2>
              </div>
              <div className="text-3xl sm:text-5xl">👁️</div>
            </div>
          </div>

          {/* Total Clicks */}
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm font-medium mb-2">Total Link Clicks</p>
                <h2 className="text-3xl sm:text-5xl font-bold text-teal-400">{analytics.totalClicks}</h2>
              </div>
              <div className="text-3xl sm:text-5xl">🔗</div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-30 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-4 sm:mb-6">Top Performing Links</h2>
          {analytics.topPerformers.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {analytics.topPerformers.map((link, idx) => (
                <div key={idx} className="bg-slate-900 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 w-full">
                    <p className="font-semibold text-white text-sm sm:text-base break-words">{link.title}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {link.clicks} clicks • {link.visits} visits
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <span className="bg-emerald-500 bg-opacity-20 text-emerald-400 px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap">
                      {((link.clicks / Math.max(analytics.totalClicks, 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Links Stats */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-30">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-4 sm:mb-6">All Links Performance</h2>
          {analytics.allLinks.length === 0 ? (
            <p className="text-gray-400 text-sm">No links created yet</p>
          ) : (
            <div className="overflow-x-auto -mx-6 sm:-mx-8 sm:mx-0">
              <div className="inline-block min-w-full sm:min-w-0 px-6 sm:px-0">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-2 sm:px-4 text-gray-400 font-semibold">Link</th>
                      <th className="text-center py-3 px-2 sm:px-4 text-gray-400 font-semibold">Clicks</th>
                      <th className="text-center py-3 px-2 sm:px-4 text-gray-400 font-semibold">Visits</th>
                      <th className="text-center py-3 px-2 sm:px-4 text-gray-400 font-semibold">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.allLinks.map((link, idx) => (
                      <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700 hover:bg-opacity-20 transition">
                        <td className="py-3 px-2 sm:px-4 text-white truncate">{link.title}</td>
                        <td className="py-3 px-2 sm:px-4 text-center text-emerald-400">{link.clicks}</td>
                        <td className="py-3 px-2 sm:px-4 text-center text-teal-400">{link.visits}</td>
                        <td className="py-3 px-2 sm:px-4 text-center text-gray-400">
                          {link.visits > 0 ? ((link.clicks / link.visits) * 100).toFixed(1) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
