const db = require("../database/database");

exports.createMaintenanceRequest = (req, res) => {
  const {
    asset_id,
    employee_id,
    issue_description,
    attachment_url
  } = req.body;

  if (!asset_id || !employee_id || !issue_description) {
    return res.status(400).json({
      message: "Missing required fields"
    });
  }

  db.run(
    `
    INSERT INTO maintenance_requests
    (
      asset_id,
      employee_id,
      issue_description,
      attachment_url,
      status
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      asset_id,
      employee_id,
      issue_description,
      attachment_url || null,
      "Open"
    ],
    function (err) {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.status(201).json({
        message: "Maintenance request created",
        maintenanceId: this.lastID
      });
    }
  );
};

exports.updateMaintenanceStatus = (req, res) => {

  const maintenanceId = req.params.id;

  const {
    status,
    resolution_details,
    assigned_agent_id
  } = req.body;

  db.run(
    `
    UPDATE maintenance_requests
    SET
      status = ?,
      resolution_details = ?,
      assigned_agent_id = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      status,
      resolution_details,
      assigned_agent_id,
      maintenanceId
    ],
    function (err) {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json({
        message: "Maintenance updated"
      });
    }
  );
};

exports.getMaintenanceRequests = (req, res) => {

  db.all(
    `
    SELECT *
    FROM maintenance_requests
    ORDER BY created_at DESC
    `,
    [],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json(rows);
    }
  );
};