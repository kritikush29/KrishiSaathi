const express = require('express');
const router  = express.Router();
const { getPrices } = require('../controllers/priceController');

// GET /api/prices?state=Maharashtra&district=Pune
router.get('/', getPrices);

module.exports = router;
