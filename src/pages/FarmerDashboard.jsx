import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { mockCrops, mockOrders, mockWeather } from '../data/mockData';
import {
    Package, DollarSign, ShoppingCart, TrendingUp,
    Cloud, Droplets, Wind, CheckCircle, Clock, Truck, FileCheck, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cropAPI } from '../services/api';

const statCards = [
    { label: 'Total Earnings', value: '₹2,45,000', change: '+12%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Active Listings', value: '8', change: '+2', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Orders', value: '24', change: '+5', icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Market Rank', value: 'Top 15%', change: '↑3', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
];

const earningsData = [
    { label: 'This Week', amount: '₹45,200', pct: 75 },
    { label: 'This Month', amount: '₹1,82,000', pct: 60 },
    { label: 'Last Month', amount: '₹2,10,000', pct: 85 },
];

const cropPerformance = [
    { name: 'Wheat', revenue: 85000, pct: 85, color: 'bg-green-500' },
    { name: 'Rice', revenue: 62000, pct: 62, color: 'bg-blue-500' },
    { name: 'Tomatoes', revenue: 45000, pct: 45, color: 'bg-red-400' },
    { name: 'Cotton', revenue: 38000, pct: 38, color: 'bg-yellow-500' },
    { name: 'Mangoes', revenue: 28000, pct: 28, color: 'bg-orange-400' },
];

const statusCfg = {
    confirmed: { icon: CheckCircle, cls: 'text-green-600 bg-green-50', label: 'Confirmed' },
    pending: { icon: Clock, cls: 'text-yellow-600 bg-yellow-50', label: 'Pending' },
    shipped: { icon: Truck, cls: 'text-blue-600 bg-blue-50', label: 'Shipped' },
    delivered: { icon: FileCheck, cls: 'text-purple-600 bg-purple-50', label: 'Delivered' },
};

export default function FarmerDashboard() {
    const { user } = useAuth();
    const recentOrders = mockOrders.slice(0, 3);
    const [activeListingsCount, setActiveListingsCount] = useState(8); // Mock default

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await cropAPI.myListings();
                if (res.data?.success && res.data.data.listings) {
                    const activeCount = res.data.data.listings.filter(l => l.status === 'active').length;
                    setActiveListingsCount(activeCount || 8); // Keep 8 if 0 just for visual mock fallback if desired, wait no, let's show real count!
                    // Let's show real count if fetch works. If it's a new farmer 0 is correct.
                    if (res.data.data.listings.length > 0) {
                        setActiveListingsCount(activeCount);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    // Update the stat cards with dynamic active listings count
    const dynamicStatCards = statCards.map(s => 
        s.label === 'Active Listings' ? { ...s, value: activeListingsCount.toString() } : s
    );

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="page-title">
                    Welcome back, {user?.name || 'Farmer'} 👋
                </motion.h1>
                <p className="page-subtitle">Here's what's happening with your farm today.</p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
                <Link to="/farmer/upload" className="btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2 whitespace-nowrap">
                    <Package className="w-4 h-4" /> Upload Crop
                </Link>
                <Link to="/farmer/listings" className="btn-secondary !py-2.5 !px-5 text-sm flex items-center gap-2 whitespace-nowrap">
                    View Listings
                </Link>
                <Link to="/farmer/orders" className="btn-ghost !py-2.5 !px-5 text-sm flex items-center gap-2 whitespace-nowrap border border-gray-200">
                    View Orders
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {dynamicStatCards.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }} className="stat-card">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{s.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-sm text-gray-500">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Weather + Earnings */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Weather */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2"><Cloud className="w-5 h-5" /> Weather</h3>
                            <p className="text-blue-100 text-sm">{mockWeather.location}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold">{mockWeather.temp}°C</p>
                            <p className="text-blue-100 text-sm">{mockWeather.condition}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 mb-4 text-sm text-blue-100">
                        <span className="flex items-center gap-1"><Droplets className="w-4 h-4" /> {mockWeather.humidity}%</span>
                        <span className="flex items-center gap-1"><Wind className="w-4 h-4" /> {mockWeather.wind}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {mockWeather.forecast.map(f => (
                            <div key={f.day} className="text-center bg-white/10 rounded-xl py-2 px-1">
                                <p className="text-xs text-blue-100">{f.day}</p>
                                <p className="text-lg my-1">{f.icon}</p>
                                <p className="text-xs font-semibold">{f.high}°</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Earnings */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">Earnings Overview</h3>
                    <div className="space-y-4">
                        {earningsData.map(e => (
                            <div key={e.label}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">{e.label}</span>
                                    <span className="font-semibold text-gray-800">{e.amount}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${e.pct}%` }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className="h-full gradient-primary rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm text-gray-500">Total Earnings</span>
                        <span className="text-xl font-bold text-primary-700">₹2,45,000</span>
                    </div>
                </motion.div>
            </div>

            {/* Crop Performance */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Crop Performance</h3>
                <div className="space-y-3">
                    {cropPerformance.map(c => (
                        <div key={c.name} className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700 w-20">{c.name}</span>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${c.pct}%` }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                    className={`h-full rounded-full ${c.color}`}
                                />
                            </div>
                            <span className="text-sm font-semibold text-gray-800 w-20 text-right">₹{(c.revenue / 1000).toFixed(0)}K</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-900">Recent Orders</h3>
                    <Link to="/farmer/orders" className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Crop', 'Buyer', 'Qty', 'Price', 'Status', 'Date'].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentOrders.map(o => {
                                const s = statusCfg[o.status];
                                return (
                                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{o.crop}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{o.buyer}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{o.quantity}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{o.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
                                                <s.icon className="w-3.5 h-3.5" /> {s.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{o.date}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
