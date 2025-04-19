const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const { protect, authorize } = require("../middleware/auth");

// Create todo - Client only
router.post("/", protect, authorize(1), async (req, res) => {
  try {
    const todo = await Todo.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all todos for a user - Client
router.get("/my", protect, authorize(1), async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.status(200).json({ success: true, data: todos });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all todos - Admin only
router.get("/all", protect, authorize(0), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const todos = await Todo.find()
      .populate("user", "name email")
      .skip(skip)
      .limit(limit);

    const total = await Todo.countDocuments();

    res.status(200).json({
      success: true,
      data: todos,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update todo - Client (own todos only)
router.put("/:id", protect, authorize(1), async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Make sure user owns todo
    if (todo.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this todo" });
    }

    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete todo - Client (own todos only)
router.delete("/:id", protect, authorize(1), async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Make sure user owns todo
    if (todo.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this todo" });
    }

    await todo.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Todo deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/todos/stats
// @desc    Get statistics about user's todos
// @access  Private
router.get("/stats", protect, authorize(1), async (req, res) => {
  try {
    const totalTodos = await Todo.countDocuments({ user: req.user.id });
    const completedTodos = await Todo.countDocuments({
      user: req.user.id,
      completed: true,
    });
    const pendingTodos = totalTodos - completedTodos;

    // Get todos created in the last 7 days
    const lastWeekTodos = await Todo.countDocuments({
      user: req.user.id,
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      success: true,
      data: {
        total: totalTodos,
        completed: completedTodos,
        pending: pendingTodos,
        lastWeekCreated: lastWeekTodos,
        completionRate: totalTodos
          ? ((completedTodos / totalTodos) * 100).toFixed(1)
          : 0,
      },
    });
  } catch (error) {
    console.error("Get todo stats error:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving todo statistics",
    });
  }
});

module.exports = router;
