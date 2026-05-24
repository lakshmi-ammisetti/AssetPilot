const express = require("express");

const router = express.Router();

const {
  getDashboardMetrics
} = require("../controllers/dashboardController");

router.get("/assets", getDashboardMetrics);

module.exports = router;