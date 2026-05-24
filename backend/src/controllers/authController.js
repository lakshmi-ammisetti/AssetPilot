const db = require('../database/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['employee', 'agent', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    [name, email, hashedPassword, role],
    function (err) {
      if (err) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      res.status(201).json({
        message: 'User registered successfully',
        userId: this.lastID
      });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      userId: user.id
    });
  });
};

exports.me = (req, res) => {
  db.get(
    `SELECT id, name, email, role FROM users WHERE id = ?`,
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    }
  );
};