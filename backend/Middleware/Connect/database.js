const mongoose = require("mongoose"); // Import mongoose module that will be used to connect to MongoDB.

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;


const connectDB = async () => { // Create a new function called connectDB that will connect to database.
  try {
    const connect = await mongoose.connect(MONGO_URI); // Connect to MongoDB using mongoose.connect() method.
    console.log(`MongoDB Connected: ${connect.connection.host}`); // If connection is successful, print the host name.
  } catch (err) { // If connection is unsuccessful, print the error message and exit the process.
    console.log(err); // Print the error message.
    process.exit(1); // Exit the process.
  }
};
module.exports = connectDB; // Export the connectDB function.
