const db = require('../database/database');

// 1. Create a New Asset
exports.createAsset = (req, res) => {
  const {
    asset_tag,
    name,
    category,
    type,
    status,
    purchase_date,
    last_serviced_date,
    depreciation_value,
    qr_code_url
  } = req.body;

  if (!asset_tag || !name || !category || !type) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  db.run(
    `
    INSERT INTO assets (
      asset_tag, name, category, type, status, purchase_date,
      last_serviced_date, depreciation_value, qr_code_url
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      asset_tag,
      name,
      category,
      type,
      status || 'Available',
      purchase_date || null,
      last_serviced_date || null,
      depreciation_value || 0,
      qr_code_url || null
    ],
    function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      res.status(201).json({
        message: 'Asset created successfully',
        assetId: this.lastID
      });
    }
  );
};

// 2. Update an Existing Asset
exports.updateAsset = (req, res) => {
  const assetId = req.params.id;
  const {
    asset_tag,
    name,
    category,
    type,
    status,
    purchase_date,
    last_serviced_date,
    depreciation_value
  } = req.body;

  if (!asset_tag || !name || !category || !type) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  db.run(
    `
    UPDATE assets
    SET asset_tag = ?,
        name = ?,
        category = ?,
        type = ?,
        status = ?,
        purchase_date = ?,
        last_serviced_date = ?,
        depreciation_value = ?
    WHERE id = ?
    `,
    [
      asset_tag,
      name,
      category,
      type,
      status,
      purchase_date,
      last_serviced_date,
      depreciation_value,
      assetId
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json({ message: 'Asset updated successfully' });
    }
  );
};

// 3. Delete an Asset (Single Clean Copy)
exports.deleteAsset = (req, res) => {
  const assetId = req.params.id;

  db.run(`DELETE FROM assets WHERE id = ?`, [assetId], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to delete asset", error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json({ message: 'Asset deleted successfully' });
  });
};

// 4. Get Assets List with Safe Fallbacks & Case Insensitive Filters
exports.getAssets = (req, res) => {
  // Grab all parameters safely with clean empty defaults
  const search = req.query.search || '';
  const type = req.query.type || '';
  const status = req.query.status || '';
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  const offset = (Number(page) - 1) * Number(limit);

  // COALESCE prevents SQLite from breaking if database cells are NULL
  const sql = `
    SELECT * FROM assets
    WHERE LOWER(COALESCE(name, '')) LIKE ?
      AND (? = '' OR LOWER(COALESCE(type, '')) = LOWER(?))
      AND (? = '' OR LOWER(COALESCE(status, '')) = LOWER(?))
    ORDER BY id ASC
    LIMIT ? OFFSET ?
  `;

  const queryParams = [
    `%${search.toLowerCase()}%`,
    type, type,
    status, status,
    Number(limit),
    offset
  ];

  db.all(sql, queryParams, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const countSql = `
      SELECT COUNT(*) AS total FROM assets
      WHERE LOWER(COALESCE(name, '')) LIKE ?
        AND (? = '' OR LOWER(COALESCE(type, '')) = LOWER(?))
        AND (? = '' OR LOWER(COALESCE(status, '')) = LOWER(?))
    `;

    const countParams = [
      `%${search.toLowerCase()}%`,
      type, type,
      status, status
    ];

    db.get(countSql, countParams, (err2, countRow) => {
      if (err2) {
        return res.status(500).json({ message: err2.message });
      }

      const totalItems = countRow ? countRow.total : 0;

      res.json({
        data: rows || [],
        total: totalItems,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalItems / Number(limit)) || 1
      });
    });
  });
};

// 5. Assign Asset to Staff Member
exports.assignAsset = (req, res) => {
  const assetId = req.params.id;
  const { assigned_to } = req.body;

  if (!assigned_to) {
    return res.status(400).json({ message: 'assigned_to is required' });
  }

  db.get(`SELECT * FROM assets WHERE id = ?`, [assetId], (err, asset) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    if (asset.status === 'Assigned' || asset.assigned_to) {
      return res.status(409).json({ message: 'Asset already assigned' });
    }

    db.run(
      `UPDATE assets SET assigned_to = ?, status = 'Assigned' WHERE id = ?`,
      [assigned_to, assetId],
      function (updateErr) {
        if (updateErr) return res.status(500).json({ message: updateErr.message });

        db.run(
          `INSERT INTO repair_logs (asset_id, action, performed_by) VALUES (?, ?, ?)`,
          [assetId, 'Asset assigned', assigned_to]
        );
        db.run(
          `
          INSERT INTO asset_assignments (asset_id, employee_id, assigned_by)
          VALUES (?, ?, ?)
          `,
          [assetId, assigned_to, assigned_to]
        );
        res.json({ message: 'Asset assigned successfully' });
      }
    );
  });
};

// 6. Get Assets belonging to a specific employee
exports.getEmployeeAssets = (req, res) => {
  const { employeeId } = req.params;
  const sql = `SELECT * FROM assets WHERE assigned_to = ?`;

  db.all(sql, [employeeId], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
};

// 7. Standalone Maintenance Reminders Lookup
exports.getMaintenanceReminders = (req, res) => {
  const sql = `
    SELECT * FROM assets
    WHERE last_serviced_date IS NOT NULL
      AND DATE(last_serviced_date) <= DATE('now', '-6 months')
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
};