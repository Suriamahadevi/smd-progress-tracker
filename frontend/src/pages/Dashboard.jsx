import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CalendarSearch, Clock, Code2, Flame, Hand, Plus, Puzzle, Star, Target } from "lucide-react";
import Sidebar from "../components/Sidebar";
import LogCard from "../components/LogCard";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const todayString = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const parseDdMmYyyy = (dateStr) => {
  const [dd, mm, yyyy] = String(dateStr).split("/");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd)).getTime();
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const formatToDdMmYyyy = (yyyyMmDd) => {
    // Input from <input type="date"> is usually "YYYY-MM-DD"
    const [yyyy, mm, dd] = String(yyyyMmDd).split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get("/logs");
        setLogs(data);
      } catch (_err) {
        toast.error("Unable to load logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const weekly = useMemo(
    () => [...logs].sort((a, b) => parseDdMmYyyy(b.date) - parseDdMmYyyy(a.date)).slice(0, 7),
    [logs]
  );
  const avgRating = weekly.length ? (weekly.reduce((s, l) => s + (l.selfRating || 0), 0) / weekly.length).toFixed(1) : "0";
  const totalSolved = weekly.reduce((s, l) => s + (l.problemsSolved || 0), 0);
  const totalHours = weekly.reduce((s, l) => s + (l.codingHours || 0), 0);

  const streak = useMemo(() => {
    const dateSet = new Set(logs.map((l) => l.date));
    const formatDdMmYyyy = (d) => {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };

    const cursor = new Date();
    let count = 0;
    while (dateSet.has(formatDdMmYyyy(cursor))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [logs]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const copyShare = async () => {
    if (!user?.publicSlug) return;
    const shareLink = `${window.location.origin}/public/${user.publicSlug}`;
    await navigator.clipboard.writeText(shareLink);
    toast.success("Share link copied");
  };

  const deleteLog = async (date) => {
    const ok = window.confirm("Delete this log?");
    if (!ok) return;
    try {
      await api.delete(`/logs/date/${date.replaceAll("/", "-")}`);
      toast.success("Log deleted");
      setLogs((prev) => prev.filter((l) => l.date !== date));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete log");
    }
  };

  const searchLogByDate = async () => {
    if (!searchValue) return;
    const ddMmYyyy = formatToDdMmYyyy(searchValue); // DD/MM/YYYY
    const apiDate = ddMmYyyy.replaceAll("/", "-"); // DD-MM-YYYY
    try {
      await api.get(`/logs/date/${apiDate}`);
      navigate(`/log/${apiDate}`);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.custom((t) => (
          <div className="rounded-xl border border-white/10 bg-[#16161f] p-4 text-white shadow-lg">
            <p className="text-sm">No log found for this date</p>
            <div className="mt-3 flex gap-3">
              <button
                className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate(`/log/${apiDate}`);
                }}
              >
                Create log for this date
              </button>
              <button
                className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm font-semibold text-cyan transition hover:bg-white/5"
                onClick={() => toast.dismiss(t.id)}
              >
                Close
              </button>
            </div>
          </div>
        ));
      } else {
        toast.error("Unable to fetch log for this date");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030308] md:pl-[260px] p-0 text-gray-900 dark:text-white">
      <Sidebar />
      <main className="p-6 md:p-8">
        <div className="mb-6">
          <div className="text-gray-500 dark:text-white/50 text-lg font-body flex items-center gap-2">
            <span>{greeting}, {user?.name || "Student"}</span>
            <Hand size={18} className="text-accent-cyan" />
          </div>
          <div className="text-3xl font-display font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mt-1">
            Dashboard
          </div>
          <div className="text-sm text-gray-500 dark:text-white/40 mt-1 flex items-center gap-2">
            <Clock size={16} className="text-gray-500 dark:text-white/40" />
            Today: {todayString()}
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          <button
            className="w-full h-14 bg-gradient-to-r from-accent-indigo to-accent-cyan text-white font-body font-semibold rounded-2xl px-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-indigo active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            onClick={() => navigate(`/log/${todayString().replaceAll("/", "-")}`)}
            type="button"
          >
            <span className="flex items-center justify-center gap-3">
              <Plus size={18} />
              Add Today's Log
            </span>
          </button>
          <button
            className="w-full border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 rounded-2xl px-4 py-2.5 text-sm hover:bg-gray-100/70 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white transition-all duration-200"
            onClick={copyShare}
            type="button"
          >
            Copy Share Link
          </button>
        </div>

        <form
          className="mb-6"
          onSubmit={(e) => {
            e.preventDefault();
            searchLogByDate();
          }}
        >
          <div className="bg-white dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3 focus-within:border-accent-indigo/50 transition-all">
            <CalendarSearch size={18} className="text-accent-indigo" />
            <input
              type="date"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-transparent border-none p-0 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-none focus:ring-0 bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
            />
            <button
              type="submit"
              className="shrink-0 h-10 bg-gradient-to-r from-accent-indigo to-accent-cyan text-white font-body font-semibold rounded-xl px-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-indigo active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col gap-3 shadow-card hover:border-accent-indigo/30 transition-all duration-200">
            <div className="rounded-xl p-2 bg-amber-500/15 text-amber-400 shadow-sm">
              <Flame size={18} />
            </div>
            <div className="text-xs text-gray-500 dark:text-white/40 uppercase tracking-wider font-body">Streak</div>
            <div className="mt-1 text-3xl font-display font-bold text-gray-900 dark:text-white">{streak}</div>
            <div className="text-xs text-gray-500 dark:text-white/40 font-body">days</div>
          </div>

          <div className="bg-white dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col gap-3 shadow-card hover:border-accent-indigo/30 transition-all duration-200">
            <div className="rounded-xl p-2 bg-accent-indigo-glow text-accent-indigo shadow-glow-indigo">
              <Star size={18} />
            </div>
            <div className="text-xs text-gray-500 dark:text-white/40 uppercase tracking-wider font-body">Avg Rating</div>
            <div className="mt-1 text-3xl font-display font-bold text-gray-900 dark:text-white">{avgRating}</div>
            <div className="text-xs text-gray-500 dark:text-white/40 font-body">/ 10</div>
          </div>

          <div className="bg-white dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col gap-3 shadow-card hover:border-accent-indigo/30 transition-all duration-200">
            <div className="rounded-xl p-2 bg-accent-cyan-glow text-accent-cyan shadow-glow-cyan">
              <Code2 size={18} />
            </div>
            <div className="text-xs text-gray-500 dark:text-white/40 uppercase tracking-wider font-body">Coding Hours</div>
            <div className="mt-1 text-3xl font-display font-bold text-gray-900 dark:text-white">{totalHours}</div>
            <div className="text-xs text-gray-500 dark:text-white/40 font-body">hrs</div>
          </div>

          <div className="bg-white dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col gap-3 shadow-card hover:border-accent-indigo/30 transition-all duration-200">
            <div className="rounded-xl p-2 bg-[#a855f71a] text-purple-400 shadow-glow-sm">
              <Puzzle size={18} />
            </div>
            <div className="text-xs text-gray-500 dark:text-white/40 uppercase tracking-wider font-body">Problems Solved</div>
            <div className="mt-1 text-3xl font-display font-bold text-gray-900 dark:text-white">{totalSolved}</div>
            <div className="text-xs text-gray-500 dark:text-white/40 font-body">solved</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white/90 flex items-center gap-3">
            <Clock size={18} className="text-accent-cyan" />
            Recent Logs
          </h2>
          <div className="text-xs bg-gray-100 dark:bg-white/5 rounded-full px-3 py-1 text-gray-600 dark:text-white/50 font-body">Last 7 days</div>
        </div>

        {loading ? (
          <p className="text-gray-600 dark:text-white/60">Loading logs...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {weekly.map((log) => (
              <LogCard key={log._id} log={log} onDelete={deleteLog} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
