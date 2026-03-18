const router = require('express').Router();
const { detectDisease, getHistory } = require('../controllers/detectionController');
const { auth, optionalAuth } = require('../middlewares/auth');
const multer = require('multer');

// Use memory storage so we can forward the buffer to the AI service
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

// Predict uses optionalAuth — guests can analyze, logged-in users get history saved
router.post('/predict', optionalAuth, upload.single('image'), detectDisease);
// History requires full auth
router.get('/history', auth, getHistory);

module.exports = router;
