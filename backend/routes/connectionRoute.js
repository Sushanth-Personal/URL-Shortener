const express = require("express");
const router = express.Router();
const { redirectUrl } = require("../controllers/mainController.js");


router.get("/", (req, res) =>
  res.status(200).json({ message: "Connected" })
);
router.get("/:shortUrl",  redirectUrl);

module.exports = router;
