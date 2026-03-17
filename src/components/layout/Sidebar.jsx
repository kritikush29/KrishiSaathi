import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import {
    Sprout, LayoutDashboard, Package, Upload, ClipboardList,
    Store, Shield, HelpCircle, LogOut, Menu, X, ChevronLeft,
    ShoppingCart, Newspaper
} from 'lucide-react';

const farmerLinks = [
    { to: '/farmer', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/farmer/listings', icon: Package, label: 'My Listings' },
    { to: '/farmer/upload', icon: Upload, label: 'Upload Crop' },
    { to: '/farmer/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/farmer/store', icon: Store, label: 'Agri Store' },
    { to: '/farmer/insurance', icon: Shield, label: 'Insurance' },
    { to: '/farmer/support', icon: HelpCircle, label: 'Support' },
];

const buyerLinks = [
    { to: '/buyer', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/buyer/marketplace', icon: ShoppingCart, label: 'Marketplace' },
    { to: '/buyer/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/buyer/store', icon: Store, label: 'Agri Store' },
    { to: '/buyer/insurance', icon: Shield, label: 'Insurance' },
    { to: '/buyer/support', icon: HelpCircle, label: 'Support' },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const links = user?.role === 'farmer' ? farmerLinks : buyerLinks;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isLinkActive = (linkTo) => {
        if (linkTo === '/farmer' || linkTo === '/buyer') {
            return location.pathname === linkTo;
        }
        return location.pathname.startsWith(linkTo);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md flex-shrink-0">
                        <Sprout className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && <span className="text-lg font-bold text-primary-800">KrishiSaathi</span>}
                </Link>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft className={`w-4 h-4 text-gray-500 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* User Info */}
            {!collapsed && user && (
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                            <p className="text-xs text-primary-600 capitalize font-medium">{user.role === 'farmer' ? '👨‍🌾 Farmer' : '🏪 Buyer'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Label */}
            {!collapsed && (
                <div className="px-5 pt-4 pb-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Navigation</p>
                </div>
            )}

            {/* Links */}
            <nav className="flex-1 px-3 pb-3 space-y-1 overflow-y-auto">
                {links.map(link => {
                    const active = isLinkActive(link.to);
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={active ? 'sidebar-link-active' : 'sidebar-link'}
                            onClick={() => setMobileOpen(false)}
                            title={collapsed ? link.label : undefined}
                        >
                            <link.icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && <span className="text-sm">{link.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Krishi Samachar link */}
            {!collapsed && (
                <div className="px-3 pb-2">
                    <Link
                        to="/samachar"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-earth-50 text-primary-700 hover:from-primary-100 hover:to-earth-100 transition-all font-medium"
                        onClick={() => setMobileOpen(false)}
                    >
                        <Newspaper className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">Krishi Samachar</span>
                    </Link>
                </div>
            )}

            {/* Logout */}
            <div className="p-3 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="sidebar-link text-red-500 hover:bg-red-50 hover:text-red-700 w-full"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="text-sm">Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
                <Menu className="w-5 h-5 text-gray-700" />
            </button>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 lg:hidden"
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop sidebar */}
            <aside
                className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 z-30 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'
                    }`}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
