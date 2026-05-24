const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./database/database');
const app = express();

app.use(cors({
  origin: 'https://asset-pilot-three.vercel.app'
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'AssetPilot API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});