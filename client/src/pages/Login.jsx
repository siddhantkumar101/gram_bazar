import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] p-4 flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white p-5 rounded-2xl shadow space-y-3 border border-orange-100">
        <h2 className="text-2xl font-semibold text-earth">Login</h2>
        <input
          className="w-full p-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-saffron"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="w-full p-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-saffron"
          type="password"
          placeholder="Password / OTP"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full tap-target bg-saffron text-white rounded-lg font-medium">Login</button>
        <p className="text-sm">
          New here?{" "}
          <Link className="text-earth font-medium" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
