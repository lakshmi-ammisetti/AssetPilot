const express = require("express");

const router = express.Router();

const {
  createMaintenanceRequest,
  updateMaintenanceStatus,
  getMaintenanceRequests
} = require("../controllers/maintenanceController");

router.post("/", createMaintenanceRequest);

router.put("/:id/status", updateMaintenanceStatus);

router.get("/", getMaintenanceRequests);

module.exports = router;