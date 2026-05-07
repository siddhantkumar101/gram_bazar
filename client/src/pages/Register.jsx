import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", password: "", role: "buyer" });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] p-4 flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white p-5 rounded-2xl shadow space-y-3 border border-orange-100">
        <h2 className="text-2xl font-semibold text-earth">Register</h2>
        <input
          className="w-full p-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-saffron"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
        <select
          className="w-full p-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-saffron"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="delivery_partner">Delivery Partner</option>
        </select>
        <button className="w-full tap-target bg-saffron text-white rounded-lg font-medium">Register</button>
      </form>
    </div>
  );
};

export default Register;
