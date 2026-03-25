import mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema(
  {
    from: { type: String, default: "" },
    to: { type: String, default: "" },
    note: { type: String, default: "" }
  },
  { _id: false }
);

const dailyLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true, index: true },

    morningLog: { type: timeLogSchema, default: () => ({}) },
    noonLog: { type: timeLogSchema, default: () => ({}) },
    eveningLog: { type: timeLogSchema, default: () => ({}) },

    completedTopic: { type: Boolean, default: false },
    tookNotes: { type: Boolean, default: false },
    codingHours: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 },
    platformsUsed: { type: String, default: "" },
    moduleTaskNote: { type: String, default: "" },

    workedOnProject: { type: Boolean, default: false },
    completedTask: { type: Boolean, default: false },
    taskDetails: { type: String, default: "" },

    studied8hrs: { type: Boolean, default: false },
    noDistractions: { type: Boolean, default: false },
    followedSchedule: { type: Boolean, default: false },

    issues: { type: [String], default: [] },
    selfRating: { type: Number, min: 1, max: 10, default: 1 },
    tomorrowPlan: { type: [String], default: [] },

    goalOfDay: { type: String, default: "" },
    whatLearned: { type: String, default: "" },
    completed: { type: String, default: "" },
    pending: { type: String, default: "" },
    nextPlan: { type: String, default: "" },
    notes: { type: String, default: "" }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyLog", dailyLogSchema);
