import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const signToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, batch, course, email, password } = req.body;
    if (!name || !batch || !course || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const publicSlug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${nanoid(6)}`;

    const user = await User.create({
      name,
      batch,
      course,
      email: email.toLowerCase(),
      password: hashedPassword,
      publicSlug
    });

    const token = signToken(user._id);
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        batch: user.batch,
        course: user.course,
        email: user.email,
        profilePic: user.profilePic,
        publicSlug: user.publicSlug
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to register", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user._id);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        batch: user.batch,
        course: user.course,
        email: user.email,
        profilePic: user.profilePic,
        publicSlug: user.publicSlug
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to login", error: err.message });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

export default router;
