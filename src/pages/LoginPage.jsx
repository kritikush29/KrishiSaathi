import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Sprout, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import NotificationAlert from '../components/ui/NotificationAlert';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const user = await login(form.email, form.password);
            navigate(`/${user.role}`);
        } catch (err) {
            setError('Invalid credentials. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <NotificationAlert type="error" message={error} show={!!error} onClose={() => setError('')} />

            {/* Left: Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <Link to="/" className="flex items-center gap-2 mb-10">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-primary-800">KrishiSaathi</span>
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.login_welcome')}</h1>
                    <p className="text-gray-500 mb-8">{t('auth.login_desc')}</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.email_phone')}</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    className="input-field pl-11"
                                    placeholder="farmer@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    className="input-field pl-11 pr-11"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                <span className="text-gray-600">{t('auth.remember')}</span>
                            </label>
                            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">{t('auth.forgot')}</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <> {t('navbar.login')} <ArrowRight className="w-5 h-5" /> </>
                            )}
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">or continue with</span></div>
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

                    <p className="text-center mt-6 text-sm text-gray-600">
                        {t('auth.no_account')}{' '}
                        <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700">
                            {t('navbar.signup')}
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-white" />
                    <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full border-2 border-white" />
                    <div className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full border-2 border-white" />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center relative z-10"
                >
                    <div className="text-[120px] mb-6">👨‍🌾</div>
                    <h2 className="text-3xl font-bold text-white mb-3">Welcome to KrishiSaathi</h2>
                    <p className="text-primary-100 text-lg max-w-sm">
                        Your trusted digital partner for modern farming success.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
