const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const role = require('../middleware/role');
const {
  createAsset,
  getAssets,
  assignAsset,
  getEmployeeAssets,
  updateAsset,
  deleteAsset,
  getMaintenanceReminders,
} = require('../controllers/assetController');
router.get('/', auth, getAssets);
router.post('/', auth, role('admin'), createAsset);

router.get('/reminders', getMaintenanceReminders);
router.get('/employee/:employeeId', auth, getEmployeeAssets);

router.put('/:id/assign', auth, role('admin', 'agent'), assignAsset);
router.put('/:id', auth, role('admin'), updateAsset);
router.delete('/:id', auth, role('admin'), deleteAsset);

module.exports = router;
