const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
// Middleware function to authenticate token from cookies
const authenticateToken = async (req, res, next) => {
  // Extract token and user ID from cookies\

  const token = req.cookies.accessToken;
  const userId = req.cookies.userId;
  console.log("Token:", token, "userId:", userId);
  // Check for missing token
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No valid access token" });
  }

  // Validate the environment variable
  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error("ACCESS_TOKEN_SECRET is not defined in the environment variables.");
    return res.status(500).json({ message: "Server configuration error." });
  }

  try {
    // Verify the access token
    const decodedAccess = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Optionally check if the decoded user ID matches the userId from the cookie
    if (userId && decodedAccess.id !== userId) {
      return res.status(403).json({ message: "Forbidden: Token does not match user." });
    }

    // Attach user info to the request object
    req.user = decodedAccess;

    // Proceed to the next middleware or route handler
    return next();
  } catch (error) {
    console.error("Access token verification failed:", error.message);

    // Forbidden response for invalid token
    return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
};

module.exports = authenticateToken;
