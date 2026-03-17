import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Upload, Plus, X, MapPin, Image, FileText } from 'lucide-react';

export default function FarmerUploadCrop() {
    const [form, setForm] = useState({
        name: '', quantity: '', pricePerKg: '', location: '', description: '', category: 'grains'
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(f => ({
            file: f,
            preview: URL.createObjectURL(f),
            name: f.name
        }));
        setImages(prev => [...prev, ...newImages].slice(0, 5));
    };

    const removeImage = (idx) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    const categories = [
        { value: 'grains', label: '🌾 Grains' },
        { value: 'vegetables', label: '🥬 Vegetables' },
        { value: 'fruits', label: '🍎 Fruits' },
        { value: 'pulses', label: '🫘 Pulses' },
        { value: 'spices', label: '🌶️ Spices' },
        { value: 'cash_crops', label: '🌿 Cash Crops' },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-2xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="page-title flex items-center gap-2">
                        <Upload className="w-7 h-7 text-primary-600" /> Upload Crop
                    </h1>
                    <p className="page-subtitle">List your crop on the marketplace for buyers to discover.</p>
                </div>

                {/* Success Banner */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                    >
                        <span className="text-2xl">✅</span>
                        <div>
                            <p className="font-semibold text-green-800">Listing Published!</p>
                            <p className="text-sm text-green-600">Your crop is now visible to buyers on the marketplace.</p>
                        </div>
                    </motion.div>
                )}

                {/* Form */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Crop Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Crop Name *</label>
                            <input type="text" className="input-field" placeholder="e.g. Organic Wheat"
                                value={form.name} onChange={set('name')} required />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {categories.map(c => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, category: c.value })}
                                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all text-center ${form.category === c.value
                                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-400'
                                            : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                                            }`}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity + Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity (kg) *</label>
                                <input type="number" className="input-field" placeholder="e.g. 500"
                                    value={form.quantity} onChange={set('quantity')} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price per kg (₹) *</label>
                                <input type="number" className="input-field" placeholder="e.g. 25"
                                    value={form.pricePerKg} onChange={set('pricePerKg')} required />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" className="input-field pl-10" placeholder="e.g. Indore, MP"
                                    value={form.location} onChange={set('location')} required />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                            <textarea className="input-field h-24 resize-none" placeholder="Describe crop quality, grade, harvest date..."
                                value={form.description} onChange={set('description')} />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Upload Images <span className="text-gray-400 font-normal">(max 5)</span>
                            </label>
                            {images.length > 0 && (
                                <div className="flex gap-3 mb-3 overflow-x-auto pb-2">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200">
                                            <img src={img.preview} alt={img.name} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {images.length < 5 && (
                                <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer block">
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload crop images</p>
                                    <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB each</p>
                                </label>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !form.name || !form.quantity || !form.pricePerKg || !form.location}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><Upload className="w-5 h-5" /> Publish Listing</>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
