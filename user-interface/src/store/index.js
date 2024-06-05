// Import necessary modules and utilities
import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";

// Define initial state for the slice
const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
};

// Async thunk to fetch genres from TMDB API
export const getGenres = createAsyncThunk("netflix/genres", async () => {
  const { data: { genres } } = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return genres;
});

// Function to create array from raw data fetched from API
const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    const movieGenres = [];
    movie.genre_ids.forEach((genre) => {
      const name = genres.find(({ id }) => id === genre);
      if (name) movieGenres.push(name.name);
    });
    if (movie.backdrop_path)
      moviesArray.push({
        id: movie.id,
        name: movie?.original_name ? movie.original_name : movie.original_title,
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3),
      });
  });
};

// Async function to get raw data from TMDB API
const getRawData = async (api, genres, paging = false) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const { data: { results } } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    createArrayFromRawData(results, moviesArray, genres);
  }
  return moviesArray;
};

// Async thunk to fetch data by genre
export const fetchDataByGenre = createAsyncThunk(
  "netflix/genre",
  async ({ genre, type }, thunkAPI) => {
    const { netflix: { genres } } = thunkAPI.getState();
    return getRawData(`${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`, genres);
  }
);

// Async thunk to fetch trending movies
export const fetchMovies = createAsyncThunk(
  "netflix/trending",
  async ({ type }, thunkAPI) => {
    const { netflix: { genres } } = thunkAPI.getState();
    return getRawData(`${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`, genres, true);
  }
);

// Async thunk to fetch liked movies by user
export const getUsersLikedMovies = createAsyncThunk(
  "netflix/getLiked",
  async (email) => {
    const { data: { movies } } = await axios.get(`http://localhost:5000/api/user/liked/${email}`);
    return movies;
  }
);

// Async thunk to remove movie from liked list
export const removeMovieFromLiked = createAsyncThunk(
  "netflix/deleteLiked",
  async ({ movieId, email }) => {
    const { data: { movies } } = await axios.put("http://localhost:5000/api/user/remove", {
      email,
      movieId,
    });
    return movies;
  }
);

// Create a slice for Netflix data management
const NetflixSlice = createSlice({
  name: "Netflix",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
        state.genresLoaded = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
      })
      .addCase(fetchDataByGenre.fulfilled, (state, action) => {
        state.movies = action.payload;
      })
      .addCase(getUsersLikedMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
      })
      .addCase(removeMovieFromLiked.fulfilled, (state, action) => {
        state.movies = action.payload;
      });
  },
});

// Create Redux store with NetflixSlice reducer
export const store = configureStore({
  reducer: {
    netflix: NetflixSlice.reducer,
  },
});

// Export actions from NetflixSlice
export const { setGenres, setMovies } = NetflixSlice.actions;
