const express = require("express");
const router = express.Router();
const { redirectUrl } = require("../controllers/mainController.js");


router.get("/:shortUrl",  redirectUrl);

module.exports = router;
