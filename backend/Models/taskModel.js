const mongoose = require('mongoose'); // Import mongoose module

// Create a new mongoose schema called taskSchema
const taskSchema = mongoose.Schema(
    {
        text: { // This is the schema for the task text
            type: String, // The type of the task text is a string
            required: [true, 'Please enter a task'], // The task text is required
        },

        project: { // This is the schema for the project
            type: mongoose.Schema.Types.ObjectId, // The type of the project is an ObjectId
            required: true, // The project is required
            ref: 'Project' // The project is referenced to the Project model
        },

        status: {
            type: String,
            enum: ['todo', 'inProgress', 'done'],
            default: 'inProgress' // Default status is 'inProgress'
        },

        dueDate: { // This is the schema for the due date
            type: Date, // The type of the due date is a date
            required: [true, 'Please enter a due date'], // The due date is required
        },

        assignedTo: { // This is the schema for the assigned user
            type: String, // The type of the assigned user is a string
            default: '' // Default to an empty string if not assigned
        }
    },
    {
        timestamps: true, // This will create timestamps for when the task was created
    }
);

module.exports = mongoose.model('Task', taskSchema); // Export the taskSchema as a model called Task
