import api from "../services/api";
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
  const [showQRModal, setShowQRModal] = useState(null);
  const [visitorCountryName, setVisitorCountryName] = useState("Your Region");
  const [totalLinks, setTotalLinks] = useState(0);
  const [visibleLinks, setVisibleLinks] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [accentColor, setAccentColor] = useState("#00ff00");

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
      
      // Determine if ID is a slug (contains hyphens, lowercase) or a MongoDB ID (hex)
      const isSlug = id.includes('-') || /^[a-z0-9-]+$/.test(id);
      const url = isSlug ? `/hub/${id}` : `/public/${id}`;
      console.log(`Fetching from: ${url} (detected as ${isSlug ? 'slug' : 'user ID'})`);
      
      const res = await api.get(url);
      
      console.log("✅ API Response received:", res.data);
      console.log("Response type:", typeof res.data);
      
      // Handle new response format with user info
      if (res.data && res.data.links) {
        console.log("📌 Using new format (has links array)");
        setLinks(res.data.links);
        const visibleLinks = res.data.links.filter(link => shouldShowLink(link.rules));
        setFilteredLinks(visibleLinks);
        setUserName(res.data.userName || "User");
        setTotalLinks(res.data.links.length);
        setVisibleLinks(visibleLinks.length);
        setVisitorCountryName(res.data.visitorCountryName || "Your Region");
        setTheme(res.data.theme || "dark");
        setAccentColor(res.data.accentColor || "#00ff00");
      } else if (Array.isArray(res.data)) {
        // Fallback for array format
        console.log("📌 Using old format (is array)");
        setLinks(res.data);
        const visibleLinks = res.data.filter(link => shouldShowLink(link.rules));
        setFilteredLinks(visibleLinks);
        setTotalLinks(res.data.length);
        setVisibleLinks(visibleLinks.length);
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
      await api.post(`/click/${linkId}`);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Failed to track click");
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "light" 
          ? "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200" 
          : "bg-gradient-to-br from-slate-950 via-slate-900 to-black"
      }`}>
        <div className="text-center">
          <p className={`text-xl ${theme === "light" ? "text-gray-700" : "text-emerald-400"}`}>
            Loading links...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-3 sm:p-6 ${
      theme === "light" 
        ? "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200" 
        : "bg-gradient-to-br from-black via-black to-black"
    }`}>
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className={`mb-6 sm:mb-8 font-semibold transition-all flex items-center gap-2 text-sm sm:text-base ${
            theme === "light"
              ? "text-gray-700 hover:text-gray-900"
              : "text-emerald-400 hover:text-emerald-300"
          }`}
        >
          ← Back
        </button>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: accentColor }}
          >
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className={`text-2xl sm:text-4xl font-bold mb-2 ${
            theme === "light" ? "text-gray-900" : "text-emerald-400"
          }`}>
            {userName}'s Links
          </h1>
          <p className={`text-sm sm:text-base ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
            Check out these awesome links
          </p>
        </div>

        {/* Theme Indicator */}
        <div className={`text-center mb-4 sm:mb-6 text-xs sm:text-sm ${
          theme === "light" ? "text-gray-500" : "text-gray-500"
        }`}>
          {theme === "light" ? "☀️" : "🌙"} {theme === "light" ? "Light" : "Dark"} Theme
        </div>

        {/* Visitor's Country */}
        <div className={`text-xs sm:text-sm mb-4 text-center ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
          📍 Showing links available in: {visitorCountryName}
        </div>

        {/* Filter Stats */}
        {totalLinks !== visibleLinks && (
          <p className="text-emerald-400 text-sm mb-4">
            {visibleLinks} of {totalLinks} links available in your region
          </p>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        {/* Links Container */}
        <div className="space-y-3 mb-8">
          {filteredLinks.length === 0 ? (
            <div className={`backdrop-blur-lg p-8 sm:p-12 rounded-2xl shadow-2xl border text-center ${
              theme === "light"
                ? "bg-white bg-opacity-70 border-gray-300"
                : "bg-slate-800 bg-opacity-50 border-emerald-500 border-opacity-30"
            }`}>
              <p className={`text-base sm:text-lg ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                {links.length === 0 ? 'No links shared yet' : 'No links available at this time'}
              </p>
            </div>
          ) : (
            filteredLinks.map(link => (
              <div
                key={link._id}
                className={`backdrop-blur-lg p-4 sm:p-6 rounded-xl border transition-all duration-300 shadow-lg ${
                  theme === "light"
                    ? "bg-white bg-opacity-80 border-gray-200 hover:border-gray-400 hover:shadow-xl"
                    : "bg-slate-800 bg-opacity-50 border-emerald-500 border-opacity-30 hover:border-emerald-500 hover:border-opacity-100 hover:shadow-emerald-500/50"
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center">
                  {/* Link Info */}
                  <button
                    onClick={() => handleClick(link._id, link.url)}
                    className="flex-1 text-left group w-full min-w-0"
                  >
                    <h3 
                      className={`text-base sm:text-xl font-bold transition-all break-words ${
                        theme === "light"
                          ? "text-gray-900 group-hover:text-gray-700"
                          : "text-white group-hover:text-emerald-400"
                      }`}
                      style={{ color: theme === "light" ? undefined : accentColor }}
                    >
                      {link.title}
                    </h3>
                    <p className={`text-xs sm:text-sm mt-2 break-all ${
                      theme === "light"
                        ? "text-gray-600 hover:text-gray-800"
                        : "text-gray-400 hover:text-gray-300"
                    }`}>
                      {link.url}
                    </p>
                  </button>
                  
                  {/* QR Code Icon */}
                  {link.qrCode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowQRModal(link);
                      }}
                      className="text-2xl sm:text-3xl hover:scale-110 transition-transform flex-shrink-0"
                      title="View QR Code"
                    >
                      📱
                    </button>
                  )}
                </div>
              </div>
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

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-emerald-500">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4 text-center">{showQRModal.title}</h3>
            <img 
              src={showQRModal.qrCode} 
              alt="QR Code" 
              className="w-full mb-4 bg-white p-4 rounded" 
            />
            <button
              onClick={() => setShowQRModal(null)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
