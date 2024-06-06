const User = require("../models/UserModel");

// Controller function to add a movie to the user's liked list
module.exports.addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user) {
      // If user exists, check if movie already exists in liked list
      const { likedMovies } = user;
      const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);

      if (!movieAlreadyLiked) {
        // If movie not already liked, add it to the liked list
        await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: [...user.likedMovies, data],
          },
          { new: true }
        );
      } else {
        // If movie already liked, send response
        return res.json({ msg: "Movie already added to the liked list." });
      }
    } else {
      // If user does not exist, create a new user with the liked movie
      await User.create({ email, likedMovies: [data] });
    }

    // Send success response
    return res.json({ msg: "Movie successfully added to liked list." });
  } catch (error) {
    // If error occurs, send error response
    return res.json({ msg: "Error adding movie to the liked list" });
  }
};

// Controller function to get liked movies for a user
module.exports.getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;

    // Find user by email
    const user = await User.findOne({ email });

    if (user) {
      // If user found, send liked movies
      return res.json({ msg: "Success", movies: user.likedMovies });
    } else {
      // If user not found, send error response
      return res.json({ msg: "User with given email not found." });
    }
  } catch (error) {
    // If error occurs, send error response
    return res.json({ msg: "Error fetching movies." });
  }
};

// Controller function to remove a movie from the liked list
module.exports.removeFromLikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user) {
      // If user found, find movie index
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ id }) => id === movieId);

      if (movieIndex === -1) {
        // If movie not found, send error response
        return res.status(400).send({ msg: "Movie not found." });
      }

      // Remove movie from liked list
      movies.splice(movieIndex, 1);

      // Update user's liked movies
      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies: movies,
        },
        { new: true }
      );

      // Send success response
      return res.json({ msg: "Movie successfully removed.", movies });
    } else {
      // If user not found, send error response
      return res.json({ msg: "User with given email not found." });
    }
  } catch (error) {
    // If error occurs, send error response
    return res.json({ msg: "Error removing movie from the liked list" });
  }
};
