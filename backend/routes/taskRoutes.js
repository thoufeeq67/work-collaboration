const express = require("express");
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } = require("../Controllers/taskControllers");
const { protect } = require('../Middleware/authMiddleware');

// Ensure each of these functions is properly defined in taskControllers.js
router.get("/",  getTasks);
router.post("/",  createTask);
router.put("/:id",  updateTask);
router.delete("/:id",  deleteTask);
router.put("/:id/status",  updateTaskStatus);

module.exports = router;
