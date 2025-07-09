const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user authentication schema
const authSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensure each username is unique
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure each email is unique
      match: /.+\@.+\..+/, // Basic email format validation
    },
    contact: {
      type: String, // Assuming a string for phone numbers
      required: true, // Make it mandatory
      unique: true, // Ensure no duplicate contact numbers
      match: /^[0-9]{10}$/, // Validate a 10-digit phone number
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Pre-save middleware to hash the password
authSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});

// Method to compare passwords
authSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Static method for user login
authSchema.statics.login = async function (identifier, password) {
  const user = await this.findOne(
    {
      $or: [{ username: identifier }, { email: identifier }],
    },
    { password: 1 },
    { refreshToken: 1 }
  );

  if (!user) {
    throw new Error("User not found");
  }
  // Check if the password is correct
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  return user._id;
};

// Export the user model
const User = mongoose.model("User", authSchema);
module.exports = User;
