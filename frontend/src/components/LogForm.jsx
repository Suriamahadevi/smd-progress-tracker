import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookMarked,
  CalendarCheck,
  Check,
  ClipboardList,
  Code2,
  Clock,
  FolderKanban,
  Plus,
  Save,
  Share2,
  Star,
  X,
  Zap
} from "lucide-react";
import TimeLogSection from "./TimeLogSection";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const sectionBase = "bg-white dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-4 animate-fadeUp";

const defaultState = {
  date: "",
  morningLog: { from: "", to: "", note: "" },
  noonLog: { from: "", to: "", note: "" },
  eveningLog: { from: "", to: "", note: "" },
  completedTopic: false,
  tookNotes: false,
  codingHours: 0,
  problemsSolved: 0,
  platformsUsed: "",
  moduleTaskNote: "",
  workedOnProject: false,
  completedTask: false,
  taskDetails: "",
  studied8hrs: false,
  noDistractions: false,
  followedSchedule: false,
  issues: [""],
  selfRating: 1,
  tomorrowPlan: [""],
  goalOfDay: "",
  whatLearned: "",
  completed: "",
  pending: "",
  nextPlan: "",
  notes: ""
};

function SectionHeader({ icon, accentClass, accentBgClass, title }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-white/10">
      <div className={`w-[3px] h-8 rounded ${accentClass}`} />
      <div className={`rounded-xl p-2 ${accentBgClass} border border-gray-200 dark:border-white/10`}>{icon}</div>
      <div className="font-display text-base font-semibold text-gray-900 dark:text-white">{title}</div>
    </div>
  );
}

function CustomCheckbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer group py-3 border-b border-gray-200 dark:border-white/10 last:border-0">
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
            checked
              ? "bg-accent-indigo border-accent-indigo"
              : "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#14141f] group-hover:border-gray-300 dark:group-hover:border-white/40"
          }`}
        >
          {checked && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
        <input type="checkbox" className="sr-only text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="text-sm text-gray-500 dark:text-white/50 font-body group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
      </div>
    </label>
  );
}

function ListRowInput({ value, onChange, onRemove, placeholder }) {
  return (
    <div className="flex items-center gap-3 bg-bg-elevated rounded-xl px-4 py-2.5 mb-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white/90 px-0 py-0 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
      />
      <button type="button" onClick={onRemove} className="text-gray-500/50 dark:text-white/30 hover:text-accent-red transition-colors" aria-label="Remove">
        <X size={18} />
      </button>
    </div>
  );
}

export default function LogForm({ initialData, onSubmit, saving }) {
  const { user } = useAuth();
  const initial = useMemo(() => ({ ...defaultState, ...initialData }), [initialData]);
  const [form, setForm] = useState(initial);
  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateListValue = (key, index, value) => {
    const arr = [...form[key]];
    arr[index] = value;
    setField(key, arr);
  };

  const addRow = (key) => setField(key, [...form[key], ""]);
  const removeRow = (key, index) => setField(key, form[key].filter((_, i) => i !== index));

  const copyShareLink = async () => {
    if (!user?.publicSlug) return;
    const url = `${window.location.origin}/public/${user.publicSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    } catch (_err) {
      toast.error("Link copy failed");
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...form,
          issues: form.issues.filter((item) => item.trim() !== ""),
          tomorrowPlan: form.tomorrowPlan.filter((item) => item.trim() !== "")
        });
      }}
    >
      <div className={`${sectionBase} border-[#6366f1]`}>
        <SectionHeader
          title="Learning Tasks"
          accentClass="bg-accent-indigo"
          accentBgClass="bg-accent-indigo/15 text-accent-indigo"
          icon={<BookMarked size={18} className="text-accent-indigo" />}
        />
        <CustomCheckbox checked={form.completedTopic} onChange={(v) => setField("completedTopic", v)} label="Completed assigned topic" />
        <CustomCheckbox checked={form.tookNotes} onChange={(v) => setField("tookNotes", v)} label="Took notes properly" />
        <textarea
          rows={3}
          className="mt-4 w-full bg-gray-100 dark:bg-[#14141f] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/25 focus:outline-none focus:border-accent-indigo/50 focus:ring-2 focus:ring-accent-indigo/10 transition-all text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
          placeholder="Module task note"
          value={form.moduleTaskNote}
          onChange={(e) => setField("moduleTaskNote", e.target.value)}
        />
      </div>

      <div className={`${sectionBase} border-[#22d3ee]`}>
        <SectionHeader
          title="Coding Practice"
          accentClass="bg-accent-cyan"
          accentBgClass="bg-accent-cyan/15 text-accent-cyan"
          icon={<Code2 size={18} className="text-accent-cyan" />}
        />

        <div className="py-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="sr-only text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
              checked={form.codingHours > 0}
              onChange={(e) =>
                setField("codingHours", e.target.checked ? (form.codingHours > 0 ? form.codingHours : 1) : 0)
              }
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                form.codingHours > 0 ? "bg-accent-indigo border-accent-indigo" : "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#14141f] group-hover:border-gray-300 dark:group-hover:border-white/40"
              }`}
            >
              {form.codingHours > 0 && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-sm text-gray-500 dark:text-white/50 font-body group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Practiced coding</span>
          </label>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-white/50">Minimum hrs</span>
            <input
              type="number"
              min="0"
              className="w-20 bg-gray-100 dark:bg-[#14141f] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-indigo/30 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
              value={form.codingHours}
              onChange={(e) => {
                const v = e.target.value === "" ? 0 : Number(e.target.value);
                setField("codingHours", Number.isFinite(v) ? v : 0);
              }}
            />
          </div>
        </div>

        <div className="py-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="sr-only text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
              checked={form.problemsSolved > 0}
              onChange={(e) =>
                setField(
                  "problemsSolved",
                  e.target.checked ? (form.problemsSolved > 0 ? form.problemsSolved : 1) : 0
                )
              }
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                form.problemsSolved > 0 ? "bg-accent-indigo border-accent-indigo" : "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#14141f] group-hover:border-gray-300 dark:group-hover:border-white/40"
              }`}
            >
              {form.problemsSolved > 0 && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-sm text-gray-500 dark:text-white/50 font-body group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Solved problems</span>
          </label>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-white/50">No. of problems</span>
            <input
              type="number"
              min="0"
              className="w-20 bg-gray-100 dark:bg-[#14141f] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-indigo/30 text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
              value={form.problemsSolved}
              onChange={(e) => {
                const v = e.target.value === "" ? 0 : Number(e.target.value);
                setField("problemsSolved", Number.isFinite(v) ? v : 0);
              }}
            />
          </div>
        </div>

        <label className="block mt-4">
          <div className="text-sm text-gray-500 dark:text-white/50 font-body mb-2">Platforms used</div>
          <input
            type="text"
            className="w-full bg-gray-100 dark:bg-[#14141f] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/25 focus:outline-none focus:border-accent-indigo/50 focus:ring-2 focus:ring-accent-indigo/10 transition-all text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
            placeholder="LeetCode / HackerRank / etc."
            value={form.platformsUsed}
            onChange={(e) => setField("platformsUsed", e.target.value)}
          />
        </label>
      </div>

      <div className={`${sectionBase} border-emerald-500`}>
        <SectionHeader
          title="Project Work"
          accentClass="bg-[#a855f7]"
          accentBgClass="bg-[#a855f7]/15 text-[#a855f7]"
          icon={<FolderKanban size={18} className="text-[#a855f7]" />}
        />
        <div className="mt-3 space-y-3">
          <label><input type="checkbox" checked={form.workedOnProject} onChange={(e) => setField("workedOnProject", e.target.checked)} /> Worked on project</label>
          <label><input type="checkbox" checked={form.completedTask} onChange={(e) => setField("completedTask", e.target.checked)} /> Completed assigned task</label>
          <textarea rows={3} className="w-full rounded-md border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#14141f] px-3 py-2 text-gray-900 dark:text-white" placeholder="Task details" value={form.taskDetails} onChange={(e) => setField("taskDetails", e.target.value)} />
        </div>
      </div>

      <div className={`${sectionBase} border-[#a855f7]`}>
        <SectionHeader
          title="Productivity"
          accentClass="bg-[#10b981]"
          accentBgClass="bg-[#10b981]/15 text-[#10b981]"
          icon={<Zap size={18} className="text-[#10b981]" />}
        />
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <label><input type="checkbox" checked={form.studied8hrs} onChange={(e) => setField("studied8hrs", e.target.checked)} /> Studied at least 8 hours</label>
          <label><input type="checkbox" checked={form.noDistractions} onChange={(e) => setField("noDistractions", e.target.checked)} /> No major distractions</label>
          <label><input type="checkbox" checked={form.followedSchedule} onChange={(e) => setField("followedSchedule", e.target.checked)} /> Followed schedule</label>
        </div>
      </div>

      <div className={`${sectionBase} border-[#ef4444]`}>
        <SectionHeader
          title="Issues Faced"
          accentClass="bg-[#ef4444]"
          accentBgClass="bg-[#ef4444]/15 text-[#ef4444]"
          icon={<AlertTriangle size={18} className="text-[#ef4444]" />}
        />
        <div className="mt-3 space-y-2">
          {form.issues.map((issue, i) => (
            <div key={`issue-${i}`} className="flex gap-2">
              <input className="flex-1 rounded-md border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#14141f] px-3 py-2 text-gray-900 dark:text-white text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" value={issue} onChange={(e) => updateListValue("issues", i, e.target.value)} />
              <button type="button" className="rounded-md border border-gray-200 dark:border-white/10 px-3 text-gray-700 dark:text-white/80" onClick={() => removeRow("issues", i)}>Delete</button>
            </div>
          ))}
          <button type="button" className="rounded-md bg-gray-100 dark:bg-white/10 px-3 py-2 text-gray-900 dark:text-white" onClick={() => addRow("issues")}>Add Issue</button>
        </div>
      </div>

      <div className={`${sectionBase} border-[#f59e0b]`}>
        <SectionHeader
          title="Self Rating"
          accentClass="bg-[#f59e0b]"
          accentBgClass="bg-[#f59e0b]/15 text-[#f59e0b]"
          icon={<Star size={18} className="text-[#f59e0b]" />}
        />
        <input
          type="range"
          min="1"
          max="10"
          value={form.selfRating}
          onChange={(e) => setField("selfRating", Number(e.target.value))}
          className="mt-4 w-full accent-accent shadow-glow text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
        />
        <p className="mt-2 text-cyan">{form.selfRating}/10</p>
      </div>

      <div className={`${sectionBase} border-[#a855f7]`}>
        <SectionHeader
          title="Time Log"
          accentClass="bg-[#a855f7]"
          accentBgClass="bg-[#a855f7]/15 text-[#a855f7]"
          icon={<Clock size={18} className="text-[#a855f7]" />}
        />
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <TimeLogSection title="Morning" value={form.morningLog} onChange={(v) => setField("morningLog", v)} />
          <TimeLogSection title="Noon" value={form.noonLog} onChange={(v) => setField("noonLog", v)} />
          <TimeLogSection title="Evening" value={form.eveningLog} onChange={(v) => setField("eveningLog", v)} />
        </div>
      </div>

      <div className={`${sectionBase} border-[#22d3ee]`}>
        <SectionHeader
          title="Daily Summary"
          accentClass="bg-[#22d3ee]"
          accentBgClass="bg-[#22d3ee]/15 text-[#22d3ee]"
          icon={<ClipboardList size={18} className="text-[#22d3ee]" />}
        />
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#14141f] px-3 py-2 text-gray-900 dark:text-white text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" placeholder="Goal of Day" value={form.goalOfDay} onChange={(e) => setField("goalOfDay", e.target.value)} />
          <input className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#14141f] px-3 py-2 text-gray-900 dark:text-white text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" placeholder="What I Learned" value={form.whatLearned} onChange={(e) => setField("whatLearned", e.target.value)} />
          <input className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#14141f] px-3 py-2 text-gray-900 dark:text-white text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" placeholder="Completed" value={form.completed} onChange={(e) => setField("completed", e.target.value)} />
          <input className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#14141f] px-3 py-2 text-gray-900 dark:text-white text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" placeholder="Pending" value={form.pending} onChange={(e) => setField("pending", e.target.value)} />
          <input className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#14141f] px-3 py-2 text-gray-900 dark:text-white text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" placeholder="Next Plan" value={form.nextPlan} onChange={(e) => setField("nextPlan", e.target.value)} />
          <input className="rounded-md border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#14141f] px-3 py-2 text-gray-900 dark:text-white text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" placeholder="Notes" value={form.notes} onChange={(e) => setField("notes", e.target.value)} />
        </div>
      </div>

      <div className={`${sectionBase} border-[#6366f1]`}>
        <SectionHeader
          title="Tomorrow Plan"
          accentClass="bg-[#6366f1]"
          accentBgClass="bg-[#6366f1]/15 text-[#6366f1]"
          icon={<CalendarCheck size={18} className="text-[#6366f1]" />}
        />
        <div className="mt-3 space-y-2">
          {form.tomorrowPlan.map((plan, i) => (
            <div key={`plan-${i}`} className="flex gap-2">
              <input className="flex-1 rounded-md border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#14141f] px-3 py-2 text-gray-900 dark:text-white text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25" value={plan} onChange={(e) => updateListValue("tomorrowPlan", i, e.target.value)} />
              <button type="button" className="rounded-md border border-gray-200 dark:border-white/10 px-3 text-gray-700 dark:text-white/80" onClick={() => removeRow("tomorrowPlan", i)}>Delete</button>
            </div>
          ))}
          <button type="button" className="rounded-md bg-gray-100 dark:bg-white/10 px-3 py-2 text-gray-900 dark:text-white" onClick={() => addRow("tomorrowPlan")}>Add Plan</button>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <button
          type="button"
          onClick={copyShareLink}
          className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-100/30 dark:bg-transparent px-6 py-3 font-semibold text-cyan transition hover:bg-gray-100/60 dark:hover:bg-white/10"
        >
          <span className="inline-flex items-center gap-3">
            <Share2 size={18} />
            Share
          </span>
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          <span className="inline-flex items-center gap-3">
            {saving && (
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
                <path
                  d="M22 12c0-5.523-4.477-10-10-10"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            )}
            Save Progress
          </span>
        </button>
      </div>
    </form>
  );
}
