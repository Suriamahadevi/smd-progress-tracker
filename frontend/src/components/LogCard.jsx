import { ArrowRight, Code2, Star, Target, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function LogCard({ log, onDelete }) {
  const rating = log.selfRating || 1;
  const ratingTone =
    rating >= 8 ? "bg-green/15 text-green" : rating >= 5 ? "bg-amber/15 text-amber" : "bg-red/15 text-red";

  return (
    <Link
      to={`/log/${log.date.replaceAll("/", "-")}`}
      className="bg-white dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-2xl p-5 transition-all duration-200 cursor-pointer group relative hover:border-accent-indigo/30 hover:shadow-glow-sm hover:-translate-y-0.5"
    >
      <button
        type="button"
        className="absolute right-3 top-3 rounded-xl p-2 border border-red-500/30 text-red-400/90 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete?.(log.date);
        }}
        aria-label="Delete log"
        title="Delete log"
      >
        <Trash2 size={18} />
      </button>

      <div className="flex items-center justify-between gap-3">
        <div className="bg-accent-indigo-glow text-accent-indigo text-xs rounded-lg px-3 py-1 font-body">
          {log.date}
        </div>
        <div
          className={`text-xs rounded-lg px-3 py-1 font-body ${
            rating >= 8 ? "bg-accent-green/15 text-accent-green" : rating >= 5 ? "bg-accent-amber/15 text-accent-amber" : "bg-accent-red/15 text-accent-red"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Star size={14} />
            {rating}/10
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-700 dark:text-white/70 line-clamp-2">{log.goalOfDay || "No goal added"}</p>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-white/50">
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-accent-cyan" />
          <span>{log.codingHours || 0}</span>
          <span>hrs</span>
        </div>
        <div className="flex items-center gap-2">
          <Target size={14} className="text-purple-400" />
          <span>{log.problemsSolved || 0}</span>
          <span>solved</span>
        </div>
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0">
          <ArrowRight size={18} className="text-gray-400 dark:text-white/60" />
        </div>
      </div>
    </Link>
  );
}
