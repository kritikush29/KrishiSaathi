const { fetchAgriNews } = require('../services/newsService');

// Cache to avoid hammering RSS feeds on every request
let cachedNews = null;
let cacheTime   = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const getNews = async (req, res) => {
  try {
    const now = Date.now();
    if (!cachedNews || now - cacheTime > CACHE_TTL) {
      cachedNews = await fetchAgriNews();
      cacheTime  = now;
    }
    res.json({ success: true, count: cachedNews.length, data: cachedNews });
  } catch (err) {
    console.error('News API error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch news', data: [] });
  }
};

module.exports = { getNews };
