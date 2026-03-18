import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { mockCrops } from '../data/mockData';
import { Plus, Star, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { cropAPI } from '../services/api';

const statusOptions = ['All', 'Active', 'Sold', 'Draft'];

export default function FarmerListings() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const getMockListings = () => {
        return mockCrops.slice(0, 8).map((c, i) => ({
            ...c,
            status: i < 5 ? 'Active' : i < 7 ? 'Sold' : 'Draft',
            views: Math.floor(Math.random() * 200) + 50,
            listedDate: `2026-03-${String(15 - i).padStart(2, '0')}`,
        }));
    };

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await cropAPI.myListings();
                if (res.data?.success && res.data.data.listings.length > 0) {
                    const mapped = res.data.data.listings.map(c => ({
                        id: c._id,
                        name: c.cropName,
                        quantity: `${c.quantity} ${c.unit}`,
                        priceRange: `₹${c.priceRange.min} - ₹${c.priceRange.max}`,
                        location: c.location,
                        status: c.status.charAt(0).toUpperCase() + c.status.slice(1),
                        image: c.images?.[0]?.url || '🌾',
                        views: Math.floor(Math.random() * 100),
                        rating: 4.5,
                        bids: 0
                    }));
                    setListings(mapped);
                } else {
                    setListings(getMockListings());
                }
            } catch (err) {
                console.error("Failed to fetch listings:", err);
                setListings(getMockListings());
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    const filtered = listings.filter(c => {
        const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const statusColor = {
        Active: 'badge-green',
        Sold: 'badge-blue',
        Draft: 'badge-yellow',
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="page-title">My Listings</h1>
                    <p className="page-subtitle">{listings.length} crops listed • {listings.filter(c => c.status === 'Active').length} active</p>
                </div>
                <Link to="/farmer/upload" className="btn-primary flex items-center gap-2 text-sm w-fit">
                    <Plus className="w-4 h-4" /> New Listing
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        className="input-field pl-10 !py-2.5 text-sm"
                        placeholder="Search listings..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {statusOptions.map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={statusFilter === s ? 'filter-chip-active' : 'filter-chip'}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Listings Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((c, i) => (
                    <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="card-hover-glow"
                    >
                        <div className="h-36 bg-primary-50 flex items-center justify-center text-5xl overflow-hidden relative">
                            {c.image && c.image.startsWith('/') ? (
                                <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                                c.image
                            )}
                            <span className={`absolute top-3 right-3 ${statusColor[c.status]}`}>
                                {c.status}
                            </span>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900">{c.name}</h3>
                            <p className="text-sm text-gray-500 mt-0.5">{c.quantity} • {c.location}</p>
                            <p className="text-sm font-semibold text-primary-700 mt-1">{c.priceRange}</p>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs text-gray-500">{c.rating} • {c.bids} bids</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Eye className="w-3 h-3" /> {c.views}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button className="flex-1 py-2 text-xs font-medium bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 flex items-center justify-center gap-1 transition-colors">
                                    <Edit className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button className="flex-1 py-2 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center gap-1 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" /> Remove
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-5xl mb-4">📦</p>
                    <p className="text-lg font-semibold text-gray-700">No listings found</p>
                    <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filter.</p>
                </div>
            )}
        </DashboardLayout>
    );
}
