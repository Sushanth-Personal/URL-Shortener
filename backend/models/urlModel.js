const express = require("express");
const mongoose = require("mongoose");

// Define the user authentication schema
const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing
      ref: "User", // Reference the User model
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
    remarks: {
      type: String,
      required: false,
    },
    expiry: {
      type: Date,
      required: false,
    },
    clicks: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

// Export the url model
const Url = mongoose.model("Url", urlSchema);
module.exports = Url;
