import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle, Bell,
  RefreshCw, ExternalLink, Tag, Newspaper, ChevronRight,
  MapPin, Search, Activity, DollarSign, Clock, Filter,
  ChevronDown, Info, Landmark, Sun, FileText, ShieldCheck,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { mockSchemes } from '../data/mockData';
import axios from 'axios';

// ─── Colour palettes ──────────────────────────────────────────────────────────
const TAG_COLORS = {
  Subsidy:    { bg: 'bg-emerald-100',  text: 'text-emerald-700',  border: 'border-emerald-200'  },
  Scheme:     { bg: 'bg-violet-100',   text: 'text-violet-700',   border: 'border-violet-200'   },
  Policy:     { bg: 'bg-blue-100',     text: 'text-blue-700',     border: 'border-blue-200'     },
  Finance:    { bg: 'bg-amber-100',    text: 'text-amber-700',    border: 'border-amber-200'    },
  Market:     { bg: 'bg-orange-100',   text: 'text-orange-700',   border: 'border-orange-200'   },
  Insurance:  { bg: 'bg-pink-100',     text: 'text-pink-700',     border: 'border-pink-200'     },
  Technology: { bg: 'bg-cyan-100',     text: 'text-cyan-700',     border: 'border-cyan-200'     },
  General:    { bg: 'bg-gray-100',     text: 'text-gray-600',     border: 'border-gray-200'     },
};

const CROP_EMOJI = {
  Wheat: '🌾', Rice: '🌾', Cotton: '🪡', Soybean: '🫛',
  Maize: '🌽', Chana: '🫘', Mustard: '🟡', Moong: '🫛',
  Turmeric: '🟡', Cumin: '🌿', 'Guar Seed': '🌱', 'Castor Seed': '🌱',
  Coriander: '🌿', Onion: '🧅', Potato: '🥔', Barley: '🌾',
  Groundnut: '🥜', default: '🌿',
};

const INDIAN_STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana',
  'Uttar Pradesh','Uttarakhand','West Bengal',
];

const NEWS_TABS = ['All', 'Scheme', 'Policy', 'Subsidy', 'Finance', 'Insurance', 'Market', 'Technology'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt  = (p) => p != null ? `₹${Number(p).toLocaleString('en-IN')}` : '—';
const ago  = (iso) => {
  if (!iso) return '';
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60)   return 'just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrendBadge({ trend }) {
  if (trend === 'up')   return <span className="inline-flex items-center gap-0.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><TrendingUp className="w-3 h-3" />Rising</span>;
  if (trend === 'down') return <span className="inline-flex items-center gap-0.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full"><TrendingDown className="w-3 h-3" />Falling</span>;
  return <span className="inline-flex items-center gap-0.5 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"><Minus className="w-3 h-3" />Stable</span>;
}

function MspPill({ msp }) {
  if (!msp) return null;
  const pos = msp.diff >= 0;
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${pos ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
      title={`MSP: ${fmt(msp.msp)}`}>
      {pos ? '↑' : '↓'} {Math.abs(msp.pct)}% vs MSP
    </span>
  );
}

function PriceCard({ item, idx }) {
  const emoji  = CROP_EMOJI[item.crop] || CROP_EMOJI.default;
  const isHigh = item.alert === 'HIGH';
  const isLow  = item.alert === 'LOW';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      className={`relative bg-white rounded-2xl border-2 overflow-hidden hover:shadow-lg transition-all group
        ${isHigh ? 'border-red-200' : isLow ? 'border-emerald-300' : 'border-gray-100 hover:border-primary-200'}`}
    >
      {/* Alert top strip */}
      {(isHigh || isLow) && (
        <div className={`h-1 w-full ${isHigh ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-green-500'}`} />
      )}
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl group-hover:scale-110 transition-transform">{emoji}</span>
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{item.crop}</h3>
              {item.district && (
                <div className="flex items-center gap-0.5 text-[10px] text-gray-400 mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {item.district}{item.state ? `, ${item.state}` : ''}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <TrendBadge trend={item.trend} />
            {item.msp && <MspPill msp={item.msp} />}
          </div>
        </div>

        {/* Mandi price – dominant */}
        <div className={`rounded-xl px-3 py-2.5 mb-3 text-center
          ${isHigh ? 'bg-red-50 border border-red-100' : isLow ? 'bg-emerald-50 border border-emerald-100' : 'bg-primary-50 border border-primary-100'}`}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Mandi Price</div>
          <div className={`text-2xl font-extrabold tracking-tight
            ${isHigh ? 'text-red-600' : isLow ? 'text-emerald-600' : 'text-primary-700'}`}>
            {fmt(item.mandiPrice)}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">per quintal</div>
        </div>

        {/* Min / Max */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-[10px] text-gray-400 font-medium">Min</div>
            <div className="text-sm font-bold text-gray-700">{fmt(item.minPrice)}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-[10px] text-gray-400 font-medium">Max</div>
            <div className="text-sm font-bold text-gray-700">{fmt(item.maxPrice)}</div>
          </div>
        </div>

        {/* NCDEX secondary row */}
        <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-2">
          <div className="flex items-center gap-1 text-gray-400">
            <Activity className="w-3 h-3" />
            <span>NCDEX</span>
            {item.ncdexSymbol && <span className="text-[9px] bg-gray-100 px-1 rounded">{item.ncdexSymbol}</span>}
          </div>
          <span className="font-semibold text-gray-600">
            {item.ncdexPrice ? fmt(item.ncdexPrice) : <span className="text-gray-300 text-[10px]">Unavailable</span>}
          </span>
        </div>

        {/* Alert recommendation */}
        {item.recommendation && (
          <div className={`mt-2.5 text-[11px] px-2.5 py-1.5 rounded-lg font-medium flex items-start gap-1.5
            ${isHigh ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
            <Bell className="w-3 h-3 mt-0.5 flex-shrink-0" />
            {item.recommendation}
          </div>
        )}

        {/* Arrival date */}
        {item.arrivalDate && (
          <div className="text-[9px] text-gray-300 mt-1.5 text-right">{item.arrivalDate}</div>
        )}
      </div>
    </motion.div>
  );
}

function NewsCard({ item, idx }) {
  const colors = TAG_COLORS[item.tag] || TAG_COLORS.General;
  return (
    <motion.a
      href={item.link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group flex gap-3 bg-white rounded-xl border border-gray-100 p-3.5 hover:shadow-md hover:border-primary-200 transition-all"
    >
      {/* Recency bar */}
      <div className={`w-0.5 flex-shrink-0 rounded-full ${item.isRecent ? 'bg-primary-500' : 'bg-gray-200'}`} />
      <div className="min-w-0 flex-grow">
        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border
            ${colors.bg} ${colors.text} ${colors.border}`}>
            <Tag className="w-2.5 h-2.5" />{item.tag}
          </span>
          <div className="flex items-center gap-1.5">
            {item.isRecent && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded-full">NEW</span>
            )}
            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />{item.date}
            </span>
          </div>
        </div>
        <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1 group-hover:text-primary-700 transition-colors line-clamp-2">
          {item.title}
        </h4>
        {item.summary && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-1.5">{item.summary}</p>
        )}
        <div className="flex items-center justify-between">
          {item.source && <span className="text-[9px] text-gray-300">{item.source}</span>}
          <span className="text-xs text-primary-600 font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all ml-auto">
            Read <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}

function SchemeCard({ scheme, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 }}
      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-primary-200 transition-all flex flex-col group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="text-2xl group-hover:scale-110 transition-transform">{scheme.icon}</div>
        <h4 className="font-bold text-gray-900 text-sm leading-snug">{scheme.name}</h4>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-grow">{scheme.description}</p>
      <div className="space-y-2 mb-3">
        <div className="bg-green-50 border border-green-100 rounded-lg p-2">
          <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide block mb-0.5">Eligibility</span>
          <p className="text-xs text-gray-700">{scheme.eligibility}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-2">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide block mb-0.5">Benefits</span>
          <p className="text-xs text-gray-700">{scheme.benefits}</p>
        </div>
      </div>
      <a href={scheme.link} target="_blank" rel="noopener noreferrer"
        className="w-full text-center text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
        Learn More <ChevronRight className="w-3 h-3" />
      </a>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NewsletterPage() {
  // Tab state: 'prices' | 'news' | 'schemes'
  const [activeTab, setActiveTab] = useState('prices');

  // Price state
  const [prices, setPrices]         = useState([]);
  const [priceLoading, setPriceLoad] = useState(true);
  const [priceError, setPriceError]  = useState(null);
  const [priceSearch, setPriceSearch]= useState('');
  const [alertFilter, setAlertFilter]= useState('all');
  const [state, setState]            = useState('');
  const [district, setDistrict]      = useState('');
  const [lastUpdated, setLastUpdated]= useState(null);
  const [dataSource, setDataSource]  = useState('');

  // News state
  const [news, setNews]              = useState([]);
  const [newsLoading, setNewsLoad]   = useState(true);
  const [newsError, setNewsError]    = useState(null);
  const [newsTab, setNewsTab]        = useState('All');
  const [newsSearch, setNewsSearch]  = useState('');

  // Schemes state (from mockData, no loader needed but allow search)
  const [schemeSearch, setSchemeSearch] = useState('');

  const alertCount = prices.filter(p => p.alert).length;

  // ── Fetch prices ─────────────────────────────────────────────────────────
  const fetchPrices = useCallback(async () => {
    setPriceLoad(true);
    setPriceError(null);
    try {
      const res = await axios.get('/api/prices', {
        params: { state, district },
        timeout: 15000,
      });
      const data = res.data.data || [];
      setPrices(data);
      setLastUpdated(new Date());
      // Detect if real API or fallback
      setDataSource(data.some(d => d.arrivalDate) ? 'live' : 'fallback');
    } catch {
      setPriceError('Live API unavailable – showing reference prices.');
      const { FALLBACK_PRICES } = await import('../data/fallbackPrices');
      setPrices(FALLBACK_PRICES);
      setDataSource('offline');
    } finally {
      setPriceLoad(false);
    }
  }, [state, district]);

  // ── Fetch news ───────────────────────────────────────────────────────────
  const fetchNews = useCallback(async () => {
    setNewsLoad(true);
    setNewsError(null);
    try {
      const res = await axios.get('/api/news', { timeout: 15000 });
      const data = res.data.data || [];
      setNews(data);
      if (data.length === 0) throw new Error('empty');
    } catch {
      setNewsError('Live feeds unavailable – showing saved articles.');
      const { FALLBACK_NEWS } = await import('../data/fallbackNews');
      setNews(FALLBACK_NEWS);
    } finally {
      setNewsLoad(false);
    }
  }, []);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);
  useEffect(() => { fetchNews(); },   [fetchNews]);

  // ── Filtered data ─────────────────────────────────────────────────────────
  const filteredPrices = prices.filter(p => {
    const matchSearch = p.crop.toLowerCase().includes(priceSearch.toLowerCase()) ||
      (p.district || '').toLowerCase().includes(priceSearch.toLowerCase());
    const matchAlert = alertFilter === 'all' || p.alert === alertFilter ||
      (alertFilter === 'any' && !!p.alert);
    return matchSearch && matchAlert;
  });

  const filteredNews = news.filter(n => {
    const matchTag    = newsTab === 'All' || n.tag === newsTab;
    const matchSearch = n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      (n.summary || '').toLowerCase().includes(newsSearch.toLowerCase());
    return matchTag && matchSearch;
  });

  const filteredSchemes = mockSchemes.filter(s =>
    s.name.toLowerCase().includes(schemeSearch.toLowerCase()) ||
    s.description.toLowerCase().includes(schemeSearch.toLowerCase())
  );

  // ── Source badge ──────────────────────────────────────────────────────────
  const SourceBadge = () => {
    if (!dataSource) return null;
    const map = {
      live:    { cls: 'bg-green-100 text-green-700', label: '🟢 Live Agmarknet Data' },
      fallback:{ cls: 'bg-amber-100 text-amber-700', label: '🟡 API Data (no date)' },
      offline: { cls: 'bg-red-100 text-red-700',    label: '🔴 Offline Reference' },
    };
    const { cls, label } = map[dataSource] || map.offline;
    return <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${cls}`}>{label}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="pt-20 pb-6 bg-gradient-to-br from-primary-900 via-primary-800 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-semibold border border-white/20">
                  🌾 Krishi Samachar — KrishiSaathi
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-2">
                Market Prices &amp; Farmer Hub
              </h1>
              <p className="text-primary-200 text-sm leading-relaxed max-w-xl">
                Live mandi prices with NCDEX insight · Price alerts · Govt schemes · Policy news — everything a farmer needs in one place.
              </p>
            </div>
            {/* Stats strip */}
            <div className="flex gap-2 flex-wrap mt-2">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur rounded-xl border border-white/20 text-sm">
                <DollarSign className="w-4 h-4 text-emerald-300" />{prices.length} Crops
              </div>
              {alertCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/20 backdrop-blur rounded-xl border border-amber-400/30 text-sm text-amber-200">
                  <Bell className="w-4 h-4 animate-pulse" />{alertCount} Alert{alertCount > 1 ? 's' : ''}
                </div>
              )}
              {lastUpdated && (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur rounded-xl border border-white/20 text-xs text-primary-200">
                  <Clock className="w-3.5 h-3.5" />{ago(lastUpdated.toISOString())}
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur rounded-xl border border-white/20 text-sm">
                <Newspaper className="w-4 h-4 text-violet-300" />{news.length} Articles
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-0">
          {[
            { key: 'prices',  label: '📊 Crop Prices',      count: prices.length },
            { key: 'news',    label: '📰 Policy News',       count: news.length   },
            { key: 'schemes', label: '🏛️ Govt Schemes',     count: mockSchemes.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-colors
                ${activeTab === tab.key ? 'text-primary-700 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {tab.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                ${activeTab === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

        {/* ════ PRICES TAB ════ */}
        <AnimatePresence mode="wait">
          {activeTab === 'prices' && (
            <motion.div key="prices" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Toolbar */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
                <div className="flex flex-wrap gap-3 items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* State filter */}
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      <select value={state} onChange={e => setState(e.target.value)}
                        className="pl-8 pr-7 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer">
                        <option value="">All States</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    {/* District */}
                    <input type="text" placeholder="District…" value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-32 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50" />
                    {/* Refresh */}
                    <button onClick={fetchPrices} disabled={priceLoading}
                      className="flex items-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50">
                      <RefreshCw className={`w-3.5 h-3.5 ${priceLoading ? 'animate-spin' : ''}`} />Refresh
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <SourceBadge />
                    <a href="https://agmarknet.gov.in" target="_blank" rel="noopener noreferrer"
                      className="text-primary-600 hover:underline flex items-center gap-0.5">
                      Agmarknet <ExternalLink className="w-3 h-3" />
                    </a>
                    <a href="https://www.ncdex.com" target="_blank" rel="noopener noreferrer"
                      className="text-primary-600 hover:underline flex items-center gap-0.5">
                      NCDEX <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Search */}
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input type="text" placeholder="Search crop or district…"
                      value={priceSearch} onChange={e => setPriceSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50" />
                  </div>
                  {/* Alert filter */}
                  <select value={alertFilter} onChange={e => setAlertFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400">
                    <option value="all">All Prices</option>
                    <option value="HIGH">🔴 High Alert</option>
                    <option value="LOW">🟢 Low Alert</option>
                    <option value="any">🔔 Any Alert</option>
                  </select>
                </div>

                {priceError && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />{priceError}
                  </div>
                )}
              </div>

              {/* Price grid */}
              {priceLoading ? (
                <div className="flex flex-col items-center py-20 gap-3 text-gray-400">
                  <RefreshCw className="w-8 h-8 text-primary-400 animate-spin" />
                  <p className="text-sm">Fetching live mandi prices from Agmarknet…</p>
                </div>
              ) : filteredPrices.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No crops match your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredPrices.map((item, i) => <PriceCard key={`${item.crop}-${item.district}`} item={item} idx={i} />)}
                </div>
              )}

              <p className="text-xs text-gray-400 text-center mt-6">
                Primary data: <a href="https://agmarknet.gov.in" target="_blank" rel="noopener noreferrer" className="underline">Agmarknet (Govt. of India)</a>.
                NCDEX prices are indicative — sourced from <a href="https://www.ncdex.com" target="_blank" rel="noopener noreferrer" className="underline">ncdex.com</a>.
                Prices update every 30 minutes.
              </p>
            </motion.div>
          )}

          {/* ════ NEWS TAB ════ */}
          {activeTab === 'news' && (
            <motion.div key="news" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
                {/* Sidebar filters */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm text-gray-900">Filter by Topic</h3>
                      <button onClick={fetchNews} disabled={newsLoading}
                        className="text-xs text-primary-600 flex items-center gap-1 hover:text-primary-800">
                        <RefreshCw className={`w-3 h-3 ${newsLoading ? 'animate-spin' : ''}`} />Refresh
                      </button>
                    </div>
                    <div className="space-y-1">
                      {NEWS_TABS.map(t => {
                        const count = t === 'All' ? news.length : news.filter(n => n.tag === t).length;
                        return (
                          <button key={t} onClick={() => setNewsTab(t)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors
                              ${newsTab === t ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <span>{t}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full
                              ${newsTab === t ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* PIB attribution card */}
                  <div className="bg-gradient-to-br from-violet-50 to-primary-50 rounded-2xl border border-violet-100 p-4 text-xs text-gray-600">
                    <p className="font-semibold mb-1 text-violet-700">📡 Live Data Sources</p>
                    <ul className="space-y-1.5">
                      <li>• <a href="https://pib.gov.in" target="_blank" rel="noopener noreferrer" className="underline text-violet-600">Press Information Bureau</a> – Agri &amp; Rural Dev</li>
                      <li>• <a href="https://www.krishijagran.com" target="_blank" rel="noopener noreferrer" className="underline text-violet-600">Krishi Jagran</a> – Farmer News</li>
                      <li>• <a href="https://ddkisan.gov.in" target="_blank" rel="noopener noreferrer" className="underline text-violet-600">DD Kisan</a> – Agri Broadcasts</li>
                    </ul>
                  </div>
                </div>

                {/* News feed */}
                <div>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search news articles…"
                      value={newsSearch} onChange={e => setNewsSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                  </div>

                  {newsError && (
                    <div className="mb-4 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />{newsError}
                    </div>
                  )}

                  {newsLoading ? (
                    <div className="flex flex-col items-center py-20 gap-3 text-gray-400">
                      <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
                      <p className="text-sm">Fetching live government news…</p>
                    </div>
                  ) : filteredNews.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p>No articles found.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredNews.map((item, i) => <NewsCard key={item.id} item={item} idx={i} />)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ SCHEMES TAB ════ */}
          {activeTab === 'schemes' && (
            <motion.div key="schemes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search government schemes…"
                  value={schemeSearch} onChange={e => setSchemeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>

              {filteredSchemes.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No schemes match your search.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredSchemes.map((scheme, i) => <SchemeCard key={scheme.id} scheme={scheme} idx={i} />)}
                </div>
              )}

              <div className="mt-8 bg-gradient-to-r from-primary-50 to-emerald-50 rounded-2xl border border-primary-100 p-5 text-center">
                <p className="text-sm font-semibold text-primary-800 mb-1">Need help applying for a scheme?</p>
                <p className="text-xs text-gray-600 mb-3">Our support team can guide you through the application process.</p>
                <a href="/chat" className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
                  Chat with Support <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
