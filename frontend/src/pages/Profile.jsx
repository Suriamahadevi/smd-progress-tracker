import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { user, setUser, refresh } = useAuth();
  const [form, setForm] = useState({ name: "", batch: "", course: "", profilePic: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        batch: user.batch || "",
        course: user.course || "",
        profilePic: user.profilePic || ""
      });
    }
  }, [user]);

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => setForm((p) => ({ ...p, profilePic: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/user/profile", form);
      setUser(data);
      await refresh();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030308] md:pl-[260px] p-0 text-gray-900 dark:text-white">
      <Sidebar />
      <main className="p-4 md:p-8">
        <form className="glass-card max-w-2xl rounded-xl p-6" onSubmit={onSave}>
          <h1 className="font-heading text-3xl text-cyan">Profile</h1>
          <div className="mt-4 flex items-center gap-4">
            {form.profilePic ? <img src={form.profilePic} className="h-20 w-20 rounded-full object-cover" /> : <div className="h-20 w-20 rounded-full bg-white/10" />}
            <div className="space-y-2">
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <input className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" placeholder="Or paste image URL/base64" value={form.profilePic} onChange={(e) => setForm((p) => ({ ...p, profilePic: e.target.value }))} />
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <input className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" placeholder="Batch" value={form.batch} onChange={(e) => setForm((p) => ({ ...p, batch: e.target.value }))} />
            <input className="rounded-md border border-white/20 bg-transparent px-3 py-2 md:col-span-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" placeholder="Course" value={form.course} onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))} />
          </div>
          <button className="mt-5 rounded-lg bg-accent px-5 py-2" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
        </form>
      </main>
    </div>
  );
}
