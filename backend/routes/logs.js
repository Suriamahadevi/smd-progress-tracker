import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import DailyLog from "../models/DailyLog.js";

const router = express.Router();

const parseDdMmYyyy = (dateStr) => {
  const [dd, mm, yyyy] = String(dateStr).split("/");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd)).getTime();
};

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const payload = { ...req.body, userId: req.user.id };
    const log = await DailyLog.findOneAndUpdate(
      { userId: req.user.id, date },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json(log);
  } catch (err) {
    return res.status(500).json({ message: "Failed to save log", error: err.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const logs = await DailyLog.find({ userId: req.user.id });
    logs.sort((a, b) => parseDdMmYyyy(b.date) - parseDdMmYyyy(a.date));
    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch logs", error: err.message });
  }
});

router.get("/date/:date", authMiddleware, async (req, res) => {
  try {
    const rawDate = req.params.date;
    const normalized = rawDate.includes("-") ? rawDate.split("-").join("/") : rawDate;
    const log = await DailyLog.findOne({ userId: req.user.id, date: normalized });
    if (!log) return res.status(404).json({ message: "Log not found" });
    return res.json(log);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch date log", error: err.message });
  }
});

router.delete("/date/:date", authMiddleware, async (req, res) => {
  try {
    const rawDate = req.params.date;
    const normalized = rawDate.includes("-") ? rawDate.split("-").join("/") : rawDate;
    const deleted = await DailyLog.findOneAndDelete({ userId: req.user.id, date: normalized });
    if (!deleted) return res.status(404).json({ message: "Log not found" });
    return res.json({ message: "Log deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete log", error: err.message });
  }
});

export default router;
