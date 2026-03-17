import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Sprout, TrendingUp, Users, Shield, ShoppingCart, CloudSun,
    MessageCircle, ArrowRight, CheckCircle, Smartphone, Star,
    Zap, Globe, BarChart3, Leaf
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useTranslation } from 'react-i18next';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
};

const stagger = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
};

const features = [
    { icon: TrendingUp, title: 'Price Discovery', desc: 'Get real-time market prices and analytics for informed selling decisions.', color: 'bg-green-100 text-green-600' },
    { icon: Users, title: 'Direct Buyer Connect', desc: 'Connect with verified buyers directly, eliminating middlemen.', color: 'bg-blue-100 text-blue-600' },
    { icon: ShoppingCart, title: 'Agri Marketplace', desc: 'Buy and sell crops, seeds, fertilizers in one platform.', color: 'bg-purple-100 text-purple-600' },
    { icon: CloudSun, title: 'Weather Insights', desc: 'Accurate weather forecasts to plan your farming activities.', color: 'bg-orange-100 text-orange-600' },
    { icon: Shield, title: 'Crop Insurance', desc: 'Easy access to government and private crop insurance schemes.', color: 'bg-red-100 text-red-600' },
    { icon: MessageCircle, title: '24/7 Support', desc: 'Expert helpline and chat support for farming queries.', color: 'bg-teal-100 text-teal-600' },
];

const steps = [
    { num: '01', title: 'Register Free', desc: 'Create your account as a farmer or buyer in 2 minutes.', icon: '👤' },
    { num: '02', title: 'List or Browse', desc: 'Farmers list crops. Buyers browse the marketplace.', icon: '📋' },
    { num: '03', title: 'Connect & Trade', desc: 'Negotiate, bid, and trade directly with transparency.', icon: '🤝' },
];

const benefits = [
    'No middlemen — direct market access',
    'Better prices through competitive bidding',
    'Weather-aware farming decisions',
    'Access to verified insurance schemes',
    'Free agri-expert support 24/7',
    'Secure digital payments',
];

export default function LandingPage() {
    const { t } = useTranslation();
    return (
        <div className="bg-white">
            <Navbar />

            {/* Hero */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/photos/background.jpg')" }}>
                <div className="absolute inset-0 bg-black/50"></div>
                
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl mix-blend-screen" />
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl mix-blend-screen" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 z-10 text-white">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div {...fadeUp}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
                                <Sprout className="w-4 h-4 text-white" />
                                <span className="text-sm font-semibold text-white">{t('landing.hero_tagline')}</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-md">
                                {t('landing.hero_title_1')}{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500">
                                    {t('landing.hero_title_2')}
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed drop-shadow">
                                {t('landing.hero_desc')}
                            </p>

                            {/* Role-based CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <Link to="/login" className="group bg-white text-primary-700 font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg">
                                    <span className="text-2xl">👨‍🌾</span> Login as Farmer <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/login" className="group bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:bg-white/25 active:scale-[0.98] flex items-center justify-center gap-3 text-lg">
                                    <span className="text-2xl">🏪</span> Login as Buyer <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <p className="text-sm text-gray-300">
                                New here?{' '}
                                <Link to="/signup" className="text-green-300 font-semibold hover:text-green-200 underline underline-offset-2">
                                    Create a free account →
                                </Link>
                            </p>

                            <div className="flex items-center gap-8 mt-10 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-fit">
                                <div>
                                    <p className="text-2xl font-bold text-white">50K+</p>
                                    <p className="text-sm text-gray-200">{t('landing.stats_farmers')}</p>
                                </div>
                                <div className="w-px h-10 bg-white/30" />
                                <div>
                                    <p className="text-2xl font-bold text-white">₹100Cr+</p>
                                    <p className="text-sm text-gray-200">{t('landing.stats_volume')}</p>
                                </div>
                                <div className="w-px h-10 bg-white/30" />
                                <div>
                                    <p className="text-2xl font-bold text-white">200+</p>
                                    <p className="text-sm text-gray-200">{t('landing.stats_cities')}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="hidden lg:flex justify-center"
                        >
                            <div className="relative">
                                <div className="w-[420px] h-[420px] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white/20 box-border">
                                    <img src="/photos/front page.jpg" alt="Farmer in field" className="w-full h-full object-cover" />
                                </div>
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                    className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Today's Price</p>
                                        <p className="text-sm font-bold text-gray-800">₹2,450/qt ↑</p>
                                    </div>
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ repeat: Infinity, duration: 3.5 }}
                                    className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                                        <Star className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Farmer Rating</p>
                                        <p className="text-sm font-bold text-gray-800">4.8 ★★★★★</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Role Selection Cards */}
            <section className="section-padding bg-gradient-to-b from-white to-primary-50/30">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-12">
                        <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Join As</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Choose Your Role</h2>
                        <p className="text-gray-600 max-w-xl mx-auto">Whether you grow crops or purchase them, KrishiSaathi has the right tools for you.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <motion.div {...stagger} transition={{ delay: 0.1 }}>
                            <Link to="/signup" className="block group p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-primary-400 hover:shadow-2xl transition-all duration-300">
                                <div className="text-6xl mb-4">👨‍🌾</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">I'm a Farmer</h3>
                                <p className="text-gray-600 mb-4">List your crops, get fair prices, access insurance & weather insights.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-500" /> Upload & manage crop listings</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-500" /> Track orders & earnings</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-500" /> Access crop insurance</li>
                                </ul>
                                <div className="mt-6 flex items-center text-primary-600 font-semibold group-hover:gap-3 transition-all gap-2">
                                    Get Started <ArrowRight className="w-5 h-5" />
                                </div>
                            </Link>
                        </motion.div>

                        <motion.div {...stagger} transition={{ delay: 0.2 }}>
                            <Link to="/signup" className="block group p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-blue-400 hover:shadow-2xl transition-all duration-300">
                                <div className="text-6xl mb-4">🏪</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">I'm a Buyer</h3>
                                <p className="text-gray-600 mb-4">Browse fresh crops, place bids, and get doorstep delivery.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Browse verified crop listings</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Place bids & track orders</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Direct farmer contact</li>
                                </ul>
                                <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all gap-2">
                                    Get Started <ArrowRight className="w-5 h-5" />
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="section-padding bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-16">
                        <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">{t('navbar.features')}</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">{t('landing.features_title')}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">{t('landing.features_desc')}</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                {...stagger}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="group p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <f.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section-padding bg-primary-50/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-16">
                        <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">How It Works</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">{t('landing.how_it_works')}</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((s, i) => (
                            <motion.div
                                key={s.num}
                                {...stagger}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                className="relative text-center p-8 bg-white rounded-2xl shadow-md"
                            >
                                <div className="text-5xl mb-4">{s.icon}</div>
                                <span className="text-5xl font-bold text-primary-100">{s.num}</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">{s.title}</h3>
                                <p className="text-gray-600 text-sm">{s.desc}</p>
                                {i < 2 && (
                                    <ArrowRight className="hidden md:block absolute top-1/2 -right-6 w-8 h-8 text-primary-300" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="section-padding bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div {...fadeUp}>
                            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Benefits</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-8">
                                {t('landing.benefits_title')}
                            </h2>
                            <div className="space-y-4">
                                {benefits.map((b, i) => (
                                    <motion.div
                                        key={i}
                                        {...stagger}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                        <span className="text-gray-700">{b}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { icon: Zap, val: '30%', label: 'Higher Income' },
                                { icon: Globe, val: '200+', label: 'Mandis Connected' },
                                { icon: BarChart3, val: '₹100Cr', label: 'Trade Volume' },
                                { icon: Leaf, val: '15K+', label: 'Organic Listings' },
                            ].map((s, i) => (
                                <div key={i} className="bg-primary-50 rounded-2xl p-6 text-center hover:bg-primary-100 transition-colors">
                                    <s.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-primary-700">{s.val}</p>
                                    <p className="text-sm text-gray-600">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Download App */}
            <section className="section-padding gradient-primary text-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp} className="text-center">
                        <Smartphone className="w-16 h-16 mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Download KrishiSaathi App</h2>
                        <p className="text-primary-100 max-w-xl mx-auto mb-8 text-lg">
                            Get the full experience on your mobile. Available on Android & iOS.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-primary-700 font-semibold py-3 px-8 rounded-xl hover:bg-primary-50 transition-colors flex items-center justify-center gap-2">
                                <span className="text-2xl">📱</span> Google Play
                            </button>
                            <button className="bg-white/10 border-2 border-white/30 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                                <span className="text-2xl">🍎</span> App Store
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
