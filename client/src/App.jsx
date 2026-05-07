import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateListing from "./pages/CreateListing";
import ListingDetail from "./pages/ListingDetail";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import SellerDashboard from "./pages/SellerDashboard";

const App = () => {
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-cream text-gray-900 font-inter flex flex-col md:flex-row w-full">
      {/* Navbar acts as Sidebar on Desktop, Bottom Bar on Mobile */}
      <Navbar />

      <div className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col md:pl-64">
        {/* Top Strip */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100/50 shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:hidden">
            <span className="text-2xl">🛒</span>
            <span className="font-bold text-saffron text-xl">GramBazaar</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back! 👋</h1>
          </div>
          <button
            onClick={() => i18n.changeLanguage(i18n.language === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-50 to-white border border-orange-200 text-saffron px-4 py-2 rounded-full text-sm font-semibold active:scale-95 transition-all shadow-sm hover:shadow-md"
          >
            {i18n.language === "en" ? "🇮🇳 हिंदी" : "🇬🇧 EN"}
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full overflow-x-hidden relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/sell" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
