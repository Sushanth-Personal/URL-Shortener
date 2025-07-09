const express = require("express");
const router = express.Router();
const {
  getUser,
  updateUser,
  deleteUser,
  postUrl,
  getUrlsByUser,
  updateUrl,
  getAnalytics,
  getClicks,
  deleteUrl,
  logoutUser
} = require("../controllers/mainController.js");

router.get("/user", getUser);
router.put("/user", updateUser);
router.delete("/user", deleteUser);
router.post("/url", postUrl);
router.delete("/url/:urlIdParam", deleteUrl);
router.put("/url", updateUrl);
router.get("/url", getUrlsByUser);
router.get("/analytics", getAnalytics);
router.get("/clicks", getClicks);
router.post("/logout", logoutUser);
router.get("/", (req, res) =>
  res.status(200).json({ message: "Connected" })
);

module.exports = router;
