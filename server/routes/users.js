import express from "express";
import User from "../models/User.js";

const router = express.Router();

// POST /api/users - make a simple user profile or reuse it if the email exists.
router.post("/", async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required." });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { username: username.trim(), email: email.toLowerCase().trim() },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Could not save user.", error: error.message });
  }
});

export default router;
