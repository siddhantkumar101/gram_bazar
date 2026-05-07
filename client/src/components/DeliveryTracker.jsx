const DeliveryTracker = ({ status = "pending" }) => {
  const steps = [
    { id: "pending", label: "Order Placed", icon: "📦" },
    { id: "accepted", label: "Accepted", icon: "🤝" },
    { id: "picked_up", label: "Out for Delivery", icon: "🚚" },
    { id: "delivered", label: "Delivered", icon: "✅" }
  ];

  const currentIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <div className="flex justify-between items-center relative">
        {/* Background Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 rounded-full z-0"></div>
        
        {/* Active Line */}
        <div 
          className="absolute top-5 left-0 h-1 bg-saffron rounded-full z-0 transition-all duration-700 ease-in-out" 
          style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-4 transition-all duration-500 ${
                  isCompleted 
                    ? "bg-saffron border-orange-100 text-white shadow-md scale-110" 
                    : "bg-white border-gray-100 text-gray-400"
                } ${isCurrent ? "pulse-ring" : ""}`}
              >
                {step.icon}
              </div>
              <span className={`text-[10px] md:text-xs font-bold text-center max-w-[60px] md:max-w-[80px] ${
                isCompleted ? "text-gray-800" : "text-gray-400"
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryTracker;