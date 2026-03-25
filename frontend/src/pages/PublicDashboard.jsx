import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { BookMarked, Check, Code2 } from "lucide-react";

const parseDdMmYyyy = (dateStr) => {
  const [dd, mm, yyyy] = String(dateStr).split("/");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd)).getTime();
};

const sectionCard = "glass-card rounded-lg border-l-4 border-accent p-4";

const isNonEmptyString = (v) => typeof v === "string" && v.trim() !== "";
const nonEmptyArray = (arr) =>
  Array.isArray(arr) ? arr.map((x) => String(x)).filter((x) => x.trim() !== "") : [];

function StaticInput({ value }) {
  return <div className="rounded-md border border-white/20 bg-transparent px-3 py-2">{value}</div>;
}

function StaticTextArea({ value }) {
  return (
    <div className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 whitespace-pre-wrap">
      {value}
    </div>
  );
}

function ReadOnlyTimeSlot({ title, value }) {
  const hasFrom = isNonEmptyString(value?.from);
  const hasTo = isNonEmptyString(value?.to);
  const hasNote = isNonEmptyString(value?.note);
  return (
    <div className="glass-card rounded-lg border-l-4 border-cyan p-4">
      <h4 className="font-heading text-base">{title}</h4>
      {(hasFrom || hasTo) && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {hasFrom && (
            <div className="block">
              <span className="text-sm text-gray-400">From</span>
              <div className="mt-2 w-full rounded-md border border-white/20 bg-transparent px-3 py-2">{value.from}</div>
            </div>
          )}
          {hasTo && (
            <div className="block">
              <span className="text-sm text-gray-400">To</span>
              <div className="mt-2 w-full rounded-md border border-white/20 bg-transparent px-3 py-2">{value.to}</div>
            </div>
          )}
        </div>
      )}
      {hasNote && (
        <div className="mt-3 w-full rounded-md border border-white/20 bg-transparent px-3 py-2">
          <div className="text-sm whitespace-pre-wrap">{value.note}</div>
        </div>
      )}
    </div>
  );
}

export default function PublicDashboard() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/user/public/${slug}`);
        setData(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const logsSorted = useMemo(() => {
    const logs = data?.logs || [];
    return [...logs].sort((a, b) => parseDdMmYyyy(b.date) - parseDdMmYyyy(a.date));
  }, [data]);

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-[#030308] p-6 text-gray-900 dark:text-white">Loading...</div>;
  if (!data) return <div className="min-h-screen bg-gray-50 dark:bg-[#030308] p-6 text-gray-900 dark:text-white">Profile not found</div>;

  const selectedLog = selectedDate ? logsSorted.find((l) => l.date === selectedDate) : null;

  const profileAvatar = data.user?.profilePic ? (
    <img src={data.user.profilePic} className="h-10 w-10 rounded-full object-cover" alt="Profile" />
  ) : (
    <div className="h-10 w-10 rounded-full bg-white/10" />
  );

  const desktopProfileBlock = (
    <div className="flex items-center gap-3">
      {profileAvatar}
      <div className="leading-tight">
        <p className="font-semibold">{data.user?.name}</p>
        <p className="text-sm text-gray-400">
          {data.user?.batch} - {data.user?.course}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030308] p-4 md:p-8 text-gray-900 dark:text-white">
      {!selectedLog ? (
        <div className="glass-card mx-auto max-w-4xl rounded-xl p-6">
          <div className="flex items-center gap-4">
            {data.user?.profilePic ? (
              <img src={data.user.profilePic} className="h-16 w-16 rounded-full object-cover" alt="Profile" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-white/10" />
            )}
            <div>
              <h1 className="font-heading text-3xl text-cyan">{data.user?.name}</h1>
              <p className="text-gray-300">
                {data.user?.batch} - {data.user?.course}
              </p>
            </div>
          </div>

          <h2 className="mt-6 font-heading text-2xl">Progress By Day</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {logsSorted.map((log) => (
              <button
                key={log._id}
                type="button"
                onClick={() => setSelectedDate(log.date)}
                className="rounded-lg border border-white/10 bg-card/70 p-4 text-left transition hover:bg-white/5"
              >
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <span className="text-cyan">{log.date}</span>
                  <span>Rating {log.selfRating || 1}/10</span>
                  <span>{log.codingHours || 0}h coding</span>
                  <span>{log.problemsSolved || 0} solved</span>
                </div>
                <p className="mt-2 text-sm text-gray-200">
                  <strong>Goal:</strong> {log.goalOfDay || "-"}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Learned:</strong> {log.whatLearned || "-"}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="font-heading text-3xl text-cyan">Log - {selectedLog.date}</h1>
            {desktopProfileBlock}
          </div>

          <div className="space-y-6">
            <div className={`${sectionCard} border-fuchsia-500`}>
              <h3 className="font-heading text-xl flex items-center gap-2">
                <BookMarked size={18} className="text-cyan" />
                Learning Tasks
              </h3>
              <div className="mt-3 space-y-2">
                {selectedLog.completedTopic && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-accent-cyan" />
                    <span>Completed assigned topic</span>
                  </div>
                )}
                {selectedLog.tookNotes && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-accent-cyan" />
                    <span>Took notes properly</span>
                  </div>
                )}
              </div>
              {isNonEmptyString(selectedLog.moduleTaskNote) && (
                <div className="mt-3">{/* keep same spacing as textarea */}<StaticTextArea value={selectedLog.moduleTaskNote} /></div>
              )}
            </div>

            <div className={`${sectionCard} border-fuchsia-400`}>
              <h3 className="font-heading text-xl flex items-center gap-2">
                <Code2 size={18} className="text-cyan" />
                Coding Practice
              </h3>
              <div className="mt-3 space-y-3">
                {selectedLog.codingHours > 0 && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-accent-cyan" />
                    <span className="min-w-0">Practiced coding</span>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-sm text-gray-400">Minimum hrs</span>
                      <div className="w-28 rounded-md border border-white/20 bg-transparent px-3 py-2 text-center">
                        {selectedLog.codingHours}
                      </div>
                    </div>
                  </div>
                )}
                {selectedLog.problemsSolved > 0 && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-accent-cyan" />
                    <span className="min-w-0">Solved problems</span>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-sm text-gray-400">No. of problems</span>
                      <div className="w-28 rounded-md border border-white/20 bg-transparent px-3 py-2 text-center">
                        {selectedLog.problemsSolved}
                      </div>
                    </div>
                  </div>
                )}
                {isNonEmptyString(selectedLog.platformsUsed) && (
                  <div className="block">
                    <span className="text-sm text-gray-400">Platforms used</span>
                    <div className="mt-2">
                      <StaticInput value={selectedLog.platformsUsed} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`${sectionCard} border-emerald-500`}>
              <h3 className="font-heading text-xl">Project Work</h3>
              <div className="mt-3 space-y-3">
                {selectedLog.workedOnProject && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-accent-cyan" />
                    <span>Worked on project</span>
                  </div>
                )}
                {selectedLog.completedTask && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-accent-cyan" />
                    <span>Completed assigned task</span>
                  </div>
                )}
                {isNonEmptyString(selectedLog.taskDetails) && (
                  <StaticTextArea value={selectedLog.taskDetails} />
                )}
              </div>
            </div>

            <div className={`${sectionCard} border-yellow-500`}>
              <h3 className="font-heading text-xl">Productivity</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {selectedLog.studied8hrs && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-accent-cyan" />
                    <span>Studied at least 8 hours</span>
                  </div>
                )}
                {selectedLog.noDistractions && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-accent-cyan" />
                    <span>No major distractions</span>
                  </div>
                )}
                {selectedLog.followedSchedule && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-accent-cyan" />
                    <span>Followed schedule</span>
                  </div>
                )}
              </div>
            </div>

            <div className={`${sectionCard} border-rose-500`}>
              <h3 className="font-heading text-xl">Issues Faced</h3>
              <div className="mt-3 space-y-2">
                {nonEmptyArray(selectedLog.issues).map((issue, i) => (
                  <div key={`issue-${i}`} className="flex gap-2">
                    <div className="flex-1 rounded-md border border-white/20 bg-transparent px-3 py-2">{issue}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${sectionCard} border-indigo-400`}>
              <h3 className="font-heading text-xl">Self Rating</h3>
              <div className="mt-4 h-2 w-full rounded-md bg-white/10 shadow-glow" />
              <p className="mt-2 text-cyan">{selectedLog.selfRating}/10</p>
            </div>

            <div className={`${sectionCard} border-sky-500`}>
              <h3 className="font-heading text-xl">Tomorrow Plan</h3>
              <div className="mt-3 space-y-2">
                {nonEmptyArray(selectedLog.tomorrowPlan).map((plan, i) => (
                  <div key={`plan-${i}`} className="flex gap-2">
                    <div className="flex-1 rounded-md border border-white/20 bg-transparent px-3 py-2">{plan}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${sectionCard} border-cyan`}>
              <h3 className="font-heading text-xl text-cyan">Time Log</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <ReadOnlyTimeSlot title="Morning" value={selectedLog.morningLog || {}} />
                <ReadOnlyTimeSlot title="Noon" value={selectedLog.noonLog || {}} />
                <ReadOnlyTimeSlot title="Evening" value={selectedLog.eveningLog || {}} />
              </div>
            </div>

            <div className={`${sectionCard} border-violet-500`}>
              <h3 className="font-heading text-xl">Daily Summary</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {isNonEmptyString(selectedLog.goalOfDay) && <StaticInput value={selectedLog.goalOfDay} />}
                {isNonEmptyString(selectedLog.whatLearned) && <StaticInput value={selectedLog.whatLearned} />}
                {isNonEmptyString(selectedLog.completed) && <StaticInput value={selectedLog.completed} />}
                {isNonEmptyString(selectedLog.pending) && <StaticInput value={selectedLog.pending} />}
                {isNonEmptyString(selectedLog.nextPlan) && <StaticInput value={selectedLog.nextPlan} />}
                {isNonEmptyString(selectedLog.notes) && <StaticInput value={selectedLog.notes} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
