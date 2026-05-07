import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../api/services";

const AuthContext = createContext(null);
const DEMO_USERS_KEY = "grambazaar_demo_users";
const DEMO_SESSION_KEY = "grambazaar_demo_session";

const readDemoUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeDemoUsers = (users) => localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
const writeDemoSession = (user) => localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
const readDemoSession = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_SESSION_KEY) || "null");
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const { data } = await authApi.me();
      setUser(data.data.user);
    } catch (error) {
      const demoUser = readDemoSession();
      setUser(demoUser);
      if (!error?.response && demoUser) {
        toast("Using offline demo login mode", { icon: "📶" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (payload) => {
    try {
      const res = await authApi.login(payload);
      setUser(res.data.data.user);
      toast.success("Logged in");
      return;
    } catch (error) {
      if (error?.response) {
        throw error;
      }
    }

    const users = readDemoUsers();
    const found = users.find((u) => u.phone === payload.phone && u.password === payload.password);
    if (!found) {
      throw new Error("Invalid demo credentials");
    }
    const safeUser = { ...found };
    delete safeUser.password;
    setUser(safeUser);
    writeDemoSession(safeUser);
    toast.success("Logged in (offline demo mode)");
  };

  const register = async (payload) => {
    try {
      const res = await authApi.register(payload);
      setUser(res.data.data.user);
      toast.success("Registered");
      return;
    } catch (error) {
      if (error?.response) {
        throw error;
      }
    }

    const users = readDemoUsers();
    if (users.some((u) => u.phone === payload.phone)) {
      throw new Error("Phone already registered in demo mode");
    }
    const demoUser = {
      _id: `${Date.now()}`,
      name: payload.name,
      phone: payload.phone,
      role: payload.role || "buyer",
      password: payload.password
    };
    users.push(demoUser);
    writeDemoUsers(users);

    const safeUser = { ...demoUser };
    delete safeUser.password;
    setUser(safeUser);
    writeDemoSession(safeUser);
    toast.success("Registered (offline demo mode)");
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore in offline mode.
    }
    setUser(null);
    localStorage.removeItem(DEMO_SESSION_KEY);
    toast.success("Logged out");
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
