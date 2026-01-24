/**
 * CSV Export Utility
 * 
 * Provides functions to convert data to CSV format for export.
 * Used for analytics data export functionality.
 */

/**
 * Convert JSON data to CSV format
 * 
 * @param {Array} data - Array of objects to convert
 * @param {Array} headers - Array of header objects [{key, label}]
 * @returns {string} CSV formatted string
 */
const jsonToCSV = (data, headers) => {
  if (!data || data.length === 0) {
    return headers.map(h => h.label).join(",");
  }

  // Create header row
  const headerRow = headers.map(h => h.label).join(",");

  // Create data rows
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header.key];
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        return "";
      }

      // Handle dates
      if (value instanceof Date) {
        return value.toISOString().split("T")[0];
      }

      // Handle strings with commas or quotes - escape them
      if (typeof value === "string") {
        if (value.includes(",") || value.includes('"') || value.includes("\n")) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }

      // Handle numbers and other types
      return value.toString();
    }).join(",");
  }).join("\n");

  return `${headerRow}\n${dataRows}`;
};

/**
 * Convert analytics data to CSV format
 * 
 * @param {Array} links - Array of link objects with analytics data
 * @param {string} userName - Name of the user for reference
 * @returns {string} CSV formatted string
 */
const generateAnalyticsCSV = (links, userName) => {
  // Define CSV headers
  const headers = [
    { key: "title", label: "Link Title" },
    { key: "url", label: "URL" },
    { key: "clicks", label: "Total Clicks" },
    { key: "visits", label: "Total Visits" },
    { key: "lastClicked", label: "Last Clicked" },
    { key: "createdAt", label: "Created Date" }
  ];

  // Transform link data for CSV export
  const analyticsData = links.map(link => ({
    title: link.title,
    url: link.url,
    clicks: link.clicks || 0,
    visits: link.visits || 0,
    lastClicked: link.lastClicked || "Never",
    createdAt: link.createdAt
  }));

  return jsonToCSV(analyticsData, headers);
};

/**
 * Generate CSV filename with timestamp
 * 
 * @param {string} userName - User name for filename
 * @returns {string} Formatted filename
 */
const generateCSVFilename = (userName) => {
  const timestamp = new Date().toISOString().split("T")[0];
  const safeName = userName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  return `${safeName}_analytics_${timestamp}.csv`;
};

module.exports = {
  jsonToCSV,
  generateAnalyticsCSV,
  generateCSVFilename
};
