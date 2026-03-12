
const express = require("express");
const app = express();

app.use(express.json());

let tasks = [
  { id: 1, title: "Complete API project", priority: "High", completed: false },
  { id: 2, title: "Prepare for interview", priority: "Medium", completed: false }
];

// API info
app.get("/", (req, res) => {
  res.json({
    message: "Task Priority Manager API",
    endpoints: [
      "GET /tasks",
      "POST /tasks",
      "PATCH /tasks/:id/complete",
      "GET /tasks/high-priority",
      "GET /tasks/stats",
      "DELETE /tasks/:id"
    ]
  });
});

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Create task
app.post("/tasks", (req, res) => {

  const { title, priority } = req.body;

  if (!title || !priority) {
    return res.status(400).json({ error: "Title and priority are required" });
  }

  const task = {
    id: tasks.length + 1,
    title,
    priority,
    completed: false
  };

  tasks.push(task);
  res.status(201).json(task);
});

// Mark task completed
app.patch("/tasks/:id/complete", (req, res) => {

  const task = tasks.find(t => t.id == req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  task.completed = true;

  res.json({
    message: "Task marked as completed",
    task
  });
});

// Filter high priority tasks
app.get("/tasks/high-priority", (req, res) => {

  const highPriority = tasks.filter(t => t.priority === "High");

  res.json(highPriority);
});

// Task statistics
app.get("/tasks/stats", (req, res) => {

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const highPriority = tasks.filter(t => t.priority === "High").length;

  res.json({
    totalTasks: total,
    completedTasks: completed,
    pendingTasks: pending,
    highPriorityTasks: highPriority
  });

});

// Delete task
app.delete("/tasks/:id", (req, res) => {

  tasks = tasks.filter(t => t.id != req.params.id);

  res.json({ message: "Task deleted successfully" });

});

app.listen(3000, () => {
  console.log("Task Priority API running at http://localhost:3000/");
});
