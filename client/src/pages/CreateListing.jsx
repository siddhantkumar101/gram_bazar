import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { listingApi } from "../api/services";
import VoiceRecorder from "../components/VoiceRecorder";
import useAuth from "../hooks/useAuth";
import { saveOfflineListing } from "../utils/offlineStore";

const CATEGORIES = ["Vegetables", "Grains", "Dairy", "Tools", "Services", "Animals", "Clothes", "Other"];
const CAT_ICONS = { Vegetables: "🥦", Grains: "🌾", Dairy: "🥛", Tools: "🔧", Services: "⚡", Animals: "🐄", Clothes: "👗", Other: "📦" };

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Vegetables",
    deliveryAvailable: false,
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(urls);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) return toast.error("Title and price are required");
    setLoading(true);

    const payload = new FormData();
    Object.entries(form).forEach(([k, v]) => payload.append(k, v));
    Array.from(images).forEach((file) => payload.append("images", file));

    try {
      await listingApi.create(payload);
      toast.success("Listing published! 🎉");
      navigate("/");
    } catch (error) {
      console.error("API Error creating listing:", error.response?.data || error.message || error);
      toast.error(`Upload failed: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      if (!error.response) {
        saveOfflineListing({
          ...form,
          price: Number(form.price),
          images: previewImages.length ? previewImages : ["https://placehold.co/600x400?text=Your+Listing"],
          seller: { _id: user?._id || "offline-user", name: user?.name || "Seller", phone: user?.phone || "" },
          location: { village: "Local", district: "Local", state: "Local" },
          isActive: true,
        });
        toast.success("Saved offline 📶");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pb-8">
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Form */}
        <div className="w-full lg:w-[60%] bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="bg-gradient-to-r from-saffron to-[#e8500f] px-8 py-6">
            <h2 className="text-3xl font-extrabold text-white">Sell an Item</h2>
            <p className="text-orange-100 font-medium mt-1">Reach buyers instantly in your local community.</p>
          </div>

          <form onSubmit={submit} className="p-8 space-y-6">
            {/* Title & Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Product Title <span className="text-red-500">*</span></label>
                <input
                  className="input-field text-lg"
                  placeholder="e.g. Fresh Tomatoes"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">₹</span>
                  <input
                    className="input-field pl-10 text-lg font-bold text-saffron"
                    type="number"
                    placeholder="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat })}
                    className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border-2 font-bold transition-all active:scale-95 ${
                      form.category === cat
                        ? "bg-orange-50 text-saffron border-saffron shadow-sm"
                        : "bg-white text-gray-500 border-gray-100 hover:border-orange-200 hover:bg-orange-50/30"
                    }`}
                  >
                    <span className="text-2xl drop-shadow-sm">{CAT_ICONS[cat]}</span>
                    <span className="text-sm">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-700">Detailed Description</label>
              </div>
              <div className="relative">
                <textarea
                  className="input-field min-h-[140px] resize-y pr-20 text-base"
                  placeholder="Describe product quality, exact quantity, freshness..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <div className="absolute bottom-4 right-4 z-10">
                  <VoiceRecorder
                    lang="hi-IN"
                    onText={(voiceText) =>
                      setForm((prev) => ({
                        ...prev,
                        description: prev.description ? `${prev.description} ${voiceText}` : voiceText,
                      }))
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">Tip: Use the microphone to dictate in Hindi or English!</p>
            </div>

            {/* Photo & Delivery Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Images */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Upload Photos</label>
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-orange-300 rounded-2xl cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors group">
                  <span className="text-3xl transition-transform group-hover:scale-110">📷</span>
                  <span className="text-sm font-medium text-gray-600 mt-1">
                    {images.length ? `${images.length} photo(s) selected` : "Tap to browse"}
                  </span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} />
                </label>
              </div>

              {/* Delivery */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Delivery Options</label>
                <div 
                  className={`h-24 rounded-2xl border-2 flex items-center justify-between px-5 cursor-pointer transition-colors ${
                    form.deliveryAvailable ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                  }`}
                  onClick={() => setForm({ ...form, deliveryAvailable: !form.deliveryAvailable })}
                >
                  <div>
                    <p className={`font-bold ${form.deliveryAvailable ? "text-green-700" : "text-gray-600"}`}>
                      {form.deliveryAvailable ? "🚚 I will deliver" : "🏪 Buyer picks up"}
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {form.deliveryAvailable ? "Delivery to buyer's location" : "Buyer visits your location"}
                    </p>
                  </div>
                  <div className={`w-14 h-8 rounded-full transition-colors relative shadow-inner flex items-center px-1 ${form.deliveryAvailable ? "bg-green-500" : "bg-gray-300"}`}>
                    <span className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${form.deliveryAvailable ? "translate-x-6" : "translate-x-0"}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-lg py-4 shine shadow-[0_8px_20px_rgba(255,107,53,0.3)] hover:shadow-[0_12px_25px_rgba(255,107,53,0.4)]"
              >
                {loading ? "Publishing..." : "🚀 Publish Listing"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Live Preview (Desktop Only) */}
        <div className="hidden lg:block w-[40%]">
          <div className="sticky top-28">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Live Preview</h3>
            
            <div className="bg-white rounded-3xl shadow-lg shadow-orange-100/50 border border-orange-100 overflow-hidden transform transition-all hover:-translate-y-1">
              <div className="relative">
                <img
                  src={previewImages[0] || "https://placehold.co/600x400/FFF8F0/FF6B35?text=Preview+Image"}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                <span className="absolute top-4 left-4 badge bg-white/90 backdrop-blur-md text-gray-800 shadow-md px-3 py-1">
                  {form.category}
                </span>
                
                {form.deliveryAvailable && (
                  <span className="absolute top-4 right-4 badge bg-green-500 text-white shadow-md px-3 py-1">
                    🚚 Delivery
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                  {form.title || "Your Product Title"}
                </h3>
                <p className="text-saffron text-2xl font-black mb-4">
                  ₹{form.price || "0"}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-saffron font-bold">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user?.name || "Seller Name"}</p>
                    <p className="text-xs text-gray-500 font-medium">📍 Your Location</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Helper Card */}
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
              <span className="text-blue-500 text-xl">💡</span>
              <div>
                <h4 className="font-bold text-blue-900">Pro Tip</h4>
                <p className="text-sm text-blue-800/80 font-medium mt-1">Listings with clear photos and a detailed voice description sell 3x faster on GramBazaar!</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateListing;
