import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { mockSupportTickets, mockFAQs } from '../data/mockData';
import {
    HelpCircle, Plus, MessageCircle, ChevronDown, ChevronUp,
    Clock, CheckCircle, AlertCircle, Send, Search
} from 'lucide-react';

const ticketStatusCfg = {
    open: { cls: 'badge-red', label: 'Open', icon: AlertCircle },
    in_progress: { cls: 'badge-yellow', label: 'In Progress', icon: Clock },
    resolved: { cls: 'badge-green', label: 'Resolved', icon: CheckCircle },
};

const categories = ['Payment', 'Technical', 'Orders', 'Insurance', 'Account', 'Other'];

export default function SupportPage() {
    const [activeTab, setActiveTab] = useState('tickets');
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [ticketForm, setTicketForm] = useState({ subject: '', category: 'Payment', priority: 'Medium', description: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmitTicket = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setShowNewTicket(false);
            setTicketForm({ subject: '', category: 'Payment', priority: 'Medium', description: '' });
        }, 2000);
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="page-title flex items-center gap-2">
                        <HelpCircle className="w-7 h-7 text-primary-600" /> Support
                    </h1>
                    <p className="page-subtitle">Get help, raise tickets, and find answers to common questions.</p>
                </div>
                <button onClick={() => setShowNewTicket(true)}
                    className="btn-primary flex items-center gap-2 text-sm w-fit">
                    <Plus className="w-4 h-4" /> Raise Ticket
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {[
                    { id: 'tickets', label: 'My Tickets', icon: MessageCircle },
                    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={activeTab === tab.id ? 'filter-chip-active' : 'filter-chip'}>
                        <span className="flex items-center gap-1.5"><tab.icon className="w-4 h-4" /> {tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
                <div className="space-y-4">
                    {mockSupportTickets.map((ticket, i) => {
                        const s = ticketStatusCfg[ticket.status];
                        return (
                            <motion.div key={ticket.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-gray-400">{ticket.id}</span>
                                            <span className={s.cls}><s.icon className="w-3 h-3 inline mr-1" />{s.label}</span>
                                            <span className={`badge ${ticket.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{ticket.priority}</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{ticket.subject}</p>
                                        <p className="text-xs text-gray-500 mt-1">Category: {ticket.category} • Created: {ticket.createdAt} • Updated: {ticket.lastUpdated}</p>
                                    </div>
                                    <button className="btn-ghost text-sm border border-gray-200">View Details</button>
                                </div>
                            </motion.div>
                        );
                    })}
                    {mockSupportTickets.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-4">🎫</p>
                            <p className="text-lg font-semibold text-gray-700">No tickets yet</p>
                            <p className="text-gray-500 text-sm">Click "Raise Ticket" to get help.</p>
                        </div>
                    )}
                </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
                <div className="space-y-3 max-w-3xl">
                    {mockFAQs.map((faq, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }} className="faq-item">
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-medium text-gray-800 text-sm pr-4">{faq.q}</span>
                                {expandedFaq === i ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                )}
                            </button>
                            {expandedFaq === i && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                    className="px-4 pb-4">
                                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* New Ticket Modal */}
            {showNewTicket && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNewTicket(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>

                        {submitted ? (
                            <div className="text-center py-8">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl mb-4">✅</motion.div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Ticket Submitted!</h3>
                                <p className="text-sm text-gray-500">We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-lg font-bold text-gray-900">Raise a Ticket</h3>
                                    <button onClick={() => setShowNewTicket(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                        <span className="text-gray-400 text-xl">&times;</span>
                                    </button>
                                </div>
                                <form onSubmit={handleSubmitTicket} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                                        <input type="text" className="input-field" placeholder="Brief description of your issue"
                                            value={ticketForm.subject} onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                                            <select className="input-field" value={ticketForm.category}
                                                onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}>
                                                {categories.map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                                            <select className="input-field" value={ticketForm.priority}
                                                onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}>
                                                {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                                        <textarea className="input-field h-24 resize-none" placeholder="Describe your issue in detail..."
                                            value={ticketForm.description} onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })} required />
                                    </div>
                                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                                        <Send className="w-4 h-4" /> Submit Ticket
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </DashboardLayout>
    );
}



