const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const dotenv = require("dotenv");
dotenv.config();

const jwtExpiresIn = "150m";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: jwtExpiresIn,
  });
};

const registerUser = async (req, res) => {
  const { username, email, contact, password } = req.body;
  console.log(username, email, contact, password);
  try {
    // Check if username already exists
    const existingUserName = await User.exists({ username });

    if (existingUserName) {
      return res
        .status(400)
        .json({ message: "Username already exists" });
    }

    // Check if email already exists
    const existingEmail = await User.exists({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists" });
    }

     // Check if email already exists
     const existingNumber = await User.exists({ contact });
     if (existingNumber) {
       return res
         .status(400)
         .json({ message: "Contact already exists" });
     }

    // Create new user if no existing user or email found
    const user = new User({ username, email,contact, password });

    // Save the user to the database
    await user.save();

    // Send response with tokens
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(400).json({ message: "Error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Verify the password
    const isPasswordValid = await user.comparePassword(password); // Assuming `comparePassword` is a method to verify the password
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate the access token
    const accessToken = generateAccessToken(user._id);

    // Convert the Mongoose document to a plain object
    const userData = user.toObject();

    // Remove the password field from the user data
    delete userData.password;

    // Set cookies with HttpOnly, Secure, and SameSite flags
    const oneHour = 3600; // Cookie expiration time in seconds
    console.log(accessToken, user._id);
    console.log(process.env.NODE_ENV);
    // Set userId cookie
    res.cookie("userId", user._id, {
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: oneHour * 1000, // Cookie expiration time in milliseconds
      path: "/",
    });

    // Set accessToken cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: oneHour * 1000, // Cookie expiration time in milliseconds
      path: "/",
    });

    // Send the response with a success message (without sending user password)
    res.status(200).json({
      message: "Success",
      user: userData, // Send all user details excluding the password
    });
  } catch (error) {
    console.error("Login error:", error.message); // Log the error
    res.status(500).json({ error: "Server error during login" }); // Handle server error
  }
};


module.exports = {
  registerUser,
  loginUser,
};
