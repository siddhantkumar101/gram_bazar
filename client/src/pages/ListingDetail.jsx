import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listingApi, orderApi } from "../api/services";
import toast from "react-hot-toast";
import WhatsAppBtn from "../components/WhatsAppBtn";
import useAuth from "../hooks/useAuth";
import useTTS from "../hooks/useTTS";
import { getOfflineListingById, saveOfflineOrder } from "../utils/offlineStore";

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toggle, isSpeaking } = useTTS();

  const { data, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      try {
        return (await listingApi.getOne(id)).data.data.listing;
      } catch {
        return getOfflineListingById(id);
      }
    },
  });

  if (isLoading) return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 pb-24 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="bg-orange-100 rounded-3xl h-[400px] md:h-[600px] w-full md:w-1/2" />
        <div className="space-y-6 w-full md:w-1/2 mt-4 md:mt-0">
          <div className="bg-gray-200 rounded-xl h-10 w-3/4" />
          <div className="bg-gray-100 rounded-lg h-6 w-1/4" />
          <div className="bg-orange-50 rounded-2xl h-24 w-full" />
          <div className="bg-gray-100 rounded-lg h-32 w-full" />
        </div>
      </div>
    </div>
  );

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="text-6xl bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center">😕</div>
      <p className="text-gray-500 font-bold text-xl">Listing not found</p>
    </div>
  );

  const ttsText = `${data.title}. Price: ${data.price} rupees. Seller: ${data.seller?.name}. ${data.description || ""}`;

  return (
    <div className="w-full max-w-6xl mx-auto pb-28 pt-4 md:pt-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Image Gallery */}
        <div className="w-full md:w-1/2 relative bg-gray-50">
          <img
            src={data.images?.[0] || "https://placehold.co/600x600/FFF8F0/FF6B35?text=📦"}
            alt={data.title}
            className="w-full h-[400px] md:h-full min-h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
          {data.category && (
            <span className="absolute top-4 left-4 badge bg-white/90 backdrop-blur-md text-gray-800 shadow-lg px-4 py-1.5 text-sm">
              {data.category}
            </span>
          )}
          {data.deliveryAvailable && (
            <span className="absolute top-4 right-4 badge bg-green-500 text-white shadow-lg px-4 py-1.5 text-sm flex items-center gap-1.5">
              🚚 Delivery Available
            </span>
          )}
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              {data.title}
            </h1>
            <button
              onClick={() => toggle(ttsText, "hi-IN")}
              className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-300 active:scale-95 hover:scale-105 ${
                isSpeaking
                  ? "bg-red-500 text-white pulse-ring"
                  : "bg-gradient-to-br from-saffron to-[#e8500f] text-white shadow-saffron"
              }`}
              title={isSpeaking ? "Stop reading" : "Read aloud (Hindi)"}
            >
              {isSpeaking ? "⏹" : "🔊"}
            </button>
          </div>

          <p className="text-gray-400 text-sm font-medium mb-8">Added {new Date(data.createdAt || Date.now()).toLocaleDateString()}</p>

          {/* Price Box */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between mb-8">
            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1 md:mb-0">Selling Price</span>
            <span className="text-saffron text-4xl font-black">₹{data.price}</span>
          </div>

          {/* Description */}
          {data.description && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>📝</span> Description
              </h3>
              <p className="text-gray-600 text-base leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100">
                {data.description}
              </p>
            </div>
          )}

          {/* Seller Card */}
          <div className="mt-auto pt-6 border-t border-gray-100 mb-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">About the Seller</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-saffron to-[#ff9870] flex items-center justify-center text-white font-bold text-2xl shadow-md">
                {data.seller?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg">{data.seller?.name}</p>
                {data.location?.village && (
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                    <span>📍</span> {data.location.village}, {data.location.district}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Actions Desktop/Mobile */}
          {user?.role !== "seller" && (
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                className="flex-1 btn-primary text-lg py-4 flex items-center justify-center gap-2 shine"
                onClick={async () => {
                  try {
                    await orderApi.create({ listingId: data._id, quantity: 1, deliveryRequested: true });
                    toast.success("Order placed successfully! 🎉");
                  } catch {
                    saveOfflineOrder({
                      listing: { _id: data._id, title: data.title, price: data.price },
                      buyer: user?._id || "offline-user",
                      seller: data.seller?._id || "offline-seller",
                      quantity: 1,
                      status: "pending",
                      deliveryRequested: true,
                    });
                    toast.success("Order saved offline 📶");
                  }
                }}
              >
                <span>🛒</span> Buy Now
              </button>
              <div className="flex-1">
                <WhatsAppBtn phone={data.seller?.phone} title={data.title} className="w-full h-full py-4 text-lg" />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ListingDetail;
