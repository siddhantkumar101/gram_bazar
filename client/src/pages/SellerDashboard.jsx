import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../api/services";
import toast from "react-hot-toast";

const STATUS_FLOW = {
  "pending": { next: "accepted", label: "Accept Order", color: "bg-blue-500" },
  "accepted": { next: "picked_up", label: "Mark Out for Delivery", color: "bg-saffron" },
  "picked_up": { next: "delivered", label: "Mark Delivered", color: "bg-green-500" },
  "delivered": { next: null, label: "Completed", color: "bg-gray-400" }
};

const SellerDashboard = () => {
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ["orders", "seller"],
    queryFn: async () => (await orderApi.sellerOrders()).data.data.orders
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => orderApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Order status updated!");
      queryClient.invalidateQueries(["orders", "seller"]);
    },
    onError: () => toast.error("Failed to update status")
  });

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your incoming orders and deliveries.</p>
        </div>
        <div className="w-12 h-12 bg-saffron/10 text-saffron rounded-full flex items-center justify-center text-2xl">
          📊
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data?.length > 0 ? data.map((order) => {
          const flow = STATUS_FLOW[order.status] || STATUS_FLOW["pending"];
          
          return (
            <div key={order._id} className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Order #{order._id.slice(-6)}</span>
                  <h3 className="text-xl font-bold text-gray-900">{order.listing?.title || "Unknown Item"}</h3>
                  <p className="text-saffron font-bold mt-1">₹{order.listing?.price || 0} x {order.quantity || 1}</p>
                </div>
                <div className="text-right">
                  <span className="badge bg-orange-50 text-saffron border border-orange-100 uppercase text-[10px]">
                    Status: {order.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Customer Details</h4>
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {order.buyer?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{order.buyer?.name || "Unknown Buyer"}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><span>📞</span> {order.buyer?.phone || "No phone"}</p>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs font-medium text-gray-400">
                  {order.deliveryRequested ? "🚚 Delivery Requested" : "🏪 Customer Pickup"}
                </p>
                
                {flow.next ? (
                  <button
                    onClick={() => updateMutation.mutate({ id: order._id, status: flow.next })}
                    disabled={updateMutation.isLoading}
                    className={`px-5 py-2.5 rounded-full text-white font-bold text-sm shadow-md transition-transform active:scale-95 hover:brightness-110 ${flow.color}`}
                  >
                    {updateMutation.isLoading ? "Updating..." : flow.label}
                  </button>
                ) : (
                  <span className="px-5 py-2.5 rounded-full bg-gray-100 text-gray-500 font-bold text-sm">
                    Order Completed
                  </span>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-orange-200 text-center">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="text-2xl font-bold text-gray-800">No Orders Yet</h3>
            <p className="text-gray-500 font-medium mt-2">When customers buy your items, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
