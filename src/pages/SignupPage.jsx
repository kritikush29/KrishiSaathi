import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Sprout, User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import NotificationAlert from '../components/ui/NotificationAlert';

export default function SignupPage() {
    const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', role: 'farmer' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.email || !form.password) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const user = await signup(form);
            navigate(`/${user.role}`);
        } catch {
            setError('Signup failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const roles = [
        {
            id: 'farmer',
            emoji: '👨‍🌾',
            title: 'Farmer',
            desc: 'Sell crops, track orders, get insights',
            features: ['List crops', 'Weather updates', 'Crop insurance'],
        },
        {
            id: 'buyer',
            emoji: '🏪',
            title: 'Buyer',
            desc: 'Browse crops, place bids, buy fresh',
            features: ['Browse marketplace', 'Direct contact', 'Track delivery'],
        },
    ];

    return (
        <div className="min-h-screen flex">
            <NotificationAlert type="error" message={error} show={!!error} onClose={() => setError('')} />

            {/* Left: Visual */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-700 to-primary-500 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-48 h-48 rounded-full border-2 border-white" />
                    <div className="absolute bottom-10 left-10 w-36 h-36 rounded-full border-2 border-white" />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center relative z-10"
                >
                    <div className="text-[120px] mb-6">🌱</div>
                    <h2 className="text-3xl font-bold text-white mb-3">{t('auth.signup_welcome')}</h2>
                    <p className="text-primary-100 text-lg max-w-sm">
                        {t('auth.signup_desc')}
                    </p>
                </motion.div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <Link to="/" className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-primary-800">KrishiSaathi</span>
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.create_account')}</h1>
                    <p className="text-gray-500 mb-6">{t('auth.signup_desc')}</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selector Cards */}
                        <div className="grid grid-cols-2 gap-3 mb-2">
                            {roles.map(role => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setForm({ ...form, role: role.id })}
                                    className={`p-4 rounded-xl text-left transition-all border-2 ${form.role === role.id
                                        ? 'border-primary-500 bg-primary-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{role.emoji}</div>
                                    <p className={`font-bold text-sm ${form.role === role.id ? 'text-primary-700' : 'text-gray-800'}`}>{role.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{role.desc}</p>
                                    {form.role === role.id && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="mt-2 space-y-1">
                                            {role.features.map(f => (
                                                <p key={f} className="text-[11px] text-primary-600 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" /> {f}
                                                </p>
                                            ))}
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.full_name')}</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" className="input-field pl-11" placeholder="Rajesh Kumar" value={form.name} onChange={set('name')} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.phone')}</label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="tel" className="input-field pl-11" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="email" className="input-field pl-11" placeholder="you@example.com" value={form.email} onChange={set('email')} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    className="input-field pl-11 pr-11"
                                    placeholder="Min 8 characters"
                                    value={form.password}
                                    onChange={set('password')}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <> {t('auth.create_account')} <ArrowRight className="w-5 h-5" /> </>
                            )}
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="mt-5">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">or sign up with</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                                <span className="text-lg">🔵</span> Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                                <span className="text-lg">🔷</span> Facebook
                            </button>
                        </div>
                    </div>

                    <p className="text-center mt-5 text-sm text-gray-600">
                        {t('auth.already_account')}{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                            {t('navbar.login')}
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
