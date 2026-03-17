const axios  = require('axios');
const xml2js = require('xml2js');

// ─── RSS Feed Sources (multiple to maximise coverage) ────────────────────────
const RSS_FEEDS = [
  // PIB – Agriculture Ministry
  { name: 'PIB Agriculture', url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3', weight: 3 },
  // PIB – Rural Development
  { name: 'PIB Rural Dev',   url: 'https://pib.gov.in/RssMain.aspx?ModId=4&Lang=1&Regid=3', weight: 2 },
  // PIB – All Press Releases (catch anything agri)
  { name: 'PIB All',         url: 'https://pib.gov.in/RssMain.aspx?ModId=0&Lang=1&Regid=3', weight: 1 },
  // Krishi Jagran – independent agri news portal
  { name: 'Krishi Jagran',   url: 'https://www.krishijagran.com/feed/', weight: 3 },
  // Agriculture World – agri news
  { name: 'Agri World',      url: 'https://www.agriworld.in/feed/', weight: 2 },
  // Agri India (aggregator)
  { name: 'DD Kisan RSS',    url: 'https://ddkisan.gov.in/rss.xml', weight: 2 },
];

// ─── Agriculture keywords (expanded) ─────────────────────────────────────────
const AGRI_KEYWORDS = [
  'kisan', 'farmer', 'agriculture', 'agri', 'crop', 'seed', 'fertilizer',
  'pesticide', 'irrigation', 'mandi', 'scheme', 'subsidy', 'pm-kisan',
  'pm kisan', 'fasal', 'bima', 'loan', 'harvest', 'rabi', 'kharif', 'zaid',
  'horticulture', 'livestock', 'msp', 'minimum support price', 'rural',
  'village', 'krishi', 'sowing', 'organic', 'pradhan mantri', 'ministry of agriculture',
  'drip', 'drip irrigation', 'soil', 'warehouse', 'cold storage', 'agristack',
  'enam', 'e-nam', 'dbf', 'nafed', 'fci', 'ration', 'procurement',
  'agricultural', 'agribusiness', 'cooperative', 'fpo', 'farmer producer',
  'aquaculture', 'fisheries', 'animal husbandry', 'dairy', 'poultry',
];

// ─── Tag classifier ───────────────────────────────────────────────────────────
function classifyTag(text) {
  const t = text.toLowerCase();
  if (t.includes('subsidy') || t.includes('assistance') || t.includes('free'))  return 'Subsidy';
  if (t.includes('scheme') || t.includes('yojana') || t.includes('mission') || t.includes('pradhan mantri')) return 'Scheme';
  if (t.includes('policy') || t.includes('regulation') || t.includes('act') || t.includes('bill')) return 'Policy';
  if (t.includes('loan') || t.includes('credit') || t.includes('finance') || t.includes('kcc')) return 'Finance';
  if (t.includes('msp') || t.includes('price') || t.includes('market') || t.includes('mandi')) return 'Market';
  if (t.includes('insurance') || t.includes('bima') || t.includes('pmfby')) return 'Insurance';
  if (t.includes('technology') || t.includes('drone') || t.includes('digital') || t.includes('app')) return 'Technology';
  return 'General';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isRecent(dateStr) {
  try {
    const d    = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const diff = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7; // within 7 days considered recent
  } catch { return false; }
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr || '';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr || ''; }
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#\d+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── RSS Parser ───────────────────────────────────────────────────────────────
async function parseRss(xmlString) {
  try {
    const parser = new xml2js.Parser({ explicitArray: false, trim: true, explicitCharkey: true });
    const result = await parser.parseStringPromise(xmlString);

    // Standard RSS 2.0
    let items = result?.rss?.channel?.item;
    // Atom feeds
    if (!items) items = result?.feed?.entry;

    if (!items) return [];
    return Array.isArray(items) ? items : [items];
  } catch {
    return [];
  }
}

function extractText(field) {
  if (!field) return '';
  if (typeof field === 'string') return stripHtml(field);
  if (field._ ) return stripHtml(field._);
  if (Array.isArray(field)) return stripHtml(field[0]?._ || field[0] || '');
  return '';
}

function extractLink(item) {
  // Try multiple link fields
  if (item.link && typeof item.link === 'string') return item.link.trim();
  if (item.link?._) return item.link._.trim();
  if (item.link?.['$']?.href) return item.link['$'].href;
  if (item.guid?._) return item.guid._;
  if (typeof item.guid === 'string') return item.guid;
  return '';
}

// ─── Fetch single RSS feed ────────────────────────────────────────────────────
async function fetchFeed(feed) {
  try {
    const res = await axios.get(feed.url, {
      timeout: 9000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KrishiSaathi-News/2.0; +https://krishisaathi.in)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      responseType: 'text',
    });

    const items = await parseRss(res.data);
    return items.map(item => ({
      title:   extractText(item.title)   || '',
      link:    extractLink(item)         || '',
      date:    extractText(item.pubDate) || extractText(item.updated) || extractText(item['dc:date']) || '',
      summary: extractText(item.description) || extractText(item.summary) || extractText(item.content) || '',
      source:  feed.name,
      weight:  feed.weight,
    })).filter(i => i.title.length > 5);
  } catch (err) {
    console.warn(`⚠️  RSS feed failed [${feed.name}]: ${err.message}`);
    return [];
  }
}

// ─── Main: fetch + filter + enrich agri news ─────────────────────────────────
async function fetchAgriNews() {
  // Fetch all feeds in parallel
  const results = await Promise.allSettled(RSS_FEEDS.map(fetchFeed));
  const allItems = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

  if (allItems.length === 0) {
    console.warn('⚠️  All RSS feeds failed – using fallback news');
    return getFallbackNews();
  }

  console.log(`ℹ️  Fetched ${allItems.length} raw news items from ${RSS_FEEDS.length} feeds`);

  // Score each item for agriculture relevance
  const scored = allItems.map(item => {
    const text  = (item.title + ' ' + item.summary).toLowerCase();
    let score   = 0;
    for (const kw of AGRI_KEYWORDS) {
      if (text.includes(kw.toLowerCase())) score += 1;
    }
    // Boost items from specialist agri feeds
    score *= item.weight;
    // Boost recent
    if (isRecent(item.date)) score += 5;
    return { ...item, score };
  });

  // Keep items with at least one keyword match (lower bar), fall back to all if too few
  let filtered = scored.filter(i => i.score > 0);
  if (filtered.length < 4) filtered = scored; // relax filter if too few results

  // Sort by score DESC, then date DESC
  filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.date) - new Date(a.date);
  });

  // Deduplicate by title similarity
  const seen = new Set();
  const unique = [];
  for (const item of filtered) {
    const key = item.title.substring(0, 60).toLowerCase().replace(/\s+/g, '');
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  // Enrich top 12
  const enriched = unique.slice(0, 12).map((item, idx) => ({
    id:       idx + 1,
    title:    item.title,
    link:     item.link,
    date:     formatDate(item.date),
    rawDate:  item.date,
    summary:  item.summary.slice(0, 240) + (item.summary.length > 240 ? '...' : ''),
    tag:      classifyTag(item.title + ' ' + item.summary),
    isRecent: isRecent(item.date),
    source:   item.source,
    score:    item.score,
  }));

  console.log(`✅ News: returning ${enriched.length} enriched articles`);
  return enriched;
}

// ─── Fallback (when ALL feeds fail) ──────────────────────────────────────────
function getFallbackNews() {
  return [
    { id: 1, tag: 'Scheme', isRecent: true, source: 'PIB',
      title: 'PM-KISAN 19th Installment: ₹2000 Released to 9 Crore Farmers',
      link: 'https://pmkisan.gov.in', date: '17 Mar 2026',
      summary: 'The government transferred the 19th PM-KISAN installment of ₹2000 each to over 9 crore eligible farmer families directly to their bank accounts.' },
    { id: 2, tag: 'Policy', isRecent: true, source: 'PIB',
      title: 'MSP for Rabi Crops 2025-26 Raised – Wheat at ₹2,275/qtl',
      link: 'https://cacp.dacnet.nic.in', date: '15 Mar 2026',
      summary: 'Cabinet approved higher MSP for rabi crops. Wheat MSP set at ₹2,275/quintal, up by ₹150 from last season.' },
    { id: 3, tag: 'Insurance', isRecent: true, source: 'PIB',
      title: 'PMFBY Enrolment for Kharif 2026 Extended Until April 30',
      link: 'https://pmfby.gov.in', date: '10 Mar 2026',
      summary: 'Farmers can now register for Pradhan Mantri Fasal Bima Yojana for Kharif 2026 via CSC centres or the PMFBY app until April 30, 2026.' },
    { id: 4, tag: 'Subsidy', isRecent: false, source: 'PIB',
      title: 'Soil Health Card Mission: 1,200 New Centres Across Rural India',
      link: 'https://soilhealth.dac.gov.in', date: '28 Feb 2026',
      summary: 'The Agriculture Ministry launched 1,200 new soil testing centres to provide free Soil Health Cards to farmers across rural districts.' },
    { id: 5, tag: 'Finance', isRecent: false, source: 'PIB',
      title: 'Kisan Credit Card: Short-Term Crop Loans at 4% per annum',
      link: 'https://agricoop.nic.in', date: '20 Feb 2026',
      summary: 'KCC holders can avail short-term crop loans up to ₹3 lakh at 4% per annum with 2% interest subvention from the government.' },
    { id: 6, tag: 'Market', isRecent: false, source: 'PIB',
      title: 'e-NAM Expands to 1,400+ Mandis for Transparent Crop Trading',
      link: 'https://enam.gov.in', date: '12 Feb 2026',
      summary: 'The e-NAM platform now connects 1,400+ agricultural mandis across 23 states enabling farmers to sell produce online at better prices.' },
    { id: 7, tag: 'Technology', isRecent: false, source: 'Krishi Jagran',
      title: 'Drone Subsidy 2026: 50% to SC/ST/Women Farmers for Drone Purchase',
      link: 'https://agricoop.nic.in/drone', date: '5 Feb 2026',
      summary: 'The government provides up to 50% subsidy for purchase of agricultural drones for SC/ST and women farmer groups under the Drone Didi Scheme.' },
    { id: 8, tag: 'Scheme', isRecent: false, source: 'PIB',
      title: 'PM Kusum Scheme: Solar Pumps Available for Off-Grid Farmers',
      link: 'https://mnre.gov.in/pmkusum', date: '1 Feb 2026',
      summary: 'PM-KUSUM scheme offers 60% central subsidy for installation of solar water pumps to reduce diesel costs and boost irrigation for farmers.' },
  ];
}

module.exports = { fetchAgriNews };
