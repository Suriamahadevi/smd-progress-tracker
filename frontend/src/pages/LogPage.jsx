import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { UserCircle, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import LogForm from "../components/LogForm";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const normalizeDate = (date) => (date === "today" ? null : date.replaceAll("-", "/"));
const today = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

export default function LogPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const targetDate = normalizeDate(date) || today();

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      try {
        const apiDate = targetDate.replaceAll("/", "-");
        const { data } = await api.get(`/logs/date/${apiDate}`);
        setLog(data);
      } catch (_err) {
        setLog({ date: targetDate });
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, [targetDate]);

  useEffect(() => {
    if (!showImageModal) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowImageModal(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showImageModal]);

  const saveLog = async (form) => {
    setSaving(true);
    try {
      const payload = { ...form, date: targetDate };
      const { data } = await api.post("/logs", payload);
      setLog(data);
      toast.success("Progress saved!");
    } catch (err) {
      toast.error("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteLog = async () => {
    const ok = window.confirm("Are you sure you want to delete this log?");
    if (!ok) return;
    try {
      const apiDate = targetDate.replaceAll("/", "-");
      await api.delete(`/logs/date/${apiDate}`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete log");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030308] md:pl-[260px] p-0 text-gray-900 dark:text-white">
      <Sidebar />
      <main className="p-4 md:p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h1 className="font-heading text-3xl text-cyan">Log - {targetDate}</h1>
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-3">
              {user?.profilePic ? (
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="h-10 w-10 rounded-full overflow-hidden"
                  aria-label="Open profile image"
                >
                  <img src={user.profilePic} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                </button>
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                  <UserCircle size={20} className="text-gray-500 dark:text-white/50" />
                </div>
              )}
              <div className="leading-tight">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-gray-400 dark:text-white/50">
                  {user?.batch} - {user?.course}
                </p>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <LogForm initialData={log} onSubmit={saveLog} saving={saving} />
            <button
              type="button"
              onClick={deleteLog}
              className="mt-6 w-full rounded-lg border border-red-500 bg-transparent px-4 py-3 text-red-400 transition hover:bg-red-500/10"
            >
              Delete Log
            </button>
          </>
        )}
      </main>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-200 ${
          showImageModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowImageModal(false)}
        aria-hidden={!showImageModal}
      >
        <button
          type="button"
          onClick={() => setShowImageModal(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            onClick={(e) => e.stopPropagation()}
            className={`max-w-[400px] max-h-[400px] rounded-2xl border border-white/10 object-contain transform transition-transform duration-200 ${
              showImageModal ? "scale-100" : "scale-90"
            }`}
          />
        ) : null}
      </div>
    </div>
  );
}
