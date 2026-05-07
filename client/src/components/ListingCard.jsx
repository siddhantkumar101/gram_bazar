import { Link } from "react-router-dom";
import WhatsAppBtn from "./WhatsAppBtn";
import useTTS from "../hooks/useTTS";

const categoryColors = {
  Vegetables: "bg-green-100 text-green-700",
  Grains: "bg-yellow-100 text-yellow-700",
  Dairy: "bg-blue-100 text-blue-700",
  Tools: "bg-gray-100 text-gray-700",
  Services: "bg-purple-100 text-purple-700",
  Animals: "bg-orange-100 text-orange-700",
  Clothes: "bg-pink-100 text-pink-700",
  Other: "bg-slate-100 text-slate-600",
};

const ListingCard = ({ listing }) => {
  const { toggle, isSpeaking } = useTTS();
  const ttsText = `${listing.title}. Price: ${listing.price} rupees. Seller: ${listing.seller?.name}. ${listing.description || ""}`;

  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative">
        <img
          src={listing.images?.[0] || "https://placehold.co/400x280/FFF8F0/FF6B35?text=📦"}
          alt={listing.title}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
        {listing.category && (
          <span className={`absolute top-2 left-2 badge ${categoryColors[listing.category] || "bg-orange-100 text-orange-700"}`}>
            {listing.category}
          </span>
        )}
        {listing.deliveryAvailable && (
          <span className="absolute top-2 right-2 badge bg-earth text-white text-[10px]">
            🚚 Delivery
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-1">{listing.title}</h3>

        <div className="flex items-center justify-between mt-1">
          <p className="text-saffron text-lg font-bold">₹{listing.price}</p>
          {/* TTS Button */}
          <button
            onClick={() => toggle(ttsText, "hi-IN")}
            className={`tap-target rounded-full w-9 h-9 flex items-center justify-center transition-all ${
              isSpeaking
                ? "bg-red-100 text-red-500 pulse-ring"
                : "bg-orange-50 text-saffron hover:bg-orange-100"
            }`}
            title={isSpeaking ? "Stop" : "Listen"}
            type="button"
          >
            {isSpeaking ? "⏹" : "🔊"}
          </button>
        </div>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-gray-500">👤 {listing.seller?.name}</span>
          {listing.location?.village && (
            <span className="text-xs text-gray-400">• 📍 {listing.location.village}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <Link
            className="flex-1 btn-secondary text-sm text-center"
            to={`/listings/${listing._id}`}
          >
            View Details
          </Link>
          <WhatsAppBtn phone={listing.seller?.phone} title={listing.title} />
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
