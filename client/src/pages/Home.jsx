import { useState } from "react";
import useListings from "../hooks/useListings";
import ListingCard from "../components/ListingCard";
import { useTranslation } from "react-i18next";

const CATEGORIES = ["", "Vegetables", "Grains", "Dairy", "Tools", "Services", "Animals", "Clothes", "Other"];
const CAT_ICONS = { "": "🌾", Vegetables: "🥦", Grains: "🌾", Dairy: "🥛", Tools: "🔧", Services: "⚡", Animals: "🐄", Clothes: "👗", Other: "📦" };

const Home = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { data, isLoading } = useListings({ search, category, page: 1, limit: 20 });
  const { t } = useTranslation();

  return (
    <div className="pb-24 md:pb-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF6B35] via-[#e8500f] to-[#b33a08] p-8 md:p-12 shadow-2xl mb-8 group">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#FFD166] opacity-10 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm mb-3">
              Your Local <br className="md:hidden" />
              <span className="text-orange-200">Rural Marketplace</span>
            </h1>
            <p className="text-orange-100 text-lg font-medium opacity-90 max-w-md">
              Buy and sell fresh produce, tools, and services directly within your community.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-96 relative group/search">
            <div className="absolute inset-0 bg-white rounded-2xl blur-md opacity-20 group-hover/search:opacity-40 transition-opacity"></div>
            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-inner">
              <span className="pl-5 text-white/70 text-xl">🔍</span>
              <input
                className="w-full pl-3 pr-5 py-4 bg-transparent border-none text-white placeholder-white/60 focus:outline-none focus:ring-0 text-lg font-medium"
                placeholder={t("search_placeholder") || "Search items..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Categories</h2>
          {!isLoading && data?.items?.length > 0 && (
            <p className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {data.items.length} {category ? `in ${category}` : "total items"}
            </p>
          )}
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat || "all"}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border-2 transition-all active:scale-95 duration-200 ${
                  isActive
                    ? "bg-saffron text-white border-saffron shadow-[0_4px_15px_rgba(255,107,53,0.3)] -translate-y-1"
                    : "bg-white text-gray-600 border-orange-100 hover:border-saffron hover:text-saffron hover:shadow-md"
                }`}
              >
                <span className="text-xl drop-shadow-sm">{CAT_ICONS[cat]}</span>
                <span>{cat || "All"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-3xl overflow-hidden border border-orange-50 shadow-sm">
              <div className="bg-orange-100/50 h-52 w-full" />
              <div className="p-5 space-y-3">
                <div className="bg-gray-200 rounded-md h-5 w-3/4" />
                <div className="bg-gray-100 rounded-md h-4 w-1/2" />
                <div className="bg-orange-50 rounded-xl h-12 w-full mt-4" />
              </div>
            </div>
          ))
        ) : data?.items?.length ? (
          data.items.map((item) => <ListingCard key={item._id} listing={item} />)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-orange-200">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-5xl mb-4">🌾</div>
            <h3 className="text-2xl font-bold text-gray-800">No listings found</h3>
            <p className="text-gray-500 font-medium mt-2 max-w-md text-center">
              We couldn't find anything matching your search. Be the first to add something in this category!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
