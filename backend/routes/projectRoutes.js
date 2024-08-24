const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectByTitle,
  updateProjectById,
  deleteProjectById,
  addTaskToProject,
  removeTaskFromProject
} = require('../Controllers/projectController');

// Route to create a new project
router.post('/', createProject);

// Route to get all projects
router.post('/all', getAllProjects);

// Route to get a project by ID
router.get('/:title', getProjectByTitle);

// Route to update a project by ID
router.put('/:id', updateProjectById);

// Route to delete a project by ID
router.delete('/:id', deleteProjectById);

// Route to add a task to a project
router.post('/add-task', addTaskToProject);

// Route to remove a task from a project
router.post('/remove-task', removeTaskFromProject);

module.exports = router;
