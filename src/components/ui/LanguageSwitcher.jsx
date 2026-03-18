import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { languages, langFontMap } from '../../i18n';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const current = languages.find(l => l.code === i18n.resolvedLanguage) || languages[0];

    // Apply font family to <html> on language change
    useEffect(() => {
        const font = langFontMap[i18n.resolvedLanguage] || langFontMap.en;
        document.documentElement.style.fontFamily = font;
        document.documentElement.lang = i18n.resolvedLanguage;
    }, [i18n.resolvedLanguage]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const switchLang = (code) => {
        i18n.changeLanguage(code);
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-700 bg-gray-50 hover:bg-primary-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-primary-200"
                aria-label="Select Language"
                aria-expanded={open}
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{current.nativeLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-[100] overflow-hidden"
                    >
                        <div className="px-3 py-2 border-b border-gray-100">
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">🌐 Select Language</p>
                        </div>
                        <div className="max-h-72 overflow-y-auto py-1">
                            {languages.map((lang) => {
                                const isActive = lang.code === i18n.resolvedLanguage;
                                return (
                                    <button
                                        key={lang.code}
                                        onClick={() => switchLang(lang.code)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-150 ${
                                            isActive
                                                ? 'bg-primary-50 text-primary-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="text-base">{lang.flag}</span>
                                        <div className="flex-1 text-left">
                                            <p className={`font-medium ${isActive ? 'text-primary-700' : 'text-gray-800'}`}>
                                                {lang.nativeLabel}
                                            </p>
                                            <p className="text-[11px] text-gray-400">{lang.label}</p>
                                        </div>
                                        {isActive && (
                                            <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
