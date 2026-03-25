import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import DailyLog from "../models/DailyLog.js";

const router = express.Router();

const parseDdMmYyyy = (dateStr) => {
  const [dd, mm, yyyy] = String(dateStr).split("/");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd)).getTime();
};

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, batch, course, profilePic } = req.body;
    const updates = { name, batch, course, profilePic };
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

router.get("/public/:slug", async (req, res) => {
  try {
    const user = await User.findOne({ publicSlug: req.params.slug }).select("-password");
    if (!user) return res.status(404).json({ message: "Public profile not found" });

    const logs = await DailyLog.find({ userId: user._id });
    logs.sort((a, b) => parseDdMmYyyy(b.date) - parseDdMmYyyy(a.date));
    return res.json({ user, logs });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch public data", error: err.message });
  }
});

export default router;
