const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const role = require('../middleware/role');
const db = require('../database/database');

router.get('/', auth, role('admin', 'agent'), (req, res) => {
  db.all(
    `SELECT id, name, email, role FROM users ORDER BY id DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json(rows);
    }
  );
});

module.exports = router;