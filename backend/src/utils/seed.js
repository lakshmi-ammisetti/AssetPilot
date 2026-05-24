const db = require('../database/database');
const bcrypt = require('bcryptjs');

const users = [
  { name: 'Admin User', email: 'admin@assetpilot.com', password: 'admin123', role: 'admin' },
  { name: 'IT Agent', email: 'agent@assetpilot.com', password: 'agent123', role: 'agent' },
  { name: 'Employee One', email: 'employee@assetpilot.com', password: 'employee123', role: 'employee' }
];

const assets = [
  ['AST-1001', 'Dell Latitude 5440', 'Laptop', 'Laptop', 'Available', '2024-02-10', '2025-01-12'],
  ['AST-1002', 'Samsung 24-inch Monitor', 'Monitor', 'Monitor', 'Assigned', '2023-08-15', '2025-03-20'],
  ['AST-1003', 'Logitech Keyboard', 'Accessories', 'Keyboard', 'Under Repair', '2024-06-18', '2024-12-10']
];

db.serialize(() => {
  users.forEach((u) => {
    const hash = bcrypt.hashSync(u.password, 10);
    db.run(
      `INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      [u.name, u.email, hash, u.role]
    );
  });

  assets.forEach((a) => {
    db.run(
      `
      INSERT OR IGNORE INTO assets
      (asset_tag, name, category, type, status, purchase_date, last_serviced_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      a
    );
  });
});