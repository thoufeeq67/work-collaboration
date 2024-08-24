const Project = require("../Models/projectModel");
const Task = require("../Models/taskModel");
// import user
const User = require("../Models/userModel");

// Create a new project

// Create a new project
const createProject = async (req, res) => {
  try {
    const { email, title, description, tasks } = req.body;

   
    const user = await User.findOne({ email });
    

    // Create a new project instance with the user's ID
    const project = new Project({
      User: user._id, // Use the found user's ID
      title,
      description,
      tasks, // Array of task IDs
    });

    
    const savedProject = await project.save();
   

    // Return the saved project as a response
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all projects

const getAllProjects = async (req, res) => {
  try {
    const { userEmail } = req.body; // Get the email from the request body

    // Step 1: Find the user by email
    const user = await User.findOne({ email: userEmail });

    const userId = user._id; // Get the user ID

    // Step 2: Fetch projects associated with the user ID
    const projects = await Project.find({ User: userId });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single project by ID
const getProjectByTitle = async (req, res) => {
  try {
    // Find the project by its title
    const project = await Project.findOne({ title: req.params.title });

    const tasks = await Task.find({ project: project._id });

    // Return the project along with its tasks
    res.status(200).json({ project, tasks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a project by ID
const updateProjectById = async (req, res) => {
  try {
    const { title, description, tasks } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, tasks },
      { new: true } // Return the updated document
    ).populate("tasks");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a project by ID
const deleteProjectById = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a task to a project
const addTaskToProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.tasks.push(taskId);
    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove a task from a project
const removeTaskFromProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.tasks = project.tasks.filter((task) => task.toString() !== taskId);
    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectByTitle,
  updateProjectById,
  deleteProjectById,
  addTaskToProject,
  removeTaskFromProject,
};
