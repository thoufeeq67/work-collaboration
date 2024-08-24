const mongoose = require('mongoose');
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

async function connectToDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

module.exports = connectToDatabase;
