import { useQuery } from "@tanstack/react-query";
import { orderApi } from "../api/services";
import DeliveryTracker from "../components/DeliveryTracker";
import { getOfflineOrders } from "../utils/offlineStore";
import { Link } from "react-router-dom";

const Orders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["orders", "my"],
    queryFn: async () => {
      try {
        return (await orderApi.my()).data.data.orders;
      } catch {
        return getOfflineOrders();
      }
    }
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
          <p className="text-gray-500 font-medium mt-1">Track and manage your purchases</p>
        </div>
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
          📦
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-3xl p-6 border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-8"></div>
              <div className="h-2 bg-orange-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : data?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-full -mr-4 -mt-4"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Order #{order._id?.slice(-6) || "OFFLNE"}</span>
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{order.listing?.title || "Unknown Item"}</h3>
                  <p className="text-gray-500 font-medium text-sm mt-1">Qty: {order.quantity || 1}</p>
                </div>
                {order.listing?._id && (
                  <Link to={`/listings/${order.listing._id}`} className="text-saffron bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full text-xs font-bold transition-colors">
                    View Item
                  </Link>
                )}
              </div>

              {/* Receipt Break */}
              <div className="flex items-center gap-2 my-2 opacity-30">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>

              <div className="flex justify-between items-center py-2 relative z-10">
                <span className="text-gray-500 font-medium">Total Amount</span>
                <span className="text-2xl font-black text-saffron">₹{order.listing?.price * (order.quantity || 1) || 0}</span>
              </div>

              <DeliveryTracker status={order.status} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-orange-200 mt-4">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-5xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold text-gray-800">No orders yet</h3>
          <p className="text-gray-500 font-medium mt-2 mb-6">Looks like you haven't bought anything.</p>
          <Link to="/" className="btn-primary">Start Shopping</Link>
        </div>
      )}
    </div>
  );
};

export default Orders;
