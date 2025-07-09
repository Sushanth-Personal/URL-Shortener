const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Url = require("../models/urlModel");
const crypto = require("crypto");
const base62 = require("base62"); // A Base62 encoding library
const Analytics = require("../models/analyticsModel");
const UAParser = require("ua-parser-js");
const getUser = async (req, res) => {
  try {
    // Get the userId from cookies
    const userIdFromCookie = req.cookies.userId;
    // console.log("UserIdfromcookie", userIdFromCookie);

    // Check if the userId is a valid ObjectId format
    const userId = mongoose.Types.ObjectId.isValid(userIdFromCookie)
      ? new mongoose.Types.ObjectId(userIdFromCookie)
      : null;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Invalid userId format" });
    }

    // Fetch user data from the database using the userId, excluding the password field
    const userData = await User.findById(userId).select("-password");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data without the password
    return res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while retrieving user data",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userIdFromCookie = req.cookies.userId;

    // Validate userId format
    const userId = mongoose.Types.ObjectId.isValid(userIdFromCookie)
      ? new mongoose.Types.ObjectId(userIdFromCookie)
      : null;

    if (!userId) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email, contact } = req.body;

    // Validate email format
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Check if email already exists in the database (excluding current user)
      const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Validate contact number (must be exactly 10 digits)
    if (contact && !/^\d{10}$/.test(contact)) {
      return res.status(400).json({ message: "Contact number must be exactly 10 digits" });
    }

    // Update fields if provided
    user.username = username || user.username;
    user.email = email || user.email;
    user.contact = contact || user.contact;

    await user.save();

    return res.status(200).json({ message: "User data updated successfully" });

  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({
      message: "An error occurred while updating user data",
    });
  }
};



const deleteUser = async (req, res) => {
  try {
    const userIdFromCookie = req.cookies.userId;

    // Validate userId format
    const userId = mongoose.Types.ObjectId.isValid(userIdFromCookie)
      ? new mongoose.Types.ObjectId(userIdFromCookie)
      : null;

    if (!userId) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

     // Clear all cookies
     res.clearCookie('userId', { httpOnly: true, secure: true, sameSite: 'Strict' });
     res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'Strict' });

    return res.status(200).json({ message: "User deleted and cookies cleared successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while deleting user",
    });
  }
}
const postUrl = async (req, res) => {
  const { url, expiry, remarks } = req.body;
  console.log("expiry date", expiry);
  // Get userId from the middleware-augmented req object
  const userId = req.user.id;

  if (!url) {
    return res.status(400).json({ message: "URL is required." });
  }

  try {
    // Generate a SHA-256 hash of the URL
    const hash = crypto
      .createHash("sha256")
      .update(url + Date.now().toString())
      .digest("hex");

    // Convert the hash to a Base62 string (to shorten the URL)
    const shortUrl = base62.encode(
      Buffer.from(hash, "hex").readUIntBE(0, 6)
    ); // Only take part of the hash for a shorter URL

    // Validate and handle expiry
    let expiryDate = null;
    if (expiry) {
      const parsedExpiry = new Date(expiry);
      if (!isNaN(parsedExpiry)) {
        expiryDate = parsedExpiry;
      } else {
        return res.status(400).json({ message: "Invalid expiry date format." });
      }
    }

    // Create a new Url document
    const newUrl = new Url({
      userId, // Use userId from the token
      url,
      shortUrl, // Short URL using Base62 encoding
      expiry: expiryDate,
      remarks: remarks || "",
    });

    // Save to the database
    const savedUrl = await newUrl.save();

    res.status(201).json({
      message: "Shortened URL created successfully.",
      shortUrl: savedUrl.shortUrl,
      data: savedUrl,
    });
  } catch (error) {
    console.error("Error creating shortened URL:", error);
    res.status(500).json({
      message: "Server error. Unable to create shortened URL.",
    });
  }
};

const updateUrl = async (req, res) => {
  const {shortUrl, url, expiry, remarks } = req.body;

  // Get userId from the middleware-augmented req object
  const userId = req.user.id;

  if (!url) {
    return res.status(400).json({ message: "URL is required." });
  }

  try {
    const urlReq = await Url.findOne({ shortUrl });

    if (!urlReq) {
      return res.status(404).json({ message: "URL not found." });
    }

    // Check if the URL is being updated
    if (urlReq.url !== url) {
      // Generate a new SHA-256 hash of the updated URL
      const hash = crypto
        .createHash("sha256")
        .update(url + Date.now().toString())
        .digest("hex");

      // Convert the hash to a Base62 string (to shorten the URL)
      const shortUrl = base62.encode(
        Buffer.from(hash, "hex").readUIntBE(0, 6)
      ); // Only take part of the hash for a shorter URL
      
      // Update the shortUrl in the database
      urlReq.shortUrl = shortUrl;
    }

    // Update the other fields
    urlReq.url = url;
    urlReq.remarks = remarks || "";

    // Remove or update the expiry field
    if (expiry) {
      const parsedExpiry = new Date(expiry);
      if (!isNaN(parsedExpiry)) {
        urlReq.expiry = parsedExpiry;
      } else {
        return res.status(400).json({ message: "Invalid expiry date format." });
      }
    } else {
      // Remove the expiry field if not sent
      urlReq.expiry = null;
    }


    // Save the updated document to the database
    const savedUrl = await urlReq.save();
    console.log("savedUrl", savedUrl);
    res.status(200).json({
      message: "Shortened URL updated successfully.",
      shortUrl: savedUrl.shortUrl,
      data: savedUrl,
    });
  } catch (error) {
    console.error("Error updating shortened URL:", error);
    res.status(500).json({
      message: "Server error. Unable to update shortened URL.",
    });
  }
};



const redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;

  console.log("Short URL:", shortUrl);

  try {
    // Find the URL from the database using the short URL
    const urlRecord = await Url.findOne({ shortUrl });

    if (!urlRecord) {
      return res.status(404).json({ message: "URL not found." });
    }

    // Check if the URL has expired
    if (urlRecord.expiry && new Date(urlRecord.expiry) < new Date()) {
      return res.status(400).json({ message: "The URL has expired." });
    }

    console.log("Redirecting to:", urlRecord.url);

    // Capture the User-Agent string
    const userAgentString = req.headers["x-forwarded-user-agent"] || req.headers["user-agent"];
    console.log("User-Agent:", userAgentString);

    // Parse User-Agent
    const parser = new UAParser();
    parser.setUA(userAgentString);
    const uaResult = parser.getResult();

    // Determine device category
    let deviceCategory = "desktop"; // Default
    if (uaResult.device.type === "mobile") {
      deviceCategory = "mobile";
    } else if (uaResult.device.type === "tablet") {
      deviceCategory = "tablet";
    }

    // Get platform (OS name)
    const platform = uaResult.os.name || "Unknown";

    console.log("Detected Device Type:", deviceCategory);
    console.log("Platform:", platform);

    // Capture IP address (handle proxies)
    const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;

    // Create a new analytics record
    const newAnalyticsRecord = new Analytics({
      userId: urlRecord.userId,
      urlId: urlRecord._id,
      url: urlRecord.url,
      shortUrl: urlRecord.shortUrl,
      date: new Date(),
      devices: deviceCategory,
      ipAddress,
      deviceType: deviceCategory,
      platform: platform, // Save platform (Android, iOS, Windows, etc.)
    });

    await newAnalyticsRecord.save();

    // Increment the clicks field
    urlRecord.clicks = (urlRecord.clicks || 0) + 1;
    await urlRecord.save();

    // Redirect to the original URL
    return res.redirect(urlRecord.url);
  } catch (error) {
    console.error("Error redirecting to the URL:", error);
    return res.status(500).json({ message: "Server error. Unable to redirect." });
  }
};



const getUrlsByUser = async (req, res) => {
  try {
    // Extract the userId from the cookies
    const userId = req.cookies.userId;

    // Check if the userId exists in the cookie
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID is missing." });
    }

    // Get the page number and limit from the query parameters (default to page 1 and limit 5)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch URLs from the database for the given userId with pagination
    const urls = await Url.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by latest

    // Get the total number of URLs to calculate the total number of pages
    const totalUrls = await Url.countDocuments({ userId });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalUrls / limit);

    // Respond with the paginated URLs and pagination info
    res.status(200).json({
      pagination: {
        page,
        totalPages,
        totalUrls,
        limit,
      },
      data: urls,
    });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getAnalytics = async (req, res) => {
  try {
    const userIdFromCookie = req.cookies.userId;

    // Validate userId format
    const userId = mongoose.Types.ObjectId.isValid(userIdFromCookie)
      ? new mongoose.Types.ObjectId(userIdFromCookie)
      : null;

    if (!userId) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Get page and limit from query parameters (with defaults)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the number of documents to skip based on the page
    const skip = (page - 1) * limit;

    // Query the Analytics model with pagination
    const analyticsData = await Analytics.find({ userId })
      .populate("urlId", "originalUrl shortUrl") // Populate URL details from the Url model
      .skip(skip) // Skip the appropriate number of documents
      .limit(limit) // Limit the number of documents returned
      .lean();

    if (!analyticsData || analyticsData.length === 0) {
      return res
        .status(404)
        .json({ error: "No analytics data found for this user" });
    }

    // Get the total count of analytics data for pagination info
    const totalCount = await Analytics.countDocuments({ userId });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    // Respond with analytics data and pagination info
    res.status(200).json({
      data: analyticsData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getClicks = async (req, res) => {
  try {
    const userIdFromCookie = req.cookies.userId;

    // Validate userId format
    const userId = mongoose.Types.ObjectId.isValid(userIdFromCookie)
      ? new mongoose.Types.ObjectId(userIdFromCookie)
      : null;

    if (!userId) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Aggregate analytics data for the user
    const analyticsData = await Analytics.aggregate([
      { $match: { userId: userId } }, // Match records with the given userId
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            deviceType: "$deviceType",
          }, // Group by day and device type
          count: { $sum: 1 }, // Count clicks for each device type per day
        },
      },
      {
        $group: {
          _id: "$_id.day", // Group by day
          totalClicks: { $sum: "$count" }, // Total clicks for the day
          clicksPerDevice: {
            $push: {
              deviceType: "$_id.deviceType",
              clicks: "$count",
            },
          }, // Collect device types and their counts for each day
        },
      },
      {
        $group: {
          _id: null, // Group everything to calculate overall totals
          totalClicks: { $sum: "$totalClicks" }, // Grand total clicks
          clicksPerDevice: {
            $push: "$clicksPerDevice",
          }, // Collect all device clicks properly
          clicksPerDay: {
            $push: {
              day: "$_id",
              totalClicks: "$totalClicks",
            },
          }, // Add day-wise total clicks
        },
      },
    ]);

    if (!analyticsData || analyticsData.length === 0) {
      return res.status(404).json({ error: "No analytics data found" });
    }

    // Flatten clicksPerDevice correctly
    const deviceClicksMap = new Map();

    analyticsData[0].clicksPerDevice.flat().forEach(({ deviceType, clicks }) => {
      deviceClicksMap.set(deviceType, (deviceClicksMap.get(deviceType) || 0) + clicks);
    });

    const finalClicksPerDevice = Array.from(deviceClicksMap, ([deviceType, clicks]) => ({
      deviceType,
      clicks,
    }));

    res.status(200).json({
      totalClicks: analyticsData[0].totalClicks,
      clicksPerDevice: finalClicksPerDevice, // Now properly aggregated
      clicksPerDay: analyticsData[0].clicksPerDay,
    });
  } catch (error) {
    console.error("Error fetching clicks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const deleteUrl = async (req, res) => {
  try {
    const userIdFromCookie = req.cookies.userId;

    // Validate userId format
    const userId = mongoose.Types.ObjectId.isValid(userIdFromCookie)
      ? new mongoose.Types.ObjectId(userIdFromCookie)
      : null;

    if (!userId) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const { urlIdParam } = req.params;
    console.log("typeof urlIdParam", typeof urlIdParam);
        // Validate urlId format
        const urlId = mongoose.Types.ObjectId.isValid(urlIdParam)
        ? new mongoose.Types.ObjectId(urlIdParam)
        : null;

    // Validate urlId format
    if (!mongoose.Types.ObjectId.isValid(urlId)) {
      return res.status(400).json({ message: "Invalid URL ID format" });
    }

    // Find and delete the URL belonging to the user
    const deletedUrl = await Url.findOneAndDelete({ _id: urlId, userId });

    if (!deletedUrl) {
      return res.status(404).json({ message: "URL not found or does not belong to the user" });
    }

    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = (req, res) => {
  console.log("Im here")
  res.cookie("token", "", {
    expires: new Date(0), // Expire the cookie immediately
    httpOnly: true,       // Prevent access from JavaScript
    secure: true,         // Only allow cookies over HTTPS
    sameSite: "Lax",     // Required for cross-site cookies
    path: "/"             // Ensure it applies to the entire domain
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { logoutUser };


module.exports = {
  getUser,
  updateUser,
  deleteUser,
  postUrl,
  updateUrl,
  redirectUrl,
  getUrlsByUser,
  getAnalytics,
  getClicks,
  deleteUrl,
  logoutUser
};
