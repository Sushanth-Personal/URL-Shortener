const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
    urlId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the URL being tracked
      ref: "Url",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },

    date: {
      type: Date, // The specific date for tracking
      required: true,
    },
 
    ipAddress: { type: String, required: false }, // Store IP address
    deviceType: { type: String, required: false }, // Store device type (mobile, desktop, tablet)
    platform: { type: String, required: false }, // Store platform (iOS, Android, Web)
  },

  { timestamps: true }
);

// Export the Analytics model
const Analytics = mongoose.model("Analytics", analyticsSchema);
module.exports = Analytics;
