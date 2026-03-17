import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Search } from 'lucide-react';

export default function DashboardLayout({ children }) {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50/80">
            <Sidebar />
            <main className="lg:ml-[260px] min-h-screen">
                {/* Top Header Bar */}
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 md:px-6 lg:px-8 py-3 hidden lg:flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <Bell className="w-5 h-5 text-gray-500" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-xs">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="hidden xl:block">
                                <p className="text-sm font-medium text-gray-800 leading-tight">{user?.name || 'User'}</p>
                                <p className="text-[11px] text-gray-400 capitalize">{user?.role || 'user'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 md:p-6 lg:p-8 pt-16 lg:pt-6 max-w-[1400px]">
                    {children}
                </div>
            </main>
        </div>
    );
}
