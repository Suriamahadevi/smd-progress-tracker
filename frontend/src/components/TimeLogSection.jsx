import { Sun, Sunrise, Sunset } from "lucide-react";

export default function TimeLogSection({ title, value, onChange }) {
  const Icon = title === "Morning" ? Sunrise : title === "Noon" ? Sun : Sunset;

  return (
    <div className="bg-white dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex-1">
      <div className="flex items-center gap-2 mb-3">
        <div className="rounded-xl p-2 bg-accent-purple/15 text-accent-purple border border-accent-purple/10">
          <Icon size={18} />
        </div>
        <h4 className="font-body font-semibold text-accent-purple">{title}</h4>
      </div>

      <div className="grid gap-3 grid-cols-2">
        <label className="block">
          <span className="text-sm text-gray-500 dark:text-white/50">From</span>
          <input
            type="time"
            className="mt-2 w-full bg-gray-100 dark:bg-[#14141f] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-accent-indigo/60 focus:ring-1 focus:ring-accent-indigo/30 transition-all text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
            value={value.from || ""}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-sm text-gray-500 dark:text-white/50">To</span>
          <input
            type="time"
            className="mt-2 w-full bg-gray-100 dark:bg-[#14141f] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-accent-indigo/60 focus:ring-1 focus:ring-accent-indigo/30 transition-all text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
            value={value.to || ""}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
          />
        </label>
      </div>

      <textarea
        rows={3}
        className="mt-3 w-full bg-gray-100 dark:bg-[#14141f] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-accent-indigo/60 focus:ring-1 focus:ring-accent-indigo/30 transition-all text-gray-900 dark:text-white bg-gray-100 dark:bg-[#14141f] border-gray-200 dark:border-white/10 placeholder-gray-500 dark:placeholder-white/25"
        placeholder="Note..."
        value={value.note || ""}
        onChange={(e) => onChange({ ...value, note: e.target.value })}
      />
    </div>
  );
}
