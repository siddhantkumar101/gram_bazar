import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user, logout } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-800">Access Restricted</h2>
        <p className="text-gray-500 mt-2 mb-6 font-medium">Please login or register to view your profile and manage your account.</p>
        <button className="btn-primary w-full max-w-xs shine">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pb-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-orange-100 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100 to-saffron/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-saffron to-[#ff9870] p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-5xl md:text-6xl font-bold text-saffron">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{user.name}</h1>
            <span className="badge bg-orange-100 text-saffron text-sm px-3 py-1 uppercase tracking-wider">{user.role}</span>
          </div>
          <p className="text-gray-500 text-lg font-medium flex items-center justify-center md:justify-start gap-2 mb-6">
            <span>📞</span> {user.phone}
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="btn-primary flex items-center gap-2">
              <span>✏️</span> Edit Profile
            </button>
            <button className="btn-outline flex items-center gap-2" onClick={logout}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-3xl border border-orange-50 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl mb-4">📦</div>
          <p className="text-gray-500 font-semibold mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-gray-800">12</h3>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-orange-50 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center text-2xl mb-4">🏷️</div>
          <p className="text-gray-500 font-semibold mb-1">Active Listings</p>
          <h3 className="text-3xl font-bold text-gray-800">5</h3>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-orange-50 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-2xl mb-4">⭐</div>
          <p className="text-gray-500 font-semibold mb-1">Seller Rating</p>
          <h3 className="text-3xl font-bold text-gray-800">4.8 <span className="text-lg text-gray-400 font-medium">/ 5</span></h3>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-3xl border border-orange-100 shadow-sm mt-8 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Settings & Preferences</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {['Location Settings', 'Notification Preferences', 'Language & Region', 'Help & Support'].map((item, i) => (
            <button key={i} className="w-full p-6 flex items-center justify-between hover:bg-orange-50/50 transition-colors group">
              <span className="font-semibold text-gray-700 group-hover:text-saffron transition-colors">{item}</span>
              <span className="text-gray-300 group-hover:text-saffron transition-colors text-xl">➔</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
