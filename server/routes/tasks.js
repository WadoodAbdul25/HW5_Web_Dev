import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// GET /api/tasks?userId=... - only read tasks for the signed-in student.
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "A userId is required to load tasks." });
    }

    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Could not load tasks.", error: error.message });
  }
});

// POST /api/tasks - create a new task from the form data.
router.post("/", async (req, res) => {
  try {
    const { title, description, notes, userId } = req.body;

    const task = await Task.create({
      title,
      description,
      notes,
      user: userId
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: "Could not create task.", error: error.message });
  }
});

// PUT /api/tasks/:id - update the editable task fields.
router.put("/:id", async (req, res) => {
  try {
    const { title, description, notes, userId } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { title, description, notes },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Could not update task.", error: error.message });
  }
});

// DELETE /api/tasks/:id - remove a task permanently.
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.query;

    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: userId });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete task.", error: error.message });
  }
});

export default router;
