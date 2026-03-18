import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { detectionAPI } from '../services/api';
import Navbar from '../components/layout/Navbar';
import DashboardLayout from '../components/layout/DashboardLayout';
import Footer from '../components/layout/Footer';
import {
    Upload, Camera, Leaf, AlertTriangle, CheckCircle,
    Clock, ChevronRight, Loader2, X, Microscope, Shield
} from 'lucide-react';

export default function DiseaseDetectionPage({ dashboard }) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Load history on mount
    useEffect(() => {
        if (user) {
            setHistoryLoading(true);
            detectionAPI.history()
                .then(res => setHistory(res.data.data.detections || []))
                .catch(() => {})
                .finally(() => setHistoryLoading(false));
        }
    }, [user]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file (JPEG, PNG)');
            return;
        }
        setSelectedImage(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
        setError('');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
            setError('');
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const formData = new FormData();
            formData.append('image', selectedImage);
            const res = await detectionAPI.predict(formData);
            setResult(res.data.data.detection);
            // Refresh history
            detectionAPI.history()
                .then(r => setHistory(r.data.data.detections || []))
                .catch(() => {});
        } catch (err) {
            setError(err.response?.data?.message || 'Analysis failed. Make sure the AI service is running.');
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setSelectedImage(null);
        setPreview(null);
        setResult(null);
        setError('');
    };

    const confidenceColor = (c) => c >= 0.8 ? 'text-green-600' : c >= 0.5 ? 'text-yellow-600' : 'text-red-600';
    const confidenceBg = (c) => c >= 0.8 ? 'bg-green-500' : c >= 0.5 ? 'bg-yellow-500' : 'bg-red-500';

    const content = (
        <div className={dashboard ? '' : 'pt-20 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto'}>
            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <Microscope className="w-8 h-8 text-primary-600" />
                    {t('detection.title')}
                </h1>
                <p className="text-gray-500">{t('detection.desc')}</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Upload */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-primary-600" />
                            {t('detection.upload_title')}
                        </h2>

                        {/* Drop Zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                                preview
                                    ? 'border-primary-400 bg-primary-50/50'
                                    : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/30'
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                            {preview ? (
                                <div className="relative">
                                    <img src={preview} alt="Preview" className="w-full max-h-64 object-contain rounded-xl mx-auto" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); resetState(); }}
                                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-md hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-gray-700">{t('detection.drop_text')}</p>
                                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG up to 10MB</p>
                                </>
                            )}
                        </div>

                        {/* Analyze Button */}
                        {selectedImage && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> {t('detection.analyzing')}</>
                                ) : (
                                    <><Leaf className="w-5 h-5" /> {t('detection.analyze_btn')}</>
                                )}
                            </motion.button>
                        )}

                        {/* Error */}
                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Right: Results */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                            >
                                {/* Result Header */}
                                <div className={`p-5 ${result.disease === 'Healthy' ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <div className="flex items-center gap-3">
                                        {result.disease === 'Healthy' ? (
                                            <CheckCircle className="w-10 h-10 text-green-600" />
                                        ) : (
                                            <AlertTriangle className="w-10 h-10 text-red-600" />
                                        )}
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{result.crop}</h3>
                                            <p className={`text-sm font-semibold ${result.disease === 'Healthy' ? 'text-green-700' : 'text-red-700'}`}>
                                                {result.disease}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Confidence */}
                                <div className="p-5 border-b border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('detection.confidence')}</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(result.confidence * 100).toFixed(0)}%` }}
                                                transition={{ duration: 0.8 }}
                                                className={`h-full rounded-full ${confidenceBg(result.confidence)}`}
                                            />
                                        </div>
                                        <span className={`text-lg font-bold ${confidenceColor(result.confidence)}`}>
                                            {(result.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Treatment */}
                                <div className="p-5">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('detection.treatment')}</p>
                                    <div className="flex items-start gap-2 bg-primary-50 p-4 rounded-xl">
                                        <Shield className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-700 leading-relaxed">{result.treatment}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center"
                            >
                                <Leaf className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <p className="text-lg font-semibold text-gray-400">{t('detection.placeholder')}</p>
                                <p className="text-sm text-gray-300 mt-1">{t('detection.placeholder_sub')}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Detection History */}
            {user && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="mt-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary-600" />
                        {t('detection.history')}
                    </h2>
                    {historyLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
                            <p className="text-gray-400 text-sm">{t('detection.no_history')}</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {history.map((d, i) => (
                                <motion.div key={d._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-900 text-sm">{d.crop}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                            d.disease === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>{d.disease}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className={`font-semibold ${confidenceColor(d.confidence)}`}>
                                            {(d.confidence * 100).toFixed(1)}%
                                        </span>
                                        <span>•</span>
                                        <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{d.treatment}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );

    if (dashboard) {
        return <DashboardLayout>{content}</DashboardLayout>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {content}
            <Footer />
        </div>
    );
}
