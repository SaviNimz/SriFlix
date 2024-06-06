const mongoose = require("mongoose");

// Creating a schema for the user collection
const userSchema = new mongoose.Schema({
  // Defining the email field with specific properties
  email: {
    type: String, // Data type is String
    required: true, // Field is required
    unique: true, // Email addresses should be unique
    max: 50, // Maximum length of the email is 50 characters
  },
  // Defining the likedMovies field as an Array
  likedMovies: Array, // Array to store IDs of liked movies
});

// Exporting the model for the users collection with the defined schema
module.exports = mongoose.model("users", userSchema);