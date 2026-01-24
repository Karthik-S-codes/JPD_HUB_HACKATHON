import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showQRModal, setShowQRModal] = useState(null);
  const [showRuleModal, setShowRuleModal] = useState(null);
  const [rules, setRules] = useState([]);
  const [ruleType, setRuleType] = useState("time");  
  const [allowedCountries, setAllowedCountries] = useState(["GLOBAL"]);
  // Time-based rule states
  const [ruleStartTime, setRuleStartTime] = useState("09:00");
  const [ruleEndTime, setRuleEndTime] = useState("17:00");
  const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  // Theme states
  const [theme, setTheme] = useState("dark");
  const [accentColor, setAccentColor] = useState("#00ff00");
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");
    
    if (!token) {
      navigate("/");
      return;
    }
    
    setUserId(id);
    fetchLinks(token);
    fetchUserProfile(token);
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/user/profile", {
        headers: { authorization: token }
      });
      setTheme(res.data.theme || "dark");
      setAccentColor(res.data.accentColor || "#00ff00");
    } catch (err) {
      console.error("Failed to fetch user profile");
    }
  };

  const fetchLinks = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/links", {
        headers: { authorization: token }
      });
      setLinks(res.data);
    } catch (err) {
      setError("Failed to fetch links");
    }
  };

  const addOrUpdateLink = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (editingId) {
        await axios.put(
          `http://localhost:5000/link/${editingId}`,
          { title, url, description, rules, allowedCountries },
          { headers: { authorization: token } }
        );
        setEditingId(null);
      } else {
        await axios.post(
          "http://localhost:5000/link",
          { title, url, description, rules, allowedCountries },
          { headers: { authorization: token } }
        );
      }

      // Reset all form fields and state
      setTitle("");
      setUrl("");
      setDescription("");
      setRules([]);
      setRuleType("time");
      setRuleStartTime("09:00");
      setRuleEndTime("17:00");
      setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
      setAllowedCountries(["GLOBAL"]);
      
      fetchLinks(token);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save link");
    } finally {
      setLoading(false);
    }
  };

  const editLink = (link) => {
    setTitle(link.title);
    setUrl(link.url);
    setDescription(link.description || "");
    setRules(link.rules || []);
    setAllowedCountries(link.allowedCountries || ["GLOBAL"]);
    setEditingId(link._id);
  };

  const deleteLink = async (id) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      await axios.delete(`http://localhost:5000/link/${id}`, {
        headers: { authorization: localStorage.getItem("token") }
      });
      fetchLinks(localStorage.getItem("token"));
    } catch (err) {
      setError("Failed to delete link");
    }
  };

  /**
   * Add a new rule with proper condition based on rule type
   * For time-based rules: captures start/end times and selected days
   * For other rules: creates empty condition placeholder
   */
  const addRule = () => {
    if (!ruleType) return;
    
    // Build condition based on rule type
    let condition = {};
    
    if (ruleType === "time") {
      condition = {
        startTime: ruleStartTime,
        endTime: ruleEndTime,
        daysOfWeek: selectedDays
      };
    }
    
    // Add the new rule to the rules array
    setRules([...rules, { 
      type: ruleType, 
      condition: condition, 
      active: true 
    }]);
    
    // Close modal and reset
    setShowRuleModal(false);
    setRuleType("time");
  };

  /**
   * Toggle day selection for time-based rules
   * @param {string} day - Day abbreviation (Mon, Tue, etc.)
   */
  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const removeRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateTheme = async (newTheme) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/user/theme",
        { theme: newTheme },
        { headers: { authorization: token } }
      );
      setTheme(newTheme);
    } catch (err) {
      console.error("Failed to update theme:", err);
      alert("Failed to update theme");
    }
  };

  const updateAccentColor = async (newColor) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/user/accent-color",
        { accentColor: newColor },
        { headers: { authorization: token } }
      );
      setAccentColor(newColor);
    } catch (err) {
      console.error("Failed to update accent color:", err);
      alert("Failed to update accent color");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const cancelEdit = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setRules([]);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-400">Link Hub Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowThemeSettings(!showThemeSettings)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              🎨 Theme
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              📊 Analytics
            </button>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Theme Settings Modal */}
        {showThemeSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-emerald-500 border-opacity-30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-emerald-400">Theme Settings</h3>
                <button
                  onClick={() => setShowThemeSettings(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Theme Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Choose Theme
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateTheme("dark")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === "dark"
                          ? "border-emerald-500 bg-emerald-500 bg-opacity-20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-3xl mb-2">🌙</div>
                      <div className="text-white font-semibold">Dark</div>
                    </button>
                    <button
                      onClick={() => updateTheme("light")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === "light"
                          ? "border-emerald-500 bg-emerald-500 bg-opacity-20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-3xl mb-2">☀️</div>
                      <div className="text-white font-semibold">Light</div>
                    </button>
                  </div>
                </div>

                {/* Accent Color Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-12 w-16 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      placeholder="#00ff00"
                    />
                    <button
                      onClick={() => updateAccentColor(accentColor)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-semibold transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    This color will be used on your public hub page
                  </p>
                </div>

                {/* Preview */}
                <div className="bg-slate-900 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Preview:</p>
                  <div 
                    className="h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: accentColor }}
                  >
                    Sample Button
                  </div>
                </div>

                {/* Public Link */}
                <div className="bg-slate-900 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Your Public Link:</p>
                  <p className="text-emerald-400 text-sm break-all">
                    http://localhost:5173/public/{userId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Link Section */}
        <div className="bg-slate-800 bg-opacity-40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-20 mb-8">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">
            {editingId ? "Edit Link" : "Create New Link"}
          </h2>
          
          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={addOrUpdateLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Link Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My Portfolio"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your link..."
                rows="2"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
              />
            </div>

            {/* Rules Display */}
            {rules.length > 0 && (
              <div className="bg-slate-900 p-4 rounded-lg border border-emerald-500 border-opacity-20">
                <h3 className="text-sm font-semibold text-emerald-400 mb-3">Applied Rules ({rules.length})</h3>
                <div className="space-y-2">
                  {rules.map((rule, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-800 p-2 rounded">
                      <span className="text-sm text-gray-300">
                        {rule.type === 'time' && '⏰ Time-based Rule'}
                        {rule.type === 'device' && '📱 Device-based Rule'}
                        {rule.type === 'location' && '🌍 Location-based Rule'}
                        {rule.type === 'performance' && '📈 Performance-based Rule'}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeRule(idx)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                {loading ? (editingId ? "Updating..." : "Adding...") : editingId ? "Update Link" : "Add Link"}
              </button>
              <button
                type="button"
                onClick={() => setShowRuleModal(true)}
                className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                ⚙️ Add Rule
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Public Link Section */}
        <div className="bg-slate-800 bg-opacity-40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-20 mb-8">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Your Public Profile</h2>
          <p className="text-gray-400 mb-3">Share this link with others:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={`http://localhost:5173/public/${userId}`}
              readOnly
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 text-sm"
            />
            <button
              onClick={() => copyToClipboard(`http://localhost:5173/public/${userId}`)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Links List */}
        <div className="bg-slate-800 bg-opacity-40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-emerald-500 border-opacity-20">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">Your Links ({links.length})</h2>
          
          {links.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No links yet. Create one to get started!</p>
          ) : (
            <div className="space-y-3">
              {links.map(link => (
                <div
                  key={link._id}
                  className="bg-slate-900 border border-slate-700 p-4 rounded-lg hover:border-emerald-500 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{link.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{link.url}</p>
                      {link.description && (
                        <p className="text-gray-400 text-xs mt-1">{link.description}</p>
                      )}
                      {link.rules && link.rules.length > 0 && (
                        <p className="text-emerald-400 text-xs mt-1">⚙️ {link.rules.length} rules active</p>
                      )}
                      <p className="text-emerald-400 text-xs mt-2">👁️ {link.clicks} clicks</p>
                    </div>
                    {link.qrCode && (
                      <button
                        onClick={() => setShowQRModal(link)}
                        className="ml-4 text-gray-400 hover:text-emerald-400 text-2xl transition-all"
                        title="View QR Code"
                      >
                        📱
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editLink(link)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded text-sm font-semibold transition-all"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteLink(link._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-semibold transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-emerald-500">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4 text-center">{showQRModal.title}</h3>
            <img src={showQRModal.qrCode} alt="QR Code" className="w-full mb-4 bg-white p-4 rounded" />
            <button
              onClick={() => setShowQRModal(null)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-emerald-500 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">Add Rule</h3>
            <div className="space-y-4">
              {/* Rule Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rule Type</label>
                <select
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="time">⏰ Time-based (show on specific times)</option>
                  <option value="device">📱 Device-based (show on mobile/desktop)</option>
                  <option value="location">🌍 Location-based (show in specific regions)</option>
                  <option value="performance">📈 Performance-based (conditional on stats)</option>
                </select>
              </div>

              {/* Rule Description */}
              <div className="text-sm text-gray-400 bg-slate-900 p-3 rounded">
                {ruleType === 'time' && 'Show this link only during specific hours or days'}
                {ruleType === 'device' && 'Show this link only on specific device types'}
                {ruleType === 'location' && 'Show this link only to visitors from specific countries'}
                {ruleType === 'performance' && 'Show this link based on performance metrics'}
              </div>

              {/* Time-Based Rule Configuration */}
              {ruleType === 'time' && (
                <div className="space-y-4 bg-slate-900 p-4 rounded border border-slate-700">
                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={ruleStartTime}
                      onChange={(e) => setRuleStartTime(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                    <input
                      type="time"
                      value={ruleEndTime}
                      onChange={(e) => setRuleEndTime(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Day Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Days of Week</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`py-2 px-2 rounded text-xs font-semibold transition-all ${
                            selectedDays.includes(day)
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Selected: {selectedDays.length > 0 ? selectedDays.join(', ') : 'None'}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={addRule}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded transition-all"
                >
                  Add Rule
                </button>
                <button
                  onClick={() => setShowRuleModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
