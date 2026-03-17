import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockStoreProducts } from '../data/mockData';
import { productAPI } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useTranslation } from 'react-i18next';
import { Star, ShoppingCart, Plus, Minus, Check } from 'lucide-react';

const tabs = [
    { id: 'fertilizers', label: '🧪 Fertilizers' },
    { id: 'seeds', label: '🌱 Seeds' },
    { id: 'tools', label: '🔧 Tools' },
];

const categoryEmojis = {
    fertilizers: '🧪',
    seeds: '🌱',
    tools: '🔧',
};

function StoreContent() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('fertilizers');
    const [cart, setCart] = useState({});
    const [added, setAdded] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        productAPI.list({ category: activeTab })
            .then((res) => {
                const dbProducts = res.data.data.products.map(p => ({
                    id: p._id,
                    name: p.name,
                    brand: p.brand,
                    price: `₹${p.price.toLocaleString('en-IN')}`,
                    unit: p.unit,
                    rating: p.rating,
                    image: p.image?.url || categoryEmojis[p.category] || '📦',
                    desc: p.description,
                }));
                setProducts(dbProducts);
            })
            .catch(() => {
                setProducts(mockStoreProducts[activeTab] || []);
            })
            .finally(() => setLoading(false));
    }, [activeTab]);

    const addToCart = (id) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
        setAdded(id);
        setTimeout(() => setAdded(null), 1500);
    };

    return (
        <>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="page-title mb-1">🏪 {t('store.title')}</h1>
                <p className="page-subtitle mb-6">{t('store.desc')}</p>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {tabs.map(tabItem => (
                    <button key={tabItem.id} onClick={() => setActiveTab(tabItem.id)}
                        className={activeTab === tabItem.id ? 'filter-chip-active' : 'filter-chip'}>
                        {tabItem.id === 'fertilizers' ? '🧪 ' + t('store.fertilizers') : tabItem.id === 'seeds' ? '🌱 ' + t('store.seeds') : '🔧 ' + t('store.tools')}
                    </button>
                ))}
                {Object.values(cart).reduce((a, b) => a + b, 0) > 0 && (
                    <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-xl text-primary-700 font-semibold text-sm">
                        <ShoppingCart className="w-4 h-4" />
                        {Object.values(cart).reduce((a, b) => a + b, 0)} {t('store.items')}
                    </div>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                </div>
            )}

            {/* Product Grid */}
            {!loading && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {products.map((p, i) => (
                        <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }} className="card-hover-glow">
                            <div className="h-32 bg-gradient-to-br from-earth-50 to-primary-50 flex items-center justify-center text-5xl">
                                {p.image}
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">{p.unit}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{p.brand}</p>
                                <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs text-gray-500">{p.rating}</span>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-lg font-bold text-primary-700">{p.price}</span>
                                    {cart[p.id] ? (
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setCart(prev => ({ ...prev, [p.id]: Math.max(0, (prev[p.id] || 0) - 1) }))}
                                                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Minus className="w-4 h-4" /></button>
                                            <span className="text-sm font-semibold w-6 text-center">{cart[p.id]}</span>
                                            <button onClick={() => addToCart(p.id)}
                                                className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center hover:bg-primary-200"><Plus className="w-4 h-4" /></button>
                                        </div>
                                    ) : (
                                        <button onClick={() => addToCart(p.id)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${added === p.id
                                                ? 'bg-green-100 text-green-700' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'}`}>
                                            {added === p.id ? <><Check className="w-4 h-4" /> {t('buttons.added')}</> : <><ShoppingCart className="w-4 h-4" /> {t('buttons.add')}</>}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
}

export default function AgriStorePage({ dashboard }) {
    if (dashboard) {
        return (
            <DashboardLayout>
                <StoreContent />
            </DashboardLayout>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
                <StoreContent />
            </div>
            <Footer />
        </div>
    );
}
