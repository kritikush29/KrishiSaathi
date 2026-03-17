const { getEnrichedPrices } = require('../services/priceService');

const getPrices = async (req, res) => {
  try {
    const { state = '', district = '' } = req.query;
    const data = await getEnrichedPrices(state.trim(), district.trim());
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('Price API error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch price data', data: [] });
  }
};

module.exports = { getPrices };
