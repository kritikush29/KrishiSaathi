import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { mockCrops } from '../data/mockData';
import { Search, MapPin, Star, ShoppingCart, X, SlidersHorizontal, Phone, Heart } from 'lucide-react';

const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Pulses', 'Spices', 'Cash Crops'];
const priceRanges = ['Any Price', 'Under ₹1,000', '₹1,000 - ₹3,000', '₹3,000 - ₹6,000', 'Above ₹6,000'];

export default function BuyerMarketplace() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [showBid, setShowBid] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [cart, setCart] = useState([]);
    const [savedItems, setSavedItems] = useState([]);

    const filtered = mockCrops.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === 'All' || c.category === category.toLowerCase().replace(' ', '_');
        return matchSearch && matchCat;
    });

    const toggleSave = (id) => {
        setSavedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const addToCart = (crop) => {
        if (!cart.find(c => c.id === crop.id)) {
            setCart(prev => [...prev, crop]);
        }
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-6">
                <h1 className="page-title">🌾 Marketplace</h1>
                <p className="page-subtitle">Browse and bid on fresh crops directly from farmers.</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" className="input-field pl-10 !py-2.5 text-sm" placeholder="Search by crop name or location..."
                        value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                {cart.length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-xl text-primary-700 font-semibold text-sm">
                        <ShoppingCart className="w-4 h-4" /> {cart.length} items in cart
                    </div>
                )}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {categories.map(c => (
                    <button key={c} onClick={() => setCategory(c)}
                        className={category === c ? 'filter-chip-active' : 'filter-chip'}>
                        {c}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                        className="card-hover-glow group">
                        <div className="h-48 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center overflow-hidden relative">
                            {c.image.startsWith('/') ? (
                                <img src={c.image} alt={c.name} loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <span className="text-5xl group-hover:scale-105 transition-transform duration-500">{c.image}</span>
                            )}
                            <button
                                onClick={() => toggleSave(c.id)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                            >
                                <Heart className={`w-4 h-4 ${savedItems.includes(c.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-gray-900">{c.name}</h3>
                                <span className="badge-green text-xs">{c.bids} bids</span>
                            </div>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {c.location}</p>
                            <p className="text-sm text-gray-600 mt-1">Qty: {c.quantity}</p>
                            <p className="text-sm font-bold text-primary-700 mt-1">{c.priceRange}</p>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs text-gray-600">{c.rating} • {c.farmer}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => { setShowBid(c); setBidAmount(''); }}
                                    className="flex-1 btn-primary !py-2 text-sm flex items-center justify-center gap-1.5">
                                    <ShoppingCart className="w-4 h-4" /> Bid
                                </button>
                                <button onClick={() => addToCart(c)}
                                    className="px-3 py-2 rounded-xl text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5" /> Contact
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-5xl mb-4">🔍</p>
                    <p className="text-xl font-semibold text-gray-700">No crops found</p>
                    <p className="text-gray-500">Try a different search or category.</p>
                </div>
            )}

            {/* Bid Modal */}
            {showBid && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowBid(null)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Place a Bid</h3>
                            <button onClick={() => setShowBid(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-primary-100 flex items-center justify-center text-3xl">
                                {showBid.image.startsWith('/') ? (
                                    <img src={showBid.image} alt={showBid.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{showBid.image}</span>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{showBid.name}</p>
                                <p className="text-sm text-gray-500">{showBid.quantity} • {showBid.location}</p>
                                <p className="text-sm font-semibold text-primary-700">{showBid.priceRange}</p>
                            </div>
                        </div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Bid (₹ per quintal)</label>
                        <input type="number" className="input-field mb-4" placeholder="Enter bid amount"
                            value={bidAmount} onChange={e => setBidAmount(e.target.value)} />
                        <button onClick={() => setShowBid(null)} className="btn-primary w-full">Submit Bid</button>
                    </motion.div>
                </div>
            )}
        </DashboardLayout>
    );
}
