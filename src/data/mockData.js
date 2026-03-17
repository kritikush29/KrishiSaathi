export const mockCrops = [
    { id: 1, name: 'Organic Wheat', quantity: '500 kg', priceRange: '₹2,200 - ₹2,500/qt', location: 'Indore, MP', rating: 4.5, farmer: 'Rajesh Kumar', image: '/photos/organic wheat.jpg', bids: 12, category: 'grains' },
    { id: 2, name: 'Basmati Rice', quantity: '300 kg', priceRange: '₹3,500 - ₹4,000/qt', location: 'Dehradun, UK', rating: 4.8, farmer: 'Suresh Patel', image: '/photos/rice.jpg', bids: 8, category: 'grains' },
    { id: 3, name: 'Fresh Tomatoes', quantity: '200 kg', priceRange: '₹800 - ₹1,200/qt', location: 'Nashik, MH', rating: 4.2, farmer: 'Manoj Jadhav', image: '/photos/fresh tomato.jpg', bids: 15, category: 'vegetables' },
    { id: 4, name: 'Green Chilli', quantity: '100 kg', priceRange: '₹1,500 - ₹2,000/qt', location: 'Guntur, AP', rating: 4.6, farmer: 'Venkat Reddy', image: '🌶️', bids: 6, category: 'vegetables' },
    { id: 5, name: 'Alphonso Mango', quantity: '400 kg', priceRange: '₹5,000 - ₹7,000/qt', location: 'Ratnagiri, MH', rating: 4.9, farmer: 'Prakash Desai', image: '/photos/alphonso mango.jpg', bids: 22, category: 'fruits' },
    { id: 6, name: 'Cotton', quantity: '800 kg', priceRange: '₹6,000 - ₹6,500/qt', location: 'Amravati, MH', rating: 4.3, farmer: 'Ganesh Patil', image: '/photos/cotton.jpg', bids: 9, category: 'cash_crops' },
    { id: 7, name: 'Soybean', quantity: '600 kg', priceRange: '₹4,200 - ₹4,800/qt', location: 'Ujjain, MP', rating: 4.4, farmer: 'Dinesh Sharma', image: '🫘', bids: 11, category: 'pulses' },
    { id: 8, name: 'Fresh Onions', quantity: '1000 kg', priceRange: '₹1,000 - ₹1,800/qt', location: 'Lasalgaon, MH', rating: 4.1, farmer: 'Anil Wagh', image: '/photos/fresh onions.jpg', bids: 18, category: 'vegetables' },
    { id: 9, name: 'Turmeric', quantity: '250 kg', priceRange: '₹7,500 - ₹9,000/qt', location: 'Erode, TN', rating: 4.7, farmer: 'Murugan S', image: '/photos/turmeric.jpg', bids: 7, category: 'spices' },
    { id: 10, name: 'Sugarcane', quantity: '2000 kg', priceRange: '₹300 - ₹350/qt', location: 'Kolhapur, MH', rating: 4.0, farmer: 'Balaji Shinde', image: '🎋', bids: 5, category: 'cash_crops' },
];

export const mockStoreProducts = {
    fertilizers: [
        { id: 1, name: 'NPK 10-26-26', brand: 'IFFCO', price: '₹1,350', unit: '50 kg bag', rating: 4.5, image: '🧪', desc: 'Balanced nutrition for all crops' },
        { id: 2, name: 'Urea (Neem Coated)', brand: 'Kribhco', price: '₹266', unit: '45 kg bag', rating: 4.3, image: '🧴', desc: 'Nitrogen-rich fertilizer' },
        { id: 3, name: 'DAP Fertilizer', brand: 'Coromandel', price: '₹1,350', unit: '50 kg bag', rating: 4.6, image: '💊', desc: 'Phosphorus-rich for root growth' },
        { id: 4, name: 'Vermicompost', brand: 'Organic India', price: '₹450', unit: '25 kg bag', rating: 4.8, image: '🌿', desc: '100% organic manure' },
    ],
    seeds: [
        { id: 5, name: 'Hybrid Tomato Seeds', brand: 'Syngenta', price: '₹850', unit: '10g pack', rating: 4.7, image: '🌱', desc: 'High-yield hybrid variety' },
        { id: 6, name: 'BT Cotton Seeds', brand: 'Mahyco', price: '₹930', unit: '450g pack', rating: 4.4, image: '🌱', desc: 'Bollworm resistant variety' },
        { id: 7, name: 'Wheat HD-2967', brand: 'ICAR', price: '₹120', unit: '1 kg pack', rating: 4.6, image: '🌱', desc: 'High-yield, disease resistant' },
        { id: 8, name: 'Paddy Pusa 1121', brand: 'IARI', price: '₹180', unit: '1 kg pack', rating: 4.8, image: '🌱', desc: 'Premium basmati variety' },
    ],
    tools: [
        { id: 9, name: 'Hand Sprayer 16L', brand: 'Neptune', price: '₹1,200', unit: '1 piece', rating: 4.2, image: '🔧', desc: 'Manual pressure sprayer' },
        { id: 10, name: 'Drip Irrigation Kit', brand: 'Jain Irrigation', price: '₹3,500', unit: '1 set', rating: 4.5, image: '💧', desc: 'For 1-acre coverage' },
        { id: 11, name: 'Soil Testing Kit', brand: 'AgroLab', price: '₹2,100', unit: '1 kit', rating: 4.6, image: '🔬', desc: 'Test pH, NPK levels' },
        { id: 12, name: 'Garden Pruning Shears', brand: 'Falcon', price: '₹450', unit: '1 piece', rating: 4.3, image: '✂️', desc: 'Sharp carbon steel blades' },
    ],
};

export const mockInsurancePlans = [
    { id: 1, name: 'Pradhan Mantri Fasal Bima Yojana', premium: '₹500/acre', coverage: '₹50,000/acre', crops: ['Wheat', 'Rice', 'Cotton'], duration: 'Kharif/Rabi Season', features: ['Natural calamity cover', 'Pest & disease protection', 'Post-harvest loss cover'], popular: true },
    { id: 2, name: 'Weather Based Crop Insurance', premium: '₹800/acre', coverage: '₹75,000/acre', crops: ['All Crops'], duration: '6 months', features: ['Rainfall deviation cover', 'Temperature extremes', 'Quick claim settlement'], popular: false },
    { id: 3, name: 'Unified Package Insurance', premium: '₹1,200/acre', coverage: '₹1,00,000/acre', crops: ['Horticulture', 'Fruits', 'Vegetables'], duration: '12 months', features: ['Comprehensive crop cover', 'Equipment insurance', 'Personal accident cover', 'Dwelling protection'], popular: true },
];

export const mockOrders = [
    { id: 1, crop: 'Organic Wheat', buyer: 'FreshMart Foods', quantity: '200 kg', price: '₹2,400/qt', status: 'confirmed', date: '2026-03-10' },
    { id: 2, crop: 'Basmati Rice', buyer: 'Rice Palace', quantity: '100 kg', price: '₹3,800/qt', status: 'pending', date: '2026-03-09' },
    { id: 3, crop: 'Fresh Tomatoes', buyer: 'VeggieBazaar', quantity: '150 kg', price: '₹1,100/qt', status: 'shipped', date: '2026-03-08' },
    { id: 4, crop: 'Green Chilli', buyer: 'SpiceMart', quantity: '50 kg', price: '₹1,800/qt', status: 'delivered', date: '2026-03-05' },
];

export const mockWeather = {
    location: 'Indore, MP',
    temp: 28,
    condition: 'Partly Cloudy',
    humidity: 45,
    wind: '12 km/h',
    forecast: [
        { day: 'Today', high: 30, low: 18, icon: '⛅' },
        { day: 'Thu', high: 32, low: 19, icon: '☀️' },
        { day: 'Fri', high: 29, low: 17, icon: '🌦️' },
        { day: 'Sat', high: 27, low: 16, icon: '🌧️' },
        { day: 'Sun', high: 31, low: 18, icon: '☀️' },
    ],
};

export const mockSchemes = [
    {
        id: 1,
        name: 'PM Kisan Samman Nidhi',
        description: 'Direct income support of ₹6,000 per year to farmer families.',
        eligibility: 'All landholding farmers families',
        benefits: '₹6,000 per year in 3 equal installments',
        link: 'https://pmkisan.gov.in/',
        icon: '🌾'
    },
    {
        id: 2,
        name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'Comprehensive crop insurance from pre-sowing to post-harvest.',
        eligibility: 'Farmers growing notified crops in notified areas',
        benefits: 'Financial support in case of crop failure',
        link: 'https://pmfby.gov.in/',
        icon: '🛡️'
    },
    {
        id: 3,
        name: 'Kisan Credit Card (KCC)',
        description: 'Adequate and timely credit support from the banking system.',
        eligibility: 'Farmers, Tenant/Sharecroppers, SHGs/JLGs',
        benefits: 'Short term credit for crop cultivation and related activities at 4% interest',
        link: 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card',
        icon: '💳'
    },
    {
        id: 4,
        name: 'Soil Health Card Scheme',
        description: 'Provides information on nutrient status of soil along with recommendations.',
        eligibility: 'All farmers across the country',
        benefits: 'Improved crop yield through balanced use of fertilizers',
        link: 'https://soilhealth.dac.gov.in/',
        icon: '🌱'
    }
];

export const mockNews = [
    {
        id: 1,
        category: 'Policy',
        title: 'Government announces higher MSP for Kharif crops 2026-27',
        date: '16 Mar 2026',
        summary: 'The Cabinet has approved an increase in Minimum Support Prices (MSP) for all mandated Kharif crops...',
        icon: '📈'
    },
    {
        id: 2,
        category: 'Weather',
        title: 'Unseasonal rains expected in Central India',
        date: '15 Mar 2026',
        summary: 'IMD warns of light to moderate rainfall accompanied by thunderstorms in areas of MP, MH, and CG over the next 48 hours.',
        icon: '⛈️'
    },
    {
        id: 3,
        category: 'Price Alert',
        title: 'Onion prices surge by 15% across major mandis',
        date: '14 Mar 2026',
        summary: 'Due to reduced supply, wholesale prices of onions have seen a sharp increase in Lasalgaon and other major markets.',
        icon: '🧅'
    },
    {
        id: 4,
        category: 'News',
        title: 'New Agri-tech startup funding initiative launched',
        date: '12 Mar 2026',
        summary: 'A new ₹500 crore fund has been established to support innovative agricultural technology startups across the country.',
        icon: '🚀'
    }
];

export const mockSupportTickets = [
    { id: 'TKT-001', subject: 'Payment not received for wheat order', category: 'Payment', priority: 'High', status: 'open', createdAt: '2026-03-15', lastUpdated: '2026-03-16' },
    { id: 'TKT-002', subject: 'Unable to upload crop images', category: 'Technical', priority: 'Medium', status: 'in_progress', createdAt: '2026-03-12', lastUpdated: '2026-03-14' },
    { id: 'TKT-003', subject: 'Wrong delivery address on order #3', category: 'Orders', priority: 'High', status: 'resolved', createdAt: '2026-03-08', lastUpdated: '2026-03-10' },
];

export const mockInsuranceClaims = [
    { id: 'CLM-2026-001', plan: 'PM Fasal Bima Yojana', crop: 'Wheat', claimAmount: '₹25,000', status: 'approved', filedDate: '2026-02-20', settledDate: '2026-03-05' },
    { id: 'CLM-2026-002', plan: 'Weather Based Insurance', crop: 'Rice', claimAmount: '₹40,000', status: 'under_review', filedDate: '2026-03-10', settledDate: null },
];

export const mockSavedItems = [
    { id: 1, cropId: 1, name: 'Organic Wheat', farmer: 'Rajesh Kumar', price: '₹2,200 - ₹2,500/qt', location: 'Indore, MP', image: '/photos/organic wheat.jpg', savedAt: '2026-03-14' },
    { id: 2, cropId: 5, name: 'Alphonso Mango', farmer: 'Prakash Desai', price: '₹5,000 - ₹7,000/qt', location: 'Ratnagiri, MH', image: '/photos/alphonso mango.jpg', savedAt: '2026-03-12' },
    { id: 3, cropId: 9, name: 'Turmeric', farmer: 'Murugan S', price: '₹7,500 - ₹9,000/qt', location: 'Erode, TN', image: '/photos/turmeric.jpg', savedAt: '2026-03-10' },
];

export const mockFAQs = [
    { q: 'How do I list my crops on KrishiSaathi?', a: 'Go to your Farmer Dashboard → Upload Crop, fill in the details like crop name, quantity, price, and upload images. Click "Publish Listing" to make it live.' },
    { q: 'How does the bidding system work?', a: 'Buyers can place bids on listed crops. As a farmer, you can accept, reject, or negotiate bids from your Orders page.' },
    { q: 'How do I apply for crop insurance?', a: 'Navigate to the Insurance section from your sidebar. Browse available plans and click "Apply Now" to submit your application.' },
    { q: 'What payment methods are supported?', a: 'We support UPI, Net Banking, Debit/Credit cards, and direct bank transfers through our secure payment gateway powered by Razorpay.' },
    { q: 'How can I track my order?', a: 'Go to Orders in your dashboard. Each order shows real-time status updates: Pending → Confirmed → Shipped → Delivered.' },
    { q: 'Is my data secure on KrishiSaathi?', a: 'Yes, we use industry-standard encryption and secure servers. Your personal and financial data is never shared with third parties.' },
];
