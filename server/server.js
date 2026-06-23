require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const cropRoutes = require('./routes/cropRoutes');
const marketRoutes = require('./routes/marketRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const insuranceRoutes = require('./routes/insuranceRoutes');
const detectionRoutes = require('./routes/detectionRoutes');
const priceRoutes    = require('./routes/priceRoutes');
const newsRoutes     = require('./routes/newsRoutes');
const { initJobs }   = require('./jobs');

const app = express();
const server = http.createServer(app);

// Dynamic CORS origin configuration
const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://krishi-saathi045.vercel.app',
    'https://krishi-saathi045.vercel.app/'
];
if (clientUrl) {
    const trimmedUrl = clientUrl.trim();
    if (!allowedOrigins.includes(trimmedUrl)) {
        allowedOrigins.push(trimmedUrl);
    }
    const cleanUrl = trimmedUrl.endsWith('/') ? trimmedUrl.slice(0, -1) : trimmedUrl;
    const slashUrl = cleanUrl + '/';
    if (!allowedOrigins.includes(cleanUrl)) allowedOrigins.push(cleanUrl);
    if (!allowedOrigins.includes(slashUrl)) allowedOrigins.push(slashUrl);
}

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
    },
});

// Make io accessible to controllers
app.set('io', io);

// Socket.io events
io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join listing room for real-time bids
    socket.on('join-listing', (listingId) => {
        socket.join(`listing:${listingId}`);
        console.log(`📌 ${socket.id} joined listing:${listingId}`);
    });

    socket.on('leave-listing', (listingId) => {
        socket.leave(`listing:${listingId}`);
    });

    socket.on('disconnect', () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/marketplace', marketRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/detection', detectionRoutes);
app.use('/api/prices',   priceRoutes);
app.use('/api/news',     newsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'KrishiSaathi API is running 🌾',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB();
        initJobs();
        server.listen(PORT, () => {
            console.log(`\n🚀 KrishiSaathi API running on port ${PORT}`);
            console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 Health: http://localhost:${PORT}/api/health\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = { app, server, io };
