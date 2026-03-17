import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockInsurancePlans, mockInsuranceClaims } from '../data/mockData';
import { insuranceAPI } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useTranslation } from 'react-i18next';
import { Shield, CheckCircle, Star, X, ArrowRight, Clock, FileCheck } from 'lucide-react';

const claimStatusCfg = {
    approved: { cls: 'badge-green', label: 'Approved' },
    under_review: { cls: 'badge-yellow', label: 'Under Review' },
    rejected: { cls: 'badge-red', label: 'Rejected' },
};

function InsuranceContent() {
    const { t } = useTranslation();
    const [selected, setSelected] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('plans');

    useEffect(() => {
        insuranceAPI.list()
            .then((res) => {
                const dbPlans = res.data.data.plans.map(p => ({
                    id: p._id, name: p.name, premium: p.premium, coverage: p.coverage,
                    crops: p.crops || [], duration: p.duration, features: p.features || [], popular: p.popular || false,
                }));
                setPlans(dbPlans);
            })
            .catch(() => { setPlans(mockInsurancePlans); })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="page-title mb-1">🛡️ {t('insurance.title')}</h1>
                <p className="page-subtitle mb-6">{t('insurance.desc')}</p>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {[
                    { id: 'plans', label: 'Insurance Plans' },
                    { id: 'claims', label: 'Claim Status' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={activeTab === tab.id ? 'filter-chip-active' : 'filter-chip'}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Plans Tab */}
            {activeTab === 'plans' && (
                <>
                    {loading && (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                        </div>
                    )}
                    {!loading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plans.map((plan, i) => (
                                <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`bg-white rounded-2xl shadow-md border-2 overflow-hidden relative ${plan.popular ? 'border-primary-500' : 'border-gray-100'}`}>
                                    {plan.popular && (
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-white" /> {t('insurance.popular')}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`p-6 ${plan.popular ? 'bg-primary-50' : 'bg-gray-50'}`}>
                                        <Shield className={`w-10 h-10 mb-3 ${plan.popular ? 'text-primary-600' : 'text-gray-500'}`} />
                                        <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{plan.duration}</p>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span className="text-2xl font-bold text-gray-900">{plan.premium}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">{t('insurance.coverage')}: <span className="font-semibold text-gray-700">{plan.coverage}</span></p>
                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('insurance.covered_crops')}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {plan.crops.map(c => (<span key={c} className="badge-green">{c}</span>))}
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-6">
                                            {plan.features.map(f => (
                                                <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                                    {f}
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => setSelected(plan)}
                                            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${plan.popular ? 'btn-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                            {t('buttons.apply_now')} <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Claims Tab */}
            {activeTab === 'claims' && (
                <div className="space-y-4">
                    {mockInsuranceClaims.map((claim, i) => {
                        const s = claimStatusCfg[claim.status];
                        return (
                            <motion.div key={claim.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-gray-400">{claim.id}</span>
                                            <span className={s.cls}>{s.label}</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{claim.plan}</p>
                                        <p className="text-sm text-gray-500">Crop: {claim.crop} • Amount: {claim.claimAmount}</p>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p className="text-gray-500">Filed: {claim.filedDate}</p>
                                        {claim.settledDate && <p className="text-green-600 font-medium">Settled: {claim.settledDate}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    {mockInsuranceClaims.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-4">🛡️</p>
                            <p className="text-lg font-semibold text-gray-700">No claims filed</p>
                            <p className="text-gray-500 text-sm">Apply for insurance and file claims when needed.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Apply Modal */}
            {selected && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Apply for Insurance</h3>
                            <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4 bg-primary-50 rounded-xl mb-4">
                            <p className="font-semibold text-gray-900">{selected.name}</p>
                            <p className="text-sm text-gray-600">{selected.premium} • {selected.coverage}</p>
                        </div>
                        <form className="space-y-3">
                            <input type="text" className="input-field" placeholder="Full Name" />
                            <input type="text" className="input-field" placeholder="Aadhaar Number" />
                            <input type="text" className="input-field" placeholder="Land Area (acres)" />
                            <select className="input-field">
                                <option>Select Crop</option>
                                {selected.crops.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <button type="button" onClick={() => setSelected(null)} className="btn-primary w-full">{t('buttons.submit_application')}</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </>
    );
}

export default function InsurancePage({ dashboard }) {
    if (dashboard) {
        return (
            <DashboardLayout>
                <InsuranceContent />
            </DashboardLayout>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
                <InsuranceContent />
            </div>
            <Footer />
        </div>
    );
}
