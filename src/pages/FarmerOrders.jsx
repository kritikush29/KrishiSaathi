import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { mockOrders } from '../data/mockData';
import { CheckCircle, Clock, Truck, FileCheck, Search, Filter, Download } from 'lucide-react';

const statusCfg = {
    confirmed: { icon: CheckCircle, cls: 'text-green-600 bg-green-50', label: 'Confirmed', step: 2 },
    pending: { icon: Clock, cls: 'text-yellow-600 bg-yellow-50', label: 'Pending', step: 1 },
    shipped: { icon: Truck, cls: 'text-blue-600 bg-blue-50', label: 'Shipped', step: 3 },
    delivered: { icon: FileCheck, cls: 'text-purple-600 bg-purple-50', label: 'Delivered', step: 4 },
};

const statusFilters = ['All', 'pending', 'confirmed', 'shipped', 'delivered'];

const allOrders = [
    ...mockOrders,
    { id: 5, crop: 'Alphonso Mango', buyer: 'FruitKart', quantity: '300 kg', price: '₹6,200/qt', status: 'confirmed', date: '2026-03-04', paymentStatus: 'Paid', buyerPhone: '+91 98765 43210' },
    { id: 6, crop: 'Turmeric', buyer: 'SpiceLand', quantity: '100 kg', price: '₹8,500/qt', status: 'pending', date: '2026-03-03', paymentStatus: 'Pending', buyerPhone: '+91 87654 32109' },
].map(o => ({
    ...o,
    paymentStatus: o.paymentStatus || (o.status === 'delivered' ? 'Paid' : o.status === 'pending' ? 'Pending' : 'Paid'),
    buyerPhone: o.buyerPhone || '+91 99999 88888',
}));

const timelineSteps = [
    { label: 'Order Placed', icon: Clock },
    { label: 'Confirmed', icon: CheckCircle },
    { label: 'Shipped', icon: Truck },
    { label: 'Delivered', icon: FileCheck },
];

export default function FarmerOrders() {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const filtered = allOrders.filter(o => {
        const matchStatus = filter === 'All' || o.status === filter;
        const matchSearch = o.crop.toLowerCase().includes(search.toLowerCase()) || o.buyer.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-6">
                <h1 className="page-title">Orders</h1>
                <p className="page-subtitle">{allOrders.length} total orders • {allOrders.filter(o => o.status === 'pending').length} pending</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        className="input-field pl-10 !py-2.5 text-sm"
                        placeholder="Search by crop or buyer..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {statusFilters.map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={filter === s ? 'filter-chip-active' : 'filter-chip'}
                        >
                            {s === 'All' ? 'All' : statusCfg[s]?.label || s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {['#', 'Crop', 'Buyer', 'Qty', 'Price', 'Payment', 'Status', 'Date', ''].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(o => {
                                const s = statusCfg[o.status];
                                return (
                                    <tr key={o.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(o)}>
                                        <td className="px-5 py-4 text-sm text-gray-400">#{o.id}</td>
                                        <td className="px-5 py-4 text-sm font-medium text-gray-900">{o.crop}</td>
                                        <td className="px-5 py-4 text-sm text-gray-600">{o.buyer}</td>
                                        <td className="px-5 py-4 text-sm text-gray-600">{o.quantity}</td>
                                        <td className="px-5 py-4 text-sm font-semibold text-gray-800">{o.price}</td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs font-semibold ${o.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {o.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
                                                <s.icon className="w-3.5 h-3.5" /> {s.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-500">{o.date}</td>
                                        <td className="px-5 py-4">
                                            <button className="text-xs text-primary-600 font-medium hover:text-primary-700">Details</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-3">📋</p>
                        <p className="text-gray-600 font-medium">No orders found</p>
                        <p className="text-sm text-gray-400">Try changing the filter or search.</p>
                    </div>
                )}
            </motion.div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900">Order #{selectedOrder.id}</h3>
                            <button onClick={() => setSelectedOrder(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                <span className="text-gray-400 text-xl">&times;</span>
                            </button>
                        </div>

                        {/* Order Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500">Crop</p>
                                <p className="font-semibold text-gray-800">{selectedOrder.crop}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500">Quantity</p>
                                <p className="font-semibold text-gray-800">{selectedOrder.quantity}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500">Price</p>
                                <p className="font-semibold text-gray-800">{selectedOrder.price}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500">Payment</p>
                                <p className={`font-semibold ${selectedOrder.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>{selectedOrder.paymentStatus}</p>
                            </div>
                        </div>

                        {/* Buyer Details */}
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Buyer Details</p>
                            <p className="text-sm font-medium text-gray-800">{selectedOrder.buyer}</p>
                            <p className="text-sm text-gray-600">{selectedOrder.buyerPhone}</p>
                        </div>

                        {/* Order Timeline */}
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Timeline</p>
                        <div className="space-y-3 mb-6">
                            {timelineSteps.map((step, i) => {
                                const currentStep = statusCfg[selectedOrder.status].step;
                                const isCompleted = i + 1 <= currentStep;
                                const isCurrent = i + 1 === currentStep;
                                return (
                                    <div key={step.label} className="flex items-center gap-3">
                                        <div className={`timeline-dot ${isCompleted ? 'bg-primary-100' : 'bg-gray-100'}`}>
                                            <step.icon className={`w-4 h-4 ${isCompleted ? 'text-primary-600' : 'text-gray-400'}`} />
                                        </div>
                                        <span className={`text-sm ${isCurrent ? 'font-semibold text-primary-700' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                                            {step.label}
                                        </span>
                                        {isCurrent && <span className="badge-green text-[10px]">Current</span>}
                                    </div>
                                );
                            })}
                        </div>

                        <button className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                            <Download className="w-4 h-4" /> Download Invoice
                        </button>
                    </motion.div>
                </div>
            )}
        </DashboardLayout>
    );
}
