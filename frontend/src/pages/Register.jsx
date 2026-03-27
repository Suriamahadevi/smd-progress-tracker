import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// ✅ ADD THIS
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    batch: "",
    course: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.token, data.user);
      toast.success("Registered successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#030308] p-4 text-gray-900 dark:text-white">
      <form className="glass-card w-full max-w-lg rounded-xl p-6" onSubmit={onSubmit}>
        <h1 className="font-heading text-3xl text-cyan">Register</h1>

        <div className="mt-4 grid gap-3 md:grid-cols-2">

          <input
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />

          <input
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
            placeholder="Batch"
            value={form.batch}
            onChange={(e) => setForm((p) => ({ ...p, batch: e.target.value }))}
          />

          <input
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 md:col-span-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
            placeholder="Course"
            value={form.course}
            onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))}
          />

          <input
            type="email"
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 md:col-span-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />

          {/* ✅ Password with ICON */}
          <div className="relative md:col-span-2">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 pr-10 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />

            {/* 👁️ ICON */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-cyan text-lg"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button className="mt-4 w-full rounded-md bg-accent py-2 font-semibold" disabled={loading}>
          {loading ? "Saving..." : "Create Account"}
        </button>

        {/* Center text */}
        <p className="mt-4 text-sm text-center">
          Already have account? <Link className="text-cyan" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}