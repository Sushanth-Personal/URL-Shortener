const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Routes = require('./routes/route');
const ConnectionRoute = require('./routes/connectionRoute');
const UrlRoute = require('./routes/urlRoute');
const ConnectDB = require('./config/db');
const authRoutes = require('./auth/routes/authRoutes');
const authenticateToken = require('./auth/middlewares/authMiddleware');
const morgan = require('morgan');
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

dotenv.config();
ConnectDB();

// Middlewares
const corsOptions = {
  origin: ['http://localhost:3000','https://minilink-frontend.onrender.com'],  // Frontend URL
  credentials: true,  // Allow cookies and credentials to be sent with requests
};

app.use(cors(corsOptions));  // Enable CORS with credentials
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
// Routes and authentication
app.use('/api', authenticateToken);  // Apply token authentication to /api routes
app.use('/auth', authRoutes);  // Auth routes (login, signup, etc.)
app.use('/api', Routes);  // Other API routes
app.use('/connection', ConnectionRoute);
app.use('/',UrlRoute);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("Successfully Connected with PORT: ", PORT);
});

process.on('SIGINT', () => {
  console.log("Server shutting down...");
  server.close(() => {
    console.log("Closed remaining connections");
    process.exit(0);  // Exit after connections are closed
  });
});
