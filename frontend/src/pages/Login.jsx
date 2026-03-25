import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#030308] p-4 text-gray-900 dark:text-white">
      <form className="glass-card w-full max-w-md rounded-xl p-6" onSubmit={onSubmit}>
        <h1 className="font-heading text-3xl text-cyan">Login</h1>
        <div className="mt-4 space-y-3">
          <input className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <input className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
          <button className="w-full rounded-md bg-accent py-2 font-semibold" disabled={loading}>{loading ? "Loading..." : "Login"}</button>
        </div>
        <p className="mt-4 text-sm">No account? <Link className="text-cyan" to="/register">Register</Link></p>
      </form>
    </div>
  );
}
