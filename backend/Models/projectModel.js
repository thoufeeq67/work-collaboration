const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Import Schema

// Define the Project schema
const projectSchema = new Schema({
  User: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required'] 
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  tasks: [{
    type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId
    ref: 'Task'
  }],
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the Project model
module.exports = mongoose.model('Project', projectSchema);
