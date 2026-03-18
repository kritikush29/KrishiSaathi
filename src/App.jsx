import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerListings from './pages/FarmerListings';
import FarmerUploadCrop from './pages/FarmerUploadCrop';
import FarmerOrders from './pages/FarmerOrders';
import BuyerDashboard from './pages/BuyerDashboard';
import BuyerMarketplace from './pages/BuyerMarketplace';
import BuyerOrders from './pages/BuyerOrders';
import MarketplacePage from './pages/MarketplacePage';
import AgriStorePage from './pages/AgriStorePage';
import InsurancePage from './pages/InsurancePage';
import ChatSupportPage from './pages/ChatSupportPage';
import KrishiSamacharPage from './pages/KrishiSamacharPage';
import SupportPage from './pages/SupportPage';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import FloatingChatbot from './components/ui/FloatingChatbot';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/store" element={<AgriStorePage />} />
          <Route path="/insurance" element={<InsurancePage />} />
          <Route path="/chat" element={<ChatSupportPage />} />
          <Route path="/samachar" element={<KrishiSamacharPage />} />
          <Route path="/detect" element={<DiseaseDetectionPage />} />

          {/* Farmer Protected */}
          <Route path="/farmer" element={<ProtectedRoute role="farmer"><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/farmer/listings" element={<ProtectedRoute role="farmer"><FarmerListings /></ProtectedRoute>} />
          <Route path="/farmer/upload" element={<ProtectedRoute role="farmer"><FarmerUploadCrop /></ProtectedRoute>} />
          <Route path="/farmer/orders" element={<ProtectedRoute role="farmer"><FarmerOrders /></ProtectedRoute>} />
          <Route path="/farmer/store" element={<ProtectedRoute role="farmer"><AgriStorePage dashboard /></ProtectedRoute>} />
          <Route path="/farmer/insurance" element={<ProtectedRoute role="farmer"><InsurancePage dashboard /></ProtectedRoute>} />
          <Route path="/farmer/support" element={<ProtectedRoute role="farmer"><SupportPage /></ProtectedRoute>} />
          <Route path="/farmer/detect" element={<ProtectedRoute role="farmer"><DiseaseDetectionPage dashboard /></ProtectedRoute>} />

          {/* Buyer Protected */}
          <Route path="/buyer" element={<ProtectedRoute role="buyer"><BuyerDashboard /></ProtectedRoute>} />
          <Route path="/buyer/marketplace" element={<ProtectedRoute role="buyer"><BuyerMarketplace /></ProtectedRoute>} />
          <Route path="/buyer/orders" element={<ProtectedRoute role="buyer"><BuyerOrders /></ProtectedRoute>} />
          <Route path="/buyer/store" element={<ProtectedRoute role="buyer"><AgriStorePage dashboard /></ProtectedRoute>} />
          <Route path="/buyer/insurance" element={<ProtectedRoute role="buyer"><InsurancePage dashboard /></ProtectedRoute>} />
          <Route path="/buyer/support" element={<ProtectedRoute role="buyer"><SupportPage /></ProtectedRoute>} />
          <Route path="/buyer/detect" element={<ProtectedRoute role="buyer"><DiseaseDetectionPage dashboard /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FloatingChatbot />
      </Router>
    </AuthProvider>
  );
}

export default App;
