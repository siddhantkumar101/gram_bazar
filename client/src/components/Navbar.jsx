import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isSeller = user?.role === "seller";
  const isBuyer = user?.role === "buyer";

  const NAV_ITEMS = [
    { to: "/", icon: "🏠", label: "Home" },
    ...(isSeller ? [
      { to: "/sell", icon: "➕", label: "Sell" },
      { to: "/dashboard", icon: "📊", label: "Dashboard" }
    ] : []),
    ...(isBuyer ? [
      { to: "/orders", icon: "📦", label: "My Orders" }
    ] : []),
  ];

  const profileItem = { to: user ? "/profile" : "/login", icon: user ? "👤" : "🔑", label: user ? "Profile" : "Login" };
  const items = [...NAV_ITEMS, profileItem];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 fixed top-0 left-0 bottom-0 bg-white border-r border-orange-100 shadow-xl z-50 py-8 px-4">
        <div className="flex items-center gap-3 mb-12 px-4">
          <span className="text-4xl drop-shadow-sm">🛒</span>
          <span className="font-bold text-2xl bg-gradient-to-r from-saffron to-[#e8500f] bg-clip-text text-transparent">GramBazaar</span>
        </div>
        
        <div className="flex flex-col gap-2">
          {items.map(({ to, icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-4 py-3.5 px-5 rounded-2xl transition-all duration-300 group ${
                  active 
                    ? "bg-orange-50 text-saffron shadow-sm border border-orange-100" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className={`text-2xl transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>{icon}</span>
                <span className={`text-base font-bold ${active ? "text-saffron" : ""}`}>{label}</span>
                {active && <span className="ml-auto w-1.5 h-6 rounded-full bg-saffron" />}
              </Link>
            );
          })}
        </div>

        {/* User preview snippet at bottom */}
        {user && (
          <div className="mt-auto bg-gradient-to-tr from-orange-50 to-white border border-orange-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron text-white flex items-center justify-center font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-orange-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 safe-area-pb">
        <div className="grid grid-cols-4 max-w-lg mx-auto">
          {items.map(({ to, icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center justify-center py-3 gap-1 tap-target relative transition-colors ${
                  active ? "text-saffron" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {active && <div className="absolute top-0 w-8 h-1 bg-saffron rounded-b-full shadow-[0_2px_8px_rgba(255,107,53,0.5)]" />}
                <span className={`text-[22px] transition-transform duration-300 ${active ? "-translate-y-1 scale-110 drop-shadow-md" : ""}`}>{icon}</span>
                <span className={`text-[10px] font-bold tracking-wide transition-all ${active ? "text-saffron opacity-100" : "opacity-70"}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
