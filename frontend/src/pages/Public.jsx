import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Public() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");

  /**
   * Check if current time falls within the rule's time range
   * @param {Object} condition - Rule condition with startTime, endTime, daysOfWeek
   * @returns {boolean} - True if current time matches rule
   */
  const isTimeRuleActive = (condition) => {
    const now = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDay = dayNames[now.getDay()];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Check if today is in the allowed days
    if (!condition.daysOfWeek || !condition.daysOfWeek.includes(currentDay)) {
      return false;
    }
    
    // Parse start and end times
    const [startH, startM] = condition.startTime.split(':').map(Number);
    const [endH, endM] = condition.endTime.split(':').map(Number);
    
    // Convert to minutes for easier comparison
    const currentMinutes = currentHour * 60 + currentMinute;
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    // Check if current time is within range
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  };

  /**
   * Evaluate all rules for a link to determine if it should be visible
   * @param {Array} linkRules - Array of rule objects
   * @returns {boolean} - True if link passes all active rules
   */
  const shouldShowLink = (linkRules) => {
    // No rules means always show
    if (!linkRules || linkRules.length === 0) {
      return true;
    }
    
    // Check each rule - ALL rules must pass
    return linkRules.every(rule => {
      if (rule.type === 'time') {
        return isTimeRuleActive(rule.condition);
      }
      // For other rule types that aren't implemented yet, show the link
      return true;
    });
  };

  useEffect(() => {
    console.log("Component mounted, userId:", id);
    fetchPublicLinks();
  }, [id]);

  const fetchPublicLinks = async () => {
    try {
      console.log("Starting fetch for userId:", id);
      setLoading(true);
      setError("");
      
      const url = `http://localhost:5000/public/${id}`;
      console.log("Fetching from:", url);
      
      const res = await axios.get(url);
      
      console.log("✅ API Response received:", res.data);
      console.log("Response type:", typeof res.data);
      
      // Handle new response format with user info
      if (res.data && res.data.links) {
        console.log("📌 Using new format (has links array)");
        setLinks(res.data.links);
        const visibleLinks = res.data.links.filter(link => shouldShowLink(link.rules));
        setFilteredLinks(visibleLinks);
        setUserName(res.data.userName || "User");
      } else if (Array.isArray(res.data)) {
        // Fallback for array format
        console.log("📌 Using old format (is array)");
        setLinks(res.data);
        const visibleLinks = res.data.filter(link => shouldShowLink(link.rules));
        setFilteredLinks(visibleLinks);
      } else {
        console.error("❌ Unknown response format:", res.data);
        setError("Invalid data format from server");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      console.error("Full error:", err);
      setError("Failed to load links: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (linkId, url) => {
    try {
      await axios.post(`http://localhost:5000/click/${linkId}`);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Failed to track click");
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="text-center">
          <p className="text-emerald-400 text-xl">Loading links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 text-emerald-400 hover:text-emerald-300 font-semibold transition-all flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-emerald-400 mb-2">{userName}'s Links</h1>
          <p className="text-gray-400">Check out these awesome links</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        {/* Links Container */}
        <div className="space-y-3 mb-8">
          {filteredLinks.length === 0 ? (
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg p-12 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-30 text-center">
              <p className="text-gray-400 text-lg">{links.length === 0 ? 'No links shared yet' : 'No links available at this time'}</p>
            </div>
          ) : (
            filteredLinks.map(link => (
              <button
                key={link._id}
                onClick={() => handleClick(link._id, link.url)}
                className="w-full bg-slate-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-xl border border-emerald-500 border-opacity-30 hover:border-emerald-500 hover:border-opacity-100 transition-all duration-300 group shadow-lg hover:shadow-emerald-500/50 text-left"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-all">
                      {link.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2 truncate hover:text-gray-300">
                      {link.url}
                    </p>
                    <p className="text-emerald-400 text-xs mt-3 font-semibold">
                      👁️ {link.clicks} views
                    </p>
                  </div>
                  <div className="text-2xl ml-4 group-hover:scale-110 transition-transform">
                    🔗
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        {links.length > 0 && (
          <div className="text-center text-gray-400 text-sm">
            <p>Total links: {links.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}
