const OFFLINE_LISTINGS_KEY = "grambazaar_offline_listings";
const OFFLINE_ORDERS_KEY = "grambazaar_offline_orders";

const defaultListings = [
  {
    _id: "seed-1",
    title: "Fresh Tomatoes",
    description: "Locally grown tomatoes, pesticide free.",
    price: 40,
    category: "Vegetables",
    images: ["https://placehold.co/600x400?text=Tomatoes"],
    seller: { _id: "seller-1", name: "Ramesh", phone: "919999999999" },
    location: { village: "Rampur", district: "Varanasi", state: "UP" },
    deliveryAvailable: true,
    isActive: true
  },
  {
    _id: "seed-2",
    title: "Desi Wheat",
    description: "Clean and fresh wheat, 25kg bags.",
    price: 1200,
    category: "Grains",
    images: ["https://placehold.co/600x400?text=Wheat"],
    seller: { _id: "seller-2", name: "Sunita", phone: "918888888888" },
    location: { village: "Chunar", district: "Mirzapur", state: "UP" },
    deliveryAvailable: false,
    isActive: true
  }
];

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const getOfflineListings = () => {
  const existing = read(OFFLINE_LISTINGS_KEY, []);
  if (existing.length === 0) {
    write(OFFLINE_LISTINGS_KEY, defaultListings);
    return defaultListings;
  }
  return existing;
};

export const saveOfflineListing = (listing) => {
  const current = getOfflineListings();
  const next = [{ ...listing, _id: `offline-${Date.now()}` }, ...current];
  write(OFFLINE_LISTINGS_KEY, next);
  return next[0];
};

export const getOfflineListingById = (id) => getOfflineListings().find((item) => item._id === id);

export const getOfflineOrders = () => read(OFFLINE_ORDERS_KEY, []);

export const saveOfflineOrder = (order) => {
  const current = getOfflineOrders();
  const next = [{ ...order, _id: `order-${Date.now()}` }, ...current];
  write(OFFLINE_ORDERS_KEY, next);
  return next[0];
};
