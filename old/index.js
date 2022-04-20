const parser = require("body-parser");
const express = require("express");
const rateLimit = require('express-rate-limit');

const router = express.Router();

const authLimit = rateLimit({
  windowMs: 30000, // 10 secs
  max: 5,
  handler: (req, res) => res.status(429).send('Too many requests, please try again later.'),
});

router.use("/auth", authLimit);
router.use("/auth", require("./auth"));
router.use("/logout", require("./logout"));

router.use("/webhooks", require("./webhooks"));

module.exports = router;
