import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import {
    Menu, X, Sprout, LogIn, UserPlus, LogOut,
    LayoutDashboard, ShoppingCart, Shield, MessageCircle,
    ChevronDown, User
} from 'lucide-react';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const isDashboard = location.pathname.startsWith('/farmer') || location.pathname.startsWith('/buyer');

    const publicLinks = [
        { to: '/#features', label: t('navbar.features') },
        { to: '/marketplace', label: t('navbar.marketplace') },
        { to: '/store', label: t('navbar.agri_store') },
        { to: '/insurance', label: t('navbar.insurance') },
        { to: '/samachar', label: t('navbar.samachar') },
        { to: '/detect', label: t('navbar.detect') },
    ];

    const LanguageToggle = () => (
        <button
            onClick={() => i18n.changeLanguage(i18n.resolvedLanguage === 'hi' ? 'en' : 'hi')}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors flex items-center gap-1 bg-gray-50 hover:bg-primary-50 rounded-lg mx-1"
            title="Switch Language"
        >
            <span className={i18n.resolvedLanguage !== 'hi' ? 'font-bold text-primary-700' : ''}>English</span>
            <span className="text-gray-300">|</span>
            <span className={i18n.resolvedLanguage === 'hi' ? 'font-bold text-primary-700' : ''}>हिंदी</span>
        </button>
    );

    const handleLogout = () => {
        logout();
        navigate('/');
        setDropdownOpen(false);
    };

    if (isDashboard) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                            <Sprout className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-primary-800 group-hover:text-primary-600 transition-colors">
                            KrishiSaathi
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {publicLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="h-4 w-px bg-gray-300 mx-1"></div>
                        <LanguageToggle />
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </button>
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                                        >
                                            <Link to={`/${user.role}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50" onClick={() => setDropdownOpen(false)}>
                                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                                            </Link>
                                            <Link to="/marketplace" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50" onClick={() => setDropdownOpen(false)}>
                                                <ShoppingCart className="w-4 h-4" /> Marketplace
                                            </Link>
                                            <Link to="/chat" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50" onClick={() => setDropdownOpen(false)}>
                                                <MessageCircle className="w-4 h-4" /> Support
                                            </Link>
                                            <hr className="my-1 border-gray-100" />
                                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                                                <LogOut className="w-4 h-4" /> Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-700 rounded-lg transition-all">
                                    <LogIn className="w-4 h-4" /> {t('navbar.login')}
                                </Link>
                                <Link to="/signup" className="btn-primary text-sm !py-2 !px-5 flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" /> {t('navbar.signup')}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden overflow-hidden bg-white border-t border-gray-100"
                    >
                        <div className="px-4 py-4 space-y-1">
                            <div className="flex justify-center mb-4">
                                <LanguageToggle />
                            </div>
                            {publicLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-xl"
                                    onClick={() => setOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <hr className="my-2 border-gray-100" />
                            {user ? (
                                <>
                                    <Link to={`/${user.role}`} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-xl" onClick={() => setOpen(false)}>
                                        Dashboard
                                    </Link>
                                    <button onClick={() => { handleLogout(); setOpen(false); }} className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-xl" onClick={() => setOpen(false)}>
                                        {t('navbar.login')}
                                    </Link>
                                    <Link to="/signup" className="block px-4 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl text-center" onClick={() => setOpen(false)}>
                                        {t('navbar.signup')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
