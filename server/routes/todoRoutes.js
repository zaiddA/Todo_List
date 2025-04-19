// Delete a todo
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Check if the todo belongs to the user
    if (todo.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this todo" });
    }

    await todo.deleteOne();
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Delete todo error:", error);
    res.status(500).json({ message: "Error deleting todo" });
  }
});
