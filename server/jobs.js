const cron = require('node-cron');
const { fetchMandiPrices, fetchNcdexPrices, storePriceHistory } = require('./services/priceService');
const { fetchAgriNews } = require('./services/newsService');

/**
 * Background job: refresh prices every 6 hours.
 * Runs at 00:00, 06:00, 12:00, 18:00 IST.
 */
function startPriceJob() {
  cron.schedule('0 0,6,12,18 * * *', async () => {
    console.log('🌾 [CRON] Refreshing mandi + NCDEX prices...');
    try {
      const mandiData = await fetchMandiPrices();
      storePriceHistory(mandiData);
      console.log(`✅ [CRON] Stored prices for ${mandiData.length} crops.`);
    } catch (err) {
      console.error('❌ [CRON] Price job failed:', err.message);
    }
  });
}

/**
 * Background job: refresh agri news every 30 minutes.
 */
function startNewsJob() {
  cron.schedule('*/30 * * * *', async () => {
    console.log('📰 [CRON] Refreshing agri news feed...');
    try {
      await fetchAgriNews(); // newsController holds its own cache; just warm it
      console.log('✅ [CRON] News feed refreshed.');
    } catch (err) {
      console.error('❌ [CRON] News job failed:', err.message);
    }
  });
}

function initJobs() {
  startPriceJob();
  startNewsJob();
  console.log('⏰ Background jobs scheduled (prices: 4×/day, news: every 30 min)');
}

module.exports = { initJobs };
