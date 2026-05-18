const express = require("express");
const router = express.Router();
const Todo = require("../models/todo.model");

// GET all todos
router.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// POST new todo
router.post("/", async (req, res) => {
  const newTodo = new Todo({
    title: req.body.title,
  });

  await newTodo.save();
  res.json(newTodo);
});

// ✅ Toggle complete
router.put("/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.completed = !todo.completed;
  await todo.save();

  res.json(todo);
});

// ✏️ Edit todo
router.put("/edit/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { new: true },
  );

  res.json(todo);
});

// 🗑️ Delete todo
router.delete("/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
