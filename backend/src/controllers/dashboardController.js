const db = require("../database/database");

exports.getDashboardMetrics = (req, res) => {
  const data = {};

  // 1. Fetch your core metric counts (Available, Assigned, Under Repair)
  const countsSql = `
    SELECT 
      SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) AS available,
      SUM(CASE WHEN status = 'Assigned' THEN 1 ELSE 0 END) AS assigned,
      SUM(CASE WHEN status = 'Under Repair' THEN 1 ELSE 0 END) AS underRepair
    FROM assets
  `;

  db.get(countsSql, [], (err, countsRow) => {
    if (err) return res.status(500).json({ message: err.message });

    data.available = (countsRow && countsRow.available) || 0;
    data.assigned = (countsRow && countsRow.assigned) || 0;
    data.underRepair = (countsRow && countsRow.underRepair) || 0;

    // 2. Fetch asset types and counts (This fixes your "No data available" box!)
    const typeSql = `
  SELECT LOWER(type) AS type, COUNT(*) AS count 
  FROM assets 
  WHERE type IS NOT NULL AND type != ''
  GROUP BY LOWER(type)
`;
    db.all(typeSql, [], (err2, typeRows) => {
      if (err2) return res.status(500).json({ message: err2.message });
      
      // This fills the metrics.usageByType array your frontend is mapping over
      data.usageByType = typeRows || [];

      // 3. Fetch reminders (assets not serviced in past 6 months)
    const reminderSql = `
  SELECT id, name, asset_tag, status, last_serviced_date 
  FROM assets 
  WHERE last_serviced_date IS NOT NULL 
    AND DATE(last_serviced_date) <= DATE('now', '-6 months')
`;

      db.all(reminderSql, [], (err3, reminderRows) => {
        if (err3) return res.status(500).json({ message: err3.message });
        
        data.maintenanceReminders = reminderRows || [];

        // Send everything back to your React app in one clean package
        res.json(data);
      });
    });
  });
};