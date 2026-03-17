import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { mockCrops, mockOrders, mockSavedItems } from '../data/mockData';
import {
    ShoppingCart, TrendingUp, Package, DollarSign, Heart,
    ArrowRight, Star, MapPin, Clock, CheckCircle, Truck, FileCheck
} from 'lucide-react';

const statCards = [
    { label: 'Total Purchases', value: '15', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Spent', value: '₹3,80,000', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Active Orders', value: '3', icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Saved Items', value: String(3), icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
];

const statusCfg = {
    confirmed: { cls: 'badge-green', label: 'Confirmed' },
    pending: { cls: 'badge-yellow', label: 'Pending' },
    shipped: { cls: 'badge-blue', label: 'Shipped' },
    delivered: { cls: 'badge-purple', label: 'Delivered' },
};

export default function BuyerDashboard() {
    const { user } = useAuth();

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="page-title">
                    Welcome, {user?.name || 'Buyer'} 🏪
                </motion.h1>
                <p className="page-subtitle">Discover fresh crops from verified farmers across India.</p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
                <Link to="/buyer/marketplace" className="btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2 whitespace-nowrap">
                    <ShoppingCart className="w-4 h-4" /> Browse Marketplace
                </Link>
                <Link to="/buyer/orders" className="btn-secondary !py-2.5 !px-5 text-sm flex items-center gap-2 whitespace-nowrap">
                    View Orders
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-sm text-gray-500">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Order Status Summary + Saved Items */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Order Status Summary */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-gray-900">Order Status</h3>
                        <Link to="/buyer/orders" className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Pending', count: 1, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                            { label: 'Confirmed', count: 1, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                            { label: 'Shipped', count: 1, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Delivered', count: 1, icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
                        ].map(item => (
                            <div key={item.label} className={`${item.bg} rounded-xl p-4 flex items-center gap-3`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                <div>
                                    <p className="text-lg font-bold text-gray-800">{item.count}</p>
                                    <p className="text-xs text-gray-500">{item.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Saved Items */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">Saved Items</h3>
                    <div className="space-y-3">
                        {mockSavedItems.map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-primary-50">
                                    {item.image.startsWith('/') ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="flex items-center justify-center h-full text-2xl">{item.image}</span>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.farmer} • {item.location}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-primary-700">{item.price.split(' - ')[0]}</p>
                                    <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 mt-0.5 ml-auto" />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recommended Crops */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">Recommended Crops</h3>
                    <Link to="/buyer/marketplace" className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
                        See All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockCrops.slice(0, 4).map((c, i) => (
                        <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                            className="card-hover-glow">
                            <div className="h-28 bg-primary-50 flex items-center justify-center text-4xl overflow-hidden">
                                {c.image.startsWith('/') ? (
                                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    c.image
                                )}
                            </div>
                            <div className="p-4">
                                <h4 className="font-semibold text-gray-900 text-sm">{c.name}</h4>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {c.location}</p>
                                <p className="text-sm font-semibold text-primary-700 mt-1">{c.priceRange}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs text-gray-500">{c.rating} • by {c.farmer}</span>
                                </div>
                                <Link to="/buyer/marketplace" className="btn-primary w-full mt-3 !py-2 text-sm text-center block">
                                    View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
